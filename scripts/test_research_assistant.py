from backend.services.research_assistant import (
    ResearchAssistant
)

assistant = ResearchAssistant()

results = assistant.ask(
    "privacy preserving edge ai"
)

print("\nResults:\n")

for result in results:

    print(
        result["similarity"],
        result["title"]
    )