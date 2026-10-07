import json
from pathlib import Path

from backend.services.neo4j_store import (
    Neo4jStore
)


def load_graph(graph_file):

    with open(
        graph_file,
        "r",
        encoding="utf-8"
    ) as f:

        return json.load(f)


def migrate_nodes(
    session,
    graph
):

    for node in graph.get(
        "nodes",
        []
    ):

        session.run(
            """
            MERGE (p:Paper {
                id:$id
            })

            SET
                p.title=$title
            """,
            id=node["id"],
            title=node.get(
                "title",
                ""
            )
        )


def migrate_edges(
    session,
    graph
):

    edges = graph.get(
        "edges",
        graph.get(
            "links",
            []
        )
    )

    for edge in edges:

        similarity = edge.get(
            "similarity",
            0.0
        )

        session.run(
            """
            MATCH (a:Paper {
                id:$source
            })

            MATCH (b:Paper {
                id:$target
            })

            MERGE
            (a)-[r:SIMILAR_TO]->(b)

            SET
            r.score=$score
            """,
            source=edge["source"],
            target=edge["target"],
            score=float(
                similarity
            )
        )


def main():

    graph_file = Path(
        "knowledge_graph/citation_graph.json"
    )

    if not graph_file.exists():

        print(
            "citation_graph.json not found"
        )

        return

    graph = load_graph(
        graph_file
    )

    store = Neo4jStore()

    try:

        with store.driver.session() as session:

            migrate_nodes(
                session,
                graph
            )

            migrate_edges(
                session,
                graph
            )

        print(
            "\nMigration Complete"
        )

        print(
            f"Nodes: {len(graph['nodes'])}"
        )

        print(
            f"Edges: {len(graph['edges'])}"
        )

    finally:

        store.close()


if __name__ == "__main__":

    main()