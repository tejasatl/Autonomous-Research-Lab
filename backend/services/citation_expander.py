import json


class CitationExpander:

    def __init__(self):

        with open(
            "knowledge_graph/citation_graph.json",
            "r"
        ) as f:

            self.graph = json.load(f)

    def expand(
        self,
        paper_ids
    ):

        expanded = set(
            paper_ids
        )

        for edge in self.graph["edges"]:

            if edge["source"] in paper_ids:

                expanded.add(
                    edge["target"]
                )

        return list(expanded)