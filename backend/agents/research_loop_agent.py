from backend.agents.research_director_agent import ResearchDirectorAgent
from backend.agents.idea_agent import IdeaAgent
from backend.agents.planner_agent import PlannerAgent
from backend.agents.critic_agent import CriticAgent
from backend.agents.proposal_generator_agent import ProposalGeneratorAgent

class ResearchLoopAgent:
    def __init__(self):
        self.director = ResearchDirectorAgent()
        self.idea = IdeaAgent()
        self.planner = PlannerAgent()
        self.critic = CriticAgent()
        self.proposal = ProposalGeneratorAgent()

    def run(self, topic):
        objective = self.director.direct(topic)
        idea = self.idea.generate(objective)
        plan = self.planner.plan(idea)
        review = self.critic.review(plan)
        proposal = self.proposal.generate(
            validation_text=review,
            context=f"Topic: {topic}\nCore Idea: {idea}\nExperimental Plan: {plan}"
        )

        return {
            "objective": objective,
            "idea": idea,
            "plan": plan,
            "review": review,
            "proposal": proposal
        }