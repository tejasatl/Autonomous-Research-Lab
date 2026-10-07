import json
from pathlib import Path


class GraphGapFinder:

    def __init__(self):

        with open(
            "knowledge_graph/citation_graph.json",
            "r",
            encoding="utf-8"
        ) as f:

            self.citation_graph = json.load(f)

        with open(
            "knowledge_graph/lineage_graph.json",
            "r",
            encoding="utf-8"
        ) as f:

            self.lineage_graph = json.load(f)

        self.paper_dir = Path(
            "data/papers"
        )

    def _load_paper(
        self,
        paper_id
    ):

        file = (
            self.paper_dir /
            f"{paper_id}.json"
        )

        if not file.exists():
            return None

        with open(
            file,
            "r",
            encoding="utf-8"
        ) as f:

            return json.load(f)

    def find_gaps(self):

        citation_counts = {}
        lineage_counts = {}

        for edge in self.citation_graph["edges"]:

            target = edge["target"]

            citation_counts[target] = (
                citation_counts.get(
                    target,
                    0
                ) + 1
            )

        for edge in self.lineage_graph["edges"]:

            target = edge["target"]

            lineage_counts[target] = (
                lineage_counts.get(
                    target,
                    0
                ) + 1
            )

        gaps = []

        all_papers = set()

        for node in self.citation_graph["nodes"]:

            all_papers.add(
                node["id"]
            )

        for paper_id in all_papers:

            citations = citation_counts.get(
                paper_id,
                0
            )

            lineage = lineage_counts.get(
                paper_id,
                0
            )

            if citations >= 1 and lineage == 0:

                paper = self._load_paper(
                    paper_id
                )

                if not paper:
                    continue

                gaps.append(
                    {
                        "paper_id":
                        paper_id,

                        "title":
                        paper.get(
                            "title",
                            ""
                        ),

                        "authors":
                        paper.get(
                            "authors",
                            []
                        ),

                        "published":
                        paper.get(
                            "published",
                            ""
                        ),

                        "citations":
                        citations,

                        "lineage":
                        lineage,

                        "reason":
                        (
                            "Strong semantic "
                            "connections but "
                            "weak research "
                            "lineage."
                        )
                    }
                )

        gaps.sort(
            key=lambda x:
            x["citations"],
            reverse=True
        )

        return gaps