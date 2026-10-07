import json
import networkx as nx


class AuthorInfluence:

    def calculate(self):

        with open(
            "knowledge_graph/author_graph.json",
            "r"
        ) as f:

            data = json.load(f)

        G = nx.node_link_graph(
            data
        )

        ranks = nx.pagerank(
            G
        )

        return sorted(
            ranks.items(),
            key=lambda x:
            x[1],
            reverse=True
        )