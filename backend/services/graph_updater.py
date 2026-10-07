import os
import sys
import subprocess


class GraphUpdater:

    def update(self):
        env = {**os.environ, "PYTHONPATH": "."}
        scripts = [
            "scripts/build_citation_graph.py",
            "scripts/build_author_graph.py",
            "scripts/build_lineage_graph.py",
        ]

        for s in scripts:
            try:
                subprocess.run([sys.executable, s], env=env, check=False)
            except Exception as e:
                print(f"Error running {s}: {e}")

        # Optional Neo4j migration if configured
        try:
            subprocess.run([sys.executable, "scripts/migrate_to_neo4j.py"], env=env, check=False)
        except Exception:
            pass

        return {
            "status": "updated"
        }