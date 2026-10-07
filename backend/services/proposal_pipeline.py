from backend.services.graph_gap_finder import (
    GraphGapFinder
)

from backend.services.graph_context_builder import (
    GraphContextBuilder
)

from backend.agents.proposal_generator_agent import (
    ProposalGeneratorAgent
)


class ProposalPipeline:

    def __init__(self):

        self.gaps = GraphGapFinder()

        self.context_builder = (
            GraphContextBuilder()
        )

        self.agent = (
            ProposalGeneratorAgent()
        )

    def generate(
        self,
        validation_text
    ):

        gaps = self.gaps.find_gaps()

        if gaps:

            gap = gaps[0]

            paper_ids = [
                gap["paper_id"]
            ]

            context = (
                self.context_builder
                .build_context(
                    paper_ids
                )
            )

            research_gap = (
                gap["reason"]
            )

        else:

            context = ""

            research_gap = ""

        return self.agent.generate(
            validation_text,
            context,
            research_gap
        )