import json
import re
from backend.utils.json_loader import safe_json_load


class GraphNormalizer:

    def normalize(self, path: str):

        raw = safe_json_load(path, None)

        # CASE 1: links format
        if isinstance(raw, dict) and "links" in raw:
            return self._from_links(raw)

        # CASE 2: nodes + edges format
        if isinstance(raw, dict) and "nodes" in raw and "edges" in raw:
            return self._from_node_edge(raw)

        # CASE 3: graph-style text file (your lineage file)
        return self._from_graph_text(path)

    # -------------------------
    # FORMAT 1: links
    # -------------------------
    def _from_links(self, data):

        nodes = set()
        edges = []

        for e in data.get("links", []):

            s = str(e.get("source"))
            t = str(e.get("target"))

            nodes.add(s)
            nodes.add(t)

            edges.append({
                "source": s,
                "target": t,
                "relation": e.get("relation", "related")
            })

        return {
            "nodes": [{"id": n} for n in nodes],
            "edges": edges
        }

    # -------------------------
    # FORMAT 2: nodes + edges
    # -------------------------
    def _from_node_edge(self, data):

        nodes = []
        edges = []

        for n in data.get("nodes", []):
            nodes.append({"id": str(n.get("id"))})

        for e in data.get("edges", []):
            edges.append({
                "source": str(e.get("source")),
                "target": str(e.get("target")),
                "relation": e.get("relation", "related")
            })

        return {
            "nodes": nodes,
            "edges": edges
        }

    # -------------------------
    # FORMAT 3: YOUR CURRENT LINEAGE FILE
    # -------------------------
    def _from_graph_text(self, path):

        with open(path, "r", encoding="utf-8") as f:
            text = f.read()

        # extract labels (papers)
        labels = re.findall(r'label\s+"([^"]+)"', text)

        # map index → label
        index_map = {
            str(i): labels[i] for i in range(len(labels))
        }

        raw_edges = re.findall(
            r'source\s+(\d+)\s+target\s+(\d+)',
            text
        )

        nodes = set()
        edges = []

        for s, t in raw_edges:

            if s in index_map and t in index_map:

                s_id = index_map[s]
                t_id = index_map[t]

                nodes.add(s_id)
                nodes.add(t_id)

                edges.append({
                    "source": s_id,
                    "target": t_id,
                    "relation": "influenced"
                })

        return {
            "nodes": [{"id": n} for n in nodes],
            "edges": edges
        }