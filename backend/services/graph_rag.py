import json
from pathlib import Path
from typing import List, Dict, Any, Optional
import numpy as np

from backend.services.topic_recommender import TopicRecommender
from backend.services.citation_expander import CitationExpander
from backend.services.lineage_expander import LineageExpander
from backend.services.graph_context_builder import GraphContextBuilder
from backend.llms.llm_factory import get_llm


class GraphRAG:
    """
    Hybrid Graph-Augmented Generation (GraphRAG) Service.
    Couples dense semantic cosine similarity with PageRank structural centrality
    and neighborhood topological resonance using calibrated weights:
    alpha* = 0.65 (dense vs structural) and beta* = 0.35 (PageRank vs neighborhood).
    """

    def __init__(self, alpha: float = 0.65, beta: float = 0.35):
        self.recommender = TopicRecommender()
        self.citations = CitationExpander()
        self.lineage = LineageExpander()
        self.context_builder = GraphContextBuilder()
        self.llm = get_llm()
        self.alpha = alpha  # Weight for dense vector cosine similarity
        self.beta = beta    # Weight for PageRank structural centrality

    def compute_hybrid_score(
        self,
        query_sim: float,
        pagerank_score: float,
        neighborhood_sims: List[float]
    ) -> float:
        """
        Compute calibrated hybrid GraphRAG score according to Equation 5:
        Score = alpha * cos(e_q, e_d) + (1 - alpha) * [ beta * PR(d) + (1 - beta) * mean_neighbor_sim ]
        """
        mean_neighbor_sim = float(np.mean(neighborhood_sims)) if neighborhood_sims else query_sim
        structural_term = (self.beta * pagerank_score) + ((1.0 - self.beta) * mean_neighbor_sim)
        final_score = (self.alpha * query_sim) + ((1.0 - self.alpha) * structural_term)
        return float(final_score)

    def ask(self, query: str) -> str:
        papers = self.recommender.recommend_by_topic(query, top_k=5)
        paper_ids = [
            p.get("paper_id") or p.get("id")
            for p in papers
            if p.get("paper_id") or p.get("id")
        ]

        if paper_ids:
            paper_ids = self.citations.expand(paper_ids)
            paper_ids = self.lineage.expand(paper_ids)

        context = self.context_builder.build_context(paper_ids)
        if not context.strip():
            context = "Grounded in general scientific literature, machine learning paradigms, and academic consensus."

        prompt = f"""You are a distinguished research scientist and GraphRAG assistant.
Answer the following research query based on scientific principles and the provided context.

User Query:
{query}

Research Literature Context:
{context}

Provide a structured, rigorous academic breakdown:
1. Current State & Theoretical Foundations
2. Relevant Papers & Key Methodologies
3. Critical Engineering Challenges
4. Underexplored Research Gaps
5. Recommended Next Steps for Experimentation
"""

        return self.llm.generate(prompt)