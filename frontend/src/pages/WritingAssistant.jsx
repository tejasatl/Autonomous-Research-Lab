import { useState } from "react";
import api from "../services/api";

const SECTIONS = [
  "Abstract",
  "Introduction",
  "Related Work",
  "Methodology",
  "Experiments & Baselines",
  "Discussion & Broader Impact",
  "Conclusion",
];

const PRESET_TOPICS = [
  "Frugal Quantization for Large Vision-Language Models",
  "Decentralized Federated Learning on Mobile Edge Devices",
  "Graph Neural Networks for Causal Inference in Genomics",
];

export default function WritingAssistant() {
  const [section, setSection] = useState("Abstract");
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generate(selectedTopic) {
    const topicToUse = selectedTopic || topic;
    if (!topicToUse.trim()) {
      alert("Please provide a research topic or paper title.");
      return;
    }

    setLoading(true);
    setCopied(false);

    try {
      const res = await api.get("/writing", {
        params: {
          topic: topicToUse,
          section: section,
        },
      });

      setResult(
        typeof res.data?.output === "string"
          ? res.data.output
          : JSON.stringify(res.data?.output || res.data, null, 2)
      );
    } catch {
      setResult("⚠️ Unable to generate academic section. Check backend connection.");
    }

    setLoading(false);
  }

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: "1050px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "24px", color: "#f8fafc" }}>
          Academic Section Writing Assistant
        </h1>
        <p style={{ fontSize: "14px", color: "#94a3b8" }}>
          Draft publication-ready manuscript sections using your Knowledge Graph citations, rigor standards, and formal academic phrasing.
        </p>
      </div>

      {/* Control Card */}
      <div className="arl-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Section Picker Pills */}
        <div>
          <label style={{ fontSize: "12.5px", color: "#cbd5e1", display: "block", marginBottom: "8px" }}>
            Target Paper Section
          </label>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {SECTIONS.map((sec) => (
              <button
                key={sec}
                onClick={() => setSection(sec)}
                style={{
                  padding: "6px 14px",
                  background: section === sec ? "#3b82f6" : "rgba(255, 255, 255, 0.05)",
                  border: section === sec ? "1px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "13px",
                  fontWeight: section === sec ? "600" : "500",
                  cursor: "pointer",
                }}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Input */}
        <div>
          <label style={{ fontSize: "12.5px", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>
            Research Topic & Context
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Memory-efficient attention for streaming video transformers..."
              style={{ flex: 1, padding: "12px 16px" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") generate();
              }}
            />
            <button
              onClick={() => generate()}
              disabled={loading}
              style={{
                padding: "12px 24px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              {loading ? "Composing..." : `Draft ${section}`}
            </button>
          </div>
        </div>

        {/* Preset Suggestions */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "#64748b" }}>Quick Topics:</span>
          {PRESET_TOPICS.map((t, i) => (
            <button
              key={i}
              onClick={() => {
                setTopic(t);
                generate(t);
              }}
              style={{
                padding: "4px 10px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#94a3b8",
                borderRadius: "6px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Result Section */}
      {result && (
        <div className="arl-card" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="arl-badge arl-badge-green">
              Drafted: {section}
            </span>

            <button
              onClick={copyToClipboard}
              style={{
                padding: "6px 14px",
                background: copied ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: copied ? "#34d399" : "#f8fafc",
                borderRadius: "6px",
                fontSize: "12.5px",
                cursor: "pointer",
              }}
            >
              {copied ? "✓ Copied to Clipboard" : "📋 Copy Section"}
            </button>
          </div>

          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontSize: "14px",
              lineHeight: "1.7",
              color: "#e2e8f0",
              padding: "16px",
            }}
          >
            {result}
          </pre>
        </div>
      )}

      {loading && (
        <div className="arl-card" style={{ textAlign: "center", padding: "50px", color: "#94a3b8" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>✍️</div>
          <h3>Synthesizing Academic {section}...</h3>
          <p style={{ marginTop: "4px", fontSize: "14px" }}>
            Synthesizing literature terminology, theoretical motivation, and rigorous academic prose.
          </p>
        </div>
      )}
    </div>
  );
}