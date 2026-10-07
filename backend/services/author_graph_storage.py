import json
import networkx as nx
from pathlib import Path


class AuthorGraphStorage:

    def save(
        self,
        graph
    ):

        output = (
            Path("knowledge_graph")
            / "author_graph.json"
        )

        data = nx.node_link_data(
            graph
        )

        with open(
            output,
            "w",
            encoding="utf-8"
        ) as f:

            json.dump(
                data,
                f,
                indent=4
            )

        print(
            f"Saved: {output}"
        )