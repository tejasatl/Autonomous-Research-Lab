import json
import networkx as nx
from pathlib import Path


class KnowledgeGraph:

    def __init__(self):

        self.graph = nx.DiGraph()

        self.graph_file = Path(
            "knowledge_graph/graph.json"
        )

    def add_paper(
        self,
        paper_id,
        title
    ):

        self.graph.add_node(
            paper_id,
            type="paper",
            title=title
        )

    def add_concept(
        self,
        concept
    ):

        self.graph.add_node(
            concept,
            type="concept"
        )

    def add_relation(
        self,
        source,
        relation,
        target
    ):

        self.graph.add_edge(
            source,
            target,
            relation=relation
        )

    def save(self):

        data = nx.node_link_data(
            self.graph
        )

        self.graph_file.parent.mkdir(
            exist_ok=True
        )

        with open(
            self.graph_file,
            "w"
        ) as f:

            json.dump(
                data,
                f,
                indent=2
            )

    def load(self):

        if not self.graph_file.exists():
            return

        with open(
            self.graph_file,
            "r"
        ) as f:

            data = json.load(f)

        self.graph = nx.node_link_graph(
            data
        )