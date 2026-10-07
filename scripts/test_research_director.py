from backend.agents.research_director_agent import (
    ResearchDirectorAgent
)

agent = (
    ResearchDirectorAgent()
)

result = agent.run(
    "Edge AI, Vision Transformers, Privacy"
)

print(result)