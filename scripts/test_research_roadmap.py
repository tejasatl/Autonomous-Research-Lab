from backend.services.research_roadmap import (
    ResearchRoadmap
)

roadmap = ResearchRoadmap()

steps = roadmap.roadmap()

print("\nResearch Roadmap\n")

for step in steps:
    print(step)