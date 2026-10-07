from backend.services.arxiv_client import (
    ArxivClient
)

from backend.services.paper_ingestor import (
    PaperIngestor
)

client = ArxivClient()

ingestor = PaperIngestor()

papers = client.search(

    "edge ai",

    max_results=5

)

for paper in papers:

    ingestor.save(

        paper

    )

print(

    "Downloaded",

    len(papers),

    "papers"

)