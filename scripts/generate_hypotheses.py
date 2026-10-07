from pathlib import Path

from backend.agents.hypothesis_generator_agent import (
    HypothesisGeneratorAgent
)

# Find all gap files
gap_files = list(
    Path("data/gaps").glob("*.md")
)

if not gap_files:
    raise FileNotFoundError(
        "No gap files found in data/gaps"
    )

# Get newest file
latest_gap_file = max(
    gap_files,
    key=lambda f: f.stat().st_mtime
)

print(
    f"Using gap file: {latest_gap_file.name}"
)

# Read contents
with open(
    latest_gap_file,
    "r",
    encoding="utf-8"
) as f:

    gap_text = f.read()

# Create agent
agent = HypothesisGeneratorAgent()

# Generate hypothesis
hypothesis = agent.generate(
    gap_text
)

print("\n")
print("=" * 80)
print("GENERATED HYPOTHESIS")
print("=" * 80)
print("\n")

print(hypothesis)

from pathlib import Path
from datetime import datetime

# Create folder if it doesn't exist
Path(
    "data/hypotheses"
).mkdir(
    parents=True,
    exist_ok=True
)

# Create filename
timestamp = datetime.now().strftime(
    "%Y%m%d_%H%M%S"
)

filename = (
    f"data/hypotheses/"
    f"hypothesis_{timestamp}.md"
)

# Save hypothesis
with open(
    filename,
    "w",
    encoding="utf-8"
) as f:

    f.write(hypothesis)

print("\nSaved:")
print(filename)