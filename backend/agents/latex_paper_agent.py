from backend.llms.llm_factory import get_llm


class LatexPaperAgent:

    def __init__(self):

        self.llm = get_llm()

    def generate(
        self,
        topic
    ):

        prompt = f"""
Generate an IEEE style LaTeX paper skeleton.

Topic:

{topic}

Include

Title

Abstract

Introduction

Related Work

Methodology

Experiments

Results

Conclusion

References

Return valid LaTeX.
"""

        return self.llm.generate(prompt)