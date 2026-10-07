from backend.services.paper_retriever import PaperRetriever
from backend.services.paper_storage import PaperStorage


retriever = PaperRetriever()
storage = PaperStorage()

papers = retriever.search(
    "transformer models for edge devices",
    max_results=5
)

saved_files = storage.save_papers(papers)

print("\nSaved Files:\n")

for file in saved_files:
    print(file)

