import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ResearchGaps() {
  const [gaps, setGaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadGaps();
  }, []);

  async function loadGaps() {
    try {
      const res = await api.get("/gaps");
      setGaps(res.data.gaps || []);
    } catch {
      setGaps([]);
    }
    setLoading(false);
  }

  const handleInvestigateGap = (gap) => {
    const prompt = `Formulate an experiment addressing this research gap: "${gap.title}". Context: ${gap.reason}`;
    navigate(`/copilot?query=${encodeURIComponent(prompt)}`);
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "24px", color: "#f8fafc" }}>
          Automated Research Gap Identification
        </h1>
        <p style={{ fontSize: "14px", color: "#94a3b8" }}>
          Unexplored research opportunities, citation bottlenecks, and frontier spaces discovered from the Knowledge Graph.
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="arl-badge arl-badge-purple">
          {gaps.length} Actionable Research Gaps Identified
        </span>
      </div>

      {loading ? (
        <div className="arl-card" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
          Analyzing graph density and identifying frontier bottlenecks...
        </div>
      ) : gaps.length === 0 ? (
        <div className="arl-card" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
          No research gaps currently detected. Ingest more papers to enrich graph connectivity.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {gaps.map((gap, index) => (
            <div
              key={index}
              className="arl-card"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                borderLeft: "4px solid #a855f7",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                <div>
                  <h3 style={{ fontSize: "17px", color: "#f8fafc", margin: 0 }}>
                    {gap.title || "Untitled Frontier Paper"}
                  </h3>
                  <div style={{ fontSize: "13px", color: "#34d399", marginTop: "4px" }}>
                    Authors: {(gap.authors || []).join(", ") || "Unknown"}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <span className="arl-badge arl-badge-blue">
                    {gap.published || "2024"}
                  </span>
                  <span className="arl-badge arl-badge-amber">
                    {gap.citations || 0} citations
                  </span>
                </div>
              </div>

              {gap.reason && (
                <div
                  style={{
                    background: "rgba(168, 85, 247, 0.08)",
                    border: "1px solid rgba(168, 85, 247, 0.2)",
                    borderRadius: "8px",
                    padding: "14px",
                  }}
                >
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "#c084fc", textTransform: "uppercase" }}>
                    💡 Why this is an open research opportunity
                  </div>
                  <p style={{ fontSize: "13.5px", color: "#e2e8f0", marginTop: "4px", lineHeight: "1.5" }}>
                    {gap.reason}
                  </p>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                  paddingTop: "12px",
                }}
              >
                <div style={{ fontSize: "12px", color: "#64748b" }}>
                  Paper ID: {gap.paper_id} • Lineage Score: {gap.lineage || 1}
                </div>

                <button
                  onClick={() => handleInvestigateGap(gap)}
                  style={{
                    padding: "6px 14px",
                    background: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  🚀 Investigate with Copilot
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}