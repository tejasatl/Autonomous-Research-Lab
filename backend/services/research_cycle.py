from datetime import datetime

import json

from pathlib import Path

from backend.agents.research_loop_agent import (
    ResearchLoopAgent
)


class ResearchCycle:

    def __init__(self):

        self.agent = ResearchLoopAgent()

        self.output = Path(
            "memory/research_cycles"
        )

        self.output.mkdir(
            parents=True,
            exist_ok=True
        )

    def execute(
        self,
        topic
    ):

        result = self.agent.run(topic)

        timestamp = datetime.now().strftime(
            "%Y%m%d_%H%M%S"
        )

        filename = (
            self.output /
            f"{timestamp}.json"
        )

        with open(
            filename,
            "w",
            encoding="utf-8"
        ) as f:

            json.dump(
                result,
                f,
                indent=2
            )

        return result