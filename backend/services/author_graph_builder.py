import json
from pathlib import Path
import networkx as nx


class AuthorGraphBuilder:

    def __init__(self):
        self.graph = nx.Graph()

    def build(self):

        paper_dir = Path("data/papers")

        for file in paper_dir.glob("*.json"):

            with open(
                file,
                "r",
                encoding="utf-8"
            ) as f:

                paper = json.load(f)

            paper_id = file.stem
            title = paper["title"]

            authors = paper.get(
                "authors",
                []
            )

            # paper node

            self.graph.add_node(
                paper_id,
                type="paper",
                title=title
            )

            # author nodes

            for author in authors:

                self.graph.add_node(
                    author,
                    type="author"
                )

                self.graph.add_edge(
                    author,
                    paper_id,
                    relation="wrote"
                )

            # coauthor links

            for i in range(len(authors)):
                for j in range(i + 1, len(authors)):

                    self.graph.add_edge(
                        authors[i],
                        authors[j],
                        relation="coauthor"
                    )

        return self.graph