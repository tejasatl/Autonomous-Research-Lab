from backend.llms.llm_factory import get_llm


class SummarizerAgent:

    def __init__(self):
        self.llm = get_llm()

    def summarize(self, abstract: str):

        prompt = f"""
Summarize this research paper.

Return:

1. Main Idea
2. Method
3. Key Contribution
4. Limitations

Paper Abstract:

{abstract}
"""

        return self.llm.generate(prompt)