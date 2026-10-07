from backend.services.neo4j_store import (
    Neo4jStore
)


class Neo4jGraphSearch:

    def __init__(self):

        self.store = Neo4jStore()

    def similar_papers(
        self,
        paper_id
    ):

        query = """
        MATCH
        (p:Paper {id:$id})
        -[r:SIMILAR_TO]->
        (q:Paper)

        RETURN
        q.id AS id,
        q.title AS title,
        r.score AS score

        ORDER BY score DESC
        """

        with self.store.driver.session() as session:

            result = session.run(
                query,
                id=paper_id
            )

            return [
                dict(record)
                for record in result
            ]