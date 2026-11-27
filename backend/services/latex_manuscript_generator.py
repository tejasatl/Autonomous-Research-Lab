import os
import re
import json
import time
import uuid
import zipfile
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
MANUSCRIPTS_DIR = DATA_DIR / "manuscripts"
MANUSCRIPTS_DIR.mkdir(parents=True, exist_ok=True)


class LatexManuscriptGenerator:
    """
    Conference-Grade LaTeX Manuscript & BibTeX Generator.
    Synthesizes complete, compile-ready double-column academic manuscripts
    with verified BibTeX citations, tables, algorithms, and Overleaf ZIP packaging.
    """

    def __init__(self):
        self.papers_dir = DATA_DIR / "papers"
        self.manuscripts_dir = MANUSCRIPTS_DIR

    def _sanitize_bib_key(self, paper_id: str, authors: List[str], year: str = "2024") -> str:
        """Generate standard BibTeX key, e.g. 'vaswani2017attention'."""
        first_author = "author"
        if authors and len(authors) > 0:
            first_author = re.sub(r'[^a-zA-Z]', '', authors[0].split()[-1].lower()) or "author"
        clean_id = re.sub(r'[^a-zA-Z0-9]', '', str(paper_id).lower())[:6]
        return f"{first_author}{year}_{clean_id}"

    def build_bibtex_library(self) -> Dict[str, Any]:
        """
        Scan all papers in data/papers/ and generate valid BibTeX entries.
        Returns both the bib string and a lookup mapping {paper_id: bib_key}.
        """
        bib_entries = []
        id_to_key_map = {}

        if not self.papers_dir.exists():
            return {"bibtex": "", "key_map": {}}

        for pfile in sorted(self.papers_dir.glob("*.json")):
            try:
                with open(pfile, "r", encoding="utf-8") as f:
                    pdata = json.load(f)

                pid = pdata.get("paper_id") or pfile.stem
                title = pdata.get("title") or "Untitled Scientific Paper"
                authors = pdata.get("authors") or ["Anonymous"]
                published = str(pdata.get("published") or "2024")
                year_match = re.search(r'\b(20\d\d|19\d\d)\b', published)
                year = year_match.group(1) if year_match else "2024"

                bib_key = self._sanitize_bib_key(pid, authors, year)
                id_to_key_map[pid] = bib_key
                id_to_key_map[pfile.stem] = bib_key

                author_str = " and ".join(authors) if isinstance(authors, list) else str(authors)

                entry = f"""@article{{{bib_key},
  author    = {{{author_str}}},
  title     = {{{{{title}}}}},
  journal   = {{arXiv preprint arXiv:{pid}}},
  year      = {{{year}}}
}}"""
                bib_entries.append(entry)

            except Exception as e:
                logger.warning(f"Error generating BibTeX for {pfile}: {e}")

        unified_bib = "\n\n".join(bib_entries)
        return {"bibtex": unified_bib, "key_map": id_to_key_map}

    def synthesize_manuscript(self, topic: str, target_venue: str = "NeurIPS / ICLR", abstract_override: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate full conference paper draft with LaTeX source, bibliography, and Overleaf package.
        """
        from backend.llms.llm_factory import get_llm
        llm = get_llm()

        # Build BibTeX context
        bib_data = self.build_bibtex_library()
        key_map = bib_data["key_map"]
        available_keys = list(set(key_map.values()))

        # Load existing local paper titles for grounding
        grounding_titles = []
        for pfile in sorted(self.papers_dir.glob("*.json"))[:6]:
            try:
                with open(pfile, "r", encoding="utf-8") as f:
                    d = json.load(f)
                    grounding_titles.append(f"- {d.get('title')} (CiteKey: {key_map.get(pfile.stem, 'ref')})")
            except Exception:
                pass
        grounding_str = "\n".join(grounding_titles)

        prompt = f"""
You are a Principal AI Scientist and Senior NeurIPS/ICLR Area Chair.
Draft a rigorous, high-impact, double-column scientific conference manuscript in LaTeX.

Target Research Topic: {topic}
Target Publication Venue: {target_venue}
Available Ground-Truth Literature in Lab:
{grounding_str}

Available Citation Keys for \\cite{{...}}:
{', '.join(available_keys[:10]) if available_keys else 'baseline2024, author2024'}

Formatting & Structure Guidelines:
1. Output valid LaTeX starting with:
   \\documentclass[10pt,twocolumn,letterpaper]{{article}}
   \\usepackage[utf8]{{inputenc}}
   \\usepackage{{amsmath,amssymb,amsfonts}}
   \\usepackage{{graphicx}}
   \\usepackage{{booktabs}}
   \\usepackage{{hyperref}}
   \\usepackage{{microtype}}
2. Title, Authors (Autonomous Research Lab Swarm), Affiliation, and Abstract.
3. Structure:
   - \\section{{Introduction}} (Motivation, Gap, Challenges, List of 3 Key Contributions)
   - \\section{{Related Work}} (Use \\cite{{...}} with the provided citation keys)
   - \\section{{Methodology}} (Formal mathematical problem setup, architecture, equations)
   - \\section{{Experimental Setup}} (Datasets, Baselines, Hardware compute setup)
   - \\section{{Empirical Evaluation}} (Include a formatted \\begin{{table}} comparing baselines)
   - \\section{{Limitations \\& Broader Impact}}
   - \\section{{Conclusion}}
   - \\bibliographystyle{{plain}}
   - \\bibliography{{references}}
   - \\end{{document}}
4. Maintain academic rigor, formal mathematical notations (equations using \\begin{{equation}}), and concrete quantitative claims.
5. Return ONLY the complete compilable LaTeX code inside a ```latex ``` code block.
"""

        response = llm.generate(prompt)

        # Extract LaTeX code
        if "```latex" in response:
            latex_code = response.split("```latex")[1].split("```")[0].strip()
        elif "```" in response:
            latex_code = response.split("```")[1].split("```")[0].strip()
        else:
            latex_code = response.strip()

        manuscript_id = f"ms_{int(time.time())}_{uuid.uuid4().hex[:6]}"
        bundle_dir = self.manuscripts_dir / manuscript_id
        bundle_dir.mkdir(parents=True, exist_ok=True)

        # 1. Write main.tex
        tex_path = bundle_dir / "main.tex"
        with open(tex_path, "w", encoding="utf-8") as f:
            f.write(latex_code)

        # 2. Write references.bib
        bib_path = bundle_dir / "references.bib"
        with open(bib_path, "w", encoding="utf-8") as f:
            f.write(bib_data["bibtex"])

        # 3. Write README_OVERLEAF.txt
        readme_path = bundle_dir / "README_OVERLEAF.txt"
        readme_content = f"""========================================================================
 AUTONOMOUS RESEARCH LAB (ARL) - OVERLEAF DEPLOYMENT INSTRUCTIONS
========================================================================
Manuscript ID: {manuscript_id}
Topic: {topic}
Generated At: {time.strftime('%Y-%m-%d %H:%M:%S')}

HOW TO COMPILE ON OVERLEAF:
1. Go to https://www.overleaf.com/project
2. Click "New Project" -> "Upload Project"
3. Select this ZIP archive ({manuscript_id}.zip).
4. Overleaf will automatically load main.tex and references.bib.
5. Set compiler to pdfLaTeX and click "Recompile".
========================================================================"""
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write(readme_content)

        # 4. Create Overleaf-ready ZIP archive
        zip_path = self.manuscripts_dir / f"{manuscript_id}.zip"
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zip_f:
            zip_f.write(tex_path, arcname="main.tex")
            zip_f.write(bib_path, arcname="references.bib")
            zip_f.write(readme_path, arcname="README_OVERLEAF.txt")

        # Save metadata
        metadata = {
            "manuscript_id": manuscript_id,
            "topic": topic,
            "target_venue": target_venue,
            "created_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "latex_code": latex_code,
            "bibtex_code": bib_data["bibtex"],
            "zip_filename": f"{manuscript_id}.zip",
            "zip_path": str(zip_path)
        }
        with open(bundle_dir / "metadata.json", "w", encoding="utf-8") as f:
            json.dump(metadata, f, indent=2)

        return metadata

    def get_manuscripts_history(self) -> List[Dict[str, Any]]:
        """Retrieve previously synthesized manuscripts."""
        history = []
        if not self.manuscripts_dir.exists():
            return []

        for mdir in sorted(self.manuscripts_dir.iterdir(), reverse=True):
            if mdir.is_dir():
                meta_file = mdir / "metadata.json"
                if meta_file.exists():
                    try:
                        with open(meta_file, "r", encoding="utf-8") as f:
                            history.append(json.load(f))
                    except Exception:
                        pass
        return history


_generator_instance = None

def get_latex_manuscript_generator() -> LatexManuscriptGenerator:
    global _generator_instance
    if _generator_instance is None:
        _generator_instance = LatexManuscriptGenerator()
    return _generator_instance

get_latex_generator = get_latex_manuscript_generator
