from backend.agents.idea_agent import IdeaAgent
from backend.agents.planner_agent import PlannerAgent
from backend.agents.critic_agent import CriticAgent
from backend.agents.proposal_generator_agent import ProposalGeneratorAgent

class ResearchTeam:
    def __init__(self):
        self.idea = IdeaAgent()
        self.planner = PlannerAgent()
        self.critic = CriticAgent()
        self.proposal = ProposalGeneratorAgent()

    def run(self, topic):
        idea = self.idea.generate(topic)
        plan = self.planner.plan(idea)
        review = self.critic.review(plan)
        proposal = self.proposal.generate(
            validation_text=review,
            context=f"Topic: {topic}\nCore Idea: {idea}\nPlan: {plan}"
        )

        return {
            "idea": idea,
            "plan": plan,
            "review": review,
            "proposal": proposal
        }