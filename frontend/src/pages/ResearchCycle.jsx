import { useState } from "react";
import api from "../services/api";

const PRESETS = [
  "Edge Vision Transformers with 4-bit Quantization",
  "Graph Neural Networks for Drug Synergy Prediction",
  "Self-Correcting Code Generation with Unit-Test Feedback",
  "Zero-Shot Robotic Manipulation via Foundation Models",
];

export default function ResearchCycle() {
  const [topic, setTopic] = useState("Edge Vision Transformers with 4-bit Quantization");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const [cycleData, setCycleData] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const steps = [
    {
      key: "objective",
      title: "Research Directive",
      description: "Research Director establishes high-impact research goals and scope constraints.",
      icon: "👑",
    },
    {
      key: "idea",
      title: "Novel Hypothesis",
      description: "Idea Agent hypothesizes technical innovations addressing identified gaps.",
      icon: "💡",
    },
    {
      key: "plan",
      title: "Experiment Plan",
      description: "Planner Agent formulates methodology, baselines, and implementation roadmap.",
      icon: "📋",
    },
    {
      key: "review",
      title: "Peer Critique",
      description: "Critic Agent provides rigorous academic scrutiny and feasibility analysis.",
      icon: "🧐",
    },
    {
      key: "proposal",
      title: "Full Proposal",
      description: "Proposal Generator drafts structured academic proposal ready for grant or submission.",
      icon: "📄",
    },
  ];

  async function runCycle(customTopic) {
    const topicToUse = customTopic || topic;
    if (!topicToUse.trim()) {
      alert("Please enter a research topic.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/research_cycle", {
        params: { topic: topicToUse },
      });
      setCycleData(res.data);
    } catch {
      setError("Failed to execute research cycle. Ensure backend is running and LLM is configured.");
    }
    setLoading(false);
  }

  const copyStageContent = () => {
    if (!cycleData || !cycleData[steps[selected].key]) return;
    const content = typeof cycleData[steps[selected].key] === "string"
      ? cycleData[steps[selected].key]
      : JSON.stringify(cycleData[steps[selected].key], null, 2);
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: "1150px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "24px", color: "#f8fafc" }}>
          Autonomous 5-Stage Research Cycle
        </h1>
        <p style={{ fontSize: "14px", color: "#94a3b8" }}>
          End-to-end autonomous closed loop: Director ➔ Idea ➔ Planner ➔ Critic ➔ Proposal synthesis.
        </p>
      </div>

      {/* Control Card */}
      <div className="arl-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={{ fontSize: "13px", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>
            Research Objective / Topic
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter research topic / domain..."
              style={{ flex: 1, padding: "12px 16px" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") runCycle();
              }}
            />
            <button
              onClick={() => runCycle()}
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
              {loading ? "Executing Cycle..." : "🚀 Execute Cycle"}
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
                runCycle(t);
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

      {/* Main Stepper + Inspector View */}
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "20px" }}>
        {/* Step Navigation Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
            Assembly Pipeline
          </div>

          {steps.map((step, index) => {
            const hasData = cycleData && cycleData[step.key];
            const isSelected = selected === index;
            return (
              <div
                key={index}
                onClick={() => setSelected(index)}
                style={{
                  cursor: "pointer",
                  padding: "14px",
                  borderRadius: "10px",
                  border: isSelected
                    ? "1px solid #3b82f6"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                  background: isSelected
                    ? "linear-gradient(90deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.05) 100%)"
                    : "#151d2f",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>{step.icon}</span>
                    <h4 style={{ margin: 0, fontSize: "14px", color: isSelected ? "#93c5fd" : "#f8fafc" }}>
                      {step.title}
                    </h4>
                  </div>
                  {hasData && (
                    <span className="arl-badge arl-badge-green" style={{ fontSize: "10px" }}>
                      ✓ Generated
                    </span>
                  )}
                </div>

                <p style={{ margin: "6px 0 0 0", fontSize: "12px", color: "#94a3b8", lineHeight: "1.4" }}>
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Step Content Card */}
        <div className="arl-card" style={{ display: "flex", flexDirection: "column", gap: "16px", minHeight: "480px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "12px" }}>
            <div>
              <h2 style={{ fontSize: "18px", color: "#f8fafc", margin: 0 }}>
                {steps[selected].icon} Stage {selected + 1}: {steps[selected].title}
              </h2>
              <p style={{ color: "#94a3b8", margin: "4px 0 0 0", fontSize: "13px" }}>
                {steps[selected].description}
              </p>
            </div>

            {cycleData && cycleData[steps[selected].key] && (
              <button
                onClick={copyStageContent}
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
                {copied ? "✓ Copied!" : "📋 Copy Stage"}
              </button>
            )}
          </div>

          {loading && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔄</div>
              <h3>Coordinating Autonomous Multi-Agent Loop...</h3>
              <p style={{ fontSize: "14px", marginTop: "4px" }}>
                The Director is orchestrating Idea, Planner, and Critic agents to synthesize an end-to-end scientific proposal.
              </p>
            </div>
          )}

          {!loading && cycleData && cycleData[steps[selected].key] && (
            <pre
              style={{
                whiteSpace: "pre-wrap",
                fontSize: "14px",
                lineHeight: "1.7",
                color: "#e2e8f0",
                maxHeight: "550px",
                overflowY: "auto",
              }}
            >
              {typeof cycleData[steps[selected].key] === "string"
                ? cycleData[steps[selected].key]
                : JSON.stringify(cycleData[steps[selected].key], null, 2)}
            </pre>
          )}

          {!loading && (!cycleData || !cycleData[steps[selected].key]) && (
            <div style={{ textAlign: "center", padding: "80px 20px", color: "#64748b" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🚀</div>
              <p style={{ fontSize: "14px" }}>
                Click "Execute Cycle" above to generate the full automated research loop for your topic.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}