from backend.services.graph_search import GraphSearch


class ResearchRecommender:

    def __init__(self):

        self.graph = GraphSearch()

    def recommend(
        self,
        paper_id
    ):

        return self.graph.find_related_papers(
            paper_id
        )