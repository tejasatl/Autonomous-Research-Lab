import React from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "./Icons";

const navSections = [
  {
    title: "Lab Cockpit",
    items: [
      { name: "Dashboard", path: "/", iconKey: "dashboard" },
      { name: "Projects", path: "/projects", iconKey: "projects" },
      { name: "Research Cycle", path: "/research_cycle", iconKey: "cycle" },
    ]
  },
  {
    title: "AI & Agents",
    items: [
      { name: "Research Copilot", path: "/copilot", iconKey: "copilot" },
      { name: "Multi-Agent Team", path: "/research-team", iconKey: "team" },
      { name: "GraphRAG Chat", path: "/chat", iconKey: "chat" },
      { name: "Intelligence Hub", path: "/research-intelligence", iconKey: "intelligence" },
    ]
  },
  {
    title: "Knowledge Graphs",
    items: [
      { name: "Visual Graph (2D)", path: "/graph", iconKey: "graph" },
      { name: "Research Clusters", path: "/clusters", iconKey: "clusters" },
      { name: "Communities", path: "/communities", iconKey: "communities" },
      { name: "Neo4j Database", path: "/neo4j", iconKey: "database" },
      { name: "Author Network", path: "/authors", iconKey: "authors" },
      { name: "Paper Timeline", path: "/timeline", iconKey: "timeline" },
    ]
  },
  {
    title: "Lab Operations",
    items: [
      { name: "Paper Search & Ingest", path: "/search", iconKey: "search" },
      { name: "Research Gaps", path: "/gaps", iconKey: "gaps" },
      { name: "Experiment Planner", path: "/experiment-planner", iconKey: "experiment" },
      { name: "Proposal Generator", path: "/proposal", iconKey: "proposal" },
      { name: "Writing Assistant", path: "/writing", iconKey: "writing" },
      { name: "Lab Memory", path: "/memory", iconKey: "memory" },
    ]
  }
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside
      style={{
        width: "256px",
        minWidth: "256px",
        background: "#ffffff",
        borderRight: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        userSelect: "none",
        boxShadow: "2px 0 16px rgba(15, 23, 42, 0.02)",
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: "22px 20px 18px 20px",
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
            color: "#ffffff",
          }}
        >
          <Icon name="sparkles" size={20} color="#ffffff" strokeWidth={2} />
        </div>
        <div>
          <div style={{ fontWeight: "700", fontSize: "15px", color: "#0f172a", letterSpacing: "-0.01em" }}>
            Autonomous Lab
          </div>
          <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", letterSpacing: "0.04em" }}>
            RESEARCH OS v2.4
          </div>
        </div>
      </div>

      {/* Nav List */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        {navSections.map((section) => (
          <div key={section.title}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                padding: "0 10px 6px 10px",
              }}
            >
              {section.title}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      color: isActive ? "#2563eb" : "#475569",
                      background: isActive ? "#eff6ff" : "transparent",
                      border: isActive ? "1px solid #dbeafe" : "1px solid transparent",
                      fontSize: "13.5px",
                      fontWeight: isActive ? "600" : "500",
                      textDecoration: "none",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Icon
                      name={item.iconKey}
                      size={16}
                      color={isActive ? "#2563eb" : "#64748b"}
                      strokeWidth={isActive ? 2.1 : 1.8}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div
        style={{
          padding: "14px 18px",
          borderTop: "1px solid #f1f5f9",
          background: "#fafbfd",
          fontSize: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ color: "#64748b", fontWeight: "500" }}>System Core</span>
        <span style={{ color: "#059669", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 6px rgba(16, 185, 129, 0.5)",
            }}
          />
          Online
        </span>
      </div>
    </aside>
  );
}
