from backend.llms.llm_factory import get_llm


class BaselineSelectorAgent:

    def __init__(self):

        self.llm = get_llm()

    def select(self, topic):

        prompt = f"""
Research Topic

{topic}

Recommend:

• SOTA models

• Classical baselines

• Recent papers

• GitHub implementations

Return markdown.
"""

        return self.llm.generate(prompt)