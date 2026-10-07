import json

from pathlib import Path

from backend.services.paper_indexer import (
    PaperIndexer
)

paper = {

    "id":"test",

    "pdf":"https://arxiv.org/pdf/1706.03762.pdf"

}

engine = PaperIndexer()

print(

    engine.index(
        paper
    )

)