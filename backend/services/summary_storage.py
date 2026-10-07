import json
from pathlib import Path


class SummaryStorage:

    def __init__(self):
        self.storage_dir = Path("data/summaries")
        self.storage_dir.mkdir(parents=True, exist_ok=True)

    def save_summary(
        self,
        paper_id: str,
        summary: str
    ):

        filename = self.storage_dir / f"{paper_id}.json"

        with open(
            filename,
            "w",
            encoding="utf-8"
        ) as f:

            json.dump(
                {"summary": summary},
                f,
                indent=4,
                ensure_ascii=False
            )