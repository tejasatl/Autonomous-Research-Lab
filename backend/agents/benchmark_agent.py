from backend.llms.llm_factory import get_llm


class BenchmarkAgent:

    def __init__(self):

        self.llm = get_llm()

    def generate(
        self,
        topic
    ):

        prompt = f"""
Topic

{topic}

Generate a benchmark comparison table.

Include

Model

Accuracy

Precision

Recall

Latency

Parameters

Memory

Inference Speed

Return markdown.
"""

        return self.llm.generate(prompt)