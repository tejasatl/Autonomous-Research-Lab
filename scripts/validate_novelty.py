import json
from pathlib import Path

from backend.agents.novelty_validator_agent import (
    NoveltyValidatorAgent
)

# Load summaries

paper_context = []

for file in Path(
    "data/summaries"
).glob("*.json"):

    with open(
        file,
        "r",
        encoding="utf-8"
    ) as f:

        data = json.load(f)

        paper_context.append(
            data["summary"]
        )

paper_context = "\n\n".join(
    paper_context
)

# Load latest hypothesis

hypothesis_files = list(
    Path(
        "data/hypotheses"
    ).glob("*.md")
)

latest = max(
    hypothesis_files,
    key=lambda x: x.stat().st_mtime
)

with open(
    latest,
    "r",
    encoding="utf-8"
) as f:

    hypothesis_text = f.read()

agent = NoveltyValidatorAgent()

result = agent.validate(
    hypothesis_text,
    paper_context
)

print(result)

from pathlib import Path
from datetime import datetime

Path(
    "data/validations"
).mkdir(
    parents=True,
    exist_ok=True
)

timestamp = datetime.now().strftime(
    "%Y%m%d_%H%M%S"
)

filename = (
    f"data/validations/"
    f"validation_{timestamp}.md"
)

with open(
    filename,
    "w",
    encoding="utf-8"
) as f:
    f.write(result)

print("\nSaved:")
print(filename)