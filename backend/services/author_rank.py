import json
from pathlib import Path
import networkx as nx
from networkx.readwrite import json_graph

def get_author_ranks(graph_path="knowledge_graph/author_graph.json"):
    path = Path(graph_path)
    if not path.exists():
        return {}
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        G = json_graph.node_link_graph(data)
        if len(G) == 0:
            return {}
        return nx.pagerank(G)
    except Exception as e:
        print(f"Error computing author ranks: {e}")
        return {}

if __name__ == "__main__":
    scores = get_author_ranks()
    for author, score in sorted(scores.items(), key=lambda x: x[1], reverse=True):
        print(author, score)