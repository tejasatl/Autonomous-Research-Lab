import json
from pathlib import Path

import networkx as nx

from sentence_transformers import (
    SentenceTransformer
)

from sklearn.metrics.pairwise import (
    cosine_similarity
)


paper_dir = Path("data/papers")

papers = []

for file in paper_dir.glob("*.json"):

    with open(
        file,
        "r",
        encoding="utf-8"
    ) as f:

        paper = json.load(f)

    papers.append(
        {
            "id": file.stem,
            "title": paper["title"],
            "summary": paper["summary"]
        }
    )

print(
    f"Loaded {len(papers)} papers"
)

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

texts = [
    f"{p['title']} {p['summary']}"
    for p in papers
]

embeddings = model.encode(
    texts,
    show_progress_bar=True
)

similarity_matrix = cosine_similarity(
    embeddings
)

G = nx.DiGraph()

for paper in papers:

    G.add_node(
        paper["id"],
        title=paper["title"]
    )

SIMILARITY_THRESHOLD = 0.45

for i in range(len(papers)):

    for j in range(len(papers)):

        if i == j:
            continue

        similarity = similarity_matrix[i][j]

        if similarity >= SIMILARITY_THRESHOLD:

            G.add_edge(
                papers[i]["id"],
                papers[j]["id"],
                similarity=round(
                    float(similarity),
                    3
                )
            )

output = (
    "knowledge_graph/"
    "citation_graph.json"
)

data = nx.node_link_data(G)

with open(
    output,
    "w",
    encoding="utf-8"
) as f:

    json.dump(
        data,
        f,
        indent=2
    )

print("\nSaved:", output)

print(
    "Nodes:",
    G.number_of_nodes()
)

print(
    "Edges:",
    G.number_of_edges()
)

print("\nTop Similarities:\n")

top_edges = sorted(
    G.edges(data=True),
    key=lambda x: x[2]["similarity"],
    reverse=True
)

for u, v, data in top_edges[:10]:

    print(
        f"{u} -> {v} : "
        f"{data['similarity']}"
    )