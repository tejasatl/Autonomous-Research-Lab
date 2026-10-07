import { useEffect, useState } from "react";
import api from "../services/api";

export default function Timeline() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimeline();
  }, []);

  async function loadTimeline() {
    try {
      const res = await api.get("/timeline");
      setTimeline(res.data || []);
    } catch {
      setTimeline([]);
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "24px", color: "#f8fafc" }}>
          Research Lineage & Citation Timeline
        </h1>
        <p style={{ fontSize: "14px", color: "#94a3b8" }}>
          Chronological tracing of scientific influence, foundational architectures, and derivative breakthroughs.
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="arl-badge arl-badge-purple">
          {timeline.length} Citation Influence Chains
        </span>
      </div>

      {loading ? (
        <div className="arl-card" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
          Extracting citation lineage and influence chains...
        </div>
      ) : timeline.length === 0 ? (
        <div className="arl-card" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
          No timeline connections currently detected. Ingest connected papers via arXiv to build lineage chains.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", position: "relative", paddingLeft: "20px" }}>
          {/* Vertical Timeline bar */}
          <div
            style={{
              position: "absolute",
              left: "29px",
              top: "20px",
              bottom: "20px",
              width: "2px",
              background: "linear-gradient(180deg, #3b82f6 0%, #8b5cf6 50%, #10b981 100%)",
            }}
          />

          {timeline.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "24px",
                marginBottom: "24px",
                position: "relative",
              }}
            >
              {/* Timeline Node Point */}
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "#1e293b",
                  border: "3px solid #3b82f6",
                  flexShrink: 0,
                  marginTop: "16px",
                  boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
                }}
              />

              {/* Timeline Card */}
              <div className="arl-card" style={{ flex: 1, padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span style={{ fontSize: "11px", color: "#60a5fa", fontWeight: "700", textTransform: "uppercase" }}>
                      Origin Paper
                    </span>
                    <h3 style={{ fontSize: "16px", color: "#f8fafc", marginTop: "2px" }}>
                      {item.paper}
                    </h3>
                  </div>
                  <span className="arl-badge arl-badge-blue">Step {index + 1}</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    margin: "14px 0",
                    color: "#94a3b8",
                    fontSize: "12px",
                  }}
                >
                  <span style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.08)" }} />
                  <span style={{ color: "#a78bfa", fontWeight: "600" }}>↓ Influenced & Extended ↓</span>
                  <span style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.08)" }} />
                </div>

                <div>
                  <span style={{ fontSize: "11px", color: "#34d399", fontWeight: "700", textTransform: "uppercase" }}>
                    Derivative Breakthrough
                  </span>
                  <h4 style={{ fontSize: "15px", color: "#34d399", marginTop: "2px" }}>
                    {item.influenced}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}