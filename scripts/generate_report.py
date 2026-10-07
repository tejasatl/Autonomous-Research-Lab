import json
from pathlib import Path

from backend.agents.trend_analyzer_agent import (
    TrendAnalyzerAgent
)

from backend.agents.report_writer_agent import (
    ReportWriterAgent
)

from backend.services.report_storage import (
    ReportStorage
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

trend_agent = TrendAnalyzerAgent()

trend_analysis = trend_agent.analyze(
    summaries
)

report_agent = ReportWriterAgent()

report = report_agent.generate_report(
    topic="Transformer Models for Edge Devices",
    trend_analysis=trend_analysis
)

storage = ReportStorage()

path = storage.save_report(report)

print(path)