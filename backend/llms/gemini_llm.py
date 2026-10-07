import google.generativeai as genai

from .base import BaseLLM


class GeminiLLM(BaseLLM):

    def __init__(
        self,
        api_key: str,
        model: str = "gemini-2.5-flash"
    ):

        genai.configure(
            api_key=api_key
        )

        self.model = genai.GenerativeModel(
            model
        )

    def generate(
        self,
        prompt: str
    ) -> str:

        try:

            response = self.model.generate_content(
                prompt
            )

            return response.text

        except Exception as e:

            print(
                f"Gemini API Error: {e}"
            )

            return (
                f"LLM generation failed: {str(e)}"
            )