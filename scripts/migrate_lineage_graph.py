import json

from backend.services.neo4j_store import (
    Neo4jStore
)

store = Neo4jStore()

with open(
    "knowledge_graph/lineage_graph.json",
    "r",
    encoding="utf-8"
) as f:

    graph = json.load(f)

with store.driver.session() as session:

    edges = graph.get(
        "edges",
        graph.get(
            "links",
            []
        )
    )

    for edge in edges:

        session.run(
            """
            MATCH (a:Paper {
                id:$source
            })

            MATCH (b:Paper {
                id:$target
            })

            MERGE
            (a)-[:INSPIRED]->(b)
            """,
            source=edge["source"],
            target=edge["target"]
        )

store.close()

print(
    "Lineage graph migrated"
)