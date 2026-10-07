from backend.services.neo4j_store import (
    Neo4jStore
)


class CypherSearch:

    def __init__(self):

        self.db = Neo4jStore()

    def related_papers(
        self,
        paper_id
    ):

        query = """
        MATCH (p:Paper)-[:RELATED]->(r:Paper)
        WHERE p.id = $paper_id
        RETURN r.id as paper
        """

        return self.db.run_query(
            query,
            {
                "paper_id":
                paper_id
            }
        )