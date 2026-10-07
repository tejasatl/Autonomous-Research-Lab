import json

from pyvis.network import (
    Network
)

net = Network(
    height="800px",
    width="100%"
)

with open(
    "knowledge_graph/citation_graph.json",
    "r"
) as f:

    graph = json.load(f)

for node in graph["nodes"]:

    net.add_node(
        node["id"],
        label=node["title"]
    )

for edge in graph["edges"]:

    net.add_edge(
        edge["source"],
        edge["target"]
    )

net.save_graph(
    "citation_graph.html"
)

print(
    "Saved citation_graph.html"
)