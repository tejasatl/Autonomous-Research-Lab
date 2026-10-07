import requests
from .base import BaseLLM

class LocalLLM(BaseLLM):
    def __init__(self, model: str = "llama3"):
        self.model = model

    def generate(self, prompt: str) -> str:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={"model": self.model, "prompt": prompt, "stream": False}
        )
        return response.json()["response"]