from pathlib import Path
from backend.services.graph_gap_finder import (
    GraphGapFinder
)


class GapReportGenerator:

    def generate(self):

        finder = GraphGapFinder()

        gaps = finder.find_gaps()

        output = Path(
            "data/gaps"
        )

        output.mkdir(
            exist_ok=True
        )

        file = (
            output /
            "graph_gap_report.md"
        )

        with open(
            file,
            "w",
            encoding="utf-8"
        ) as f:

            f.write(
                "# Graph Gap Report\n\n"
            )

            for gap in gaps:

                f.write(
                    f"## {gap['title']}\n\n"
                )

                f.write(
                    f"Paper ID: "
                    f"{gap['paper_id']}\n\n"
                )

                f.write(
                    f"Published: "
                    f"{gap['published']}\n\n"
                )

                f.write(
                    f"Reason: "
                    f"{gap['reason']}\n\n"
                )

        return file