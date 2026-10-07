from backend.agents.research_director_agent import ResearchDirectorAgent
from backend.agents.research_team import ResearchTeam
from backend.services.research_memory import ResearchMemory


class ResearchManager:
    """
    ResearchManager coordinates multi-agent research operations,
    manages execution checkpoints, and persists research state in memory.
    """

    def __init__(self):
        self.director = ResearchDirectorAgent()
        self.team = ResearchTeam()
        self.memory = ResearchMemory()

    def run_topic(self, topic: str):
        objective = self.director.direct(topic)
        team_result = self.team.run(topic)

        session_data = {
            "topic": topic,
            "objective": objective,
            "team_result": team_result
        }
        try:
            self.memory.save(session_data)
        except Exception:
            pass

        return session_data
