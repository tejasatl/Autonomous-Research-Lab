import json

from fastapi import APIRouter

router = APIRouter()


@router.get("/timeline")
def timeline():

    with open(
        "knowledge_graph/lineage_graph.json"
    ) as f:

        graph = json.load(f)

    return [

        {
            "paper":
            edge["source"],

            "influenced":
            edge["target"]

        }

        for edge in graph["links"]

    ]