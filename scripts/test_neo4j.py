from backend.services.neo4j_query import (
    Neo4jQuery
)

q = Neo4jQuery()

print(
    q.related_papers(
        "2502.15816v1"
    )
)