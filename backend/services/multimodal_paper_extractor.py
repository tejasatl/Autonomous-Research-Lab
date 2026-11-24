import os
import json
import base64
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional
import fitz

logger = logging.getLogger(__name__)

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"
FIGURES_DIR = DATA_DIR / "figures"
FIGURES_DIR.mkdir(parents=True, exist_ok=True)


class MultimodalPaperExtractor:
    """
    Multimodal Scientific Document Understanding Engine.
    Extracts high-resolution architectural schematics, performance plots,
    and structured tables from PDF papers, with Gemini Multimodal interpretation.
    """

    def __init__(self):
        self.figures_dir = FIGURES_DIR

    def extract_from_pdf(self, pdf_path: str, paper_id: str, max_pages: int = 15) -> Dict[str, Any]:
        """
        Extract all figures, charts, and structured tables from a scientific PDF.
        """
        pdf_file = Path(pdf_path)
        if not pdf_file.exists():
            return {
                "paper_id": paper_id,
                "figures": [],
                "tables": [],
                "error": f"PDF not found at {pdf_path}"
            }

        paper_fig_dir = self.figures_dir / paper_id
        paper_fig_dir.mkdir(parents=True, exist_ok=True)

        extracted_figures = []
        extracted_tables = []

        try:
            doc = fitz.open(str(pdf_file))
            num_pages = min(len(doc), max_pages)

            for page_idx in range(num_pages):
                page = doc[page_idx]
                page_num = page_idx + 1

                # 1. Extract Structured Tables
                try:
                    tabs = page.find_tables()
                    for t_idx, tab in enumerate(tabs):
                        df_dict = tab.extract()
                        if df_dict and len(df_dict) > 1:
                            headers = [str(h or f"Col_{i}") for i, h in enumerate(df_dict[0])]
                            rows = [[str(cell or "") for cell in row] for row in df_dict[1:]]
                            extracted_tables.append({
                                "table_id": f"table_p{page_num}_{t_idx + 1}",
                                "page": page_num,
                                "headers": headers,
                                "rows": rows,
                                "row_count": len(rows),
                                "col_count": len(headers)
                            })
                except Exception as te:
                    logger.debug(f"Table extraction error on page {page_num}: {te}")

                # 2. Extract Figures and Visual Images
                try:
                    image_list = page.get_images(full=True)
                    for img_idx, img_info in enumerate(image_list):
                        xref = img_info[0]
                        base_image = doc.extract_image(xref)
                        image_bytes = base_image.get("image")
                        image_ext = base_image.get("ext", "png")
                        width = base_image.get("width", 0)
                        height = base_image.get("height", 0)

                        # Filter out tiny logos, glyphs, or horizontal divider lines
                        if width >= 120 and height >= 120 and (width * height) >= 25000:
                            fig_filename = f"figure_p{page_num}_{img_idx + 1}.{image_ext}"
                            fig_path = paper_fig_dir / fig_filename
                            
                            with open(fig_path, "wb") as f_out:
                                f_out.write(image_bytes)

                            extracted_figures.append({
                                "figure_id": f"fig_p{page_num}_{img_idx + 1}",
                                "page": page_num,
                                "filename": fig_filename,
                                "file_path": str(fig_path),
                                "width": width,
                                "height": height,
                                "aspect_ratio": round(width / max(height, 1), 2),
                                "url": f"/api/papers/{paper_id}/figures/{fig_filename}"
                            })
                except Exception as ie:
                    logger.debug(f"Image extraction error on page {page_num}: {ie}")

            doc.close()

        except Exception as e:
            logger.error(f"Error processing PDF for multimodal extraction: {e}")
            return {
                "paper_id": paper_id,
                "figures": extracted_figures,
                "tables": extracted_tables,
                "error": str(e)
            }

        # Save metadata index for this paper
        metadata = {
            "paper_id": paper_id,
            "total_figures": len(extracted_figures),
            "total_tables": len(extracted_tables),
            "figures": extracted_figures,
            "tables": extracted_tables
        }
        meta_path = paper_fig_dir / "multimodal_index.json"
        with open(meta_path, "w", encoding="utf-8") as f:
            json.dump(metadata, f, indent=2)

        return metadata

    def get_paper_multimodal_data(self, paper_id: str) -> Dict[str, Any]:
        """Retrieve existing extracted multimodal data or extract if PDF exists."""
        paper_fig_dir = self.figures_dir / paper_id
        meta_path = paper_fig_dir / "multimodal_index.json"

        if meta_path.exists():
            with open(meta_path, "r", encoding="utf-8") as f:
                return json.load(f)

        # Check if PDF exists in data/pdfs
        pdfs_dir = DATA_DIR / "pdfs"
        pdf_candidate = pdfs_dir / f"{paper_id}.pdf"
        if pdf_candidate.exists():
            return self.extract_from_pdf(str(pdf_candidate), paper_id)

        # Fallback synthesized structural representation from paper metadata
        paper_file = DATA_DIR / "papers" / f"{paper_id}.json"
        if paper_file.exists():
            with open(paper_file, "r", encoding="utf-8") as f:
                pdata = json.load(f)
            return {
                "paper_id": paper_id,
                "total_figures": 0,
                "total_tables": 0,
                "figures": [],
                "tables": [],
                "message": "Full-text PDF not downloaded yet. Run Paper Ingestion to retrieve PDF with visual assets.",
                "paper_title": pdata.get("title", "")
            }

        return {
            "paper_id": paper_id,
            "total_figures": 0,
            "total_tables": 0,
            "figures": [],
            "tables": [],
            "message": "Paper not found."
        }

    def interpret_figure(self, paper_id: str, figure_filename: str, context: str = "") -> Dict[str, Any]:
        """
        Multimodal Deep Visual Interpretation using Gemini Multimodal Vision API.
        """
        fig_path = self.figures_dir / paper_id / figure_filename
        if not fig_path.exists():
            raise FileNotFoundError(f"Figure {figure_filename} not found for paper {paper_id}")

        gemini_key = os.getenv("GEMINI_API_KEY")
        if not gemini_key:
            return {
                "figure_id": figure_filename,
                "interpretation": "Gemini API key not configured. Visual interpretation requires GEMINI_API_KEY.",
                "status": "unconfigured"
            }

        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel("gemini-2.5-flash")

            with open(fig_path, "rb") as img_f:
                image_bytes = img_f.read()

            ext = fig_path.suffix.lower().replace(".", "")
            mime = "image/png" if ext == "png" else "image/jpeg"
            
            prompt = f"""
You are a senior peer reviewer and principal scientist analyzing an extracted scientific paper figure.
Paper Context: {context}

Perform a rigorous scientific interpretation:
1. **Architectural / Methodological Breakdown**: What pipeline, model architecture, or experiment does this diagram illustrate?
2. **Quantitative & Benchmark Analysis**: What do the axes, curves, or heatmaps measure? Which method outperforms baseline?
3. **Critical Discovery / Finding**: What is the core takeaway an academic reviewer must understand from this figure?
Keep the analysis precise, highly scientific, and directly actionable.
"""
            contents = [
                {"mime_type": mime, "data": image_bytes},
                prompt
            ]
            response = model.generate_content(contents)
            interpretation_text = response.text if response else "No response generated."

            return {
                "paper_id": paper_id,
                "figure_filename": figure_filename,
                "interpretation": interpretation_text,
                "status": "success"
            }

        except Exception as e:
            logger.error(f"Error in multimodal figure interpretation: {e}")
            return {
                "paper_id": paper_id,
                "figure_filename": figure_filename,
                "interpretation": f"Multimodal analysis encountered an issue: {str(e)}",
                "status": "error"
            }


_extractor_instance = None

def get_multimodal_extractor() -> MultimodalPaperExtractor:
    global _extractor_instance
    if _extractor_instance is None:
        _extractor_instance = MultimodalPaperExtractor()
    return _extractor_instance
