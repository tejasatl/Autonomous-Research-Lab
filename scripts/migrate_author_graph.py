import json

from backend.services.neo4j_store import (
    Neo4jStore
)


store = Neo4jStore()

with open(
    "knowledge_graph/author_graph.json",
    "r",
    encoding="utf-8"
) as f:

    graph = json.load(f)

with store.driver.session() as session:

    for node in graph["nodes"]:

        node_id = node["id"]

        if node.get("type") == "author":

            session.run(
                """
                MERGE (a:Author {
                    name:$name
                })
                """,
                name=node_id
            )

    edges = graph.get(
        "edges",
        graph.get(
            "links",
            []
        )
    )

    for edge in edges:

        source = edge["source"]
        target = edge["target"]

        session.run(
            """
            MERGE (a:Author {
                name:$source
            })

            MERGE (b:Author {
                name:$target
            })

            MERGE
            (a)-[:CO_AUTHOR]->(b)
            """,
            source=source,
            target=target
        )

store.close()

print(
    "Author graph migrated"
)