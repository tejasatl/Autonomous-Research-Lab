import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    papers: 0,
    authors: 0,
    citations: 0,
    gaps: 0,
  });
  const [systemStatus, setSystemStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      api.get("/stats"),
      api.get("/system_status"),
    ]).then(([statsRes, sysRes]) => {
      if (statsRes.status === "fulfilled" && statsRes.value.data) {
        setStats(statsRes.value.data);
      }
      if (sysRes.status === "fulfilled" && sysRes.value.data) {
        setSystemStatus(sysRes.value.data);
      }
      setLoading(false);
    });
  }, []);

  const quickActions = [
    {
      title: "Autonomous Research Cycle",
      desc: "Run 5-stage loop: Gaps → Hypotheses → Planning → Execution → Synthesis",
      path: "/research_cycle",
      icon: "🔄",
      tag: "Autonomous Loop",
      color: "#3b82f6",
    },
    {
      title: "Multi-Agent Swarm",
      desc: "Coordinate Director, Idea, Planner, and Critic agents on any topic",
      path: "/research-team",
      icon: "🤖",
      tag: "Agent Swarm",
      color: "#8b5cf6",
    },
    {
      title: "Interactive Knowledge Graph",
      desc: "Visualize 2D citation network, paper lineage, and topology metrics",
      path: "/graph",
      icon: "🌐",
      tag: "NetworkX / Neo4j",
      color: "#06b6d4",
    },
    {
      title: "AI Research Copilot",
      desc: "Ask deep research questions with hybrid GraphRAG retrieval",
      path: "/copilot",
      icon: "🚀",
      tag: "GraphRAG",
      color: "#10b981",
    },
    {
      title: "Paper Search & Ingest",
      desc: "Search arXiv & local papers, ingest PDFs with automatic chunking",
      path: "/search",
      icon: "🔍",
      tag: "Literature Ingest",
      color: "#f59e0b",
    },
    {
      title: "Grant & Proposal Studio",
      desc: "Generate complete NSF/IEEE proposals with one-click LaTeX export",
      path: "/proposal",
      icon: "📄",
      tag: "LaTeX Export",
      color: "#ec4899",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Hero Welcome Banner */}
      <div
        className="arl-card"
        style={{
          background: "linear-gradient(135deg, #111a2e 0%, #17243d 100%)",
          border: "1px solid rgba(59, 130, 246, 0.2)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", zIndex: 2, maxWidth: "720px" }}>
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            <span className="arl-badge arl-badge-blue">Autonomous Lab v2.0</span>
            <span className="arl-badge arl-badge-green">
              LLM: {systemStatus?.llm_backend?.toUpperCase() || "GEMINI"}
            </span>
          </div>

          <h1 style={{ fontSize: "28px", color: "#f8fafc", marginBottom: "8px" }}>
            Autonomous AI Research Laboratory
          </h1>
          <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: "1.6" }}>
            A fully unified scientific discovery platform powered by multi-agent coordination,
            hybrid GraphRAG citation graphs, automated experiment execution, and LaTeX grant proposal synthesis.
          </p>

          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
            <Link
              to="/research_cycle"
              style={{
                padding: "10px 20px",
                background: "#3b82f6",
                color: "white",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "14px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>⚡</span> Start Autonomous Cycle
            </Link>

            <Link
              to="/copilot"
              style={{
                padding: "10px 20px",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#e2e8f0",
                borderRadius: "8px",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              Open Copilot
            </Link>
          </div>
        </div>
      </div>

      {/* Primary Key Metrics */}
      <div>
        <h2 style={{ fontSize: "18px", color: "#f8fafc", marginBottom: "14px" }}>
          Knowledge Base & Research Metrics
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          <div className="arl-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", color: "#94a3b8" }}>Indexed Papers</span>
              <span style={{ fontSize: "20px" }}>📚</span>
            </div>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "#60a5fa", marginTop: "8px" }}>
              {stats.papers}
            </div>
            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
              Full text parsed & vectorized
            </div>
          </div>

          <div className="arl-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", color: "#94a3b8" }}>Tracked Authors</span>
              <span style={{ fontSize: "20px" }}>👨‍🔬</span>
            </div>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "#34d399", marginTop: "8px" }}>
              {stats.authors}
            </div>
            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
              Collaboration & citation network
            </div>
          </div>

          <div className="arl-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", color: "#94a3b8" }}>Citation Connections</span>
              <span style={{ fontSize: "20px" }}>🔗</span>
            </div>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "#f87171", marginTop: "8px" }}>
              {stats.citations}
            </div>
            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
              Graph edges and lineage links
            </div>
          </div>

          <div className="arl-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", color: "#94a3b8" }}>Discovered Gaps</span>
              <span style={{ fontSize: "20px" }}>🎯</span>
            </div>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "#c084fc", marginTop: "8px" }}>
              {stats.gaps}
            </div>
            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
              Opportunities for novel contributions
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Matrix */}
      <div>
        <h2 style={{ fontSize: "18px", color: "#f8fafc", marginBottom: "14px" }}>
          Autonomous Research Workspaces
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {quickActions.map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="arl-card"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                textDecoration: "none",
                cursor: "pointer",
                borderLeft: `4px solid ${action.color}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "24px" }}>{action.icon}</span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: action.color,
                    background: "rgba(255, 255, 255, 0.05)",
                    padding: "3px 8px",
                    borderRadius: "6px",
                  }}
                >
                  {action.tag}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: "16px", color: "#f8fafc", margin: 0 }}>
                  {action.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "6px", lineHeight: "1.4" }}>
                  {action.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* System Engine & Multi-Agent Architecture */}
      <div className="arl-card">
        <h3 style={{ fontSize: "16px", color: "#f8fafc", marginBottom: "12px" }}>
          Multi-Agent Discovery Pipeline Architecture
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
            marginTop: "16px",
          }}
        >
          {[
            { role: "Director Agent", desc: "Orchestration & goals", icon: "👑" },
            { role: "Idea Agent", desc: "Cross-domain divergence", icon: "💡" },
            { role: "Hypothesis Agent", desc: "Falsifiable conditions", icon: "🔬" },
            { role: "Planner Agent", desc: "Step-by-step executions", icon: "📋" },
            { role: "Critic Agent", desc: "Peer-review stress test", icon: "🧐" },
            { role: "Proposal Agent", desc: "Publication & LaTeX", icon: "📝" },
          ].map((agent, i) => (
            <div
              key={i}
              style={{
                padding: "14px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "22px" }}>{agent.icon}</div>
              <div style={{ fontWeight: "600", color: "#f8fafc", fontSize: "14px", marginTop: "6px" }}>
                {agent.role}
              </div>
              <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
                {agent.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}