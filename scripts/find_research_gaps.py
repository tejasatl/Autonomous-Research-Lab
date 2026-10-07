import json
from pathlib import Path

from backend.agents.gap_finder_agent import (
    GapFinderAgent
)

summaries = []

for file in Path(
    "data/summaries"
).glob("*.json"):

    with open(
        file,
        "r",
        encoding="utf-8"
    ) as f:

        data = json.load(f)

        summaries.append(
            data["summary"]
        )

trend_text = "\n\n".join(
    summaries
)

agent = GapFinderAgent()
try:
    gaps = agent.find_gaps(trend_text)
except Exception as e:
    print("Gap generation skipped due to quota:", e)
    gaps = "Mock gaps: edge AI optimization, model compression, adaptive inference"

print(gaps)

from backend.services.gap_storage import GapStorage

agent = GapFinderAgent()

gaps = agent.find_gaps(
    trend_text
)

storage = GapStorage()

path = storage.save(gaps)

print("\n")
print(gaps)

print("\nSaved to:")
print(path)