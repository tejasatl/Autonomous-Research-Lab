import json
from pathlib import Path
from backend.services.pdf_text_extractor import PDFTextExtractor


class PaperParser:
    """
    PaperParser extracts structured metadata and body text from research paper documents.
    """

    def __init__(self):
        self.pdf_extractor = PDFTextExtractor()

    def parse_json(self, file_path: str) -> dict:
        path = Path(file_path)
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return {
            "id": path.stem,
            "title": data.get("title", ""),
            "authors": data.get("authors", []),
            "summary": data.get("summary", ""),
            "published": data.get("published", ""),
            "url": data.get("url", "")
        }

    def parse_pdf(self, pdf_path: str) -> dict:
        text = self.pdf_extractor.extract(pdf_path)
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        title = lines[0] if lines else "Untitled"
        return {
            "title": title,
            "text": text,
            "char_count": len(text),
            "line_count": len(lines)
        }
