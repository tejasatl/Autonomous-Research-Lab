from backend.services.neo4j_store import (
    Neo4jStore
)

store = Neo4jStore()

with store.driver.session() as session:

    result = session.run(
        "RETURN 'Connected' AS message"
    )

    print(
        result.single()["message"]
    )

store.close()