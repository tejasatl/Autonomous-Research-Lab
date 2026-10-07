from fastapi import APIRouter

from backend.agents.research_director_agent import (
    ResearchDirectorAgent
)

router = APIRouter()

director = ResearchDirectorAgent()


@router.get("/research")
def research():

    result = director.run(
        "Edge AI, Vision Transformers"
    )

    return result