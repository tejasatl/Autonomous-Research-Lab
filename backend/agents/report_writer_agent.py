from backend.llms.llm_factory import get_llm


class ReportWriterAgent:

    def __init__(self):
        self.llm = get_llm()

    def generate_report(
        self,
        topic: str,
        trend_analysis: str
    ):

        prompt = f"""
Create a professional research report.

Topic:
{topic}

Trend Analysis:
{trend_analysis}

Return Markdown format with:

# Research Report
## Executive Summary
## Common Methods
## Major Contributions
## Common Limitations
## Research Gaps
## Future Directions
## Conclusion
"""

        return self.llm.generate(prompt)