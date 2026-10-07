import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

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
        background: "radial-gradient(ellipse at top, #111a2f, #090d16)",
        padding: "20px",
      }}
    >
      <div
        className="arl-card"
        style={{
          width: "420px",
          maxWidth: "100%",
          padding: "36px",
          background: "#101726",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              marginBottom: "12px",
              boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
            }}
          >
            ⚛
          </div>
          <h1 style={{ fontSize: "22px", color: "#f8fafc" }}>
            Sign In to Autonomous Lab
          </h1>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
            Autonomous Multi-Agent AI Scientific Discovery Platform
          </p>
        </div>

        <form onSubmit={login} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "12.5px", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>
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
            <label style={{ fontSize: "12.5px", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>
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