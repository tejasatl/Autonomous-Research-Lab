from backend.services.cypher_traversal import (
    CypherTraversal
)

from backend.llms.llm_factory import (
    get_llm
)


class Neo4jGraphRAG:

    def __init__(self):

        self.cypher = (
            CypherTraversal()
        )

        self.llm = get_llm()

    def ask(
        self,
        query,
        paper_id
    ):

        related = (
            self.cypher
            .related_papers(
                paper_id
            )
        )

        prompt = f"""
Question:

{query}

Graph Context:

{related}

Answer using graph knowledge.
"""

        return self.llm.generate(
            prompt
        )