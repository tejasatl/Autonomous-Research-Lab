from backend.llms.llm_factory import get_llm


class ExperimentPlannerAgent:

    def __init__(self):

        self.llm = get_llm()

    def plan(self, topic):

        prompt = f"""
Research Topic

{topic}

Design experiments.

Include

Training

Validation

Ablation

Hyperparameters

Evaluation

Expected outcomes

Return markdown.
"""

        return self.llm.generate(prompt)