import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Icon from "../components/Icons";
import ProjectLogo from "../components/ProjectLogo";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/login", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.access_token);
      window.location.href = "/";
    } catch (err) {
      if (err.response) {
        setError(err.response.data.detail || "Invalid username or password.");
      } else {
        setError("Cannot connect to research backend server.");
      }
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "var(--bg-app, #e9edf2)",
        padding: "20px",
      }}
    >
      <div
        className="arl-card"
        style={{
          width: "420px",
          maxWidth: "100%",
          padding: "36px",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ display: "inline-flex", marginBottom: "12px" }}>
            <ProjectLogo size={46} />
          </div>
          <h1 style={{ fontSize: "22px", color: "#0f172a", fontWeight: "700" }}>
            Sign In to Autonomous Lab
          </h1>
          <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
            Autonomous Multi-Agent AI Scientific Discovery Platform
          </p>
        </div>

        <form onSubmit={login} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "12.5px", color: "#334155", display: "block", marginBottom: "6px" }}>
              Username or Email
            </label>
            <input
              placeholder="e.g. researcher1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "11px 14px",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "12.5px", color: "#334155", display: "block", marginBottom: "6px" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "11px 14px",
              }}
            />
          </div>

          {error && (
            <div
              style={{
                padding: "10px 14px",
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "8px",
                color: "#f87171",
                fontSize: "12.5px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
              marginTop: "8px",
            }}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "13px", color: "#94a3b8" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#60a5fa", fontWeight: "600" }}>
            Register new account
          </Link>
        </div>
      </div>
    </div>
  );
}