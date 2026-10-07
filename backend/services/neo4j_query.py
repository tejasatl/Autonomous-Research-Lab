from backend.services.neo4j_store import (
    Neo4jStore
)


class Neo4jQuery:

    def __init__(self):

        self.store = Neo4jStore(
            "bolt://localhost:7687",
            "neo4j",
            "password"
        )

    def related_papers(
        self,
        paper_id
    ):

        query = """
        MATCH
        (p:Paper {id:$id})
        -[r:SIMILAR_TO]->
        (q:Paper)

        RETURN
        q.id,
        q.title,
        r.score

        ORDER BY r.score DESC
        """

        with self.store.driver.session() as session:

            result = session.run(
                query,
                id=paper_id
            )

            return list(result)