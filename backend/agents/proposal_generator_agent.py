from backend.llms.llm_factory import get_llm


class ProposalGeneratorAgent:

    def __init__(self):

        self.llm = get_llm()

    def generate(
        self,
        validation_text,
        context="",
        research_gap=""
    ):

        prompt = f"""
You are an academic researcher.

Validation:

{validation_text}

Research Context:

{context}

Research Gap:

{research_gap}

Create a complete research proposal.

Include:

1. Title
2. Abstract
3. Problem Statement
4. Related Work
5. Research Gap
6. Methodology
7. Experimental Setup
8. Expected Results
9. Risks
10. Future Directions

Return markdown.
"""

        return self.llm.generate(
            prompt
        )