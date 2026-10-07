import subprocess
import sys


import os

def run_script(script_name):

    print("\n" + "=" * 80)
    print(f"RUNNING: {script_name}")
    print("=" * 80 + "\n")

    env = {**os.environ, "PYTHONPATH": "."}
    result = subprocess.run(
        [sys.executable, f"scripts/{script_name}"],
        env=env
    )
    if result.returncode != 0:
        print(f"WARNING: {script_name} failed, continuing pipeline...\n")

    


pipeline = [
    "test_retriever.py",
    "batch_summarize.py",
    "analyze_trends.py",
    "find_research_gaps.py",
    "generate_hypotheses.py",
    "validate_novelty.py",
    "generate_proposal.py"
]

for script in pipeline:
    run_script(script)

print("\n")
print("=" * 80)
print("ARL PIPELINE COMPLETE")
print("=" * 80)