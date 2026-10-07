import json


class GraphRetriever:

    def __init__(self):

        with open(
            "knowledge_graph/citation_graph.json",
            "r",
            encoding="utf-8"
        ) as f:

            self.graph = json.load(f)

    def get_related_papers(
        self,
        paper_id
    ):

        related = []

        for edge in self.graph["edges"]:

            if edge["source"] == paper_id:

                related.append(
                    {
                        "paper_id":
                        edge["target"],

                        "score":
                        edge["similarity"]
                    }
                )

        return sorted(
            related,
            key=lambda x:
            x["score"],
            reverse=True
        )