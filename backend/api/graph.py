from fastapi import APIRouter

from backend.services.neo4j_store import (
    Neo4jStore
)

router = APIRouter()


@router.get("/graph")
def graph():

    store = Neo4jStore()

    with store.driver.session() as session:

        result = session.run(
            """
            MATCH (a)-[r]->(b)

            RETURN
            a.id AS source,
            b.id AS target,
            type(r) AS relation

            LIMIT 500
            """
        )

        return [
            dict(record)
            for record in result
        ]