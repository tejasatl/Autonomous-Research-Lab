from backend.services.graph_gap_finder import (
    GraphGapFinder
)

finder = GraphGapFinder()

gaps = finder.find_gaps()

print(
    "\n=== Research Opportunities ===\n"
)

for i, gap in enumerate(
    gaps,
    start=1
):

    print(
        f"{i}. {gap['title']}"
    )

    print(
        f"Paper ID: {gap['paper_id']}"
    )

    print(
        f"Published: {gap['published']}"
    )

    print(
        f"Citations: {gap['citations']}"
    )

    print(
        f"Authors: "
        f"{', '.join(gap['authors'])}"
    )

    print(
        f"Reason: {gap['reason']}"
    )

    print("-" * 80)