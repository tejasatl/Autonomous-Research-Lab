import fitz
from pathlib import Path

class PDFTextExtractor:
    def extract(self, pdf_path):
        path = Path(pdf_path)
        if not path.exists():
            return ""
        try:
            with fitz.open(str(path)) as doc:
                text = []
                for page in doc:
                    page_text = page.get_text()
                    if page_text:
                        text.append(page_text)
                return "\n".join(text)
        except Exception as e:
            print(f"Error extracting text from PDF {pdf_path}: {e}")
            return ""