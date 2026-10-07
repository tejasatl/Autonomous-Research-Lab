import { useEffect, useState, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import api from "../services/api";

export default function GraphExplorer() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [metrics, setMetrics] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("graph"); // "graph" or "table"
  const fgRef = useRef();

  useEffect(() => {
    loadGraph();
    loadMetrics();
  }, []);

  async function loadGraph() {
    setLoading(true);
    try {
      // First try the enriched full graph endpoint
      const res = await api.get("/graph/full");
      if (res.data && res.data.nodes && res.data.links) {
        // Enforce positive values for force-directed node sizing
        const sanitizedNodes = res.data.nodes.map((n) => ({
          ...n,
          val: Math.max(3, n.val || 4),
          color: getNodeColor(n.type || "paper"),
        }));
        setGraphData({ nodes: sanitizedNodes, links: res.data.links });
      } else {
        // Fallback to legacy /graph endpoint
        const fallback = await api.get("/graph");
        const edges = fallback.data || [];
        const nodeMap = new Map();
        const links = [];

        edges.forEach((e) => {
          if (!nodeMap.has(e.source)) {
            nodeMap.set(e.source, {
              id: e.source,
              name: e.source,
              type: "paper",
              val: 4,
              color: "#3b82f6"
            });
          }
          if (!nodeMap.has(e.target)) {
            nodeMap.set(e.target, {
              id: e.target,
              name: e.target,
              type: "paper",
              val: 4,
              color: "#8b5cf6"
            });
          }
          links.push({
            source: e.source,
            target: e.target,
            type: e.type || "cites"
          });
        });

        setGraphData({
          nodes: Array.from(nodeMap.values()),
          links: links
        });
      }
    } catch (err) {
      console.error("Failed to load graph data", err);
    }
    setLoading(false);
  }

  async function loadMetrics() {
    try {
      const res = await api.get("/graph/metrics");
      setMetrics(res.data);
    } catch {
      setMetrics(null);
    }
  }

  function getNodeColor(type) {
    switch (type) {
      case "topic":
        return "#ec4899";
      case "author":
        return "#10b981";
      case "institution":
        return "#f59e0b";
      default:
        return "#3b82f6";
    }
  }

  const filteredNodes = searchTerm
    ? graphData.nodes.filter((n) =>
        (n.name || n.id).toLowerCase().includes(searchTerm.toLowerCase())
      )
    : graphData.nodes;

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    if (fgRef.current) {
      fgRef.current.centerAt(node.x, node.y, 1000);
      fgRef.current.zoom(3, 1000);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "24px", color: "#f8fafc" }}>
            Interactive Knowledge Graph
          </h1>
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>
            Citation networks, semantic connections, and research lineage
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "8px 14px",
              background: "#151d2f",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              color: "white",
              fontSize: "13px",
              width: "220px",
            }}
          />

          <button
            onClick={() => setViewMode(viewMode === "graph" ? "table" : "graph")}
            style={{
              padding: "8px 16px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "white",
              borderRadius: "8px",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            {viewMode === "graph" ? "📋 Table View" : "🌐 Graph View"}
          </button>

          <button
            onClick={() => {
              if (fgRef.current) {
                fgRef.current.zoomToFit(400);
              }
            }}
            style={{
              padding: "8px 16px",
              background: "#3b82f6",
              border: "none",
              color: "white",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Reset Camera
          </button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        <div className="arl-card" style={{ padding: "16px" }}>
          <div style={{ fontSize: "12px", color: "#94a3b8" }}>Total Nodes</div>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "#60a5fa", marginTop: "4px" }}>
            {graphData.nodes.length}
          </div>
        </div>
        <div className="arl-card" style={{ padding: "16px" }}>
          <div style={{ fontSize: "12px", color: "#94a3b8" }}>Citation Edges</div>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "#34d399", marginTop: "4px" }}>
            {graphData.links.length}
          </div>
        </div>
        <div className="arl-card" style={{ padding: "16px" }}>
          <div style={{ fontSize: "12px", color: "#94a3b8" }}>Connected Components</div>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "#a78bfa", marginTop: "4px" }}>
            {metrics?.connected_components || (graphData.nodes.length > 0 ? 1 : 0)}
          </div>
        </div>
        <div className="arl-card" style={{ padding: "16px" }}>
          <div style={{ fontSize: "12px", color: "#94a3b8" }}>Density / Status</div>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "#f59e0b", marginTop: "4px" }}>
            {metrics ? (metrics.density * 100).toFixed(1) + "%" : "Active"}
          </div>
        </div>
      </div>

      {/* Main Graph Canvas / Inspector Area */}
      {viewMode === "graph" ? (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "620px",
            background: "#080c14",
            borderRadius: "14px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            overflow: "hidden",
          }}
        >
          {loading ? (
            <div
              style={{
                display: "flex",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                color: "#94a3b8",
              }}
            >
              Calculating force layout & rendering topology...
            </div>
          ) : (
            <ForceGraph2D
              ref={fgRef}
              graphData={{
                nodes: filteredNodes,
                links: graphData.links,
              }}
              backgroundColor="#080c14"
              nodeLabel={(n) => `${n.name || n.id} (${n.type || "paper"})`}
              nodeColor={(n) => n.color || "#3b82f6"}
              nodeRelSize={5}
              linkColor={() => "rgba(255, 255, 255, 0.18)"}
              linkDirectionalArrowLength={4}
              linkDirectionalArrowRelPos={1}
              onNodeClick={handleNodeClick}
              cooldownTicks={100}
            />
          )}

          {/* Node Detail Drawer Modal */}
          {selectedNode && (
            <div
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                width: "360px",
                maxHeight: "580px",
                overflowY: "auto",
                background: "rgba(15, 23, 42, 0.95)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
                zIndex: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <span className="arl-badge arl-badge-blue">
                  {selectedNode.type || "Paper"}
                </span>
                <button
                  onClick={() => setSelectedNode(null)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    fontSize: "18px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>

              <h3 style={{ marginTop: "12px", color: "#f8fafc", fontSize: "16px" }}>
                {selectedNode.name || selectedNode.id}
              </h3>

              {selectedNode.authors && selectedNode.authors.length > 0 && (
                <div style={{ marginTop: "10px", fontSize: "13px", color: "#34d399" }}>
                  <strong>Authors:</strong> {selectedNode.authors.join(", ")}
                </div>
              )}

              {selectedNode.year && (
                <div style={{ marginTop: "4px", fontSize: "13px", color: "#94a3b8" }}>
                  <strong>Year:</strong> {selectedNode.year}
                </div>
              )}

              {selectedNode.abstract && (
                <div style={{ marginTop: "12px" }}>
                  <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>
                    Abstract
                  </div>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#cbd5e1",
                      marginTop: "4px",
                      lineHeight: "1.5",
                      maxHeight: "160px",
                      overflowY: "auto",
                    }}
                  >
                    {selectedNode.abstract}
                  </p>
                </div>
              )}

              <div style={{ marginTop: "16px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "12px" }}>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                  <strong>Node ID:</strong> {selectedNode.id}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Table View */
        <div className="arl-card" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)", textAlign: "left", color: "#94a3b8" }}>
                <th style={{ padding: "12px" }}>Source Node</th>
                <th style={{ padding: "12px" }}>Relationship</th>
                <th style={{ padding: "12px" }}>Target Node</th>
              </tr>
            </thead>
            <tbody>
              {graphData.links.map((link, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                    color: "#f8fafc",
                  }}
                >
                  <td style={{ padding: "12px", fontWeight: "500", color: "#60a5fa" }}>
                    {typeof link.source === "object" ? link.source.id : link.source}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span className="arl-badge arl-badge-purple">
                      {link.type || "CITES"}
                    </span>
                  </td>
                  <td style={{ padding: "12px", fontWeight: "500", color: "#34d399" }}>
                    {typeof link.target === "object" ? link.target.id : link.target}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}