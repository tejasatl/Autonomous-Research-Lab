import json

from backend.agents.summarizer_agent import SummarizerAgent


agent = SummarizerAgent()

with open(
    "data/papers/2601.03290v1.json",
    "r",
    encoding="utf-8"
) as f:

    paper = json.load(f)

summary = agent.summarize(
    paper["summary"]
)

print(summary)