from backend.services.neo4j_store import (
    Neo4jStore
)


class CommunityDetection:

    def __init__(self):

        self.db = Neo4jStore()

    def discover(self):

        query = """
        CALL gds.louvain.stream(
            'researchGraph'
        )
        YIELD nodeId,
              communityId

        RETURN
            gds.util.asNode(nodeId).id AS paper_id,
            labels(
                gds.util.asNode(nodeId)
            ) AS labels,
            communityId

        ORDER BY
            communityId
        """

        return self.db.run_query(query)