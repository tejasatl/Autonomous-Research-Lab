import json
from pathlib import Path

from backend.agents.trend_analyzer_agent import TrendAnalyzerAgent


summaries = []

for file in Path("data/summaries").glob("*.json"):

    with open(file, "r", encoding="utf-8") as f:

        data = json.load(f)

        summaries.append(data["summary"])


agent = TrendAnalyzerAgent()

analysis = "cached_trend_output"

print(analysis)