from pathlib import Path
from datetime import datetime


class ReportStorage:

    def __init__(self):
        self.storage_dir = Path("data/reports")
        self.storage_dir.mkdir(
            parents=True,
            exist_ok=True
        )

    def save_report(self, report: str):

        timestamp = datetime.now().strftime(
            "%Y%m%d_%H%M%S"
        )

        filename = (
            self.storage_dir /
            f"report_{timestamp}.md"
        )

        with open(
            filename,
            "w",
            encoding="utf-8"
        ) as f:

            f.write(report)

        return filename