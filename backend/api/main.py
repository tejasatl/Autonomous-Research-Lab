import os
import json
import time
from datetime import datetime, date
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import networkx as nx
import fitz

from backend.services.graph_rag import GraphRAG
from backend.services.research_recommender import ResearchRecommender
from backend.services.research_memory import ResearchMemory
from backend.services.graph_gap_finder import GraphGapFinder
from backend.services.neo4j_store import Neo4jStore
from backend.services.proposal_pipeline import ProposalPipeline
from backend.services.pdf_generator import PDFGenerator
from backend.services.cypher_search import CypherSearch
from backend.agents.research_team import ResearchTeam

app = FastAPI(
    title="Autonomous Research Lab",
    version="1.0.0",
    description="Multi-Agent Autonomous Scientific Research Laboratory"
)

# In-memory high-speed cache
_cache = {}

def get_cached(key: str, ttl: int = 60):
    if key in _cache:
        data, exp = _cache[key]
        if time.time() < exp:
            return data
    return None

def set_cached(key: str, data, ttl: int = 60):
    _cache[key] = (data, time.time() + ttl)
    return data


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
graph_rag = GraphRAG()

recommender = ResearchRecommender()

memory = ResearchMemory()

gap_finder = GraphGapFinder()

proposal_pipeline = ProposalPipeline()

pdf_generator = PDFGenerator()

team = ResearchTeam()

neo4j_store = Neo4jStore()

cypher = CypherSearch()


