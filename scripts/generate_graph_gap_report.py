from backend.services.gap_report_generator import (
    GapReportGenerator
)

generator = GapReportGenerator()

file = generator.generate()

print(
    f"Saved report: {file}"
)