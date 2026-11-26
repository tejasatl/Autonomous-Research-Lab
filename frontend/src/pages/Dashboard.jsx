import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Icon from "../components/Icons";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    papers: 0,
    authors: 0,
    citations: 0,
    gaps: 0,
  });
  const [systemStatus, setSystemStatus] = useState(null);
  const [promptInput, setPromptInput] = useState("");

  useEffect(() => {
    Promise.allSettled([
      api.get("/stats"),
      api.get("/system_status"),
    ]).then(([statsRes, sysRes]) => {
      if (statsRes.status === "fulfilled" && statsRes.value?.data) {
        setStats(statsRes.value.data);
      }
      if (sysRes.status === "fulfilled" && sysRes.value?.data) {
        setSystemStatus(sysRes.value.data);
      }
    });
  }, []);

  const handleCopilotSubmit = (e) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    navigate(`/copilot?q=${encodeURIComponent(promptInput.trim())}`);
  };

  const days = [
    { name: "Mon", num: 1 },
    { name: "Tue", num: 2 },
    { name: "Wed", num: 3 },
    { name: "Thu", num: 4 },
    { name: "Fri", num: 5 },
    { name: "Sat", num: 6 },
    { name: "Sun", num: 7 },
    { name: "Mon", num: 8 },
    { name: "Tue", num: 9, isCurrent: true },
    { name: "Wed", num: 10 },
    { name: "Thu", num: 11 },
    { name: "Fri", num: 12 },
    { name: "Sat", num: 13 },
    { name: "Sun", num: 14 },
    { name: "Mon", num: 15 },
    { name: "Tue", num: 16 },
  ];

  const agentSchedules = [
    {
      name: "Director Agent",
      role: "Lead Orchestrator",
      initials: "DA",
      bar: {
        startCol: 1,
        spanCols: 3,
        title: "Literature Review",
        status: "Active",
        type: "purple",
      },
    },
    {
      name: "Hypothesis Synthesizer",
      role: "Empirical Divergence",
      initials: "HS",
      bar: {
        startCol: 4,
        spanCols: 4,
        title: "Gap Formulation",
        status: "Approved",
        type: "emerald",
      },
    },
    {
      name: "Sandbox Executor",
      role: "GPU & Code Benchmark",
      initials: "SE",
      bar: {
        startCol: 8,
        spanCols: 4,
        title: "Matplotlib & Eval",
        status: "Running",
        type: "glass",
      },
    },
    {
      name: "Peer Review Panel",
      role: "NeurIPS / ICML Critic",
      initials: "PR",
      bar: {
        startCol: 13,
        spanCols: 3,
        title: "Committee Evaluation",
        status: "Queued",
        type: "purple",
      },
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Quick Metrics Strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "16px",
        }}
      >
        <div className="arl-card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12.5px", fontWeight: "600", color: "#64748b" }}>Indexed Literature</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="search" size={16} color="#2563eb" />
            </div>
          </div>
          <div style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", marginTop: "8px", letterSpacing: "-0.02em" }}>
            {stats.papers}
          </div>
          <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: "2px" }}>
            Full papers parsed & vectorized
          </div>
        </div>

        <div className="arl-card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12.5px", fontWeight: "600", color: "#64748b" }}>Tracked Authors</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="authors" size={16} color="#16a34a" />
            </div>
          </div>
          <div style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", marginTop: "8px", letterSpacing: "-0.02em" }}>
            {stats.authors}
          </div>
          <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: "2px" }}>
            Co-authorship network nodes
          </div>
        </div>

        <div className="arl-card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12.5px", fontWeight: "600", color: "#64748b" }}>Citation Graph Edges</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#faf5ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="graph" size={16} color="#9333ea" />
            </div>
          </div>
          <div style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", marginTop: "8px", letterSpacing: "-0.02em" }}>
            {stats.citations}
          </div>
          <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: "2px" }}>
            Cross-reference lineage links
          </div>
        </div>

        <div className="arl-card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12.5px", fontWeight: "600", color: "#64748b" }}>Discovered Gaps</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="gaps" size={16} color="#ea580c" />
            </div>
          </div>
          <div style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", marginTop: "8px", letterSpacing: "-0.02em" }}>
            {stats.gaps}
          </div>
          <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: "2px" }}>
            Novel research opportunities
          </div>
        </div>
      </div>

      {/* Top Schedule / Pipeline Grid Section (Outcrowd Hero Layout) */}
      <div className="arl-card" style={{ padding: "26px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
              Research Timeline & Scheduled Cycles
            </h2>
            <p style={{ fontSize: "12.5px", color: "#64748b", margin: "4px 0 0 0" }}>
              Multi-agent sprint tracking, autonomous verification milestones, and sandbox runs.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "9999px",
                fontSize: "12px",
                fontWeight: "600",
                color: "#334155",
              }}
            >
              <Icon name="calendar" size={13} color="#64748b" />
              <span>December 15, 2026</span>
              <Icon name="chevron-down" size={11} color="#94a3b8" />
            </div>

            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 14px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "9999px",
                fontSize: "12px",
                fontWeight: "600",
                color: "#334155",
                cursor: "pointer",
              }}
            >
              <Icon name="filter" size={12} color="#64748b" />
              <span>Filter</span>
            </button>

            <Link
              to="/research_cycle"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 14px",
                background: "#eff6ff",
                border: "1px solid #dbeafe",
                borderRadius: "9999px",
                fontSize: "12px",
                fontWeight: "600",
                color: "#2563eb",
                textDecoration: "none",
              }}
            >
              <span>View all cycles</span>
              <Icon name="arrow-right" size={12} color="#2563eb" />
            </Link>
          </div>
        </div>

        {/* Schedule Grid Table */}
        <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: "920px" }}>
            {/* Table Header: Days */}
            <div style={{ display: "grid", gridTemplateColumns: "220px repeat(16, 1fr)", gap: "4px", marginBottom: "8px" }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", paddingLeft: "8px" }}>
                Active Agent Sprints
              </div>
              {days.map((d, i) => (
                <div
                  key={i}
                  style={{
                    textAlign: "center",
                    padding: "6px 2px",
                    borderRadius: "8px",
                    background: d.isCurrent ? "#2563eb" : "transparent",
                    color: d.isCurrent ? "#ffffff" : "#64748b",
                    fontWeight: d.isCurrent ? "700" : "500",
                    position: "relative",
                  }}
                >
                  <div style={{ fontSize: "10.5px" }}>{d.name}</div>
                  <div style={{ fontSize: "12px", marginTop: "2px" }}>{d.num}</div>
                  {d.isCurrent && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "-14px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#2563eb",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Agent Rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "14px" }}>
              {agentSchedules.map((agent, rowIdx) => (
                <div
                  key={rowIdx}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "220px repeat(16, 1fr)",
                    gap: "4px",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  {/* Agent Identity Column */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "4px 8px" }}>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "#e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#334155",
                      }}
                    >
                      {agent.initials}
                    </div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>
                        {agent.name}
                      </div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>
                        {agent.role}
                      </div>
                    </div>
                  </div>

                  {/* 16 Day Tile Slots */}
                  {Array.from({ length: 16 }).map((_, colIdx) => (
                    <div
                      key={colIdx}
                      style={{
                        height: "44px",
                        borderRadius: "8px",
                        background: days[colIdx]?.isCurrent ? "#f1f5f9" : "#f8fafc",
                        border: "1px solid #f1f5f9",
                      }}
                    />
                  ))}

                  {/* Overlay Timeline Bar */}
                  {agent.bar && (
                    <div
                      style={{
                        position: "absolute",
                        left: `calc(220px + 4px + (${agent.bar.startCol} * (100% - 224px) / 16))`,
                        width: `calc((${agent.bar.spanCols} * (100% - 224px) / 16) - 8px)`,
                        height: "34px",
                        top: "5px",
                        borderRadius: "10px",
                        padding: "0 10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        zIndex: 2,
                        ...(agent.bar.type === "purple" && {
                          background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                          color: "#ffffff",
                          boxShadow: "0 4px 12px rgba(124, 58, 237, 0.25)",
                        }),
                        ...(agent.bar.type === "emerald" && {
                          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                          color: "#ffffff",
                          boxShadow: "0 4px 12px rgba(5, 150, 105, 0.25)",
                        }),
                        ...(agent.bar.type === "glass" && {
                          background: "linear-gradient(135deg, rgba(147, 197, 253, 0.5) 0%, rgba(96, 165, 250, 0.45) 100%)",
                          backdropFilter: "blur(8px)",
                          border: "1px solid rgba(147, 197, 253, 0.6)",
                          color: "#1e3a8a",
                          boxShadow: "0 4px 12px rgba(37, 99, 235, 0.15)",
                        }),
                      }}
                    >
                      <span style={{ fontSize: "11.5px", fontWeight: "700", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {agent.bar.title}
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: "700",
                          padding: "2px 6px",
                          borderRadius: "9999px",
                          background: "rgba(255, 255, 255, 0.25)",
                          backdropFilter: "blur(4px)",
                          marginLeft: "6px",
                        }}
                      >
                        {agent.bar.status}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 3-Column Studio Matrix */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          alignItems: "stretch",
        }}
      >
        {/* Card 1: Milestones & Events (with Warm Amber Gradient Banner) */}
        <div className="arl-card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
              Future Milestones
            </h3>
            <Link
              to="/proposal"
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#2563eb",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                textDecoration: "none",
              }}
            >
              <span>View all</span>
              <Icon name="arrow-right" size={11} color="#2563eb" />
            </Link>
          </div>

          {/* Warm Amber Feature Milestone Banner */}
          <div
            style={{
              borderRadius: "16px",
              background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
              padding: "18px 20px",
              color: "#ffffff",
              boxShadow: "0 8px 20px rgba(245, 158, 11, 0.25)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ fontSize: "15px", fontWeight: "800", letterSpacing: "-0.01em" }}>
                ICLR 2026 Manuscript Draft
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  padding: "3px 8px",
                  borderRadius: "9999px",
                  background: "rgba(255, 255, 255, 0.3)",
                }}
              >
                In 22 hrs
              </span>
            </div>
            <p style={{ fontSize: "12px", margin: "6px 0 14px 0", opacity: 0.92, lineHeight: "1.4" }}>
              Autonomous compilation of empirical results, LaTeX formatting, and peer review stress tests.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", fontSize: "11.5px", fontWeight: "600" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Icon name="clock" size={13} color="#ffffff" />
                14:00 - 15:30
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Icon name="calendar" size={13} color="#ffffff" />
                December 18
              </span>
            </div>
          </div>

          {/* Secondary Events List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div
              style={{
                padding: "14px",
                borderRadius: "12px",
                background: "#f8fafc",
                border: "1px solid #f1f5f9",
              }}
            >
              <div style={{ fontSize: "13.5px", fontWeight: "700", color: "#0f172a" }}>
                NeurIPS Peer Review Panel
              </div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "3px" }}>
                Tri-agent committee evaluating methodology rigor and empirical robustness.
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px", fontSize: "11px", color: "#94a3b8" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Icon name="clock" size={12} />
                  17:00 - 18:00
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Icon name="calendar" size={12} />
                  December 20
                </span>
              </div>
            </div>

            <div
              style={{
                padding: "14px",
                borderRadius: "12px",
                background: "#f8fafc",
                border: "1px solid #f1f5f9",
              }}
            >
              <div style={{ fontSize: "13.5px", fontWeight: "700", color: "#0f172a" }}>
                arXiv Overnight Feed Ingestion
              </div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "3px" }}>
                Background sync across cs.LG, cs.AI, cs.CV with automated embedding updates.
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px", fontSize: "11px", color: "#94a3b8" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Icon name="clock" size={12} />
                  03:00 UTC
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Icon name="satellite" size={12} />
                  Daily Daemon
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Research Swarm Agents (2x2 Agent Cards with Task Progress) */}
        <div className="arl-card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
              Research Swarm
            </h3>
            <Link
              to="/research-team"
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#2563eb",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                textDecoration: "none",
              }}
            >
              <span>View all</span>
              <Icon name="arrow-right" size={11} color="#2563eb" />
            </Link>
          </div>

          <div className="arl-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {[
              {
                name: "Dr. Elena Vance",
                role: "Director Agent",
                tasks: "5/10 tasks done",
                initials: "EV",
                color: "#2563eb",
              },
              {
                name: "Hypothesis Synthesizer",
                role: "Idea Generation",
                tasks: "8/10 tasks done",
                initials: "HS",
                color: "#7c3aed",
              },
              {
                name: "Sandbox Executor",
                role: "Empirical Runner",
                tasks: "9/10 tasks done",
                initials: "SE",
                color: "#059669",
              },
              {
                name: "Reviewer Committee",
                role: "Critic Agent",
                tasks: "6/10 tasks done",
                initials: "RC",
                color: "#d97706",
              },
            ].map((member, i) => (
              <div
                key={i}
                style={{
                  padding: "16px",
                  borderRadius: "14px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    background: member.color,
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: "800",
                    boxShadow: `0 4px 10px ${member.color}33`,
                  }}
                >
                  {member.initials}
                </div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", marginTop: "2px" }}>
                  {member.name}
                </div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>
                  {member.role}
                </div>
                <div
                  style={{
                    marginTop: "6px",
                    padding: "3px 10px",
                    borderRadius: "9999px",
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#334155",
                  }}
                >
                  {member.tasks}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: 3D Glossy Blue Orb Copilot Card (Signature Feature from Reference Image) */}
        <div
          className="arl-card"
          style={{
            padding: "26px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            position: "relative",
            justifyContent: "space-between",
          }}
        >
          {/* Top 3D Glossy Glass Blue Orb */}
          <div style={{ padding: "12px 0 8px 0" }}>
            <div className="glossy-orb" />
          </div>

          {/* Heading */}
          <div>
            <h3 style={{ fontSize: "19px", fontWeight: "800", color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>
              Welcome, Researcher
            </h3>
            <p style={{ fontSize: "13.5px", color: "#475569", margin: "4px 0 0 0", fontWeight: "500" }}>
              What can I help with today?
            </p>
          </div>

          {/* Quick Action Pill Buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px", margin: "14px 0" }}>
            <Link
              to="/research-team"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                borderRadius: "9999px",
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
                fontSize: "11.5px",
                fontWeight: "600",
                color: "#334155",
                textDecoration: "none",
              }}
            >
              <Icon name="sparkles" size={12} color="#2563eb" />
              <span>Draft hypothesis</span>
            </Link>

            <Link
              to="/experiment-planner"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                borderRadius: "9999px",
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
                fontSize: "11.5px",
                fontWeight: "600",
                color: "#334155",
                textDecoration: "none",
              }}
            >
              <Icon name="experiment" size={12} color="#16a34a" />
              <span>Run benchmark</span>
            </Link>

            <Link
              to="/proposal"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                borderRadius: "9999px",
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
                fontSize: "11.5px",
                fontWeight: "600",
                color: "#334155",
                textDecoration: "none",
              }}
            >
              <Icon name="proposal" size={12} color="#9333ea" />
              <span>Export LaTeX</span>
            </Link>
          </div>

          {/* Interactive Chat Prompt Box */}
          <form
            onSubmit={handleCopilotSubmit}
            style={{
              width: "100%",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "12px",
              boxSizing: "border-box",
            }}
          >
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Ask research copilot anything..."
              maxLength={300}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                fontSize: "13px",
                color: "#0f172a",
                outline: "none",
                padding: "2px 0 8px 0",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "6px", borderTop: "1px solid #edf2f7" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  type="button"
                  title="Attach reference"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: "4px" }}
                >
                  <Icon name="paperclip" size={14} />
                </button>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                  GraphRAG enabled
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                  {promptInput.length}/300
                </span>
                <button
                  type="submit"
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "#2563eb",
                    border: "none",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(37, 99, 235, 0.3)",
                  }}
                >
                  <Icon name="send" size={12} color="#ffffff" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}