from backend.llms.llm_factory import get_llm


class ValidationAgent:

    def __init__(self):

        self.llm = get_llm()

    def validate(
        self,
        idea
    ):

        prompt = f"""
Validate this research idea.

Idea

{idea}

Check

Existing work

Possible duplicates

Research gap

Feasibility

Expected impact
"""

        return self.llm.generate(prompt)