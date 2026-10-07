from backend.services.lineage_search import (
    LineageSearch
)

search = LineageSearch()

print(
    search.successors(
        "2205.15437v2"
    )
)