# ⚛ Autonomous Research Lab (ARL) v2.0
> **An Autonomous Scientific Discovery Laboratory Powered by Multi-Agent AI Swarms, Hybrid GraphRAG, and Citation Topology Networks.**

[![Python 3.11+](https://img.shields.io/badge/Python-3.11%2B-blue.svg?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111%2B-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg?logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📑 Table of Contents
1. [The Vision & Core Purpose](#-the-vision--core-purpose)
2. [High-Level Architecture](#-high-level-architecture)
3. [The Multi-Agent Research Swarm](#-the-multi-agent-research-swarm)
4. [Step-by-Step Installation & Deployment](#-step-by-step-installation--deployment)
   - [Option A: Local Development Setup (Recommended)](#option-a-local-development-setup)
   - [Option B: 1-Click Docker Deployment](#option-b-1-click-docker-deployment)
5. [Configuring LLM Providers (Gemini, Ollama, Groq, OpenAI)](#-configuring-llm-providers)
6. [Comprehensive Feature User Manual](#-comprehensive-feature-user-manual)
   - [1. Lab Cockpit](#1-lab-cockpit)
   - [2. AI & Agent Intelligence](#2-ai--agent-intelligence)
   - [3. Knowledge Graphs & Topology](#3-knowledge-graphs--topology)
   - [4. Lab Operations & Publishing](#4-lab-operations--publishing)
7. [API Specification & Swagger Documentation](#-api-specification)
8. [Repository Directory Blueprint](#-repository-directory-blueprint)
9. [Troubleshooting & FAQ](#-troubleshooting--faq)
10. [Contributing & License](#-contributing--license)

---

## 🎯 The Vision & Core Purpose

Traditional scientific inquiry typically takes human researchers **months of manual labor**:
1. Sifting through hundreds of arXiv preprints and PDFs.
2. Building mental maps of who cited whom and identifying historical lineage.
3. Discovering where the literature has blind spots (**Research Gaps**).
4. Formulating falsifiable hypotheses and selecting baselines/datasets.
5. Drafting complete research proposals and conference manuscripts in LaTeX.

**Autonomous Research Lab (ARL)** fully automates this entire discovery cycle into an end-to-end, multi-agent AI execution engine. Whether operating in cloud environments or completely offline using local open-weight LLMs, ARL autonomously ingests literature, constructs citation topologies, detects unexplored frontiers, stress-tests experimental protocols, and synthesizes publication-grade manuscripts.

---

## 🏛 High-Level Architecture

ARL couples **Dense Vector Embeddings** with **Knowledge Graph Lineage** to achieve hallucination-free GraphRAG (Graph Retrieval-Augmented Generation):

```
                        ┌──────────────────────────────────────────────────┐
                        │             React 18 + Vite Frontend             │
                        │       (2D Force Graph, Cockpit, Swarm UI)        │
                        └────────────────────────┬─────────────────────────┘
                                                 │ REST API / JWT
                        ┌────────────────────────▼─────────────────────────┐
                        │              FastAPI Backend Engine              │
                        │               (backend/api/main.py)              │
                        └────────────┬────────────────────────┬────────────┘
                                     │                        │
            ┌────────────────────────▼──────────┐   ┌─────────▼────────────────────────┐
            │    Multi-Agent Research Swarm     │   │      Hybrid Graph Knowledge      │
            │  - 👑 Research Director Agent     │   │  - Sentence-Transformers Embed   │
            │  - 💡 Divergent Idea Agent        │   │  - TF-IDF Citation Graph         │
            │  - 🔬 Hypothesis Agent            │   │  - Temporal Lineage Pathways     │
            │  - 📋 Experiment Planner Agent    │   │  - Co-Authorship Network         │
            │  - 🧐 Peer Review Critic Agent    │   │  - Neo4j / Local Dual-Mode JSON  │
            │  - 📄 Proposal / LaTeX Agent      │   │  - PyMuPDF PDF Text Chunker      │
            └───────────────────────────────────┘   └──────────────────────────────────┘
```

---

## 🤖 The Multi-Agent Research Swarm

Rather than relying on a single generalist prompt, ARL distributes cognition across specialized autonomous agents that debate, refine, and stress-test ideas:

| Agent | Module | Primary Function |
|---|---|---|
| **👑 Research Director** | [`research_director_agent.py`](backend/agents/research_director_agent.py) | Principal Investigator (PI) role. Sets high-level objectives, scope constraints, and milestones. |
| **💡 Idea Agent** | [`idea_agent.py`](backend/agents/idea_agent.py) | Divergent brainstorming. Cross-pollinates disparate fields to formulate high-novelty concepts. |
| **🔬 Hypothesis Agent** | [`hypothesis_agent.py`](backend/agents/hypothesis_agent.py) | Converts concepts into mathematically rigorous, falsifiable scientific hypotheses. |
| **📋 Planner Agent** | [`planner_agent.py`](backend/agents/planner_agent.py) | Formulates step-by-step experiment roadmaps, ablation designs, and baseline selections. |
| **🧐 Critic Agent** | [`critic_agent.py`](backend/agents/critic_agent.py) | Acts as "Reviewer #2". Scrutinizes experimental soundness, hardware bottlenecks, and failure modes. |
| **📄 Proposal Agent** | [`proposal_generator_agent.py`](backend/agents/proposal_generator_agent.py) | Synthesizes end-to-end proposals formatted in Markdown, PDF, and compile-ready LaTeX (`.tex`). |
| **✍️ Writing Assistant** | [`writing_assistant.py`](backend/api/main.py) | Drafts formal manuscript sections (Abstract, Introduction, Related Work, Methodology, etc.). |

---

## ⚡ Step-by-Step Installation & Deployment

### Prerequisites
- **Python**: 3.11 or higher
- **Node.js**: v18+ and **npm**
- **Git**

---

### Option A: Local Development Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/Autonomous-Research-Lab.git
cd Autonomous-Research-Lab
```

#### 2. Configure Environment Variables
Copy the `.env.example` template to `.env`:
```bash
cp .env.example .env
```
Open `.env` in any text editor and provide your preferred LLM provider key:
```env
LLM_BACKEND=gemini
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Get a free key from [Google AI Studio](https://aistudio.google.com/). You can also use Local Ollama with zero API keys!)*

#### 3. Backend Setup
```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
python backend/main.py
```
> The backend will start on **`http://127.0.0.1:8000`**.  
> Test it in your browser: [http://127.0.0.1:8000/system_status](http://127.0.0.1:8000/system_status)

#### 4. Frontend Setup
Open a new terminal window:
```bash
cd Autonomous-Research-Lab/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
> The web interface will launch on **`http://localhost:5173`**.

---

### Option B: 1-Click Docker Deployment

If you prefer to run both backend and frontend inside containers:

```bash
# 1. Create your .env file
cp .env.example .env

# 2. Build and run containers
docker-compose up --build
```
- Frontend UI: `http://localhost:5173`
- Backend API & Swagger: `http://localhost:8000/docs`

---

## 🔄 Configuring LLM Providers

ARL features **Dynamic Runtime LLM Switching**. You can switch AI providers on the fly directly in the web UI (top right corner button: `🤖 LLM: ... ▾`) or via `.env`:

### 1. Google Gemini (Cloud Default)
```env
LLM_BACKEND=gemini
GEMINI_API_KEY=your_gemini_key
```
*Supported models: `gemini-2.5-flash`, `gemini-1.5-pro`, `gemini-1.5-flash`*

### 2. Local Ollama (100% Offline & Private)
1. Install [Ollama](https://ollama.ai/) and pull a model:
   ```bash
   ollama run llama3
   ```
2. Set in `.env`:
   ```env
   LLM_BACKEND=local
   ```
*Supported models: `llama3`, `mistral`, `deepseek-r1`, `qwen2.5` (zero API key needed!)*

### 3. Groq Cloud (Ultra-Fast Inference)
```env
LLM_BACKEND=groq
GROQ_API_KEY=your_groq_key
```
*Supported models: `llama-3.3-70b-versatile`, `mixtral-8x7b-32768`*

### 4. OpenAI
```env
LLM_BACKEND=openai
OPENAI_API_KEY=your_openai_key
```
*Supported models: `gpt-4o-mini`, `gpt-4o`*

---

## 📖 Comprehensive Feature User Manual

### 1. Lab Cockpit
- **📊 Dashboard (`/`)**: Executive control center. Displays live telemetry: indexed paper counts, tracked researchers, citation links, identified research gaps, and system health. Contains quick-launch triggers for all autonomous tools.
- **📁 Projects Workspace (`/projects`)**: Create and manage distinct scientific initiatives (e.g. *"Ultra-Low Power Vision Transformers"*). Tag milestones as `Planning`, `In Progress`, or `Completed`.
- **🔄 Autonomous Research Cycle (`/research_cycle`)**: A visual 5-stage automated assembly line. Enter a topic and click **Execute Cycle**. The system coordinates Director ➔ Idea ➔ Planner ➔ Critic ➔ Proposal in one sequential pass with stage-by-stage copy buttons.

---

### 2. AI & Agent Intelligence
- **🚀 Research Copilot (`/copilot`)**: Continuous conversational scientific assistant grounded in your literature graph. Includes prompt suggestion chips and deep-linking from research gaps.
- **🤖 Multi-Agent Team (`/research-team`)**: Watch the entire swarm collaborate live. Enter any domain to see the Idea Agent propose novel architectures, the Planner specify datasets and compute, the Critic perform adversarial review, and the Proposal Agent synthesize the paper.
- **💬 GraphRAG Chat (`/chat`)**: Multi-turn conversational interface querying both vector chunk embeddings and citation graph neighbors.
- **🧠 Intelligence Hub (`/research-intelligence`)**: Synthesizes empirical benchmark standards, citation lineage, novelty scoring, and validation protocols for any topic.

---

### 3. Knowledge Graphs & Topology
- **🌐 Interactive 2D Force Graph (`/graph`)**: Physics-simulated canvas powered by `react-force-graph-2d`. Zoom, pan, search nodes in real time, and click on any paper bubble to inspect its abstract, authors, and degree centrality in a slide-out drawer.
- **🔬 Research Clusters (`/clusters`)**: Unsupervised clustering of literature into thematic communities.
- **👥 Network Communities (`/communities`)**: Louvain modularity partitions discovering research collaboration groups.
- **⚡ Neo4j Database Explorer (`/neo4j`)**: Direct Cypher traversal for 1-hop and 2-hop graph neighbors with automated local JSON fallback.
- **👨‍🔬 Researcher Network (`/authors`)**: Searchable index of all authors in your library, sorted by publication volume.
- **📈 Publication Timeline (`/timeline`)**: Chronological influence chains tracing how foundational architectures evolved into successor breakthroughs.

---

### 4. Lab Operations & Publishing
- **🔍 Literature Search & Ingest Studio (`/search`)**:
  - **Tab 1: Search** — Query your local library and arXiv for keywords.
  - **Tab 2: Direct arXiv Ingest** — Paste any arXiv ID (e.g., `2312.00752` or `1706.03762`) to download, chunk, embed, and link the paper to your knowledge graph automatically.
  - **Tab 3: Upload PDF** — Drag and drop any research PDF preprint; PyMuPDF will parse and vectorize it.
- **🎯 Research Gap Discovery (`/gaps`)**: Scans citation topology for high-impact frontier gaps and provides one-click *"Investigate with Copilot"* triggers.
- **🧪 Experiment & Compute Planner (`/experiment-planner`)**: Structured planning tool that recommends datasets, baseline models, compute hardware budgets (GPUs, VRAM), and execution timelines.
- **📄 Grant Proposal Studio (`/proposal`)**: Synthesizes end-to-end proposals with one-click **Export LaTeX (`.tex`)**, **Markdown (`.md`)**, or **PDF**.
- **✍️ Academic Writing Assistant (`/writing`)**: Drafts individual manuscript sections (*Abstract*, *Introduction*, *Related Work*, *Methodology*, *Experiments*, *Conclusion*) with formal academic rigor.
- **💾 Persistent Lab Memory (`/memory`)**: Inspects long-term episodic memory concepts and anchors preserved across agent sessions.

---

## 📡 API Specification

Interactive Swagger UI documentation is available at **`http://127.0.0.1:8000/docs`**.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/system_status` | Health telemetry, active LLM, and indexed document counts |
| `GET` | `/llm/status` | Current LLM provider, active model, and supported backends |
| `POST` | `/llm/switch` | Switch active LLM provider and model dynamically at runtime |
| `GET` | `/graph/full` | Complete nodes and links enriched with abstracts for 2D visualization |
| `GET` | `/graph/metrics` | NetworkX PageRank, density, and connected components |
| `GET` | `/gaps` | Algorithmic research gaps with explanation reasoning |
| `GET` | `/search?query=...` | Hybrid local and arXiv literature search |
| `POST` | `/ingest_arxiv` | Ingest paper by arXiv ID, compute embeddings, and update graph |
| `POST` | `/upload_paper_pdf` | Upload and vectorize local research PDF preprint |
| `GET` | `/copilot?query=...` | Conversational GraphRAG query |
| `GET` | `/research_team?topic=...` | Coordinated Multi-Agent Swarm execution |
| `GET` | `/research_cycle?topic=...` | Autonomous 5-stage closed-loop execution |
| `GET` | `/experiment_plan?topic=...` | Datasets, baselines, hardware, and LaTeX protocol |
| `GET` | `/writing?topic=...&section=...`| Publication-grade manuscript section synthesis |
| `GET` | `/proposal?topic=...` | Complete research proposal synthesis |
| `GET` | `/proposal/download/latex` | Download compile-ready `.tex` LaTeX manuscript |
| `GET` | `/proposal/download/pdf` | Download formatted proposal as PDF |
| `GET` | `/projects` | List active research projects |
| `POST` | `/projects` | Create a new research project initiative |
| `DELETE`| `/projects/{id}` | Delete a research project initiative |
| `POST` | `/register` & `/login` | Secure JWT user authentication |

---

## 📂 Repository Directory Blueprint

```
Autonomous-Research-Lab/
├── backend/
│   ├── agents/            # Multi-agent implementations (director, idea, planner, critic, etc.)
│   ├── api/               # FastAPI route definitions and server logic (main.py)
│   ├── auth/              # Native bcrypt hashing and JWT token handlers
│   ├── config/            # Pydantic v2 settings management (settings.py)
│   ├── database/          # User storage (users.json)
│   ├── llms/              # Modular LLM adapters (Gemini, Local Ollama, Groq, OpenAI)
│   ├── models/            # Pydantic data schemas (User, Paper, Gap, Idea)
│   ├── services/          # GraphRAG, PyMuPDF, embeddings, Neo4j, Copilot, Ingestor
│   └── main.py            # Uvicorn entrypoint exporting app
├── frontend/
│   ├── src/
│   │   ├── components/    # Layout, Sidebar, Topbar, ProtectedRoute
│   │   ├── pages/         # Dashboard, GraphExplorer, Copilot, Projects, etc.
│   │   ├── services/      # Axios API service client
│   │   └── index.css      # Design system & dark theme styling
│   ├── package.json       # React 18, Vite, React Force Graph 2D
│   └── vite.config.js     # Vite configuration
├── data/                  # Persistent data stores (tracked with .gitkeep)
│   ├── chunks/            # Extracted text chunks
│   ├── embeddings/        # Sentence-transformer vector representations
│   ├── gaps/              # Identified research gap files
│   ├── papers/            # Local JSON paper metadata
│   ├── pdfs/              # Downloaded PDF preprints
│   └── proposals/         # Synthesized proposals (.md, .pdf, .tex)
├── knowledge_graph/       # Seed graphs (citation_graph, author_graph, lineage_graph)
├── memory/                # Long-term episodic memory storage
├── scripts/               # Automation utilities and batch pipelines
├── .env.example           # Documented configuration template
├── .gitignore             # Production git ignore rules
├── Dockerfile.backend     # Backend container build specification
├── Dockerfile.frontend    # Frontend container build specification
├── docker-compose.yml     # Multi-container orchestration
└── requirements.txt       # Python dependencies
```

---

## ❓ Troubleshooting & FAQ

#### Q: Do I need Neo4j installed to run the lab?
**No.** ARL operates in **dual-mode**. If a local Neo4j instance is not detected on port 7687, the platform seamlessly falls back to its built-in high-speed local JSON knowledge graphs.

#### Q: Can I run this completely offline without paying for API keys?
**Yes.** Set `LLM_BACKEND=local` in your `.env` and start Ollama (`ollama run llama3`). The entire multi-agent swarm, GraphRAG retrieval, and paper writing will run locally on your machine with zero external network requests.

#### Q: How do I create my first user account?
Start the servers, visit `http://localhost:5173/register`, enter your username, email, and password, and click **Register**. You will be redirected to log in and start using the lab.

---

## 📄 License & Attribution

Distributed under the **MIT License**. See `LICENSE` for details. Built for AI researchers, scientists, and engineers exploring autonomous scientific discovery.
