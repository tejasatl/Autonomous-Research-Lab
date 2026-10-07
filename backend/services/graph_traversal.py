from backend.services.neo4j_store import (
    Neo4jStore
)


class GraphTraversal:

    def __init__(self):

        self.db = Neo4jStore()

    def lineage(
        self,
        paper_id
    ):

        query = """
        MATCH path=
        (p:Paper)-[:INFLUENCED*1..5]->
        (x:Paper)

        WHERE p.id=$paper_id

        RETURN path
        """

        return self.db.run_query(
            query,
            {
                "paper_id":
                paper_id
            }
        )