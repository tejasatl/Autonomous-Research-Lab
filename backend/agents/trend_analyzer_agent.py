from backend.llms.llm_factory import get_llm


class TrendAnalyzerAgent:

    def __init__(self):
        self.llm = get_llm()

    def analyze(self, summaries):

        # NO LLM CALL IF EMPTY OR LOW DATA
        if not summaries or len(summaries) < 2:
            return "Not enough data for trend analysis."

        prompt = f"""
Analyze trends in these research summaries:

{summaries}

Return only 5 bullet trends.
"""

        try:
            return self.llm.generate(prompt)

        except Exception as e:
            print("Trend analysis skipped due to API limit:", e)
            return "Trend analysis skipped due to quota limit."