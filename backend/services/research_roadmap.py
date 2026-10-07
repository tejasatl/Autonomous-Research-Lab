import json


class ResearchRoadmap:

    def __init__(self):

        with open(
            "knowledge_graph/lineage_graph.json",
            "r"
        ) as f:

            self.graph = json.load(f)

    def roadmap(self):

        roadmap = []

        for edge in self.graph["edges"]:

            roadmap.append(
                (
                    edge["source"],
                    edge["target"]
                )
            )

        return roadmap