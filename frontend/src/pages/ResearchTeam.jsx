import { useState } from "react";
import api from "../services/api";
import Icon from "../components/Icons";

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
        <h1 style={{ fontSize: "24px", color: "#0f172a" }}>
          Multi-Agent Research Swarm
        </h1>
        <p style={{ fontSize: "14px", color: "#94a3b8" }}>
          Coordinated multi-agent pipeline: Research Director orchestrates Idea, Planner, Critic, and Proposal agents to synthesize complete scientific initiatives.
        </p>
      </div>

      {/* Control Card */}
      <div className="arl-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={{ fontSize: "13px", color: "#334155", display: "block", marginBottom: "6px" }}>
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
          <Icon name="sparkles" size={16} color="#2563eb" />
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>Director</div>
            <div style={{ fontSize: "11px", color: "#2563eb" }}>Orchestrator</div>
          </div>
        </div>
        <Icon name="arrow-right" size={12} color="#94a3b8" />
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Icon name="intelligence" size={16} color="#059669" />
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>Idea Agent</div>
            <div style={{ fontSize: "11px", color: "#059669" }}>Novel Concept</div>
          </div>
        </div>
        <Icon name="arrow-right" size={12} color="#94a3b8" />
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Icon name="experiment" size={16} color="#d97706" />
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>Planner</div>
            <div style={{ fontSize: "11px", color: "#d97706" }}>Execution Plan</div>
          </div>
        </div>
        <Icon name="arrow-right" size={12} color="#94a3b8" />
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Icon name="gaps" size={16} color="#dc2626" />
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>Critic</div>
            <div style={{ fontSize: "11px", color: "#dc2626" }}>Peer Review</div>
          </div>
        </div>
        <Icon name="arrow-right" size={12} color="#94a3b8" />
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Icon name="proposal" size={16} color="#9333ea" />
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>Proposal</div>
            <div style={{ fontSize: "11px", color: "#9333ea" }}>Publication Ready</div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="arl-card" style={{ textAlign: "center", padding: "50px", color: "#64748b" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
            <Icon name="team" size={36} color="#2563eb" />
          </div>
          <h3 style={{ color: "#0f172a" }}>Multi-Agent Swarm In Execution...</h3>
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
              { id: "idea", label: "Idea Agent" },
              { id: "plan", label: "Planner Agent" },
              { id: "review", label: "Critic Agent" },
              { id: "proposal", label: "Proposal Agent" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "6px 14px",
                  background: activeTab === tab.id ? "#2563eb" : "#f1f5f9",
                  border: "none",
                  borderRadius: "8px",
                  color: activeTab === tab.id ? "white" : "#475569",
                  fontSize: "12.5px",
                  fontWeight: activeTab === tab.id ? "600" : "500",
                  cursor: "pointer",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {(activeTab === "all" || activeTab === "idea") && (
            <div className="arl-card" style={{ borderLeft: "4px solid #10b981" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <h3 style={{ fontSize: "16px", color: "#0f172a", margin: 0, fontWeight: "700" }}>Idea Agent</h3>
                <span className="arl-badge arl-badge-green">Conceptual Divergence</span>
              </div>
              <pre style={{ whiteSpace: "pre-wrap", fontSize: "13.5px", lineHeight: "1.6", color: "#1e293b" }}>
                {result.idea}
              </pre>
            </div>
          )}

          {(activeTab === "all" || activeTab === "plan") && (
            <div className="arl-card" style={{ borderLeft: "4px solid #f59e0b" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <h3 style={{ fontSize: "16px", color: "#0f172a", margin: 0, fontWeight: "700" }}>Planner Agent</h3>
                <span className="arl-badge arl-badge-amber">Step-by-Step Architecture</span>
              </div>
              <pre style={{ whiteSpace: "pre-wrap", fontSize: "13.5px", lineHeight: "1.6", color: "#1e293b" }}>
                {result.plan}
              </pre>
            </div>
          )}

          {(activeTab === "all" || activeTab === "review") && (
            <div className="arl-card" style={{ borderLeft: "4px solid #ef4444" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <h3 style={{ fontSize: "16px", color: "#0f172a", margin: 0, fontWeight: "700" }}>Critic Agent</h3>
                <span className="arl-badge arl-badge-red">
                  Rigorous Peer Review
                </span>
              </div>
              <pre style={{ whiteSpace: "pre-wrap", fontSize: "13.5px", lineHeight: "1.6", color: "#1e293b" }}>
                {result.review}
              </pre>
            </div>
          )}

          {(activeTab === "all" || activeTab === "proposal") && (
            <div className="arl-card" style={{ borderLeft: "4px solid #8b5cf6" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <h3 style={{ fontSize: "16px", color: "#0f172a", margin: 0, fontWeight: "700" }}>Proposal Agent</h3>
                <span className="arl-badge arl-badge-purple">Full Synthesis</span>
              </div>
              <pre style={{ whiteSpace: "pre-wrap", fontSize: "13.5px", lineHeight: "1.6", color: "#1e293b" }}>
                {result.proposal}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}