from backend.services.graph_normalizer import GraphNormalizer

norm = GraphNormalizer()

graph = norm.normalize("knowledge_graph/lineage_graph.json")

print("NODES:")
print(graph["nodes"])

print("\nEDGES:")
print(graph["edges"])