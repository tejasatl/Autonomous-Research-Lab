from backend.services.graph_normalizer import GraphNormalizer


class GraphStore:

    def __init__(self):

        norm = GraphNormalizer()

        self.lineage = norm.normalize(
            "knowledge_graph/lineage_graph.json"
        )

        self.author = norm.normalize(
            "knowledge_graph/author_graph.json"
        )

    def get_successor_papers(self, paper_id):

        return [
            e["target"]
            for e in self.lineage["edges"]
            if e["source"] == paper_id
        ]

    def get_collaborators(self, author):

        results = set()

        for e in self.author["edges"]:

            if e["source"] == author:
                results.add(e["target"])

            elif e["target"] == author:
                results.add(e["source"])

        return list(results)