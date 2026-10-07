import os
import requests
from .base import BaseLLM

class GroqLLM(BaseLLM):
    def __init__(self, api_key: str = None, model: str = "llama-3.3-70b-versatile"):
        self.api_key = api_key or os.getenv("GROQ_API_KEY", "")
        self.model = model
        self.url = "https://api.groq.com/openai/v1/chat/completions"

    def generate(self, prompt: str) -> str:
        if not self.api_key:
            return "Groq Error: GROQ_API_KEY is not set in environment or settings."

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
                return f"Groq API Error {response.status_code}: {response.text}"
        except Exception as e:
            return f"Groq Error: {str(e)}"
