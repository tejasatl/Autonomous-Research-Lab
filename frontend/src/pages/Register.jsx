import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const register = async (e) => {
    if (e) e.preventDefault();
    setMessage("");
    setError("");

    if (!username || !email || !password) {
      setError("Please fill all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/register", {
        username,
        email,
        password,
      });

      setMessage("Account created! Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.detail || "Registration failed.");
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
          width: "440px",
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
              background: "linear-gradient(135deg, #10b981, #06b6d4)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              marginBottom: "12px",
              boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)",
            }}
          >
            🧪
          </div>
          <h1 style={{ fontSize: "22px", color: "#f8fafc" }}>
            Join the Research Lab
          </h1>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
            Create your researcher profile & workspace
          </p>
        </div>

        <form onSubmit={register} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "12.5px", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>
              Username
            </label>
            <input
              placeholder="e.g. dr_smith"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: "100%", padding: "10px 14px" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "12.5px", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="researcher@lab.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "10px 14px" }}
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
              style={{ width: "100%", padding: "10px 14px" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "12.5px", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "10px 14px" }}
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

          {message && (
            <div
              style={{
                padding: "10px 14px",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: "8px",
                color: "#34d399",
                fontSize: "12.5px",
              }}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px",
              background: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
              marginTop: "8px",
            }}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "13px", color: "#94a3b8" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#60a5fa", fontWeight: "600" }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}