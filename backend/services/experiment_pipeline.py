from backend.agents.dataset_recommender_agent import DatasetRecommenderAgent
from backend.agents.baseline_selector_agent import BaselineSelectorAgent
from backend.agents.experiment_planner_agent import ExperimentPlannerAgent
from backend.agents.hardware_estimator_agent import HardwareEstimatorAgent
from backend.agents.evaluation_agent import EvaluationAgent
from backend.agents.timeline_agent import TimelineAgent
from backend.agents.latex_paper_agent import LatexPaperAgent


class ExperimentPipeline:

    def __init__(self):

        self.datasets = DatasetRecommenderAgent()

        self.baselines = BaselineSelectorAgent()

        self.experiments = ExperimentPlannerAgent()

        self.hardware = HardwareEstimatorAgent()

        self.evaluation = EvaluationAgent()

        self.timeline = TimelineAgent()

        self.latex = LatexPaperAgent()

    def generate(
        self,
        topic
    ):

        return {

            "datasets":
                self.datasets.recommend(topic),

            "baselines":
                self.baselines.select(topic),

            "experiments":
                self.experiments.plan(topic),

            "hardware":
                self.hardware.estimate(topic),

            "evaluation":
                self.evaluation.evaluate(topic),

            "timeline":
                self.timeline.plan(topic),

            "latex":
                self.latex.generate(topic)

        }