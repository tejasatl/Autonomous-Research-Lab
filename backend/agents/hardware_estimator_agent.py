from backend.llms.llm_factory import get_llm


class HardwareEstimatorAgent:

    def __init__(self):

        self.llm = get_llm()

    def estimate(
        self,
        topic
    ):

        prompt = f"""
You are an AI systems expert.

Research topic:

{topic}

Estimate:

1. GPU requirements

2. CPU requirements

3. RAM

4. Storage

5. Estimated training time

6. Estimated cost

7. Recommended cloud platforms

Return markdown.
"""

        return self.llm.generate(prompt)