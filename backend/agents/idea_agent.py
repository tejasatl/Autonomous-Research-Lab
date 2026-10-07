from backend.services.graph_gap_finder import (
    GraphGapFinder
)

from backend.llms.llm_factory import (
    get_llm
)


class IdeaAgent:

    def __init__(self):

        self.gap_finder = (
            GraphGapFinder()
        )

        self.llm = get_llm()

    def generate(self, topic=None):
        if topic:
            prompt = f"""
You are an innovative AI research scientist.

Topic / Objective:
{topic}

Generate a clear, novel research idea with:
1. Title
2. Core Hypothesis
3. Key Technical Innovation
4. Expected Impact
5. Feasibility Assessment
6. Proposed Evaluation Methodology

Return structured markdown.
"""
            return self.llm.generate(prompt)
        return self.generate_ideas()

    def generate_ideas(self):

        gaps = (
            self.gap_finder
            .find_gaps()
        )

        prompt = f"""
Generate 5 novel research ideas.

Research gaps:

{gaps}

For each idea provide:

1. Title
2. Hypothesis
3. Novelty
4. Impact
5. Evaluation Plan
"""

        return self.llm.generate(
            prompt
        )