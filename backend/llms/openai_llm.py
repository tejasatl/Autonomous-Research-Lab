import os
import requests
from .base import BaseLLM

class OpenAILLM(BaseLLM):
    def __init__(self, api_key: str = None, model: str = "gpt-4o-mini"):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY", "")
        self.model = model
        self.url = "https://api.openai.com/v1/chat/completions"

    def generate(self, prompt: str) -> str:
        if not self.api_key:
            return "OpenAI Error: OPENAI_API_KEY is not set in environment or settings."

        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": self.model,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7
            }
            response = requests.post(self.url, headers=headers, json=payload, timeout=60)
            if response.status_code == 200:
                data = response.json()
                return data["choices"][0]["message"]["content"]
            else:
                return f"OpenAI API Error {response.status_code}: {response.text}"
        except Exception as e:
            return f"OpenAI Error: {str(e)}"
