import json
from pathlib import Path

class PaperStorage:
    def __init__(self):
        self.storage_dir = Path("data/papers")
        self.storage_dir.mkdir(parents=True, exist_ok=True)

    def save_papers(self, papers):
        saved_files = []
        for paper in papers:
            arxiv_id = (
                paper.get("id") or
                paper.get("paper_id") or
                (paper.get("url", "").rstrip("/").split("/")[-1] if paper.get("url") else None) or
                "unknown_paper"
            )
            # Sanitize arxiv_id
            safe_id = arxiv_id.replace("/", "_").replace(":", "_")
            filename = self.storage_dir / f"{safe_id}.json"

            with open(filename, "w", encoding="utf-8") as f:
                json.dump(
                    paper,
                    f,
                    indent=4,
                    ensure_ascii=False
                )

            saved_files.append(filename.name)

        return saved_files