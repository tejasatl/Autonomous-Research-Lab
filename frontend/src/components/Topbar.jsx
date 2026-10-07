import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../services/api";

export default function Topbar() {
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
      username = payload.sub || payload.username || "Researcher";
    } catch {
      username = "Researcher";
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
    if (p === "/" || p === "/dashboard") return "Research Cockpit Dashboard";
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
        style={{
          background: "#0c121e",
          padding: "14px 28px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#f8fafc", margin: 0 }}>
            {pageTitle()}
          </h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Interactive LLM Selector Button */}
          <button
            onClick={() => setShowLlmModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "20px",
              background: "rgba(59, 130, 246, 0.12)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              fontSize: "12.5px",
              color: "#93c5fd",
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
                boxShadow: "0 0 6px #10b981",
              }}
            />
            <span style={{ fontWeight: "600" }}>
              🤖 LLM: {llmInfo?.name || systemStatus?.llm_backend?.toUpperCase() || "GEMINI"} ▾
            </span>
          </button>

          {/* User Account Controls */}
          {token ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link
                to="/profile"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  color: "#e2e8f0",
                  fontSize: "13px",
                  fontWeight: "500",
                  textDecoration: "none",
                }}
              >
                <span>👤</span>
                <span>{username}</span>
              </Link>

              <button
                onClick={logout}
                style={{
                  padding: "6px 12px",
                  background: "rgba(239, 68, 68, 0.15)",
                  color: "#f87171",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link
                to="/login"
                style={{
                  padding: "6px 14px",
                  background: "#3b82f6",
                  color: "white",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                Sign in
              </Link>
              <Link
                to="/register"
                style={{
                  padding: "6px 14px",
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "#e2e8f0",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "500",
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
            background: "rgba(0, 0, 0, 0.75)",
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
              background: "#101726",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "18px", color: "#f8fafc", margin: 0 }}>
                ⚡ Switch Active LLM Provider
              </h2>
              <button
                onClick={() => setShowLlmModal(false)}
                style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "18px", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
              Select which AI model powers your multi-agent swarm, GraphRAG queries, and synthesis.
            </p>

            <form onSubmit={handleSwitchLlm} style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Providers Grid */}
              <div>
                <label style={{ fontSize: "12.5px", color: "#cbd5e1", display: "block", marginBottom: "8px" }}>
                  LLM Provider Backend
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
                          padding: "12px",
                          borderRadius: "8px",
                          border: isSelected ? "2px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.1)",
                          background: isSelected ? "rgba(59, 130, 246, 0.15)" : "rgba(255, 255, 255, 0.03)",
                          color: isSelected ? "#93c5fd" : "#cbd5e1",
                          fontWeight: isSelected ? "600" : "500",
                          fontSize: "13px",
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                      >
                        <div>{provider.name}</div>
                        <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                          {provider.default_model || provider.id}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Model selection */}
              <div>
                <label style={{ fontSize: "12.5px", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>
                  Model Version / Tag
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
                  <label style={{ fontSize: "12.5px", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>
                    API Key (Optional override - leave blank to use .env)
                  </label>
                  <input
                    type="password"
                    value={customKey}
                    onChange={(e) => setCustomKey(e.target.value)}
                    placeholder="Enter custom key or leave blank..."
                    style={{ width: "100%", padding: "10px 14px" }}
                  />
                </div>
              )}

              {switchMessage && (
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    background: switchMessage.type === "success" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                    color: switchMessage.type === "success" ? "#34d399" : "#f87171",
                    fontSize: "13px",
                  }}
                >
                  {switchMessage.text}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setShowLlmModal(false)}
                  style={{
                    padding: "9px 18px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "#cbd5e1",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={switching}
                  style={{
                    padding: "9px 22px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#3b82f6",
                    color: "white",
                    fontWeight: "600",
                    cursor: switching ? "not-allowed" : "pointer",
                    fontSize: "13px",
                  }}
                >
                  {switching ? "Switching..." : "Apply LLM"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}