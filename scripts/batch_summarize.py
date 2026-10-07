import json
from pathlib import Path

from backend.agents.summarizer_agent import SummarizerAgent
from backend.services.summary_storage import SummaryStorage


agent = SummarizerAgent()
storage = SummaryStorage()

paper_dir = Path("data/papers")
summary_dir = Path("data/summaries")

for file in paper_dir.glob("*.json"):

    paper_id = file.stem

    # Skip if already summarized
    summary_file = summary_dir / f"{paper_id}.json"

    if summary_file.exists():
        print(f"\nSkipping {file.name} (already summarized)")
        continue

    print(f"\nProcessing {file.name}")

    with open(
        file,
        "r",
        encoding="utf-8"
    ) as f:

        paper = json.load(f)

    summary = agent.summarize(
        paper["summary"]
    )

    storage.save_summary(
        paper_id,
        summary
    )

    print("Done")