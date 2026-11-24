import { useState } from "react";
import api from "../services/api";

const PRESETS = [
  "TinyML for Low-Power Edge Sensors",
  "Quantized Vision Transformers on ARM GPUs",
  "Graph Neural Networks for Causal Genomics",
  "Speculative Decoding for Mobile LLMs",
];

export default function ExperimentPlanner() {
  const [topic, setTopic] = useState("TinyML for Low-Power Edge Sensors");
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("experiments");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Sandbox State
  const [sandboxCode, setSandboxCode] = useState(
`import time, json
import numpy as np

print("⚛ Autonomous PyTorch Benchmark Sandbox Initializing...")
start_time = time.time()

# Synthetic Layer Quantization Simulation
dims = (512, 512)
fp32_weights = np.random.randn(*dims).astype(np.float32)
scale = 127.0 / np.max(np.abs(fp32_weights))
int8_weights = np.round(fp32_weights * scale).astype(np.int8)

fp32_size = fp32_weights.nbytes / 1024
int8_size = int8_weights.nbytes / 1024
compression_ratio = round(fp32_size / int8_size, 2)
latency_ms = round((time.time() - start_time) * 1000, 2)

print(f"FP32 Size: {fp32_size} KB | INT8 Size: {int8_size} KB")
print(f"Compression Ratio: {compression_ratio}x | Latency: {latency_ms} ms")

print("---METRICS---")
print(json.dumps({
    "compression_ratio": compression_ratio,
    "latency_ms": latency_ms,
    "quantization_scheme": "symmetric_int8",
    "status": "converged"
}))
print("---END_METRICS---")
print("✓ Benchmark completed successfully.")
`
  );
  const [sandboxResult, setSandboxResult] = useState(null);
  const [runningSandbox, setRunningSandbox] = useState(false);
  const [synthesizingCode, setSynthesizingCode] = useState(false);

  const tabs = [
    { key: "experiments", label: "🔬 Experiment Protocol" },
    { key: "sandbox", label: "⚡ Closed-Loop Code Sandbox" },
    { key: "datasets", label: "📦 Datasets" },
    { key: "baselines", label: "🏆 Baselines" },
    { key: "hardware", label: "⚡ Hardware & Compute" },
    { key: "evaluation", label: "📈 Evaluation Metrics" },
    { key: "timeline", label: "⏱️ Execution Timeline" },
    { key: "latex", label: "📄 LaTeX Skeleton" },
  ];

  async function generatePlan(customTopic) {
    const topicToUse = customTopic || topic;
    if (!topicToUse.trim()) {
      alert("Please enter a research topic.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/experiment_plan", {
        params: { topic: topicToUse },
      });
      setResult(res.data);
    } catch {
      setError("Unable to generate experiment plan. Ensure backend is running.");
    }
    setLoading(false);
  }

  async function handleSynthesizeCode() {
    setSynthesizingCode(true);
    try {
      const res = await api.post("/experiments/synthesize-code", {
        topic: topic,
        instructions: "Write a high-performance benchmark script using numpy or torch."
      });
      if (res.data?.code) {
        setSandboxCode(res.data.code);
      }
    } catch (err) {
      alert("Failed to synthesize code: " + (err.response?.data?.detail || err.message));
    }
    setSynthesizingCode(false);
  }

  async function handleRunSandbox() {
    setRunningSandbox(true);
    try {
      const res = await api.post("/experiments/execute", {
        topic: topic,
        code: sandboxCode
      });
      setSandboxResult(res.data);
    } catch (err) {
      alert("Sandbox execution error: " + (err.response?.data?.detail || err.message));
    }
    setRunningSandbox(false);
  }

  const copyTabContent = () => {
    if (activeTab === "sandbox") {
      navigator.clipboard.writeText(sandboxCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }
    if (!result || !result[activeTab]) return;
    const content = typeof result[activeTab] === "string"
      ? result[activeTab]
      : JSON.stringify(result[activeTab], null, 2);
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: "1150px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "24px", color: "#f8fafc" }}>
          AI Experiment Planner & Closed-Loop Code Sandbox
        </h1>
        <p style={{ fontSize: "14px", color: "#94a3b8" }}>
          Multi-agent experimental design with real Python/PyTorch code synthesis, self-debugging runtime execution, and empirical metric logging.
        </p>
      </div>

      {/* Control Card */}
      <div className="arl-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={{ fontSize: "13px", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>
            Target Research Topic
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Quantized Vision Transformers on Edge Hardware..."
              style={{ flex: 1, padding: "12px 16px" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") generatePlan();
              }}
            />
            <button
              onClick={() => generatePlan()}
              disabled={loading}
              style={{
                padding: "12px 24px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer"
              }}
            >
              {loading ? "Designing Protocol..." : "Generate Protocol"}
            </button>
          </div>
        </div>

        {/* Preset Chips */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "#64748b" }}>Quick Prompts:</span>
          {PRESETS.map((t, i) => (
            <button
              key={i}
              onClick={() => {
                setTopic(t);
                generatePlan(t);
              }}
              style={{
                padding: "4px 10px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#94a3b8",
                borderRadius: "6px",
                fontSize: "12px",
                cursor: "pointer"
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="arl-card" style={{ borderLeft: "4px solid #ef4444", color: "#fca5a5" }}>
          {error}
        </div>
      )}

      {loading && (
        <div className="arl-card" style={{ textAlign: "center", padding: "48px" }}>
          <div style={{ fontSize: "28px", marginBottom: "12px" }}>🤖</div>
          <h3 style={{ fontSize: "18px", color: "#f8fafc" }}>
            Autonomous Experiment Swarm Active
          </h3>
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>
            Querying benchmark standards, baseline papers, compute budgets, and compiling LaTeX code.
          </p>
        </div>
      )}

      {/* Results View or Sandbox View */}
      {(!loading && (result || activeTab === "sandbox")) && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              paddingBottom: "12px",
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: activeTab === tab.key ? "#3b82f6" : "rgba(255, 255, 255, 0.05)",
                  color: activeTab === tab.key ? "white" : "#94a3b8",
                  fontWeight: activeTab === tab.key ? "600" : "500",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Tab Panel */}
          {activeTab === "sandbox" ? (
            /* Closed-Loop Sandbox Panel */
            <div className="arl-card" style={{ display: "flex", flexDirection: "column", gap: "18px", borderLeft: "4px solid #10b981" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ fontSize: "17px", color: "#f8fafc", margin: 0 }}>
                    ⚡ Autonomous Execution Sandbox
                  </h3>
                  <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
                    Synthesizes runnable Python benchmark code, runs in an isolated subprocess, and self-corrects upon error.
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={handleSynthesizeCode}
                    disabled={synthesizingCode}
                    style={{
                      padding: "8px 16px",
                      background: "rgba(59, 130, 246, 0.15)",
                      border: "1px solid #3b82f6",
                      color: "#60a5fa",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    {synthesizingCode ? "Synthesizing..." : "🤖 Synthesize Code via LLM"}
                  </button>
                  <button
                    onClick={handleRunSandbox}
                    disabled={runningSandbox}
                    style={{
                      padding: "8px 18px",
                      background: "#10b981",
                      border: "none",
                      color: "#0f172a",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: "pointer"
                    }}
                  >
                    {runningSandbox ? "Executing in Sandbox..." : "▶️ Execute in Sandbox"}
                  </button>
                </div>
              </div>

              {/* Code Editor */}
              <div>
                <label style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase", fontWeight: "700", marginBottom: "6px", display: "block" }}>
                  Python Benchmark Code (Editable):
                </label>
                <textarea
                  value={sandboxCode}
                  onChange={(e) => setSandboxCode(e.target.value)}
                  rows={14}
                  style={{
                    width: "100%",
                    fontFamily: "monospace",
                    fontSize: "13px",
                    background: "#0b1120",
                    color: "#38bdf8",
                    padding: "14px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    lineHeight: "1.5",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Sandbox Execution Terminal Results */}
              {sandboxResult && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className={`arl-badge ${sandboxResult.success ? "arl-badge-green" : "arl-badge-red"}`}>
                        {sandboxResult.success ? "✓ Execution Success" : "✗ Execution Failed"}
                      </span>
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                        Time: {sandboxResult.execution_time}s • Attempts: {sandboxResult.total_attempts}
                      </span>
                    </div>

                    {sandboxResult.total_attempts > 1 && (
                      <span className="arl-badge arl-badge-purple">
                        Self-Corrected via Reflection Loop
                      </span>
                    )}
                  </div>

                  {/* Parsed Metrics Grid */}
                  {sandboxResult.metrics && Object.keys(sandboxResult.metrics).length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px" }}>
                      {Object.entries(sandboxResult.metrics).map(([k, v], idx) => (
                        <div key={idx} style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "8px", padding: "10px" }}>
                          <div style={{ fontSize: "11px", color: "#6ee7b7", textTransform: "uppercase" }}>{k}</div>
                          <div style={{ fontSize: "18px", fontWeight: "700", color: "#f8fafc", marginTop: "2px" }}>{String(v)}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Terminal stdout / stderr */}
                  <div style={{ background: "#050811", borderRadius: "8px", padding: "14px", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: "700", marginBottom: "8px" }}>
                      Sandbox Terminal Output (stdout):
                    </div>
                    <pre style={{ margin: 0, fontSize: "12.5px", color: "#a7f3d0", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
                      {sandboxResult.stdout || "(No stdout)"}
                    </pre>
                    {sandboxResult.stderr && (
                      <pre style={{ margin: "10px 0 0", fontSize: "12.5px", color: "#fca5a5", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
                        {sandboxResult.stderr}
                      </pre>
                    )}
                  </div>

                  {/* Rendered Matplotlib Empirical Plots */}
                  {sandboxResult.plots && sandboxResult.plots.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "6px" }}>
                      <div style={{ fontSize: "11px", color: "#38bdf8", textTransform: "uppercase", fontWeight: "700" }}>
                        📈 Generated Empirical Figures & Matplotlib Artifacts:
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "14px" }}>
                        {sandboxResult.plots.map((plot, pIdx) => {
                          const plotUrl = typeof plot === "string" 
                            ? `${api.defaults.baseURL || "http://127.0.0.1:8000"}/experiments/runs/${sandboxResult.run_id}/plots/${plot}`
                            : `${api.defaults.baseURL || "http://127.0.0.1:8000"}${plot.url}`;
                          const plotName = typeof plot === "string" ? plot : plot.filename;

                          return (
                            <div key={pIdx} style={{ background: "#050811", border: "1px solid rgba(56, 189, 248, 0.25)", borderRadius: "8px", overflow: "hidden" }}>
                              <img
                                src={plotUrl}
                                alt={plotName}
                                style={{ width: "100%", maxHeight: "300px", objectFit: "contain", display: "block", background: "#020617" }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                              <div style={{ padding: "10px 14px", fontSize: "12px", color: "#cbd5e1", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                                <span>📊 {plotName}</span>
                                <a
                                  href={plotUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  download={plotName}
                                  style={{ color: "#38bdf8", textDecoration: "none", fontWeight: "600" }}
                                >
                                  ⬇ Download
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Standard Protocol View */
            <div className="arl-card" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "17px", color: "#f8fafc", margin: 0 }}>
                  {tabs.find((t) => t.key === activeTab)?.label}
                </h3>

                <button
                  onClick={copyTabContent}
                  style={{
                    padding: "6px 14px",
                    background: copied ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: copied ? "#34d399" : "#f8fafc",
                    borderRadius: "6px",
                    fontSize: "12.5px",
                    cursor: "pointer",
                  }}
                >
                  {copied ? "✓ Copied!" : "📋 Copy Section"}
                </button>
              </div>

              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  fontSize: "14px",
                  lineHeight: "1.7",
                  color: "#e2e8f0",
                  maxHeight: "580px",
                  overflowY: "auto",
                }}
              >
                {typeof (result && result[activeTab]) === "string"
                  ? result[activeTab]
                  : JSON.stringify((result && result[activeTab]) || result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
