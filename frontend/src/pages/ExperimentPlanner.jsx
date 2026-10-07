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

  const tabs = [
    { key: "experiments", label: "🔬 Experiment Protocol" },
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

  const copyTabContent = () => {
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
          AI Experiment & Compute Planner
        </h1>
        <p style={{ fontSize: "14px", color: "#94a3b8" }}>
          Multi-agent experimental design: curated datasets, competitive baselines, hardware GPU estimation, and compile-ready LaTeX templates.
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
                cursor: "pointer",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "14px",
            background: "rgba(239, 68, 68, 0.15)",
            color: "#f87171",
            borderRadius: "8px",
            fontSize: "13px",
            border: "1px solid rgba(239, 68, 68, 0.3)",
          }}
        >
          {error}
        </div>
      )}

      {loading && (
        <div className="arl-card" style={{ textAlign: "center", padding: "50px", color: "#94a3b8" }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>🧪</div>
          <h3>Synthesizing Experimental Methodology...</h3>
          <p style={{ marginTop: "4px", fontSize: "14px" }}>
            Querying benchmark standards, baseline papers, compute budgets, and compiling LaTeX code.
          </p>
        </div>
      )}

      {/* Results View */}
      {result && !loading && (
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
              {typeof result[activeTab] === "string"
                ? result[activeTab]
                : JSON.stringify(result[activeTab] || result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}