from backend.services.neo4j_graph_search import (
    Neo4jGraphSearch
)

search = Neo4jGraphSearch()

results = search.similar_papers(
    "2502.15816v1"
)

for r in results:
    print(r)