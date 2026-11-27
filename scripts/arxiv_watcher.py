#!/usr/bin/env python3
"""
Autonomous Overnight arXiv Research Daemon CLI.
Continuously scans arXiv categories (cs.AI, cs.LG, cs.CV) for newly published preprints,
indexes them into Autonomous Research Lab, and alerts when new papers resolve existing research gaps.
"""

import sys
import time
import argparse
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend.services.arxiv_daemon import get_arxiv_daemon


def main():
    parser = argparse.ArgumentParser(description="Autonomous arXiv Research Daemon")
    parser.add_argument("--once", action="store_true", help="Run a single crawl cycle and exit")
    parser.add_argument("--interval", type=int, default=3600, help="Seconds between crawls in daemon mode (default 3600)")
    parser.add_argument("--limit", type=int, default=8, help="Number of preprints to check per cycle")
    args = parser.parse_args()

    daemon = get_arxiv_daemon()
    print("=" * 65)
    print(" [DAEMON] AUTONOMOUS RESEARCH LAB: ARXIV OVERNIGHT DAEMON")
    print(f" Monitoring categories: {', '.join(daemon.categories)}")
    print("=" * 65)

    if args.once:
        print("\nExecuting single discovery cycle...")
        res = daemon.run_cycle(max_results=args.limit)
        print(f"[OK] Scanned: {res['preprints_scanned']} preprints")
        print(f"[OK] New Papers Indexed: {res['new_papers_indexed']}")
        print(f"[OK] New Gap Alerts: {res['new_alerts_generated']}")
        if res['recent_alerts']:
            print("\nRecent Research Alerts:")
            for a in res['recent_alerts'][:3]:
                print(f"  [ALERT] [{a['matched_gap']}] {a['paper_title']} (arXiv:{a['paper_id']})")
        return

    print(f"Daemon running in background. Polling interval: {args.interval}s. Press Ctrl+C to stop.")
    try:
        while True:
            print(f"\n[{time.strftime('%Y-%m-%d %H:%M:%S')}] Polling arXiv Atom feeds...")
            res = daemon.run_cycle(max_results=args.limit)
            print(f"Scanned {res['preprints_scanned']} papers | {res['new_papers_indexed']} new indexed | {res['new_alerts_generated']} gap alerts")
            time.sleep(args.interval)
    except KeyboardInterrupt:
        print("\nDaemon terminated cleanly by user.")


if __name__ == "__main__":
    main()
