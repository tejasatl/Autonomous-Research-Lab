from backend.llms.llm_factory import get_llm


class ContributionAgent:

    def __init__(self):

        self.llm = get_llm()

    def extract(
        self,
        paper
    ):

        prompt = f"""
Extract the main contributions.

Paper

{paper}

Return

Major Contributions

Novel Ideas

Technical Innovations

Practical Applications
"""

        return self.llm.generate(prompt)