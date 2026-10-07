from backend.services.knowledge_graph import KnowledgeGraph


class GraphSearch:

    def __init__(self):

        self.kg = KnowledgeGraph()
        self.kg.load()

    def find_related(self, concept):

        if not self.kg.graph:
            return []

        if concept not in self.kg.graph:
            return []

        return list(self.kg.graph.neighbors(concept))