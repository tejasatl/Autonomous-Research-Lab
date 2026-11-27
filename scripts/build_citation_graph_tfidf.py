import json
from pathlib import Path
import networkx as nx
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def build_tfidf_graph():
    paper_dir = Path("data/papers")
    papers = []
    for file in paper_dir.glob("*.json"):
        with open(file, "r", encoding="utf-8") as f:
            paper = json.load(f)
        papers.append({
            "id": file.stem,
            "title": paper["title"],
            "summary": paper["summary"]
        })

    documents = [paper["summary"] for paper in papers]
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(documents)
    similarity_matrix = cosine_similarity(tfidf_matrix)

    G = nx.DiGraph()
    for paper in papers:
        G.add_node(paper["id"], title=paper["title"])

    SIMILARITY_THRESHOLD = 0.15
    for i in range(len(papers)):
        for j in range(len(papers)):
            if i == j:
                continue
            similarity = similarity_matrix[i][j]
            if similarity >= SIMILARITY_THRESHOLD:
                G.add_edge(papers[i]["id"], papers[j]["id"], similarity=round(float(similarity), 3))

    output = "knowledge_graph/citation_graph.json"
    data = nx.node_link_data(G)
    with open(output, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    print("\nSaved TFIDF graph:", output)
    print("Nodes:", G.number_of_nodes())
    print("Edges:", G.number_of_edges())


if __name__ == "__main__":
    build_tfidf_graph()
