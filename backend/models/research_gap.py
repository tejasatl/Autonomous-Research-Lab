from dataclasses import dataclass


@dataclass
class ResearchGap:

    title: str
    description: str

    impact_score: int
    novelty_score: int
    difficulty_score: int