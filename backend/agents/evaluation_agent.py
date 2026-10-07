from backend.llms.llm_factory import get_llm


class EvaluationAgent:

    def __init__(self):

        self.llm = get_llm()

    def evaluate(
        self,
        topic
    ):

        prompt = f"""
Research topic:

{topic}

Recommend evaluation protocol.

Include:

Accuracy

Precision

Recall

F1

Latency

Energy Consumption

Model Size

Inference Speed

Statistical Tests

Return markdown.
"""

        return self.llm.generate(prompt)