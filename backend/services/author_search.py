from backend.utils.json_loader import safe_json_load


class AuthorSearch:

    def __init__(self):

        self.graph = safe_json_load(
            "knowledge_graph/author_graph.json",
            {"links": []}
        )

    def collaborators(self, author_name: str):

        collaborators = set()

        for edge in self.graph.get("links", []):

            source = edge.get("source")
            target = edge.get("target")

            if source == author_name:
                collaborators.add(target)

            elif target == author_name:
                collaborators.add(source)

        return list(collaborators)