from dataclasses import dataclass


@dataclass
class ResearchIdea:
    title: str
    hypothesis: str

    novelty_score: float
    impact_score: float
    feasibility_score: float

    supporting_papers: list[str]