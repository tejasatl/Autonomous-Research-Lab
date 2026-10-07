import json
from pathlib import Path
from backend.agents.trend_analyzer_agent import TrendAnalyzerAgent
from backend.agents.report_writer_agent import ReportWriterAgent
from backend.services.report_storage import ReportStorage


class ReportGenerator:
    """
    ReportGenerator analyzes research paper summaries, extracts high-level trends,
    and produces structured academic survey reports.
    """

    def __init__(self):
        self.trend_agent = TrendAnalyzerAgent()
        self.report_agent = ReportWriterAgent()
        self.storage = ReportStorage()

    def generate(self, topic: str = "Transformer Models for Edge Devices") -> str:
        summaries = []
        summary_dir = Path("data/summaries")
        if summary_dir.exists():
            for file in summary_dir.glob("*.json"):
                try:
                    with open(file, "r", encoding="utf-8") as f:
                        data = json.load(f)
                        summaries.append(data.get("summary", ""))
                except Exception:
                    continue

        trend_analysis = self.trend_agent.analyze(summaries)
        report = self.report_agent.generate_report(
            topic=topic,
            trend_analysis=trend_analysis
        )
        saved_path = self.storage.save_report(report)
        return str(saved_path)
