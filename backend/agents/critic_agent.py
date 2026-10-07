from backend.llms.llm_factory import (
    get_llm
)


class CriticAgent:

    def __init__(self):

        self.llm = get_llm()

    def review(
        self,
        proposal
    ):

        prompt = f"""
You are a senior research reviewer.

Review the proposal.

Evaluate:

1. Novelty
2. Technical Soundness
3. Experimental Design
4. Risks
5. Weaknesses
6. Acceptance Probability

Proposal:

{proposal}
"""

        return self.llm.generate(
            prompt
        )