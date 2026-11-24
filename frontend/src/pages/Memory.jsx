import React, { useEffect, useState } from "react";
import api from "../services/api";
import Icon from "../components/Icons";

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

  function renderCategory(title, iconKey, items, badgeColorClass) {
    return (
      <div className="arl-card" style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={iconKey} size={16} color="#2563eb" />
            </div>
            <h3 style={{ fontSize: "16px", color: "#0f172a", margin: 0, fontWeight: "700" }}>{title}</h3>
          </div>
          <span className={`arl-badge ${badgeColorClass}`}>
            {items?.length || 0} items
          </span>
        </div>

        {!items || items.length === 0 ? (
          <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>No memory records stored.</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {items.map((item, index) => {
              const text = typeof item === "string" ? item : item.title || item.name || JSON.stringify(item);
              return (
                <div
                  key={index}
                  style={{
                    padding: "6px 14px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "9999px",
                    color: "#334155",
                    fontSize: "12.5px",
                    fontWeight: "500",
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
        <h1 style={{ fontSize: "24px", color: "#0f172a", fontWeight: "800", letterSpacing: "-0.01em" }}>
          Lab Long-Term Persistent Memory
        </h1>
        <p style={{ fontSize: "14px", color: "#64748b" }}>
          Persistent state, semantic concept anchors, and episodic history utilized across all autonomous agents.
        </p>
      </div>

      {loading ? (
        <div className="arl-card" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
          Loading episodic agent memory banks...
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {renderCategory("Conceptual Topics", "intelligence", memory.topics, "arl-badge-blue")}
          {renderCategory("Key Researchers", "authors", memory.authors, "arl-badge-green")}
          {renderCategory("Foundational Papers", "search", memory.papers, "arl-badge-purple")}
          {renderCategory("Cataloged Gaps", "gaps", memory.gaps, "arl-badge-amber")}
        </div>
      )}
    </div>
  );
}
