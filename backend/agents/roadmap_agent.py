from backend.services.research_roadmap import (
    ResearchRoadmap
)


class RoadmapAgent:

    def __init__(self):

        self.roadmap = (
            ResearchRoadmap()
        )

    def generate(self):

        return self.roadmap.roadmap()