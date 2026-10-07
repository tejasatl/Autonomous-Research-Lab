import json

from pathlib import Path


class PaperIngestor:

    def __init__(self):

        self.paper_dir = Path(
            "data/papers"
        )

        self.paper_dir.mkdir(
            exist_ok=True
        )

    def save(
        self,
        paper
    ):

        file = (

            self.paper_dir /

            f"{paper['id']}.json"

        )

        with open(

            file,

            "w",

            encoding="utf-8"

        ) as f:

            json.dump(

                paper,

                f,

                indent=2

            )

        return str(file)