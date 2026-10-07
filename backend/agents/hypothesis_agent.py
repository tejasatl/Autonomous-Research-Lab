from backend.agents.hypothesis_generator_agent import HypothesisGeneratorAgent
from backend.models.hypothesis import Hypothesis
from backend.llms.llm_factory import get_llm


class HypothesisAgent:
    """
    Agent responsible for synthesizing research gaps into testable scientific hypotheses.
    """

    def __init__(self):
        self.generator = HypothesisGeneratorAgent()
        self.llm = get_llm()

    def generate(self, gap_text: str) -> str:
        return self.generator.generate(gap_text)

    def formulate(self, topic: str, context: str = "") -> str:
        prompt = f"""
You are a Principal AI Scientist formulating hypotheses for novel research.

Topic:
{topic}

Context / Observations:
{context}

Formulate:
1. Primary Testable Hypothesis
2. Theoretical Justification
3. Falsification Conditions
4. Required Baseline Models
5. Proposed Validation Experiments
"""
        return self.llm.generate(prompt)
