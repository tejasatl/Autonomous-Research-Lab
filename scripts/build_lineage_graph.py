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
            "summary": paper["summary"],
            "published": paper["published"]
        }
    )

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

texts = [
    p["title"] + " " + p["summary"]
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
        title=paper["title"],
        published=paper["published"]
    )

THRESHOLD = 0.50

for i in range(len(papers)):

    for j in range(len(papers)):

        if i == j:
            continue

        older = papers[i]
        newer = papers[j]

        if older["published"] >= newer["published"]:
            continue

        similarity = similarity_matrix[i][j]

        if similarity >= THRESHOLD:

            G.add_edge(
                older["id"],
                newer["id"],
                similarity=round(
                    float(similarity),
                    3
                ),
                relation="influenced"
            )

output = (
    "knowledge_graph/"
    "lineage_graph.json"
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

print("\nResearch Lineage:\n")

for u, v, d in sorted(
    G.edges(data=True),
    key=lambda x: x[2]["similarity"],
    reverse=True
):

    print(
        f"{u} -> {v} "
        f"({d['similarity']})"
    )