@app.get("/")
def home():

    return {
        "project": "Autonomous Research Lab",
        "status": "running",
        "features": [
            "GraphRAG",
            "Neo4j",
            "Citation Graph",
            "Author Graph",
            "Research Lineage",
            "Research Gaps",
            "Proposal Generator",
            "Research Team"
        ]
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


from backend.llms.llm_factory import get_llm_info, set_llm_backend

@app.get("/llm/status")
def get_llm_status_endpoint():
    return get_llm_info()

@app.post("/llm/switch")
def switch_llm_endpoint(payload: dict):
    backend = payload.get("backend")
    if not backend:
        raise HTTPException(status_code=400, detail="Missing 'backend' field in payload")
    model = payload.get("model")
    api_key = payload.get("api_key")
    try:
        updated = set_llm_backend(backend=backend, model=model, api_key=api_key)
        return {"message": f"Successfully switched to {backend.upper()}", "llm": updated}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/system_status")
def system_status():
    neo4j_online = False
    try:
        with neo4j_store.driver.session() as s:
            s.run("RETURN 1")
            neo4j_online = True
    except Exception:
        neo4j_online = False

    papers_count = len(list(Path("data/papers").glob("*.json"))) if Path("data/papers").exists() else 0
    summaries_count = len(list(Path("data/summaries").glob("*.json"))) if Path("data/summaries").exists() else 0
    embeddings_count = len(list(Path("data/embeddings").glob("*.json"))) if Path("data/embeddings").exists() else 0
    gaps_count = len(list(Path("data/gaps").glob("*.md"))) if Path("data/gaps").exists() else 0
    proposals_count = len(list(Path("data/proposals").glob("*.md"))) if Path("data/proposals").exists() else 0

    llm_info = get_llm_info()

    return {
        "status": "online",
        "service": "Autonomous Research Lab Engine",
        "llm_backend": llm_info["current_backend"],
        "llm_model": llm_info["current_model"],
        "llm_name": llm_info["name"],
        "neo4j_connected": neo4j_online,
        "counts": {
            "papers": papers_count,
            "summaries": summaries_count,
            "embeddings": embeddings_count,
            "gaps": gaps_count,
            "proposals": proposals_count
        }
    }


@app.get("/graph/full")
def get_full_graph():
    cached = get_cached("graph_full", ttl=30)
    if cached:
        return cached

    nodes_map = {}
    links = []

    # 1. Load citation graph
    cit_file = Path("knowledge_graph/citation_graph.json")
    if cit_file.exists():
        with open(cit_file, "r", encoding="utf-8") as f:
            cit = json.load(f)
        for node in cit.get("nodes", []):
            nid = node["id"]
            nodes_map[nid] = {
                "id": nid,
                "name": node.get("title", nid),
                "type": "paper",
                "val": 10,
                "abstract": ""
            }
        for edge in cit.get("edges", []):
            links.append({
                "source": edge["source"],
                "target": edge["target"],
                "type": "citation",
                "similarity": edge.get("similarity", 0.5)
            })

    # 2. Enrich with local paper metadata
    paper_dir = Path("data/papers")
    if paper_dir.exists():
        for pfile in paper_dir.glob("*.json"):
            pid = pfile.stem
            try:
                with open(pfile, "r", encoding="utf-8") as f:
                    pdata = json.load(f)
                if pid not in nodes_map:
                    nodes_map[pid] = {
                        "id": pid,
                        "name": pdata.get("title", pid),
                        "type": "paper",
                        "val": 8,
                        "abstract": pdata.get("summary", ""),
                        "authors": pdata.get("authors", []),
                        "published": pdata.get("published", "")
                    }
                else:
                    nodes_map[pid]["abstract"] = pdata.get("summary", "")
                    nodes_map[pid]["authors"] = pdata.get("authors", [])
                    nodes_map[pid]["published"] = pdata.get("published", "")
            except Exception:
                continue

    # 3. Add lineage links
    lin_file = Path("knowledge_graph/lineage_graph.json")
    if lin_file.exists():
        with open(lin_file, "r", encoding="utf-8") as f:
            lin = json.load(f)
        edges = lin.get("edges") or lin.get("links") or []
        for edge in edges:
            links.append({
                "source": edge["source"],
                "target": edge["target"],
                "type": "lineage"
            })

    # 4. Add author nodes & links
    aut_file = Path("knowledge_graph/author_graph.json")
    if aut_file.exists():
        with open(aut_file, "r", encoding="utf-8") as f:
            aut = json.load(f)
        for n in aut.get("nodes", []):
            if n.get("type") == "author":
                nodes_map[n["id"]] = {
                    "id": n["id"],
                    "name": n["id"],
                    "type": "author",
                    "val": 6
                }
        edges = aut.get("edges") or aut.get("links") or []
        for edge in edges:
            links.append({
                "source": edge["source"],
                "target": edge["target"],
                "type": "authored"
            })

    # Node degree scaling
    for l in links:
        s = l.get("source")
        t = l.get("target")
        if s in nodes_map:
            nodes_map[s]["val"] = nodes_map[s].get("val", 5) + 1
        if t in nodes_map:
            nodes_map[t]["val"] = nodes_map[t].get("val", 5) + 1

    result = {
        "nodes": list(nodes_map.values()),
        "links": links
    }
    return set_cached("graph_full", result, ttl=30)


@app.get("/graph/metrics")
def graph_metrics():
    cached = get_cached("graph_metrics", ttl=30)
    if cached:
        return cached

    G = nx.DiGraph()
    files = [
        "knowledge_graph/citation_graph.json",
        "knowledge_graph/lineage_graph.json"
    ]
    for file in files:
        path = Path(file)
        if not path.exists():
            continue
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
            edges = data.get("edges") or data.get("links") or []
            for e in edges:
                G.add_edge(e["source"], e["target"])
        except Exception:
            continue

    if len(G.nodes) == 0:
        return {"nodes_count": 0, "edges_count": 0, "density": 0, "top_influential_papers": [], "top_connected_papers": []}

    try:
        pagerank = nx.pagerank(G)
        top_pagerank = sorted(pagerank.items(), key=lambda x: x[1], reverse=True)[:5]
    except Exception:
        top_pagerank = []

    degree = dict(G.degree())
    top_degree = sorted(degree.items(), key=lambda x: x[1], reverse=True)[:5]

    result = {
        "nodes_count": G.number_of_nodes(),
        "edges_count": G.number_of_edges(),
        "density": round(nx.density(G), 4),
        "connected_components": nx.number_weakly_connected_components(G),
        "top_influential_papers": [{"id": k, "score": round(v, 4)} for k, v in top_pagerank],
        "top_connected_papers": [{"id": k, "degree": v} for k, v in top_degree]
    }
    return set_cached("graph_metrics", result, ttl=30)



@app.get("/graph")
def get_graph():

    files = [
        "knowledge_graph/citation_graph.json",
        "knowledge_graph/lineage_graph.json"
    ]

    edges = []

    for file in files:

        path = Path(file)

        if not path.exists():
            continue

        with open(
            path,
            "r",
            encoding="utf-8"
        ) as f:

            graph = json.load(f)

        if "edges" in graph:

            edges.extend(
                graph["edges"]
            )

        elif "links" in graph:

            edges.extend(
                graph["links"]
            )

    return edges


@app.get("/authors")
def authors():

    file = Path(
        "knowledge_graph/author_graph.json"
    )

    if not file.exists():
        return []

    with open(
        file,
        "r",
        encoding="utf-8"
    ) as f:

        graph = json.load(f)

    nodes = graph.get(
        "nodes",
        []
    )

    edges = (
        graph.get("edges")
        or
        graph.get("links")
        or
        []
    )

    result = []

    for node in nodes:

        if node.get("type") != "author":
            continue

        author_name = node["id"]

        papers = 0

        for edge in edges:

            if edge["source"] == author_name:

                papers += 1

            elif edge["target"] == author_name:

                papers += 1

        result.append(
            {
                "name": author_name,
                "papers": papers
            }
        )

    return result


@app.get("/timeline")
def timeline():

    file = Path(
        "knowledge_graph/lineage_graph.json"
    )

    if not file.exists():
        return []

    with open(
        file,
        "r",
        encoding="utf-8"
    ) as f:

        graph = json.load(f)

    edges = (
        graph.get("edges")
        or
        graph.get("links")
        or
        []
    )

    return [

        {
            "paper":
            edge["source"],

            "influenced":
            edge["target"]
        }

        for edge in edges
    ]


@app.get("/memory")
def get_memory():

    return memory.load()


@app.get("/recommend/{paper_id}")
def recommend(
    paper_id: str
):

    return {
        "paper_id": paper_id,
        "recommendations":
        recommender.recommend_related_papers(
            paper_id
        )
    }


@app.get("/ask")
def ask(
    query: str
):

    response = graph_rag.ask(
        query
    )

    return {
        "query": query,
        "response": response
    }


@app.get("/gaps")
def gaps():

    return {
        "gaps": gap_finder.find_gaps()
    }


@app.get("/proposal")
def proposal(topic: str = None):
    out_dir = Path("data/proposals")
    out_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    if topic:
        proposal_text = proposal_pipeline.generate(
            f"Research Topic: {topic}\nIdentify specific technical innovations, baseline comparisons, compute bounds, and validation metrics."
        )
        with open(out_dir / f"proposal_{timestamp}.md", "w", encoding="utf-8") as f:
            f.write(proposal_text)
        return {"proposal": proposal_text}

    validation_files = list(
        Path("data/validations").glob("*.md")
    )

    if not validation_files:
        proposal_text = proposal_pipeline.generate(
            "Topic: Edge AI, Vision Transformers, and Quantization for Real-Time Execution"
        )
        with open(out_dir / f"proposal_{timestamp}.md", "w", encoding="utf-8") as f:
            f.write(proposal_text)
        return {"proposal": proposal_text}

    latest = max(
        validation_files,
        key=lambda x: x.stat().st_mtime
    )

    with open(
        latest,
        "r",
        encoding="utf-8"
    ) as f:
        validation_text = f.read()

    proposal_text = proposal_pipeline.generate(validation_text)
    with open(out_dir / f"proposal_{timestamp}.md", "w", encoding="utf-8") as f:
        f.write(proposal_text)
    return {
        "proposal": proposal_text
    }


@app.get("/proposal/download/md")
def download_md():

    files = list(
        Path(
            "data/proposals"
        ).glob(
            "*.md"
        )
    )

    if not files:

        return {
            "error":
            "No proposals found"
        }

    latest = max(
        files,
        key=lambda x:
        x.stat().st_mtime
    )

    return FileResponse(
        latest,
        filename=latest.name
    )


@app.get("/proposal/download/pdf")
def download_pdf():

    proposal_dir = Path(
        "data/proposals"
    )

    files = list(
        proposal_dir.glob(
            "*.md"
        )
    )

    if not files:

        return {
            "error":
            "No proposals found"
        }

    latest = max(
        files,
        key=lambda x:
        x.stat().st_mtime
    )

    with open(
        latest,
        "r",
        encoding="utf-8"
    ) as f:

        content = f.read()

    pdf_file = (
        proposal_dir /
        "latest_proposal.pdf"
    )

    pdf_generator.create_pdf(
        content,
        str(pdf_file)
    )

    return FileResponse(
        pdf_file,
        filename="proposal.pdf"
    )


@app.get("/proposal/download/latex")
def download_latex():
    proposal_dir = Path("data/proposals")
    files = list(proposal_dir.glob("*.md"))
    if not files:
        return {"error": "No proposals found"}
    latest = max(files, key=lambda x: x.stat().st_mtime)
    with open(latest, "r", encoding="utf-8") as f:
        content = f.read()
    tex_path = proposal_dir / f"{latest.stem}.tex"
    clean_title = latest.stem.replace("_", " ").title()
    body_text = content.replace("%", "\\%").replace("&", "\\&").replace("#", "\\#").replace("_", "\\_")
    latex_content = f"""\\documentclass[conference]{{IEEEtran}}
\\usepackage{{cite}}
\\usepackage{{amsmath,amssymb,amsfonts}}
\\usepackage{{algorithmic}}
\\usepackage{{graphicx}}
\\usepackage{{textcomp}}
\\usepackage{{xcolor}}

\\begin{{document}}

\\title{{{clean_title}}}

\\author{{\\IEEEauthorblockN{{Autonomous Research Lab}}
\\IEEEauthorblockA{{\\textit{{Advanced Agentic Systems}} \\\\
Autonomous AI Division}}}}

\\maketitle

\\begin{{abstract}}
Automated scientific proposal synthesized by Autonomous Research Lab multi-agent research team.
\\end{{abstract}}

\\section{{Proposal Content}}
{body_text}

\\end{{document}}
"""
    with open(tex_path, "w", encoding="utf-8") as f:
        f.write(latex_content)
    return FileResponse(tex_path, filename=f"{latest.stem}.tex")



@app.get("/research_team")
def research_team(
    topic: str
):

    return team.run(
        topic
    )


@app.get("/neo4j_graph")
def neo4j_graph():
    try:
        query = """
        MATCH (n)-[r]->(m)
        RETURN
        n.id as source,
        m.id as target
        LIMIT 100
        """
        return neo4j_store.run_query(query)
    except Exception:
        file = Path("knowledge_graph/citation_graph.json")
        if file.exists():
            with open(file, "r", encoding="utf-8") as f:
                return json.load(f).get("edges", [])
        return []


@app.get("/neo4j_related")
def neo4j_related(
    paper_id: str
):
    try:
        return cypher.related_papers(paper_id)
    except Exception:
        return recommender.recommend_related_papers(paper_id)


from backend.services.neo4j_graphrag import Neo4jGraphRAG
neo4j_rag = Neo4jGraphRAG()

@app.get("/neo4j_rag")
def neo4j_rag_query(
    query: str,
    paper_id: str
):
    try:
        return {
            "response": neo4j_rag.ask(query, paper_id)
        }
    except Exception:
        return {
            "response": graph_rag.ask(query)
        }


from backend.services.dashboard_stats import DashboardStats
dashboard = DashboardStats()

@app.get("/stats")
def stats():
    return dashboard.get_stats()


from backend.services.community_detection import CommunityDetection
from backend.services.research_cluster_discovery import ResearchClusterDiscovery

community_detector = CommunityDetection()
cluster_discovery = ResearchClusterDiscovery()

@app.get("/communities")
def get_communities():
    try:
        res = community_detector.discover()
        return {"communities": res}
    except Exception:
        return {"communities": []}


@app.get("/clusters")
def get_clusters():
    try:
        res = cluster_discovery.clusters()
        if res:
            return {"clusters": res}
    except Exception:
        pass
    file = Path("knowledge_graph/citation_graph.json")
    if file.exists():
        with open(file, "r", encoding="utf-8") as f:
            graph = json.load(f)
        return {"clusters": graph.get("edges", [])}
    return {"clusters": []}


from backend.services.arxiv_client import (
    ArxivClient
)

from backend.services.paper_ingestor import (
    PaperIngestor
)

from backend.services.graph_updater import (
    GraphUpdater
)

arxiv_client = ArxivClient()

paper_ingestor = PaperIngestor()

graph_updater = GraphUpdater()

@app.get("/search_arxiv")
def search_arxiv(

    query: str

):

    return arxiv_client.search(

        query

    )

@app.post("/import_paper")
def import_paper(

    paper: dict

):

    file = paper_ingestor.save(

        paper

    )

    return {

        "saved":

        file

    }

@app.post("/update_graph")
def update_graph():

    return graph_updater.update()

from backend.services.paper_indexer import (
    PaperIndexer
)
paper_indexer = PaperIndexer()
@app.post("/index_paper")
def index_paper(
    paper: dict
):

    return paper_indexer.index(
        paper
    )


@app.post("/upload_paper_pdf")
async def upload_paper_pdf(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None
):
    pdf_dir = Path("data/pdfs")
    pdf_dir.mkdir(parents=True, exist_ok=True)
    clean_filename = Path(file.filename).name
    pdf_path = pdf_dir / clean_filename

    with open(pdf_path, "wb") as f:
        content = await file.read()
        f.write(content)

    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()

    lines = [l.strip() for l in text.split("\n") if l.strip()]
    title = lines[0] if lines else clean_filename.replace(".pdf", "")
    paper_id = clean_filename.replace(".pdf", "").replace(" ", "_")

    # Save to data/papers
    paper_data = {
        "title": title,
        "authors": ["Uploaded Manuscript Author"],
        "summary": text[:2000],
        "published": str(date.today()),
        "url": f"file://data/pdfs/{clean_filename}"
    }
    paper_dir = Path("data/papers")
    paper_dir.mkdir(parents=True, exist_ok=True)
    with open(paper_dir / f"{paper_id}.json", "w", encoding="utf-8") as f:
        json.dump(paper_data, f, indent=4)

    # Chunk and embed
    chunks = paper_indexer.chunker.chunk(text)
    paper_indexer.embeddings.save(paper_id, chunks)

    # Background graph update
    if background_tasks:
        background_tasks.add_task(graph_updater.update)
    else:
        try:
            graph_updater.update()
        except Exception:
            pass

    return {
        "status": "success",
        "paper_id": paper_id,
        "title": title,
        "pages": len(doc),
        "chunks": len(chunks)
    }


@app.post("/ingest_arxiv")
def ingest_arxiv_paper(
    payload: dict,
    background_tasks: BackgroundTasks = None
):
    query_or_id = payload.get("arxiv_id") or payload.get("query")
    if not query_or_id:
        raise HTTPException(status_code=400, detail="arxiv_id or query is required.")

    results = arxiv_client.search(query_or_id)
    if not results:
        raise HTTPException(status_code=404, detail="No matching paper found on arXiv.")

    paper = results[0]
    paper_id = paper["url"].split("/")[-1]
    paper_dir = Path("data/papers")
    paper_dir.mkdir(parents=True, exist_ok=True)

    with open(paper_dir / f"{paper_id}.json", "w", encoding="utf-8") as f:
        json.dump(paper, f, indent=4)

    if background_tasks:
        background_tasks.add_task(graph_updater.update)

    return {
        "status": "success",
        "paper_id": paper_id,
        "paper": paper
    }

from backend.services.research_cycle import (
    ResearchCycle
)

cycle = ResearchCycle()

@app.get("/research_cycle")
def research_cycle(
    topic: str
):

    return cycle.execute(
        topic
    )


from backend.services.experiment_pipeline import (
    ExperimentPipeline
)
experiment = ExperimentPipeline()
@app.get("/experiment_plan")
def experiment_plan(topic: str):

    return experiment.generate(topic)


from backend.services.research_intelligence import (
    ResearchIntelligence
)
research_intelligence = ResearchIntelligence()
@app.get("/research_intelligence")
def research_intelligence_endpoint(
    topic: str
):

    return research_intelligence.analyze(
        topic
    )


from backend.services.research_copilot import ResearchCopilot
copilot = ResearchCopilot()

@app.get("/copilot")
def copilot_endpoint(query: str):
    return copilot.chat(query)


from backend.llms.llm_factory import get_llm

@app.get("/writing")
def writing_endpoint(topic: str, section: str = "Abstract"):
    llm = get_llm()
    prompt = f"""
You are an expert AI research scientist preparing a manuscript for a top-tier peer-reviewed AI conference (NeurIPS, ICML, CVPR).
Write a high quality, comprehensive, publication-grade academic section for the following research paper:

Topic: {topic}
Section: {section}

Guidelines:
- Provide rigorous scientific terminology, mathematical formulation where applicable, and detailed methodological explanations.
- Ensure logical depth, clear structure, and academic precision.
- Return the section content in clear markdown.
"""
    output = llm.generate(prompt)
    return {
        "topic": topic,
        "section": section,
        "output": output
    }


@app.get("/search")
def search_papers(query: str):
    query_lower = query.lower()
    results = []
    paper_dir = Path("data/papers")
    if paper_dir.exists():
        for file in paper_dir.glob("*.json"):
            try:
                with open(file, "r", encoding="utf-8") as f:
                    paper = json.load(f)
                title = paper.get("title", "")
                summary = paper.get("summary", "")
                authors = paper.get("authors", [])
                if (
                    query_lower in title.lower()
                    or query_lower in summary.lower()
                    or any(query_lower in str(a).lower() for a in authors)
                ):
                    results.append({
                        "paper_id": file.stem,
                        "title": title,
                        "authors": authors,
                        "published": paper.get("published", ""),
                        "abstract": summary
                    })
            except Exception:
                continue

    if not results:
        try:
            arxiv_res = arxiv_client.search(query)
            for item in arxiv_res:
                results.append({
                    "paper_id": item.get("id", item.get("url", "").split("/")[-1]),
                    "title": item.get("title", ""),
                    "authors": item.get("authors", []),
                    "published": item.get("published", ""),
                    "abstract": item.get("summary", "")
                })
        except Exception:
            pass

    return {"results": results}


PROJECTS_FILE = Path("data/projects.json")

def load_projects():
    if not PROJECTS_FILE.exists():
        default_projects = [
            {
                "id": "proj-1",
                "title": "Edge Vision Transformers Optimization",
                "topic": "Lightweight Transformer Architectures for Real-Time Edge Devices",
                "status": "In Progress",
                "created_at": "2026-06-25",
                "papers_count": 5,
                "gaps_count": 2,
                "notes": "Exploring 4-bit and 8-bit quantization sweet spots on ARM and Jetson architectures."
            },
            {
                "id": "proj-2",
                "title": "Spiking Neural Networks & TinyML",
                "topic": "Energy-Efficient Neuromorphic Computing for Ultra-Low Power Wearables",
                "status": "Planning",
                "created_at": "2026-06-28",
                "papers_count": 3,
                "gaps_count": 4,
                "notes": "Lineage tracing between biological plausibility and hardware constraints."
            }
        ]
        save_projects(default_projects)
        return default_projects
    with open(PROJECTS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_projects(projects):
    PROJECTS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(PROJECTS_FILE, "w", encoding="utf-8") as f:
        json.dump(projects, f, indent=2)

@app.get("/projects")
def get_projects():
    return load_projects()

@app.post("/projects")
def create_project(project: dict):
    projects = load_projects()
    if "id" not in project:
        project["id"] = f"proj-{len(projects) + 1}"
    projects.append(project)
    save_projects(projects)
    return {"message": "Project created", "project": project}

@app.delete("/projects/{project_id}")
def delete_project(project_id: str):
    projects = load_projects()
    projects = [p for p in projects if p.get("id") != project_id]
    save_projects(projects)
    return {"message": "Project deleted"}


from backend.auth.auth import router as auth_router
app.include_router(auth_router)