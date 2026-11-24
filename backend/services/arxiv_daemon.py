import os
import re
import json
import time
import uuid
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional
import urllib.request
import xml.etree.ElementTree as ET

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
NOTIFS_DIR = DATA_DIR / "notifications"
NOTIFS_DIR.mkdir(parents=True, exist_ok=True)
ALERTS_FILE = NOTIFS_DIR / "arxiv_alerts.json"


class ArxivDaemon:
    """
    Autonomous Overnight arXiv Research Daemon.
    Monitors arXiv categories (cs.LG, cs.AI, cs.CV), automatically discovers
    breaking preprints, updates the Knowledge Graph, and cross-references existing
    lab research gaps to generate proactive researcher alerts.
    """

    def __init__(self, categories: Optional[List[str]] = None):
        self.categories = categories or ["cs.AI", "cs.LG", "cs.CV"]
        self.papers_dir = DATA_DIR / "papers"
        self.papers_dir.mkdir(parents=True, exist_ok=True)
        self.alerts_file = ALERTS_FILE

    def _load_alerts(self) -> List[Dict[str, Any]]:
        if self.alerts_file.exists():
            try:
                with open(self.alerts_file, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                return []
        return []

    def _save_alerts(self, alerts: List[Dict[str, Any]]) -> None:
        with open(self.alerts_file, "w", encoding="utf-8") as f:
            json.dump(alerts[:50], f, indent=2)

    def fetch_latest_arxiv_preprints(self, max_results: int = 8) -> List[Dict[str, Any]]:
        """Fetch latest preprints directly from arXiv Atom API."""
        cat_query = " OR ".join([f"cat:{c}" for c in self.categories])
        url = f"http://export.arxiv.org/api/query?search_query={urllib.parse.quote(cat_query)}&sortBy=submittedDate&sortOrder=descending&max_results={max_results}"

        try:
            req = urllib.request.Request(url, headers={"User-Agent": "AutonomousResearchLab/3.0"})
            with urllib.request.urlopen(req, timeout=15) as response:
                xml_data = response.read()

            root = ET.fromstring(xml_data)
            atom_ns = {"atom": "http://www.w3.org/2005/Atom"}

            entries = []
            for entry in root.findall("atom:entry", atom_ns):
                raw_id = entry.find("atom:id", atom_ns).text or ""
                arxiv_id = raw_id.split("/abs/")[-1].strip()
                title = (entry.find("atom:title", atom_ns).text or "").strip().replace("\n", " ")
                summary = (entry.find("atom:summary", atom_ns).text or "").strip().replace("\n", " ")
                published = (entry.find("atom:published", atom_ns).text or "")[:10]

                authors = []
                for author in entry.findall("atom:author", atom_ns):
                    name_elem = author.find("atom:name", atom_ns)
                    if name_elem is not None and name_elem.text:
                        authors.append(name_elem.text.strip())

                entries.append({
                    "paper_id": arxiv_id,
                    "title": title,
                    "abstract": summary,
                    "summary": summary,
                    "authors": authors,
                    "published": published,
                    "source": "arXiv Daemon"
                })

            return entries

        except Exception as e:
            logger.error(f"Error querying arXiv API: {e}")
            return []

    def check_gap_relevance(self, paper_title: str, paper_abstract: str) -> Optional[Dict[str, Any]]:
        """Check if incoming preprint directly relates to any active lab research gaps."""
        # Check active gaps in memory/research_memory.json or data/gaps/
        memory_file = BASE_DIR / "memory" / "research_memory.json"
        tracked_gaps = [
            "Privacy Preserving Edge AI",
            "Efficient GraphRAG",
            "Vision Transformers",
            "Quantization"
        ]

        if memory_file.exists():
            try:
                with open(memory_file, "r", encoding="utf-8") as f:
                    mem = json.load(f)
                    tracked_gaps.extend(mem.get("gaps", []))
                    tracked_gaps.extend(mem.get("topics", []))
            except Exception:
                pass

        text = (paper_title + " " + paper_abstract).lower()

        for gap in set(tracked_gaps):
            keywords = [w.lower() for w in gap.split() if len(w) > 3]
            if any(k in text for k in keywords):
                return {
                    "matched_gap": gap,
                    "relevance_summary": f"Preprint relates to tracked research frontier: '{gap}'"
                }

        return None

    def run_cycle(self, max_results: int = 6) -> Dict[str, Any]:
        """
        Run a single autonomous crawl cycle:
        1. Queries arXiv for latest papers.
        2. Detects new unseen papers.
        3. Saves metadata and triggers gap correlation.
        4. Emits persistent research alerts.
        """
        preprints = self.fetch_latest_arxiv_preprints(max_results=max_results)
        existing_alerts = self._load_alerts()
        new_papers_count = 0
        new_alerts_count = 0

        for paper in preprints:
            pid = paper["paper_id"]
            pfile = self.papers_dir / f"{pid}.json"

            # Check if this paper is completely new to the lab
            if not pfile.exists():
                new_papers_count += 1
                with open(pfile, "w", encoding="utf-8") as f:
                    json.dump(paper, f, indent=2)

                # Check if it correlates with an open research gap
                gap_match = self.check_gap_relevance(paper["title"], paper["abstract"])
                if gap_match:
                    alert = {
                        "alert_id": f"alt_{uuid.uuid4().hex[:6]}",
                        "created_at": time.strftime("%Y-%m-%d %H:%M:%S"),
                        "paper_id": pid,
                        "paper_title": paper["title"],
                        "matched_gap": gap_match["matched_gap"],
                        "relevance_summary": gap_match["relevance_summary"]
                    }
                    existing_alerts.insert(0, alert)
                    new_alerts_count += 1

        self._save_alerts(existing_alerts)

        return {
            "status": "success",
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "preprints_scanned": len(preprints),
            "new_papers_indexed": new_papers_count,
            "new_alerts_generated": new_alerts_count,
            "total_active_alerts": len(existing_alerts),
            "recent_alerts": existing_alerts[:5]
        }

    def get_alerts(self) -> List[Dict[str, Any]]:
        return self._load_alerts()


_daemon_instance = None

def get_arxiv_daemon() -> ArxivDaemon:
    global _daemon_instance
    if _daemon_instance is None:
        _daemon_instance = ArxivDaemon()
    return _daemon_instance
