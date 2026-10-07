from backend.llms.llm_factory import get_llm


class DatasetRecommenderAgent:

    def __init__(self):

        self.llm = get_llm()

    def recommend(self, topic):

        prompt = f"""
You are an AI research expert.

Research topic:

{topic}

Recommend:

1. Public datasets

2. Dataset size

3. Download links

4. Why suitable

Return markdown.
"""

        return self.llm.generate(prompt)