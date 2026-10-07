import { useState } from "react";
import api from "../services/api";

const PRESET_TOPICS = [
  "Edge AI for Autonomous Aerial Vehicles",
  "Graph Neural Networks for Drug Discovery",
  "Self-Correcting LLMs via Reinforcement Learning",
  "Zero-Shot Multimodal Medical Diagnosis",
];

export default function ResearchTeam() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const runResearchTeam = async (selectedTopic) => {
    const topicToRun = selectedTopic || topic;
    if (!topicToRun.trim()) {
      alert("Please enter a research topic.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await api.get("/research_team", {
        params: { topic: topicToRun },
      });
      setResult(res.data);
    } catch {
      alert("Unable to execute Multi-Agent Research Swarm. Check backend connection.");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "1150px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "24px", color: "#f8fafc" }}>
          Multi-Agent Research Swarm
        </h1>
        <p style={{ fontSize: "14px", color: "#94a3b8" }}>
          Coordinated multi-agent pipeline: Research Director orchestrates Idea, Planner, Critic, and Proposal agents to synthesize complete scientific initiatives.
        </p>
      </div>

      {/* Control Card */}
      <div className="arl-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={{ fontSize: "13px", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>
            Research Topic or Domain
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Edge AI for Autonomous Drone Swarms"
              style={{ flex: 1, padding: "12px 16px" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") runResearchTeam();
              }}
            />
            <button
              onClick={() => runResearchTeam()}
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
              {loading ? "Coordinating Swarm..." : "Run Research Swarm"}
            </button>
          </div>
        </div>

        {/* Quick Topic Chips */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "#64748b" }}>Quick Prompts:</span>
          {PRESET_TOPICS.map((t, i) => (
            <button
              key={i}
              onClick={() => {
                setTopic(t);
                runResearchTeam(t);
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

      {/* Swarm Architecture Pipeline Banner */}
      <div
        className="arl-card"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          padding: "16px 24px",
          background: "rgba(15, 23, 42, 0.8)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "18px" }}>👑</span>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#f8fafc" }}>Director</div>
            <div style={{ fontSize: "11px", color: "#60a5fa" }}>Orchestrator</div>
          </div>
        </div>
        <span style={{ color: "#475569" }}>➔</span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "18px" }}>💡</span>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#f8fafc" }}>Idea Agent</div>
            <div style={{ fontSize: "11px", color: "#34d399" }}>Novel Concept</div>
          </div>
        </div>
        <span style={{ color: "#475569" }}>➔</span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "18px" }}>📋</span>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#f8fafc" }}>Planner</div>
            <div style={{ fontSize: "11px", color: "#fbbf24" }}>Execution Plan</div>
          </div>
        </div>
        <span style={{ color: "#475569" }}>➔</span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "18px" }}>🧐</span>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#f8fafc" }}>Critic</div>
            <div style={{ fontSize: "11px", color: "#f87171" }}>Peer Review</div>
          </div>
        </div>
        <span style={{ color: "#475569" }}>➔</span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "18px" }}>📄</span>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#f8fafc" }}>Proposal</div>
            <div style={{ fontSize: "11px", color: "#c084fc" }}>Publication Ready</div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="arl-card" style={{ textAlign: "center", padding: "50px", color: "#94a3b8" }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>🤖</div>
          <h3>Multi-Agent Swarm In Execution...</h3>
          <p style={{ fontSize: "14px", marginTop: "6px" }}>
            The Director is synchronizing context across Idea, Planner, and Critic agents.
          </p>
        </div>
      )}

      {/* Swarm Results */}
      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Agent Filter Tabs */}
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { id: "all", label: "View All Agents" },
              { id: "idea", label: "💡 Idea Agent" },
              { id: "plan", label: "📋 Planner Agent" },
              { id: "review", label: "🧐 Critic Agent" },
              { id: "proposal", label: "📄 Proposal Agent" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "6px 14px",
                  background: activeTab === tab.id ? "#3b82f6" : "rgba(255, 255, 255, 0.05)",
                  border: "none",
                  borderRadius: "6px",
                  color: "white",
                  fontSize: "12.5px",
                  fontWeight: activeTab === tab.id ? "600" : "500",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {(activeTab === "all" || activeTab === "idea") && (
            <div className="arl-card" style={{ borderLeft: "4px solid #34d399" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <h3 style={{ fontSize: "16px", color: "#f8fafc" }}>💡 Idea Agent</h3>
                <span className="arl-badge arl-badge-green">Conceptual Divergence</span>
              </div>
              <pre style={{ whiteSpace: "pre-wrap", fontSize: "13.5px", lineHeight: "1.6" }}>
                {result.idea}
              </pre>
            </div>
          )}

          {(activeTab === "all" || activeTab === "plan") && (
            <div className="arl-card" style={{ borderLeft: "4px solid #fbbf24" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <h3 style={{ fontSize: "16px", color: "#f8fafc" }}>📋 Planner Agent</h3>
                <span className="arl-badge arl-badge-amber">Step-by-Step Architecture</span>
              </div>
              <pre style={{ whiteSpace: "pre-wrap", fontSize: "13.5px", lineHeight: "1.6" }}>
                {result.plan}
              </pre>
            </div>
          )}

          {(activeTab === "all" || activeTab === "review") && (
            <div className="arl-card" style={{ borderLeft: "4px solid #f87171" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <h3 style={{ fontSize: "16px", color: "#f8fafc" }}>🧐 Critic Agent</h3>
                <span className="arl-badge" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                  Rigorous Peer Review
                </span>
              </div>
              <pre style={{ whiteSpace: "pre-wrap", fontSize: "13.5px", lineHeight: "1.6" }}>
                {result.review}
              </pre>
            </div>
          )}

          {(activeTab === "all" || activeTab === "proposal") && (
            <div className="arl-card" style={{ borderLeft: "4px solid #c084fc" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <h3 style={{ fontSize: "16px", color: "#f8fafc" }}>📄 Proposal Agent</h3>
                <span className="arl-badge arl-badge-purple">Full Synthesis</span>
              </div>
              <pre style={{ whiteSpace: "pre-wrap", fontSize: "13.5px", lineHeight: "1.6" }}>
                {result.proposal}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}