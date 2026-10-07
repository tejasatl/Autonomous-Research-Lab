from backend.llms.llm_factory import get_llm


class ConceptExtractorAgent:

    def __init__(self):
        self.llm = get_llm()

    def extract(
        self,
        text: str
    ):

        prompt = f"""
Extract important research concepts.

Return ONLY a comma-separated list.

Text:

{text}
"""

        result = self.llm.generate(
            prompt
        )

        return [
            x.strip()
            for x in result.split(",")
            if x.strip()
        ]