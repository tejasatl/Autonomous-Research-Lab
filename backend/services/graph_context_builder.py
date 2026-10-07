import json
from pathlib import Path

class GraphContextBuilder:
    def __init__(self):
        self.paper_dir = Path("data/papers")
        self.paper_dir.mkdir(parents=True, exist_ok=True)

    def build_context(self, paper_ids):
        chunks = []

        for paper_id in paper_ids:
            safe_id = str(paper_id).replace("/", "_").replace(":", "_")
            file = self.paper_dir / f"{safe_id}.json"

            if not file.exists():
                file = self.paper_dir / f"{paper_id}.json"
                if not file.exists():
                    continue

            try:
                with open(file, "r", encoding="utf-8") as f:
                    paper = json.load(f)

                title = paper.get("title", "Untitled")
                authors = paper.get("authors", [])
                if isinstance(authors, list):
                    authors_str = ", ".join(str(a) for a in authors)
                else:
                    authors_str = str(authors)

                summary = paper.get("summary") or paper.get("abstract") or "No abstract available."

                chunks.append(
                    f"Title: {title}\nAuthors: {authors_str}\nSummary:\n{summary}"
                )
            except Exception as e:
                print(f"Error reading context for paper {paper_id}: {e}")

        return "\n\n".join(chunks)