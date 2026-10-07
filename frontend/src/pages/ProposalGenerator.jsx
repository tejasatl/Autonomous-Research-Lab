import { useState } from "react";
import api from "../services/api";

const TOPIC_SUGGESTIONS = [
  "Edge AI Optimization for Real-Time Robotics",
  "Graph Neural Networks for Scientific Literature Discovery",
  "Frugal Quantization of Large Multi-Modal Models",
  "Multi-Agent Consensus for Drug Discovery Pipelines",
];

export default function ProposalGenerator() {
  const [topic, setTopic] = useState("");
  const [proposal, setProposal] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateProposal = async (selectedTopic) => {
    const topicToUse = selectedTopic !== undefined ? selectedTopic : topic;
    setLoading(true);
    setCopied(false);

    try {
      const res = await api.get("/proposal", {
        params: topicToUse ? { topic: topicToUse } : {},
      });

      setProposal(
        typeof res.data.proposal === "string"
          ? res.data.proposal
          : JSON.stringify(res.data.proposal, null, 2)
      );
    } catch {
      alert("Unable to generate proposal. Please ensure the backend is running.");
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (!proposal) return;
    navigator.clipboard.writeText(proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadLatex = () => {
    window.open(`${api.defaults.baseURL}/proposal/download/latex`, "_blank");
  };

  const downloadMarkdown = () => {
    window.open(`${api.defaults.baseURL}/proposal/download/md`, "_blank");
  };

  const downloadPDF = () => {
    window.open(`${api.defaults.baseURL}/proposal/download/pdf`, "_blank");
  };

  return (
    <div style={{ maxWidth: "1050px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "24px", color: "#f8fafc" }}>
          Automated Grant & Paper Proposal Studio
        </h1>
        <p style={{ fontSize: "14px", color: "#94a3b8" }}>
          Synthesize publication-grade research proposals with multi-agent reasoning, citations, and exportable LaTeX templates.
        </p>
      </div>

      {/* Input Control Card */}
      <div className="arl-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={{ fontSize: "13px", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>
            Research Topic or Problem Formulation (Optional)
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Energy-efficient speculative decoding on mobile devices..."
              style={{ flex: 1, padding: "12px 16px" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") generateProposal();
              }}
            />
            <button
              onClick={() => generateProposal()}
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
              {loading ? "Synthesizing..." : "Generate Proposal"}
            </button>
          </div>
        </div>

        {/* Suggested Topics */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "#64748b" }}>Suggestions:</span>
          {TOPIC_SUGGESTIONS.map((t, i) => (
            <button
              key={i}
              onClick={() => {
                setTopic(t);
                generateProposal(t);
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

      {/* Output Actions Bar */}
      {proposal && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={copyToClipboard}
              style={{
                padding: "8px 16px",
                background: copied ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: copied ? "#34d399" : "#f8fafc",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "500",
              }}
            >
              {copied ? "✓ Copied!" : "📋 Copy Proposal"}
            </button>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={downloadLatex}
              style={{
                padding: "8px 16px",
                background: "rgba(99, 102, 241, 0.15)",
                border: "1px solid rgba(99, 102, 241, 0.4)",
                color: "#a5b4fc",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              ⚡ Export LaTeX (.tex)
            </button>
            <button
              onClick={downloadMarkdown}
              style={{
                padding: "8px 16px",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#cbd5e1",
                borderRadius: "8px",
                fontSize: "13px",
              }}
            >
              📄 Markdown (.md)
            </button>
            <button
              onClick={downloadPDF}
              style={{
                padding: "8px 16px",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#cbd5e1",
                borderRadius: "8px",
                fontSize: "13px",
              }}
            >
              📕 Download PDF
            </button>
          </div>
        </div>
      )}

      {/* Proposal Render Canvas */}
      {proposal ? (
        <div className="arl-card" style={{ padding: "30px", background: "#0c1322" }}>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontSize: "14px",
              lineHeight: "1.7",
              color: "#e2e8f0",
              border: "none",
              padding: 0,
              background: "transparent !important",
            }}
          >
            {proposal}
          </pre>
        </div>
      ) : (
        !loading && (
          <div
            className="arl-card"
            style={{
              textAlign: "center",
              padding: "50px",
              color: "#94a3b8",
            }}
          >
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>📝</div>
            <h3>Ready to Generate Grant Proposal</h3>
            <p style={{ marginTop: "6px", fontSize: "14px" }}>
              Enter a research focus or click one of the suggestions above. The Multi-Agent team will structure background, methodology, hypotheses, and evaluation protocols.
            </p>
          </div>
        )
      )}

      {loading && (
        <div
          className="arl-card"
          style={{
            textAlign: "center",
            padding: "50px",
            color: "#94a3b8",
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>⚙️</div>
          <h3>Synthesizing Publication Proposal...</h3>
          <p style={{ marginTop: "6px", fontSize: "14px" }}>
            Querying literature, formulating falsifiable hypothesis, and compiling LaTeX structure.
          </p>
        </div>
      )}
    </div>
  );
}