import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ResearchGaps() {
  const [gaps, setGaps] = useState([]);
  const [frontiers, setFrontiers] = useState([]);
  const [frontierMeta, setFrontierMeta] = useState(null);
  const [activeTab, setActiveTab] = useState("frontiers"); // 'frontiers' | 'bottlenecks'
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [gapsRes, frontiersRes] = await Promise.allSettled([
        api.get("/gaps"),
        api.get("/graph/frontiers")
      ]);

      if (gapsRes.status === "fulfilled" && gapsRes.value.data) {
        setGaps(gapsRes.value.data.gaps || []);
      }
      if (frontiersRes.status === "fulfilled" && frontiersRes.value.data) {
        setFrontiers(frontiersRes.value.data.frontiers || []);
        setFrontierMeta(frontiersRes.value.data);
      }
    } catch {
      setGaps([]);
      setFrontiers([]);
    }
    setLoading(false);
  }

  const handleInvestigateHypothesis = (hypothesis) => {
    const prompt = `Formulate a rigorous experimental research proposal addressing this topological gap: ${hypothesis}`;
    navigate(`/copilot?query=${encodeURIComponent(prompt)}`);
  };

  return (
    <div style={{ maxWidth: "1150px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "24px", color: "#f8fafc" }}>
          Topological Gap Discovery & Research Frontiers
        </h1>
        <p style={{ fontSize: "14px", color: "#94a3b8" }}>
          Unexplored cross-disciplinary opportunities discovered via Graph Link Prediction (Adamic-Adar, Jaccard Index) and citation topology bottlenecks.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "12px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setActiveTab("frontiers")}
            className={`arl-tab-btn ${activeTab === "frontiers" ? "active" : ""}`}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              background: activeTab === "frontiers" ? "#3b82f6" : "rgba(255,255,255,0.05)",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "13px"
            }}
          >
            🔬 Topological Link Frontiers ({frontiers.length})
          </button>
          <button
            onClick={() => setActiveTab("bottlenecks")}
            className={`arl-tab-btn ${activeTab === "bottlenecks" ? "active" : ""}`}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              background: activeTab === "bottlenecks" ? "#3b82f6" : "rgba(255,255,255,0.05)",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "13px"
            }}
          >
            📉 Citation Bottleneck Papers ({gaps.length})
          </button>
        </div>

        {frontierMeta && (
          <div style={{ fontSize: "12px", color: "#94a3b8", display: "flex", gap: "12px" }}>
            <span>Graph Nodes: <strong style={{ color: "#38bdf8" }}>{frontierMeta.total_nodes}</strong></span>
            <span>Edges: <strong style={{ color: "#38bdf8" }}>{frontierMeta.total_edges}</strong></span>
            <span>Density: <strong style={{ color: "#34d399" }}>{frontierMeta.graph_density}</strong></span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="arl-card" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
          Computing topological Adamic-Adar link predictions across Knowledge Graph...
        </div>
      ) : activeTab === "frontiers" ? (
        /* Topological Frontiers View */
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {frontiers.length === 0 ? (
            <div className="arl-card" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
              No topological frontiers computed yet. Ingest more papers to enrich graph topology.
            </div>
          ) : (
            frontiers.map((f, idx) => (
              <div
                key={idx}
                className="arl-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  borderLeft: "4px solid #38bdf8",
                  background: "rgba(15, 23, 42, 0.65)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="arl-badge arl-badge-blue">{f.source_type}</span>
                      <strong style={{ fontSize: "16px", color: "#f8fafc" }}>{f.source_name}</strong>
                      <span style={{ color: "#94a3b8" }}>⟷</span>
                      <span className="arl-badge arl-badge-purple">{f.target_type}</span>
                      <strong style={{ fontSize: "16px", color: "#f8fafc" }}>{f.target_name}</strong>
                    </div>
                    {f.shared_intermediaries && f.shared_intermediaries.length > 0 && (
                      <div style={{ fontSize: "12px", color: "#64748b", marginTop: "6px" }}>
                        Topological Bridge Nodes: <span style={{ color: "#cbd5e1" }}>{f.shared_intermediaries.join(", ")}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                    <span className="arl-badge arl-badge-green" style={{ fontSize: "13px" }}>
                      Novelty Gap Score: {Math.round(f.novelty_gap_score * 100)}%
                    </span>
                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                      Adamic-Adar: {f.adamic_adar_score} • Jaccard: {f.jaccard_similarity}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(56, 189, 248, 0.08)",
                    border: "1px solid rgba(56, 189, 248, 0.2)",
                    borderRadius: "8px",
                    padding: "12px",
                  }}
                >
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "#38bdf8", textTransform: "uppercase" }}>
                    💡 Cross-Domain Scientific Opportunity
                  </div>
                  <p style={{ fontSize: "13.5px", color: "#e2e8f0", marginTop: "4px", lineHeight: "1.5" }}>
                    {f.hypothesis_opportunity}
                  </p>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => handleInvestigateHypothesis(f.hypothesis_opportunity)}
                    style={{
                      padding: "6px 14px",
                      background: "#38bdf8",
                      color: "#0f172a",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    🚀 Investigate with Copilot
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Bottleneck Papers View */
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {gaps.length === 0 ? (
            <div className="arl-card" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
              No bottleneck papers detected.
            </div>
          ) : (
            gaps.map((gap, index) => (
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
                    <span className="arl-badge arl-badge-blue">{gap.published || "2024"}</span>
                    <span className="arl-badge arl-badge-amber">{gap.citations || 0} citations</span>
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
                    onClick={() => handleInvestigateHypothesis(gap.reason || gap.title)}
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
            ))
          )}
        </div>
      )}
    </div>
  );
}
