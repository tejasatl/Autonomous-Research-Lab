import { useEffect, useState } from "react";
import api from "../services/api";

export default function Profile() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    role: "Lead Investigator",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({
        username: payload.sub || payload.username || "Researcher",
        email: payload.email || `${payload.sub || "researcher"}@lab.org`,
        role: payload.role || "Lead Investigator",
      });
    } catch {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "24px", color: "#f8fafc" }}>
          Researcher Profile & Credentials
        </h1>
        <p style={{ fontSize: "14px", color: "#94a3b8" }}>
          Manage your session, authorized agent workspaces, and lab access roles.
        </p>
      </div>

      <div className="arl-card" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* User Identity Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "20px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
              boxShadow: "0 0 20px rgba(59, 130, 246, 0.35)",
            }}
          >
            👤
          </div>
          <div>
            <h2 style={{ fontSize: "20px", color: "#f8fafc", margin: 0 }}>
              {user.username}
            </h2>
            <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
              <span className="arl-badge arl-badge-blue">{user.role}</span>
              <span className="arl-badge arl-badge-green">Session Active</span>
            </div>
          </div>
        </div>

        {/* Credentials Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
            <span style={{ color: "#94a3b8", fontSize: "13.5px" }}>Registered Identifier</span>
            <span style={{ color: "#f8fafc", fontWeight: "600", fontSize: "13.5px" }}>{user.username}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
            <span style={{ color: "#94a3b8", fontSize: "13.5px" }}>Contact Email</span>
            <span style={{ color: "#60a5fa", fontSize: "13.5px" }}>{user.email}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
            <span style={{ color: "#94a3b8", fontSize: "13.5px" }}>Lab Security Clearance</span>
            <span style={{ color: "#34d399", fontWeight: "600", fontSize: "13.5px" }}>Full Autonomous Execution</span>
          </div>
        </div>

        {/* Enabled Modules */}
        <div>
          <h3 style={{ fontSize: "15px", color: "#f8fafc", marginBottom: "12px" }}>
            Authorized Discovery Subsystems
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
            {[
              "Multi-Agent Swarm Coordinator",
              "GraphRAG Hybrid Semantic Retrieval",
              "Automated LaTeX Proposal Synthesis",
              "PyMuPDF ArXiv Ingestion Pipeline",
              "Interactive 2D Force Knowledge Graph",
              "Autonomous 5-Stage Research Cycle",
            ].map((mod, i) => (
              <div
                key={i}
                style={{
                  padding: "10px 14px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "8px",
                  fontSize: "12.5px",
                  color: "#cbd5e1",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ color: "#10b981" }}>✓</span> {mod}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "16px" }}>
          <button
            onClick={logout}
            style={{
              padding: "12px 24px",
              background: "rgba(239, 68, 68, 0.15)",
              color: "#f87171",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Sign Out of Lab Session
          </button>
        </div>
      </div>
    </div>
  );
}