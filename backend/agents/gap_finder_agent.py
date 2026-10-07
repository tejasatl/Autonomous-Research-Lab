from backend.llms.llm_factory import get_llm


class GapFinderAgent:

    def __init__(self):
        self.llm = get_llm()

    def find_gaps(
        self,
        trend_analysis: str
    ):

        prompt = f"""
You are an experienced AI researcher.

Based on the following trend analysis,
identify:

1. Top Research Gaps
2. Unexplored Directions
3. Underrepresented Problems
4. Potential High-Impact Research Topics

Trend Analysis:

{trend_analysis}

Return detailed reasoning.
"""

        return self.llm.generate(prompt)