from backend.services.graph_rag import (
    GraphRAG
)

engine = GraphRAG()

response = engine.ask(
    "privacy preserving vision transformers on edge devices"
)

print(response)