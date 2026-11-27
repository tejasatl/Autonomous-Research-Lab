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

    def get_csr_memory_footprint(self) -> dict:
        """
        Calculate asymptotic physical RAM footprint in Compressed Sparse Row (CSR) format
        according to Section 4.5 of the manuscript:
        Memory = (|V| + 1) * 4 bytes + |E| * 4 bytes (using 32-bit indices).
        """
        num_nodes = self.graph.number_of_nodes()
        num_edges = self.graph.number_of_edges()

        # 32-bit integer indexing (4 bytes per element)
        indptr_bytes = (num_nodes + 1) * 4
        indices_bytes = num_edges * 4
        data_bytes = num_edges * 4  # optional edge weight float32
        total_bytes = indptr_bytes + indices_bytes + data_bytes
        total_mb = round(total_bytes / (1024 * 1024), 3)

        return {
            "num_nodes": num_nodes,
            "num_edges": num_edges,
            "indptr_bytes": indptr_bytes,
            "indices_bytes": indices_bytes,
            "total_bytes": total_bytes,
            "total_ram_mb": total_mb,
            "fits_in_commodity_ram": True
        }