from backend.agents.planner_agent import (
    PlannerAgent
)

agent = PlannerAgent()

plan = agent.create_plan(
    "Edge AI"
)

print(plan)