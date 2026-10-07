from backend.services.neo4j_store import (
    Neo4jStore
)


class ResearchClusterDiscovery:

    def __init__(self):

        self.db = Neo4jStore()

    def clusters(self):

        query = """
        CALL gds.louvain.stream(
            'researchGraph'
        )
        YIELD
            nodeId,
            communityId

        RETURN
            communityId,
            collect(
                gds.util.asNode(nodeId).id
            ) AS papers,
            count(*) AS size

        ORDER BY
            size DESC
        """

        return self.db.run_query(query)