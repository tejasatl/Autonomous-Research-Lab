from backend.llms.llm_factory import get_llm


class NoveltyValidatorAgent:

    def __init__(self):
        self.llm = get_llm()

    def validate(
        self,
        hypothesis_text: str,
        paper_context: str
    ):

        prompt = f"""
You are a research evaluator.

Research Idea:

{hypothesis_text}

Existing Literature:

{paper_context}

Evaluate:

1. Novelty Score (1-10)
2. Why it is novel
3. Similar existing work
4. Main differences
5. Risk factors
6. Publication potential

Be critical.
"""

        return self.llm.generate(prompt)