from backend.agents.paper_comparison_agent import PaperComparisonAgent
from backend.agents.benchmark_agent import BenchmarkAgent
from backend.agents.contribution_agent import ContributionAgent
from backend.agents.novelty_agent import NoveltyAgent
from backend.agents.validation_agent import ValidationAgent
from backend.agents.related_work_agent import RelatedWorkAgent


class ResearchIntelligence:

    def __init__(self):

        self.compare = PaperComparisonAgent()

        self.benchmark = BenchmarkAgent()

        self.contribution = ContributionAgent()

        self.novelty = NoveltyAgent()

        self.validation = ValidationAgent()

        self.related = RelatedWorkAgent()

    def analyze(
        self,
        topic
    ):

        return {

            "benchmark":
                self.benchmark.generate(topic),

            "related_work":
                self.related.generate(topic),

            "novelty":
                self.novelty.score(topic),

            "validation":
                self.validation.validate(topic)

        }