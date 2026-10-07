from backend.services.author_graph_builder import (
    AuthorGraphBuilder
)

from backend.services.author_graph_storage import (
    AuthorGraphStorage
)


builder = AuthorGraphBuilder()

graph = builder.build()

storage = AuthorGraphStorage()

storage.save(graph)

print(
    f"Nodes: {graph.number_of_nodes()}"
)

print(
    f"Edges: {graph.number_of_edges()}"
)