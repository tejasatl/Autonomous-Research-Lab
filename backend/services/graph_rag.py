from backend.services.topic_recommender import TopicRecommender
from backend.services.citation_expander import CitationExpander
from backend.services.lineage_expander import LineageExpander
from backend.services.graph_context_builder import GraphContextBuilder
from backend.llms.llm_factory import get_llm

class GraphRAG:
    def __init__(self):
        self.recommender = TopicRecommender()
        self.citations = CitationExpander()
        self.lineage = LineageExpander()
        self.context_builder = GraphContextBuilder()
        self.llm = get_llm()

    def ask(self, query):
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