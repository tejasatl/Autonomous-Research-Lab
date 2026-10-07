import json


class DashboardStats:

    def get_stats(self):

        with open(
            "knowledge_graph/citation_graph.json"
        ) as f:

            graph = json.load(f)

        return {

            "papers":
            len(
                graph["nodes"]
            ),

            "citations":
            len(
                graph["edges"]
            )
        }