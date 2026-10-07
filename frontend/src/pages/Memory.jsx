import { useEffect, useState } from "react";
import api from "../services/api";

export default function Memory() {
  const [memory, setMemory] = useState({
    topics: [],
    authors: [],
    papers: [],
    gaps: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMemory();
  }, []);

  async function loadMemory() {
    try {
      const res = await api.get("/memory");
      setMemory(res.data || { topics: [], authors: [], papers: [], gaps: [] });
    } catch {
      setMemory({ topics: [], authors: [], papers: [], gaps: [] });
    }
    setLoading(false);
  }

  function renderCategory(title, icon, items, badgeColorClass) {
    return (
      <div className="arl-card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "18px" }}>{icon}</span>
            <h3 style={{ fontSize: "16px", color: "#f8fafc", margin: 0 }}>{title}</h3>
          </div>
          <span className={`arl-badge ${badgeColorClass}`}>
            {items?.length || 0} items
          </span>
        </div>

        {!items || items.length === 0 ? (
          <p style={{ fontSize: "13px", color: "#64748b" }}>No memory records stored.</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {items.map((item, index) => {
              const text = typeof item === "string" ? item : item.title || item.name || JSON.stringify(item);
              return (
                <div
                  key={index}
                  style={{
                    padding: "6px 12px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "6px",
                    color: "#e2e8f0",
                    fontSize: "13px",
                  }}
                >
                  {text}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1050px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "24px", color: "#f8fafc" }}>
          Lab Long-Term Persistent Memory
        </h1>
        <p style={{ fontSize: "14px", color: "#94a3b8" }}>
          Persistent state, semantic concept anchors, and episodic history utilized across all autonomous agents.
        </p>
      </div>

      {loading ? (
        <div className="arl-card" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
          Loading episodic agent memory banks...
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {renderCategory("Conceptual Topics", "🧠", memory.topics, "arl-badge-blue")}
          {renderCategory("Key Researchers", "👨‍🔬", memory.authors, "arl-badge-green")}
          {renderCategory("Foundational Papers", "📚", memory.papers, "arl-badge-purple")}
          {renderCategory("Cataloged Gaps", "🎯", memory.gaps, "arl-badge-amber")}
        </div>
      )}
    </div>
  );
}