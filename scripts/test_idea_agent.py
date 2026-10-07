from backend.agents.idea_agent import (
    IdeaAgent
)

agent = IdeaAgent()

print(
    agent.generate_ideas()
)