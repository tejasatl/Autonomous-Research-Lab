import json


class EmergingTopics:

    def detect(self):

        with open(
            "knowledge_graph/citation_graph.json",
            "r"
        ) as f:

            graph = json.load(f)

        topics = []

        for edge in graph["edges"]:

            if edge["similarity"] > 0.55:

                topics.append(
                    (
                        edge["source"],
                        edge["target"]
                    )
                )

        return topics