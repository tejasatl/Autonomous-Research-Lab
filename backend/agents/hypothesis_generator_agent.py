from backend.llms.llm_factory import get_llm


class HypothesisGeneratorAgent:

    def __init__(self):
        self.llm = get_llm()

    def generate(
        self,
        gap_text: str
    ):

        prompt = f"""
You are an AI research scientist.

Given this research gap:

{gap_text}

Generate:

1. Research Idea Title
2. Hypothesis
3. Expected Contribution
4. Novelty Score (1-10)
5. Impact Score (1-10)
6. Feasibility Score (1-10)
7. Evaluation Plan

Return in clear format.
"""

        return self.llm.generate(prompt)