class GraphReasoner:

    def explain(
        self,
        papers
    ):

        reasons = []

        for paper in papers:

            reasons.append(
                f"""
Selected:
{paper['paper_id']}

Similarity:
{paper['similarity']}
"""
            )

        return "\n".join(
            reasons
        )