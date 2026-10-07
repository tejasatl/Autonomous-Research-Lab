import { useEffect, useState } from "react";
import api from "../services/api";

const PRESETS = [
  "Efficient Vision Transformers on Edge Hardware",
  "Graph Neural Networks for Causal Inference",
  "Diffusion Models for Inverse Problems",
  "Reinforcement Learning with Verifiable Safety Guarantees",
];

export default function ResearchIntelligence() {
  const [stats, setStats] = useState({
    edges: 0,
    authors: 0,
    gaps: 0,
    timeline: 0,
  });

  const [topic, setTopic] = useState("Efficient Vision Transformers on Edge Hardware");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeTab, setActiveTab] = useState("benchmark");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const [graph, authors, gaps, timeline] = await Promise.all([
        api.get("/graph"),
        api.get("/authors"),
        api.get("/gaps"),
        api.get("/timeline"),
      ]);

      const gapsList = Array.isArray(gaps.data)
        ? gaps.data
        : gaps.data?.gaps || [];

      setStats({
        edges: graph.data?.length || 0,
        authors: authors.data?.length || 0,
        gaps: gapsList.length || 0,
        timeline: timeline.data?.length || 0,
      });
    } catch {
      setStats({ edges: 0, authors: 0, gaps: 0, timeline: 0 });
    }
  }

  async function runDeepAnalysis(customTopic) {
    const topicToUse = customTopic || topic;
    if (!topicToUse.trim()) {
      alert("Please enter a research topic.");
      return;
    }
    setAnalyzing(true);
    try {
      const res = await api.get("/research_intelligence", {
        params: { topic: topicToUse },
      });
      setAnalysisResult(res.data);
    } catch {
      alert("Analysis failed. Ensure the backend and AI models are accessible.");
    }
    setAnalyzing(false);
  }

  return (
    <div style={{ maxWidth: "1150px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "24px", color: "#f8fafc" }}>
          Research Intelligence Hub
        </h1>
        <p style={{ fontSize: "14px", color: "#94a3b8" }}>
          Multi-dimensional AI analytics across knowledge graph topology, benchmark baselines, literature novelty, and validation methodologies.
        </p>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        <div className="arl-card">
          <div style={{ fontSize: "12px", color: "#94a3b8" }}>Graph Connections</div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#60a5fa", marginTop: "4px" }}>
            {stats.edges}
          </div>
        </div>

        <div className="arl-card">
          <div style={{ fontSize: "12px", color: "#94a3b8" }}>Tracked Authors</div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#34d399", marginTop: "4px" }}>
            {stats.authors}
          </div>
        </div>

        <div className="arl-card">
          <div style={{ fontSize: "12px", color: "#94a3b8" }}>Open Research Gaps</div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#c084fc", marginTop: "4px" }}>
            {stats.gaps}
          </div>
        </div>

        <div className="arl-card">
          <div style={{ fontSize: "12px", color: "#94a3b8" }}>Lineage Pathways</div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#f59e0b", marginTop: "4px" }}>
            {stats.timeline}
          </div>
        </div>
      </div>

      {/* Intelligence Engine */}
      <div className="arl-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <h2 style={{ fontSize: "18px", color: "#f8fafc", margin: 0 }}>
            🧠 Deep Topic Intelligence Engine
          </h2>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
            Synthesize competitive baselines, related literature lineage, novelty metrics, and empirical validation designs for any scientific domain.
          </p>
        </div>

        <div>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. SNNs for Low-Power Edge Sensory Processing..."
              style={{ flex: 1, padding: "12px 16px" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") runDeepAnalysis();
              }}
            />
            <button
              onClick={() => runDeepAnalysis()}
              disabled={analyzing}
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
              {analyzing ? "Analyzing Domain..." : "Run Intelligence"}
            </button>
          </div>
        </div>

        {/* Preset Chips */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "#64748b" }}>Quick Prompts:</span>
          {PRESETS.map((t, i) => (
            <button
              key={i}
              onClick={() => {
                setTopic(t);
                runDeepAnalysis(t);
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

      {analyzing && (
        <div className="arl-card" style={{ textAlign: "center", padding: "50px", color: "#94a3b8" }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>🧠</div>
          <h3>Performing Deep Literature & Novelty Analysis...</h3>
          <p style={{ marginTop: "4px", fontSize: "14px" }}>
            Evaluating empirical benchmarks, extracting related work citation chains, and calculating novelty scores.
          </p>
        </div>
      )}

      {/* Analysis Results */}
      {analysisResult && !analyzing && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              gap: "8px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              paddingBottom: "12px",
            }}
          >
            {[
              { key: "benchmark", label: "📊 Benchmarks" },
              { key: "related_work", label: "📚 Related Work" },
              { key: "novelty", label: "✨ Novelty Score" },
              { key: "validation", label: "🧪 Validation Plan" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: activeTab === tab.key ? "#3b82f6" : "rgba(255, 255, 255, 0.05)",
                  color: activeTab === tab.key ? "white" : "#94a3b8",
                  fontWeight: activeTab === tab.key ? "600" : "500",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="arl-card">
            <pre
              style={{
                whiteSpace: "pre-wrap",
                fontSize: "14px",
                lineHeight: "1.7",
                color: "#e2e8f0",
                maxHeight: "550px",
                overflowY: "auto",
              }}
            >
              {typeof analysisResult[activeTab] === "string"
                ? analysisResult[activeTab]
                : JSON.stringify(analysisResult[activeTab], null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}