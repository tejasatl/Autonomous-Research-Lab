import json
from pathlib import Path

from backend.services.pdf_downloader import PDFDownloader
from backend.services.pdf_text_extractor import PDFTextExtractor
from backend.services.paper_chunker import PaperChunker
from backend.services.chunk_embedding_store import ChunkEmbeddingStore

class PaperIndexer:
    def __init__(self):
        self.downloader = PDFDownloader()
        self.extractor = PDFTextExtractor()
        self.chunker = PaperChunker()
        self.embeddings = ChunkEmbeddingStore()

    def index(self, paper):
        paper_id = paper.get("id") or paper.get("paper_id") or "unknown_paper"
        safe_id = str(paper_id).replace("/", "_").replace(":", "_")

        text = ""
        pdf = self.downloader.download(paper)
        if pdf and Path(pdf).exists():
            text = self.extractor.extract(pdf)

        # Fallback to abstract/summary if PDF text extraction yielded nothing
        if not text.strip():
            text = paper.get("summary") or paper.get("abstract") or paper.get("title") or ""

        chunks = self.chunker.chunk(text)
        if not chunks and text:
            chunks = [text]

        if chunks:
            self.embeddings.save(safe_id, chunks)

        chunk_file = Path("data/chunks") / f"{safe_id}.json"
        chunk_file.parent.mkdir(parents=True, exist_ok=True)

        with open(chunk_file, "w", encoding="utf-8") as f:
            json.dump(chunks, f, indent=2)

        return {
            "paper": safe_id,
            "chunks": len(chunks)
        }