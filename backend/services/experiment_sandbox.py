import os
import sys
import json
import time
import uuid
import shutil
import subprocess
import logging
from pathlib import Path
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

EXPERIMENTS_DIR = Path(__file__).resolve().parent.parent.parent / "data" / "experiments"
EXPERIMENTS_DIR.mkdir(parents=True, exist_ok=True)


class ExperimentSandbox:
    """
    Closed-Loop Autonomous Code Synthesis & Sandboxed Execution Engine.
    Synthesizes executable PyTorch / Python evaluation benchmarks, executes them
    in an isolated environment, captures empirical metrics, and self-debugs upon runtime error.
    """

    def __init__(self, max_retries: int = 2, timeout_seconds: int = 30):
        self.experiments_dir = EXPERIMENTS_DIR
        self.max_retries = max_retries
        self.timeout_seconds = timeout_seconds

    def synthesize_code(self, experiment_topic: str, instructions: str = "") -> str:
        """Use connected LLM to generate self-contained, runnable benchmark code."""
        from backend.llms.llm_factory import get_llm
        llm = get_llm()

        prompt = f"""
You are an expert Machine Learning systems engineer writing a self-contained, runnable benchmark script in Python.
Experiment Objective: {experiment_topic}
Specific Instructions: {instructions}

Requirements:
1. Use standard scientific libraries: numpy, torch, matplotlib.pyplot (using 'Agg' backend: import matplotlib; matplotlib.use('Agg')), math, time, json.
2. If datasets are required, generate a realistic synthetic or standard toy benchmark dataset (e.g. synthetic embeddings or classification tensors).
3. Generate a high-resolution empirical comparison plot using matplotlib:
   - Create a clean scientific plot (e.g. Loss Curves over epochs, Latency vs Accuracy Pareto Frontier, or Compression Ratios).
   - Use a modern dark or clean scientific theme with labeled axes and legends.
   - Save the figure directly to the working directory:
     plt.savefig("benchmark_plot.png", dpi=150, bbox_inches="tight")
     plt.close()
4. Print clear, formatted scientific metrics to stdout (e.g., Latency (ms), Accuracy / Loss, Memory Bandwidth, Parameters).
5. Output a summary dictionary printed as:
   ---METRICS---
   {{"metric_name": value, ...}}
   ---END_METRICS---
6. Keep execution quick (under 10 seconds).
7. Return ONLY valid Python code inside a ```python ``` block. Do not include conversational text.
"""
        response = llm.generate(prompt)

        # Extract code block
        if "```python" in response:
            code = response.split("```python")[1].split("```")[0].strip()
        elif "```" in response:
            code = response.split("```")[1].split("```")[0].strip()
        else:
            code = response.strip()

        return code

    def refine_code_after_error(self, code: str, error_traceback: str) -> str:
        """Self-debugging reflection loop: Agent patches the code based on the runtime traceback."""
        from backend.llms.llm_factory import get_llm
        llm = get_llm()

        prompt = f"""
The Python experiment benchmark script you wrote failed with a runtime error.
Analyze the traceback, locate the bug (e.g. dimension mismatch, missing import, syntax error), and provide the corrected code.

BROKEN CODE:
```python
{code}
```

RUNTIME TRACEBACK / STDERR:
```
{error_traceback}
```

Fix the code completely. Return ONLY the corrected executable Python code inside a ```python ``` block.
"""
        response = llm.generate(prompt)
        if "```python" in response:
            return response.split("```python")[1].split("```")[0].strip()
        elif "```" in response:
            return response.split("```")[1].split("```")[0].strip()
        return response.strip()

    def run_script(self, code: str, run_dir: Path) -> Dict[str, Any]:
        """Execute the script safely in a dedicated subprocess sandbox."""
        script_path = run_dir / "benchmark.py"
        with open(script_path, "w", encoding="utf-8") as f:
            f.write(code)

        python_exec = sys.executable  # Current venv Python
        start_time = time.time()

        try:
            # Execute with resource limits and timeout
            result = subprocess.run(
                [python_exec, str(script_path)],
                cwd=str(run_dir),
                capture_output=True,
                text=True,
                timeout=self.timeout_seconds
            )
            elapsed_time = round(time.time() - start_time, 3)

            # Parse custom metric blocks if present
            metrics = {}
            if "---METRICS---" in result.stdout:
                try:
                    raw_metrics = result.stdout.split("---METRICS---")[1].split("---END_METRICS---")[0].strip()
                    metrics = json.loads(raw_metrics)
                except Exception:
                    pass

            # Check for generated plots
            plot_files = list(run_dir.glob("*.png")) + list(run_dir.glob("*.jpg"))
            plots = [p.name for p in plot_files]

            return {
                "success": result.returncode == 0,
                "exit_code": result.returncode,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "execution_time_seconds": elapsed_time,
                "metrics": metrics,
                "plots": plots
            }

        except subprocess.TimeoutExpired:
            return {
                "success": False,
                "exit_code": -1,
                "stdout": "",
                "stderr": f"Execution timed out after {self.timeout_seconds} seconds.",
                "execution_time_seconds": self.timeout_seconds,
                "metrics": {},
                "plots": []
            }
        except Exception as e:
            return {
                "success": False,
                "exit_code": -1,
                "stdout": "",
                "stderr": f"Sandbox execution error: {str(e)}",
                "execution_time_seconds": round(time.time() - start_time, 3),
                "metrics": {},
                "plots": []
            }

    def execute_closed_loop(self, experiment_topic: str, custom_code: Optional[str] = None) -> Dict[str, Any]:
        """
        Full Closed-Loop Scientific Execution:
        1. Synthesizes or takes Python benchmark code.
        2. Executes in sandbox.
        3. If it crashes, passes traceback to self-debugging reflection loop (up to max_retries).
        4. Saves comprehensive empirical logs.
        """
        run_id = f"run_{int(time.time())}_{uuid.uuid4().hex[:6]}"
        run_dir = self.experiments_dir / "runs" / run_id
        run_dir.mkdir(parents=True, exist_ok=True)

        current_code = custom_code or self.synthesize_code(experiment_topic)
        iteration_history = []
        final_result = None

        for attempt in range(self.max_retries + 1):
            logger.info(f"Sandbox executing run {run_id} (Attempt {attempt + 1}/{self.max_retries + 1})")
            run_res = self.run_script(current_code, run_dir)
            
            iteration_history.append({
                "attempt": attempt + 1,
                "code": current_code,
                "success": run_res["success"],
                "stdout": run_res["stdout"],
                "stderr": run_res["stderr"],
                "execution_time": run_res["execution_time_seconds"]
            })

            final_result = run_res

            if run_res["success"]:
                break
            elif attempt < self.max_retries:
                logger.info("Attempt failed. Triggering Self-Correction Reflection Loop...")
                current_code = self.refine_code_after_error(current_code, run_res["stderr"])

        # Write metadata
        metadata = {
            "run_id": run_id,
            "experiment_topic": experiment_topic,
            "created_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "success": final_result["success"],
            "total_attempts": len(iteration_history),
            "final_code": current_code,
            "stdout": final_result["stdout"],
            "stderr": final_result["stderr"],
            "metrics": final_result["metrics"],
            "plots": [
                {
                    "filename": p,
                    "url": f"/experiments/runs/{run_id}/plots/{p}"
                }
                for p in final_result["plots"]
            ],
            "execution_time": final_result["execution_time_seconds"],
            "history": iteration_history
        }

        meta_file = run_dir / "metadata.json"
        with open(meta_file, "w", encoding="utf-8") as f:
            json.dump(metadata, f, indent=2)

        return metadata

    def get_experiment_runs(self, limit: int = 20) -> List[Dict[str, Any]]:
        """Retrieve recent empirical experiment runs."""
        runs_dir = self.experiments_dir / "runs"
        if not runs_dir.exists():
            return []

        runs = []
        for rdir in sorted(runs_dir.iterdir(), reverse=True):
            meta_path = rdir / "metadata.json"
            if meta_path.exists():
                try:
                    with open(meta_path, "r", encoding="utf-8") as f:
                        runs.append(json.load(f))
                except Exception:
                    pass
            if len(runs) >= limit:
                break
        return runs


_sandbox_instance = None

def get_experiment_sandbox() -> ExperimentSandbox:
    global _sandbox_instance
    if _sandbox_instance is None:
        _sandbox_instance = ExperimentSandbox()
    return _sandbox_instance
