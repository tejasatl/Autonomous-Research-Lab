import os
import json
import logging
from pathlib import Path
from typing import List, Dict, Any, Tuple
import networkx as nx
import numpy as np

logger = logging.getLogger(__name__)

KG_DIR = Path(__file__).resolve().parent.parent.parent / "knowledge_graph"


class GraphLinkPredictor:
    """
    Topological Graph Link Prediction & Hypergraph Gap Discovery Engine.
    Uses Adamic-Adar, Jaccard Coefficient, Resource Allocation, and Common Neighbors
    to discover high-affinity unexplored scientific frontiers (0-hop gaps).
    """

    def __init__(self):
        self.kg_dir = KG_DIR
        self._graph = None

    def _build_networkx_graph(self) -> nx.Graph:
        """Construct an undirected graph combining concepts, papers, and methods."""
        G = nx.Graph()

        # Load main knowledge graph
        kg_path = self.kg_dir / "graph.json"
        if kg_path.exists():
            try:
                with open(kg_path, "r", encoding="utf-8") as f:
                    kg_data = json.load(f)

                # Add nodes
                for node in kg_data.get("nodes", []):
                    node_id = str(node.get("id"))
                    node_type = node.get("type", "Concept")
                    name = node.get("name", node_id)
                    G.add_node(node_id, name=name, type=node_type)

                # Add edges
                for edge in kg_data.get("edges", []):
                    source = str(edge.get("source"))
                    target = str(edge.get("target"))
                    rel = edge.get("relation", "RELATES_TO")
                    if source and target:
                        G.add_edge(source, target, relation=rel)
            except Exception as e:
                logger.warning(f"Error parsing graph.json: {e}")

        # Also load citation graph
        cit_path = self.kg_dir / "citation_graph.json"
        if cit_path.exists():
            try:
                with open(cit_path, "r", encoding="utf-8") as f:
                    cit_data = json.load(f)

                for node in cit_data.get("nodes", []):
                    nid = str(node.get("id"))
                    label = node.get("title", nid)
                    if not G.has_node(nid):
                        G.add_node(nid, name=label, type="Paper")

                for edge in cit_data.get("edges", []):
                    s = str(edge.get("source"))
                    t = str(edge.get("target"))
                    if s and t:
                        G.add_edge(s, t, relation="CITES")
            except Exception as e:
                logger.warning(f"Error parsing citation_graph.json: {e}")

        return G

    def predict_links(self, top_k: int = 15, min_shared_neighbors: int = 1) -> List[Dict[str, Any]]:
        """
        Compute Adamic-Adar and Jaccard link prediction scores on non-adjacent nodes.
        Finds pairs of scientific concepts that have never been combined in literature,
        but share dense theoretical foundations.
        """
        G = self._build_networkx_graph()
        if G.number_of_nodes() < 3 or G.number_of_edges() < 2:
            return []

        # Find non-edges (pairs of nodes not currently connected)
        non_edges = list(nx.non_edges(G))
        if not non_edges:
            return []

        # Filter candidate pairs that share at least 1 common neighbor
        candidate_pairs = [
            (u, v) for u, v in non_edges
            if len(list(nx.common_neighbors(G, u, v))) >= min_shared_neighbors
        ]

        # If too few candidates with shared neighbors, use 2-hop node pairs
        if len(candidate_pairs) < 5:
            candidate_pairs = non_edges[:100]

        predictions = []

        # 1. Compute Adamic-Adar Index
        try:
            aa_scores = dict()
            for u, v, p in nx.adamic_adar_index(G, candidate_pairs):
                aa_scores[(u, v)] = float(p)
        except Exception:
            aa_scores = {pair: 0.0 for pair in candidate_pairs}

        # 2. Compute Jaccard Coefficient
        try:
            jaccard_scores = dict()
            for u, v, p in nx.jaccard_coefficient(G, candidate_pairs):
                jaccard_scores[(u, v)] = float(p)
        except Exception:
            jaccard_scores = {pair: 0.0 for pair in candidate_pairs}

        # 3. Compute Resource Allocation Index
        try:
            ra_scores = dict()
            for u, v, p in nx.resource_allocation_index(G, candidate_pairs):
                ra_scores[(u, v)] = float(p)
        except Exception:
            ra_scores = {pair: 0.0 for pair in candidate_pairs}

        for (u, v) in candidate_pairs:
            shared = list(nx.common_neighbors(G, u, v))
            shared_names = [G.nodes[n].get("name", str(n)) for n in shared[:4]]

            u_data = G.nodes[u]
            v_data = G.nodes[v]
            u_name = u_data.get("name", str(u))
            v_name = v_data.get("name", str(v))
            u_type = u_data.get("type", "Concept")
            v_type = v_data.get("type", "Concept")

            aa_val = aa_scores.get((u, v), 0.0)
            j_val = jaccard_scores.get((u, v), 0.0)
            ra_val = ra_scores.get((u, v), 0.0)

            # Unified Novelty & Gap Index (NGI) normalized between 0.0 and 1.0
            raw_score = (0.5 * aa_val) + (0.3 * j_val) + (0.2 * ra_val)
            norm_score = round(min(1.0, raw_score / (raw_score + 1.0) * 1.5), 3)

            # Generate scientific hypothesis for this gap
            hypothesis = (
                f"Cross-disciplinary integration of '{u_name}' ({u_type}) with '{v_name}' ({v_type}). "
                f"Connected via foundational intermediaries: {', '.join(shared_names) if shared_names else 'shared structural topology'}."
            )

            predictions.append({
                "source_id": u,
                "source_name": u_name,
                "source_type": u_type,
                "target_id": v,
                "target_name": v_name,
                "target_type": v_type,
                "adamic_adar_score": round(aa_val, 4),
                "jaccard_similarity": round(j_val, 4),
                "resource_allocation": round(ra_val, 4),
                "novelty_gap_score": norm_score,
                "shared_neighbors_count": len(shared),
                "shared_intermediaries": shared_names,
                "hypothesis_opportunity": hypothesis
            })

        # Sort by highest Novelty Gap Score
        predictions.sort(key=lambda x: x["novelty_gap_score"], reverse=True)
        return predictions[:top_k]

    def get_discovery_frontiers(self) -> Dict[str, Any]:
        """Return topology metrics and top gap predictions formatted for frontend display."""
        G = self._build_networkx_graph()
        links = self.predict_links(top_k=12)

        return {
            "total_nodes": G.number_of_nodes(),
            "total_edges": G.number_of_edges(),
            "graph_density": round(nx.density(G), 4) if G.number_of_nodes() > 0 else 0,
            "connected_components": nx.number_connected_components(G) if G.number_of_nodes() > 0 else 0,
            "predicted_gaps_count": len(links),
            "frontiers": links
        }


_predictor_instance = None

def get_graph_link_predictor() -> GraphLinkPredictor:
    global _predictor_instance
    if _predictor_instance is None:
        _predictor_instance = GraphLinkPredictor()
    return _predictor_instance
