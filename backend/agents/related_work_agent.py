from backend.llms.llm_factory import get_llm


class RelatedWorkAgent:

    def __init__(self):

        self.llm = get_llm()

    def generate(
        self,
        topic
    ):

        prompt = f"""
Topic

{topic}

Write a Related Work section.

Group papers

Compare approaches

Discuss limitations

Identify research gaps

Return academic markdown.
"""

        return self.llm.generate(prompt)