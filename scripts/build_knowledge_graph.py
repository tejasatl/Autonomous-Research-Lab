import json
from pathlib import Path

from backend.services.knowledge_graph import (
    KnowledgeGraph
)

from backend.agents.concept_extractor_agent import (
    ConceptExtractorAgent
)

kg = KnowledgeGraph()
agent = ConceptExtractorAgent()

paper_dir = Path(
    "data/papers"
)

for file in paper_dir.glob("*.json"):

    with open(
        file,
        "r",
        encoding="utf-8"
    ) as f:

        paper = json.load(f)

    paper_id = file.stem

    title = paper["title"]

    summary = paper["summary"]

    kg.add_paper(
        paper_id,
        title
    )

    concepts = agent.extract(
        summary
    )

    for concept in concepts:

        kg.add_concept(
            concept
        )

        kg.add_relation(
            paper_id,
            "uses",
            concept
        )

kg.save()

print("Knowledge graph built.")