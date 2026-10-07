from backend.agents.research_team import ResearchTeam
from backend.llms.llm_factory import get_llm


class ResearchDirectorAgent:

    def __init__(self):
        self.team = ResearchTeam()
        self.llm = get_llm()

    def direct(self, topic: str) -> str:
        prompt = f"""
You are an AI Research Director.
Define a high-impact, state-of-the-art research directive and primary objective for this domain:

Domain / Topic:
{topic}

State:
1. Primary Research Objective
2. Key Unsolved Challenge to Address
3. Target Performance & Efficiency Goals
4. Scope Boundaries & Constraints

Provide a concise, direct mission statement.
"""
        return self.llm.generate(prompt)

    def run(self, topic: str):
        return self.execute(topic)

    def execute(self, topic: str):
        return self.team.run(topic)