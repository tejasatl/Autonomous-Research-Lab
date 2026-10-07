from backend.llms.llm_factory import get_llm


class PaperComparisonAgent:

    def __init__(self):

        self.llm = get_llm()

    def compare(
        self,
        paper_a,
        paper_b
    ):

        prompt = f"""
Compare the following two research papers.

Paper A

{paper_a}

Paper B

{paper_b}

Compare

1. Problem

2. Method

3. Dataset

4. Experiments

5. Results

6. Advantages

7. Limitations

Return markdown table.
"""

        return self.llm.generate(prompt)