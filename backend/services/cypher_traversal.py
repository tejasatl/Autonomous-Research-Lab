from backend.services.neo4j_store import (
    Neo4jStore
)


class CypherTraversal:

    def __init__(self):

        self.db = Neo4jStore()

    def related_papers(
        self,
        paper_id
    ):

        query = """
        MATCH (p:Paper)-[r]->(n)
        WHERE p.id = $paper_id
        RETURN n.id as node
        LIMIT 20
        """

        return self.db.run_query(
            query,
            {
                "paper_id": paper_id
            }
        )

    def author_network(
        self,
        author
    ):

        query = """
        MATCH (a:Author)-[]-(n)
        WHERE a.name = $author
        RETURN n
        LIMIT 20
        """

        return self.db.run_query(
            query,
            {
                "author": author
            }
        )