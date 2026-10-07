from pathlib import Path
from datetime import datetime


class GapStorage:

    def __init__(self):
        self.storage_dir = Path("data/gaps")
        self.storage_dir.mkdir(
            parents=True,
            exist_ok=True
        )

    def save(self, text):

        timestamp = datetime.now().strftime(
            "%Y%m%d_%H%M%S"
        )

        filename = (
            self.storage_dir /
            f"gaps_{timestamp}.md"
        )

        with open(
            filename,
            "w",
            encoding="utf-8"
        ) as f:

            f.write(text)

        return filename