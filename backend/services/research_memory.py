from backend.utils.json_loader import safe_json_load
import json


class ResearchMemory:

    FILE = "memory/research_memory.json"

    def load(self):
        return safe_json_load(
            self.FILE,
            {
                "topics": [],
                "authors": [],
                "papers": [],
                "gaps": []
            }
        )

    def save(self, data):

        with open(self.FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)