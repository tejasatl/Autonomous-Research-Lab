import requests
from pathlib import Path

class PDFDownloader:
    def __init__(self):
        self.output = Path("data/pdfs")
        self.output.mkdir(parents=True, exist_ok=True)

    def download(self, paper):
        paper_id = paper.get("id") or paper.get("paper_id") or "unknown_paper"
        safe_id = paper_id.replace("/", "_").replace(":", "_")
        url = paper.get("pdf") or f"https://arxiv.org/pdf/{paper_id}.pdf"

        filename = self.output / f"{safe_id}.pdf"
        try:
            headers = {"User-Agent": "AutonomousResearchLab/2.0 (mailto:arl@lab.org)"}
            response = requests.get(url, headers=headers, timeout=30)
            if response.status_code == 200:
                with open(filename, "wb") as f:
                    f.write(response.content)
                return str(filename)
            else:
                print(f"Failed to download PDF {url}: status {response.status_code}")
                return None
        except Exception as e:
            print(f"Error downloading PDF {url}: {e}")
            return None