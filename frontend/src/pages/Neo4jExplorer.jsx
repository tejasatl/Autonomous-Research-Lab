import { useState } from "react";
import api from "../services/api";

const SAMPLE_IDS = ["2312.00752", "1706.03762", "2103.00020", "2005.14165"];

export default function Neo4jExplorer() {
  const [paperId, setPaperId] = useState("");
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async (selectedId) => {
    const idToQuery = selectedId || paperId;
    if (!idToQuery.trim()) return;

    setLoading(true);

    try {
      const res = await api.get("/neo4j_related", {
        params: { paper_id: idToQuery },
      });
      setPapers(res.data || []);
    } catch {
      setPapers([]);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "1050px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "24px", color: "#f8fafc" }}>
          Neo4j Graph Database Explorer
        </h1>
        <p style={{ fontSize: "14px", color: "#94a3b8" }}>
          Direct Cypher relationship traversal. Connect to Neo4j instance or fallback to high-speed local JSON Graph.
        </p>
      </div>

      {/* Query Card */}
      <div className="arl-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={{ fontSize: "13px", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>
            Target Paper ID or arXiv identifier
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              value={paperId}
              placeholder="e.g. 2312.00752 or Attention Is All You Need"
              onChange={(e) => setPaperId(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") search();
              }}
              style={{ flex: 1, padding: "12px 16px" }}
            />
            <button
              onClick={() => search()}
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
              {loading ? "Traversing..." : "Query Related"}
            </button>
          </div>
        </div>

        {/* Sample ID buttons */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: "12px", color: "#64748b" }}>Quick IDs:</span>
          {SAMPLE_IDS.map((id) => (
            <button
              key={id}
              onClick={() => {
                setPaperId(id);
                search(id);
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
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Results Feed */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h2 style={{ fontSize: "18px", color: "#f8fafc" }}>
            Related Graph Entities ({papers.length})
          </h2>
          <span className="arl-badge arl-badge-blue">
            Cypher 1-Hop Neighbors
          </span>
        </div>

        {loading ? (
          <div className="arl-card" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
            Executing Cypher traversal query across graph edges...
          </div>
        ) : papers.length === 0 ? (
          <div className="arl-card" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
            No related nodes returned for this query. Ensure the paper ID exists or Neo4j daemon is online.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {papers.map((p, idx) => {
              const label = typeof p === "string" ? p : p.paper || p.title || JSON.stringify(p);
              return (
                <div
                  key={idx}
                  className="arl-card"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 20px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "20px" }}>⚡</span>
                    <span style={{ fontSize: "14.5px", color: "#f8fafc", fontWeight: "500" }}>
                      {label}
                    </span>
                  </div>

                  <span className="arl-badge arl-badge-purple">
                    Connected Node
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}