from dataclasses import dataclass


@dataclass
class Hypothesis:

    title: str

    hypothesis: str

    novelty_score: int
    impact_score: int
    feasibility_score: int

    evaluation_plan: str
    