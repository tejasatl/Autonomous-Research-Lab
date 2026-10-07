from backend.agents.roadmap_agent import (
    RoadmapAgent
)

agent = RoadmapAgent()

print(
    agent.generate()
)