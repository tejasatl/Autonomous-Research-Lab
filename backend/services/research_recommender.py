import json


class ResearchRecommender:

    def __init__(self):

        with open(
            "knowledge_graph/citation_graph.json",
            "r",
            encoding="utf-8"
        ) as f:
            self.graph = json.load(f)

        self.nodes = {
            node["id"]: node
            for node in self.graph["nodes"]
        }

    def recommend_related_papers(
        self,
        paper_id: str,
        top_k: int = 5
    ):

        recommendations = []

        for edge in self.graph["edges"]:

            if edge["source"] == paper_id:

                target = edge["target"]

                recommendations.append(
                    {
                        "paper_id": target,
                        "title": self.nodes[target]["title"],
                        "similarity": edge["similarity"]
                    }
                )

        recommendations.sort(
            key=lambda x: x["similarity"],
            reverse=True
        )

        return recommendations[:top_k]