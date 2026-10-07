from pathlib import Path

from backend.services.proposal_pipeline import (
    ProposalPipeline
)

validation_files = list(
    Path("data/validations").glob("*.md")
)

latest = max(
    validation_files,
    key=lambda x: x.stat().st_mtime
)

with open(
    latest,
    "r",
    encoding="utf-8"
) as f:

    validation_text = f.read()

pipeline = ProposalPipeline()

proposal = pipeline.generate(
    validation_text
)

print(proposal)

from datetime import datetime

timestamp = datetime.now().strftime(
    "%Y%m%d_%H%M%S"
)

filename = (
    f"data/proposals/"
    f"proposal_{timestamp}.md"
)

with open(
    filename,
    "w",
    encoding="utf-8"
) as f:

    f.write(proposal)

print("\nSaved:")
print(filename)