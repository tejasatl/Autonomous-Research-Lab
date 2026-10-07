import re
try:
    from nltk.tokenize import sent_tokenize
except ImportError:
    sent_tokenize = None

class PaperChunker:
    def chunk(self, text, chunk_size=8):
        if not text or not text.strip():
            return []

        sentences = []
        if sent_tokenize:
            try:
                sentences = sent_tokenize(text)
            except Exception:
                sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', text) if s.strip()]
        else:
            sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', text) if s.strip()]

        if not sentences:
            sentences = [line.strip() for line in text.split("\n") if line.strip()]

        chunks = []
        current = []
        for sentence in sentences:
            current.append(sentence)
            if len(current) >= chunk_size:
                chunks.append(" ".join(current))
                current = []

        if current:
            chunks.append(" ".join(current))

        return chunks