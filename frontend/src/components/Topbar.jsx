import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../services/api";
import Icon from "./Icons";

export default function Topbar({ onToggleSidebar }) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [systemStatus, setSystemStatus] = useState(null);
  const [llmInfo, setLlmInfo] = useState(null);
  const [showLlmModal, setShowLlmModal] = useState(false);
  const [selectedBackend, setSelectedBackend] = useState("gemini");
  const [selectedModel, setSelectedModel] = useState("");
  const [customKey, setCustomKey] = useState("");
  const [switching, setSwitching] = useState(false);
  const [switchMessage, setSwitchMessage] = useState(null);

  let username = "";
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      username = payload.sub || payload.username || "Lead Researcher";
    } catch {
      username = "Lead Researcher";
    }
  }

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = () => {
    Promise.allSettled([
      api.get("/system_status"),
      api.get("/llm/status"),
    ]).then(([sysRes, llmRes]) => {
      if (sysRes.status === "fulfilled" && sysRes.value.data) {
        setSystemStatus(sysRes.value.data);
      }
      if (llmRes.status === "fulfilled" && llmRes.value.data) {
        setLlmInfo(llmRes.value.data);
        setSelectedBackend(llmRes.value.data.current_backend);
        setSelectedModel(llmRes.value.data.current_model);
      }
    });
  };

  const handleSwitchLlm = async (e) => {
    e.preventDefault();
    setSwitching(true);
    setSwitchMessage(null);

    try {
      const payload = {
        backend: selectedBackend,
        model: selectedModel || undefined,
        api_key: customKey.trim() || undefined,
      };
      const res = await api.post("/llm/switch", payload);
      setSwitchMessage({ type: "success", text: res.data.message || "LLM switched successfully!" });
      loadStatus();
      setTimeout(() => {
        setShowLlmModal(false);
        setSwitchMessage(null);
      }, 1500);
    } catch (err) {
      setSwitchMessage({
        type: "error",
        text: err.response?.data?.detail || "Failed to switch LLM backend.",
      });
    }
    setSwitching(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const pageTitle = () => {
    const p = location.pathname;
    if (p === "/" || p === "/dashboard") return "Research Cockpit";
    if (p === "/projects") return "Research Projects Workspace";
    if (p === "/research_cycle") return "Autonomous 5-Stage Research Cycle";
    if (p === "/copilot") return "AI Research Copilot";
    if (p === "/research-team") return "Multi-Agent Research Swarm";
    if (p === "/chat") return "GraphRAG Conversational Chat";
    if (p === "/research-intelligence") return "Research Topic Intelligence";
    if (p === "/graph") return "Interactive Knowledge Graph";
    if (p === "/clusters") return "Topic Clusters & Graph Topology";
    if (p === "/communities") return "Network Communities & Modularity";
    if (p === "/neo4j") return "Neo4j Graph Database Explorer";
    if (p === "/authors") return "Author Collaboration Networks";
    if (p === "/timeline") return "Publication & Citation Timeline";
    if (p === "/search") return "Literature Search & Graph Ingestion";
    if (p === "/gaps") return "Automated Research Gap Identification";
    if (p === "/experiment-planner") return "Experiment & Compute Planner";
    if (p === "/proposal") return "Automated Grant & Paper Proposal Generator";
    if (p === "/writing") return "Academic Section Writing Assistant";
    if (p === "/memory") return "Lab Long-Term Vector Memory";
    if (p === "/profile") return "User Profile & Settings";
    return "Autonomous Research Lab";
  };

  return (
    <>
      <header
        className="arl-topbar"
        style={{
          background: "#ffffff",
          padding: "16px 28px",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={onToggleSidebar}
            className="arl-mobile-menu-btn"
            aria-label="Open Navigation"
            title="Menu"
          >
            <Icon name="menu" size={19} color="#0f172a" strokeWidth={2} />
          </button>
          <h1
            className="arl-topbar-title"
            style={{ fontSize: "17px", fontWeight: "700", color: "#0f172a", margin: 0, letterSpacing: "-0.01em" }}
          >
            {pageTitle()}
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Interactive LLM Selector Button */}
          <button
            onClick={() => setShowLlmModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 14px",
              borderRadius: "9999px",
              background: "#f1f5f9",
              border: "1px solid #e2e8f0",
              fontSize: "12.5px",
              color: "#1e293b",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            title="Click to change active LLM provider and model"
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#10b981",
              }}
            />
            <span style={{ fontWeight: "600" }}>
              Engine: {llmInfo?.name || systemStatus?.llm_backend?.toUpperCase() || "GEMINI"}
            </span>
            <Icon name="chevron-down" size={12} color="#64748b" />
          </button>

          {/* User Account Controls */}
          {token ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Link
                to="/profile"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "6px 14px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "9999px",
                  color: "#334155",
                  fontSize: "12.5px",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                <Icon name="user" size={14} color="#64748b" />
                <span>{username}</span>
              </Link>

              <button
                onClick={logout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "6px 12px",
                  background: "#fff1f2",
                  color: "#e11d48",
                  border: "1px solid #fecdd3",
                  borderRadius: "9999px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                <Icon name="log-out" size={13} color="#e11d48" />
                <span>Sign out</span>
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Link
                to="/login"
                style={{
                  padding: "7px 16px",
                  background: "#2563eb",
                  color: "white",
                  borderRadius: "9999px",
                  fontSize: "12.5px",
                  fontWeight: "600",
                  textDecoration: "none",
                  boxShadow: "0 2px 8px rgba(37, 99, 235, 0.2)",
                }}
              >
                Sign in
              </Link>
              <Link
                to="/register"
                style={{
                  padding: "7px 16px",
                  background: "#ffffff",
                  color: "#334155",
                  border: "1px solid #cbd5e1",
                  borderRadius: "9999px",
                  fontSize: "12.5px",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* LLM Switcher Modal */}
      {showLlmModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            className="arl-card"
            style={{
              width: "100%",
              maxWidth: "520px",
              padding: "28px",
              background: "#ffffff",
              boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
              borderRadius: "20px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Icon name="sparkles" size={18} color="#2563eb" />
                <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                  Active LLM Engine Provider
                </h2>
              </div>
              <button
                onClick={() => setShowLlmModal(false)}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#64748b",
                  cursor: "pointer",
                }}
              >
                <Icon name="x" size={14} />
              </button>
            </div>
            <p style={{ fontSize: "13px", color: "#64748b", marginTop: "6px" }}>
              Select which AI foundation model powers the research agent swarm, GraphRAG queries, and empirical synthesis.
            </p>

            <form onSubmit={handleSwitchLlm} style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Providers Grid */}
              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "8px" }}>
                  Foundation Model Provider
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {(llmInfo?.supported_backends || [
                    { id: "gemini", name: "Google Gemini" },
                    { id: "local", name: "Local Ollama" },
                    { id: "groq", name: "Groq Cloud" },
                    { id: "openai", name: "OpenAI" },
                  ]).map((provider) => {
                    const isSelected = selectedBackend === provider.id;
                    return (
                      <button
                        type="button"
                        key={provider.id}
                        onClick={() => {
                          setSelectedBackend(provider.id);
                          setSelectedModel(provider.default_model || "");
                        }}
                        style={{
                          padding: "12px 14px",
                          borderRadius: "12px",
                          border: isSelected ? "2px solid #2563eb" : "1px solid #e2e8f0",
                          background: isSelected ? "#eff6ff" : "#f8fafc",
                          color: isSelected ? "#1d4ed8" : "#334155",
                          fontWeight: isSelected ? "700" : "500",
                          fontSize: "13px",
                          textAlign: "left",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span>{provider.name}</span>
                          {isSelected && <Icon name="check" size={14} color="#2563eb" strokeWidth={2.5} />}
                        </div>
                        <div style={{ fontSize: "11px", color: isSelected ? "#3b82f6" : "#94a3b8", marginTop: "3px" }}>
                          {provider.default_model || provider.id}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Model selection */}
              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "6px" }}>
                  Model Version / Checkpoint Identifier
                </label>
                <input
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  placeholder="e.g. gemini-2.5-flash or llama3"
                  style={{ width: "100%", padding: "10px 14px" }}
                />
              </div>

              {/* Custom API Key input if needed */}
              {selectedBackend !== "local" && (
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "6px" }}>
                    API Key (Optional override - leave blank to use configured environment)
                  </label>
                  <input
                    type="password"
                    value={customKey}
                    onChange={(e) => setCustomKey(e.target.value)}
                    placeholder="Enter custom API key..."
                    style={{ width: "100%", padding: "10px 14px" }}
                  />
                </div>
              )}

              {switchMessage && (
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "10px",
                    background: switchMessage.type === "success" ? "#ecfdf5" : "#fff1f2",
                    color: switchMessage.type === "success" ? "#065f46" : "#9f1239",
                    fontSize: "13px",
                    fontWeight: "500",
                    border: switchMessage.type === "success" ? "1px solid #a7f3d0" : "1px solid #fecdd3",
                  }}
                >
                  {switchMessage.text}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "6px" }}>
                <button
                  type="button"
                  onClick={() => setShowLlmModal(false)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "9999px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#475569",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={switching}
                  style={{
                    padding: "8px 22px",
                    borderRadius: "9999px",
                    border: "none",
                    background: "#2563eb",
                    color: "white",
                    fontWeight: "600",
                    cursor: switching ? "not-allowed" : "pointer",
                    fontSize: "13px",
                    boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)",
                  }}
                >
                  {switching ? "Switching..." : "Apply Engine"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
