import { Link, useLocation } from "react-router-dom";

const navSections = [
  {
    title: "Lab Cockpit",
    items: [
      { name: "Dashboard", path: "/", icon: "📊" },
      { name: "Projects", path: "/projects", icon: "📁" },
      { name: "Research Cycle", path: "/research_cycle", icon: "🔄" },
    ]
  },
  {
    title: "AI & Agents",
    items: [
      { name: "Research Copilot", path: "/copilot", icon: "🚀" },
      { name: "Multi-Agent Team", path: "/research-team", icon: "🤖" },
      { name: "GraphRAG Chat", path: "/chat", icon: "💬" },
      { name: "Intelligence Hub", path: "/research-intelligence", icon: "🧠" },
    ]
  },
  {
    title: "Knowledge Graphs",
    items: [
      { name: "Visual Graph (2D)", path: "/graph", icon: "🌐" },
      { name: "Research Clusters", path: "/clusters", icon: "🔬" },
      { name: "Communities", path: "/communities", icon: "👥" },
      { name: "Neo4j Database", path: "/neo4j", icon: "⚡" },
      { name: "Author Network", path: "/authors", icon: "👨‍🔬" },
      { name: "Paper Timeline", path: "/timeline", icon: "📈" },
    ]
  },
  {
    title: "Lab Operations",
    items: [
      { name: "Paper Search & Ingest", path: "/search", icon: "🔍" },
      { name: "Research Gaps", path: "/gaps", icon: "🎯" },
      { name: "Experiment Planner", path: "/experiment-planner", icon: "🧪" },
      { name: "Proposal Generator", path: "/proposal", icon: "📄" },
      { name: "Writing Assistant", path: "/writing", icon: "✍️" },
      { name: "Lab Memory", path: "/memory", icon: "💾" },
    ]
  }
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside
      style={{
        width: "260px",
        minWidth: "260px",
        background: "#0c121e",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        zIndex: 50,
        userSelect: "none"
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: "20px 18px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            boxShadow: "0 0 15px rgba(99, 102, 241, 0.4)"
          }}
        >
          ⚛
        </div>
        <div>
          <div style={{ fontWeight: "700", fontSize: "15px", color: "#f8fafc", letterSpacing: "-0.01em" }}>
            Autonomous Lab
          </div>
          <div style={{ fontSize: "11px", color: "#06b6d4", fontWeight: "600", letterSpacing: "0.04em" }}>
            MULTI-AGENT AI v2.0
          </div>
        </div>
      </div>

      {/* Nav List */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 10px",
          display: "flex",
          flexDirection: "column",
          gap: "18px"
        }}
      >
        {navSections.map((section) => (
          <div key={section.title}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                padding: "0 12px 6px 12px"
              }}
            >
              {section.title}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
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
                      borderRadius: "8px",
                      color: isActive ? "#ffffff" : "#94a3b8",
                      background: isActive
                        ? "linear-gradient(90deg, rgba(59, 130, 246, 0.22) 0%, rgba(59, 130, 246, 0.08) 100%)"
                        : "transparent",
                      borderLeft: isActive ? "3px solid #3b82f6" : "3px solid transparent",
                      fontSize: "13.5px",
                      fontWeight: isActive ? "600" : "500",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span style={{ fontSize: "15px" }}>{item.icon}</span>
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
          padding: "14px 16px",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          background: "rgba(0, 0, 0, 0.2)",
          fontSize: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <span style={{ color: "#64748b" }}>Backend Engine</span>
        <span style={{ color: "#10b981", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#10b981" }}></span>
          Online
        </span>
      </div>
    </aside>
  );
}