from backend.utils.json_loader import safe_json_load


class LineageSearch:

    def __init__(self):

        self.graph = safe_json_load(
            "knowledge_graph/lineage_graph.json",
            {"links": []}
        )

    def successors(self, paper_id):

        results = []

        for edge in self.graph["links"]:
            if edge["source"] == paper_id:
                results.append(edge["target"])

        return results