from backend.services.topic_recommender import (
    TopicRecommender
)

from backend.services.research_recommender import (
    ResearchRecommender
)


class ResearchAssistant:

    def __init__(self):

        self.topic_engine = (
            TopicRecommender()
        )

        self.paper_engine = (
            ResearchRecommender()
        )

    def ask(
        self,
        query: str
    ):

        return self.topic_engine.recommend_by_topic(
            query
        )