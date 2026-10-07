from backend.llms.llm_factory import get_llm


class NoveltyAgent:

    def __init__(self):

        self.llm = get_llm()

    def score(
        self,
        idea
    ):

        prompt = f"""
Evaluate the novelty of this research idea.

Idea

{idea}

Provide

Novelty Score (0-100)

Reasons

Strengths

Weaknesses

Risk

Publication Potential
"""

        return self.llm.generate(prompt)