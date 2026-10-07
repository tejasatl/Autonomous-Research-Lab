from backend.llms.llm_factory import get_llm


class PlannerAgent:

    def __init__(self):
        self.llm = get_llm()

    def plan(self, idea):
        prompt = f"""
You are an expert Principal AI Research Scientist and Project Planner.

Given this research idea:
{idea}

Create a rigorous, step-by-step Research Execution Plan:
1. Theoretical Foundations & Problem Formulation
2. Dataset Acquisition & Benchmark Selection
3. Model Architecture & Compression Strategy
4. Implementation Milestones & Baseline Comparisons
5. Hardware & Latency Profiling Methodology
6. Evaluation Metrics & Success Criteria
7. Potential Technical Roadblocks & Mitigation Strategies

Return structured markdown.
"""
        return self.llm.generate(prompt)

    def create_plan(
        self,
        topic
    ):

        return {
            "topic": topic,
            "steps": [
                "retrieve_papers",
                "summarize_papers",
                "analyze_trends",
                "find_research_gaps",
                "generate_hypotheses",
                "validate_novelty",
                "generate_proposal",
                "critic_review"
            ]
        }