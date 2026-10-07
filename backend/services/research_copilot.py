from backend.services.graph_rag import GraphRAG
from backend.services.graph_gap_finder import GraphGapFinder
from backend.services.research_recommender import ResearchRecommender
from backend.services.research_memory import ResearchMemory
from backend.services.chat_history import ChatHistory
from backend.agents.tool_agent import ToolAgent
from backend.llms.llm_factory import get_llm

class ResearchCopilot:
    def __init__(self):
        self.rag = GraphRAG()
        self.gaps = GraphGapFinder()
        self.recommender = ResearchRecommender()
        self.memory = ResearchMemory()
        self.chat_history = ChatHistory()
        self.tools = ToolAgent()
        self.llm = get_llm()

    def chat(self, query):
        query_strip = query.strip().lower()

        # Specific commands for raw data inspection
        if query_strip in ["gaps", "show gaps", "find gaps", "list gaps", "get gaps"]:
            result = self.gaps.find_gaps()
            self.chat_history.add(query, str(result))
            return {"type": "gaps", "response": result}

        if query_strip in ["memory", "show memory", "get memory", "list memory"]:
            result = self.memory.load()
            self.chat_history.add(query, str(result))
            return {"type": "memory", "response": result}

        # Full GraphRAG conversational synthesis
        rag_answer = self.rag.ask(query)
        history = self.chat_history.context()
        memory = self.memory.load()

        prompt = f"""You are the Lead Scientific Intelligence Copilot for an Autonomous AI Research Laboratory.
Respond to the researcher's inquiry with depth, precision, and grounded scientific citations.

Conversation History:
{history}

Episodic Lab Memory:
{memory}

GraphRAG Literature Context:
{rag_answer}

Researcher Question:
{query}

Formulate a rigorous academic response covering:
1. Direct Analysis & Theoretical Insights
2. Seminal Papers & Empirical Benchmarks
3. Methodological Challenges & Trade-offs
4. High-Impact Research Opportunities
5. Actionable Next Steps for Lab Experimentation
"""

        answer = self.llm.generate(prompt)
        self.chat_history.add(query, answer)

        return {
            "type": "answer",
            "response": answer
        }