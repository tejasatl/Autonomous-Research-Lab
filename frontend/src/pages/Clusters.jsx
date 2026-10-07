import { useEffect, useState } from "react";
import api from "../services/api";

export default function Clusters() {
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClusters();
  }, []);

  async function loadClusters() {
    try {
      const res = await api.get("/clusters");
      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.clusters || [];
      setClusters(list);
    } catch {
      setClusters([]);
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: "1150px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "24px", color: "#f8fafc" }}>
          Topic Clusters & Topological Partitions
        </h1>
        <p style={{ fontSize: "14px", color: "#94a3b8" }}>
          Unsupervised clustering of research papers, citation density groups, and thematic subfields.
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="arl-badge arl-badge-blue">
          {clusters.length} Thematic Clusters Identified
        </span>
      </div>

      {loading ? (
        <div className="arl-card" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
          Calculating topological clusters and citation boundaries...
        </div>
      ) : clusters.length === 0 ? (
        <div className="arl-card" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
          No clusters found. Ingest literature to generate citation topology.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "16px",
          }}
        >
          {clusters.map((cluster, index) => {
            const title = cluster.name || cluster.topic || `Thematic Cluster #${index + 1}`;
            const papers = cluster.papers || cluster.members || (cluster.source ? [cluster.source, cluster.target] : []);

            return (
              <div key={index} className="arl-card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "16px", color: "#f8fafc", margin: 0 }}>{title}</h3>
                  <span className="arl-badge arl-badge-purple">Group {index + 1}</span>
                </div>

                {Array.isArray(papers) && papers.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                    {papers.map((p, pIdx) => (
                      <span
                        key={pIdx}
                        style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          borderRadius: "6px",
                          color: "#cbd5e1",
                        }}
                      >
                        {typeof p === "string" ? p : p.title || p.id || JSON.stringify(p)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <pre style={{ fontSize: "12px", margin: 0, padding: "10px" }}>
                    {JSON.stringify(cluster, null, 2)}
                  </pre>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}