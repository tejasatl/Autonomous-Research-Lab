from pathlib import Path
import html
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

class PDFGenerator:
    def create_pdf(self, markdown_text, output_file):
        out_path = Path(output_file)
        out_path.parent.mkdir(parents=True, exist_ok=True)

        doc = SimpleDocTemplate(str(out_path))
        styles = getSampleStyleSheet()

        title_style = ParagraphStyle(
            'ARLTitle',
            parent=styles['Heading1'],
            fontSize=18,
            leading=22,
            spaceAfter=12
        )
        h2_style = ParagraphStyle(
            'ARLH2',
            parent=styles['Heading2'],
            fontSize=14,
            leading=18,
            spaceAfter=8
        )
        body_style = ParagraphStyle(
            'ARLBody',
            parent=styles['BodyText'],
            fontSize=10,
            leading=14,
            spaceAfter=6
        )

        content = []
        for raw_line in markdown_text.split("\n"):
            line = raw_line.strip()
            if not line:
                content.append(Spacer(1, 4))
                continue

            escaped = html.escape(line)
            if line.startswith("# "):
                content.append(Paragraph(escaped[2:], title_style))
            elif line.startswith("## "):
                content.append(Paragraph(escaped[3:], h2_style))
            elif line.startswith("### "):
                content.append(Paragraph(escaped[4:], h2_style))
            else:
                content.append(Paragraph(escaped, body_style))

        doc.build(content)
        return str(out_path)