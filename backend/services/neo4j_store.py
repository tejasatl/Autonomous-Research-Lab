from neo4j import GraphDatabase

from backend.config.settings import (
    NEO4J_URI,
    NEO4J_USER,
    NEO4J_PASSWORD
)


class Neo4jStore:

    def __init__(self):

        self.driver = (
            GraphDatabase.driver(
                NEO4J_URI,
                auth=(
                    NEO4J_USER,
                    NEO4J_PASSWORD
                )
            )
        )

    def close(self):

        self.driver.close()

    def run_query(
        self,
        query,
        params=None
    ):

        with self.driver.session() as session:

            result = session.run(
                query,
                params or {}
            )

            return [
                dict(record)
                for record in result
            ]