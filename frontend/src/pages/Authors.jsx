import { useEffect, useState } from "react";
import api from "../services/api";

export default function Authors() {
  const [authors, setAuthors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuthors();
  }, []);

  useEffect(() => {
    const results = authors.filter((author) =>
      author.name?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(results);
  }, [search, authors]);

  async function loadAuthors() {
    try {
      const res = await api.get("/authors");
      const sorted = (res.data || []).sort((a, b) => b.papers - a.papers);
      setAuthors(sorted);
      setFiltered(sorted);
    } catch {
      setAuthors([]);
      setFiltered([]);
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: "1150px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "24px", color: "#f8fafc" }}>
          Researcher Collaboration Network
        </h1>
        <p style={{ fontSize: "14px", color: "#94a3b8" }}>
          Explore key researchers, publication volumes, and collaboration hubs across your indexed knowledge graph.
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Filter authors by name (e.g., Vaswani, Bengio, LeCun)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "12px 16px",
          }}
        />
        <div style={{ fontSize: "13px", color: "#94a3b8", whiteSpace: "nowrap" }}>
          Showing <strong>{filtered.length}</strong> of {authors.length} authors
        </div>
      </div>

      {loading ? (
        <div className="arl-card" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
          Querying author nodes & calculating paper frequencies...
        </div>
      ) : filtered.length === 0 ? (
        <div className="arl-card" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
          No authors matching "{search}". Try another name or ingest papers in the Search page.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "16px",
          }}
        >
          {filtered.map((author, index) => (
            <div
              key={index}
              className="arl-card"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    background: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    color: "#34d399",
                  }}
                >
                  👨‍🔬
                </div>
                <div>
                  <h3 style={{ fontSize: "15px", color: "#f8fafc", margin: 0 }}>
                    {author.name}
                  </h3>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>
                    Verified Author
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                  paddingTop: "10px",
                }}
              >
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>Publications</span>
                <span className="arl-badge arl-badge-blue">
                  {author.papers} {author.papers === 1 ? "paper" : "papers"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}