import { useState } from "react";
import api from "../services/api";

export default function SearchPapers() {
  const [activeTab, setActiveTab] = useState("search"); // 'search', 'arxiv', 'upload'
  const [query, setQuery] = useState("");
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [arxivId, setArxivId] = useState("");
  const [arxivTitle, setArxivTitle] = useState("");
  const [ingestStatus, setIngestStatus] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  async function search() {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await api.get("/search", {
        params: { query },
      });
      setPapers(res.data.results || []);
    } catch {
      setPapers([]);
    }
    setLoading(false);
  }

  async function handleArxivIngest() {
    if (!arxivId.trim()) return;
    setLoading(true);
    setIngestStatus("Ingesting from arXiv and generating embeddings...");
    try {
      const res = await api.post("/ingest_arxiv", {
        arxiv_id: arxivId.trim(),
        title: arxivTitle.trim() || undefined,
      });
      setIngestStatus(`Success: ${res.data.message || "Paper ingested into graph!"}`);
      setArxivId("");
      setArxivTitle("");
    } catch (err) {
      setIngestStatus(
        `Ingestion error: ${err.response?.data?.detail || "Could not fetch or parse paper."}`
      );
    }
    setLoading(false);
  }

  async function handleFileUpload(e) {
    e.preventDefault();
    if (!fileToUpload) return;
    setLoading(true);
    setUploadStatus("Uploading PDF and running automated chunking & vectorization...");

    const formData = new FormData();
    formData.append("file", fileToUpload);

    try {
      const res = await api.post("/upload_paper_pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadStatus(`Success: ${res.data.message || "PDF uploaded and indexed!"}`);
      setFileToUpload(null);
    } catch (err) {
      setUploadStatus(
        `Upload error: ${err.response?.data?.detail || "Failed to process PDF."}`
      );
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "24px", color: "#f8fafc" }}>
          Literature Search & Ingestion Studio
        </h1>
        <p style={{ fontSize: "14px", color: "#94a3b8" }}>
          Explore indexed research papers, ingest new papers directly from arXiv, or upload PDF preprints.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "12px" }}>
        <button
          onClick={() => setActiveTab("search")}
          style={{
            padding: "8px 16px",
            background: activeTab === "search" ? "#3b82f6" : "rgba(255, 255, 255, 0.05)",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
          🔍 Search Local & ArXiv Papers
        </button>
        <button
          onClick={() => setActiveTab("arxiv")}
          style={{
            padding: "8px 16px",
            background: activeTab === "arxiv" ? "#3b82f6" : "rgba(255, 255, 255, 0.05)",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
          ⚡ Direct arXiv Ingest
        </button>
        <button
          onClick={() => setActiveTab("upload")}
          style={{
            padding: "8px 16px",
            background: activeTab === "upload" ? "#3b82f6" : "rgba(255, 255, 255, 0.05)",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
          📄 Upload PDF Preprint
        </button>
      </div>

      {/* Tab: Search */}
      {activeTab === "search" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") search();
              }}
              placeholder="Search by keywords, concept, or author (e.g., Transformer, Edge AI, Mamba)..."
              style={{ flex: 1, padding: "12px 16px" }}
            />
            <button
              onClick={search}
              disabled={loading}
              style={{
                padding: "12px 24px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
              }}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          <div>
            <div style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "12px" }}>
              Found {papers.length} results
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {papers.map((paper, index) => (
                <div key={index} className="arl-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                    <div>
                      <h3 style={{ fontSize: "17px", color: "#f8fafc" }}>
                        {paper.title || "Untitled Paper"}
                      </h3>
                      <div style={{ fontSize: "13px", color: "#34d399", marginTop: "4px" }}>
                        {(paper.authors || []).join(", ") || "Unknown Authors"}
                      </div>
                    </div>
                    <span className="arl-badge arl-badge-blue">
                      {paper.published || "2024"}
                    </span>
                  </div>

                  {paper.abstract && (
                    <p style={{ fontSize: "13.5px", color: "#cbd5e1", marginTop: "12px", lineHeight: "1.5" }}>
                      {paper.abstract}
                    </p>
                  )}

                  <div style={{ marginTop: "14px", display: "flex", gap: "10px", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>
                      ID: {paper.paper_id}
                    </span>
                  </div>
                </div>
              ))}

              {papers.length === 0 && !loading && (
                <div className="arl-card" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                  Enter keywords above to query your local knowledge base or fetch from arXiv.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: ArXiv Direct Ingest */}
      {activeTab === "arxiv" && (
        <div className="arl-card" style={{ maxWidth: "680px" }}>
          <h2 style={{ fontSize: "18px", color: "#f8fafc", marginBottom: "8px" }}>
            Ingest Paper Directly from arXiv
          </h2>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "20px" }}>
            Provide the arXiv identifier (e.g. <code>2312.00752</code> or <code>1706.03762</code>). The system will fetch the paper metadata, parse the text, compute vector embeddings, and add it to your Knowledge Graph.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ fontSize: "13px", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>
                arXiv ID (Required)
              </label>
              <input
                value={arxivId}
                onChange={(e) => setArxivId(e.target.value)}
                placeholder="e.g. 2312.00752"
                style={{ width: "100%", padding: "10px 14px" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "13px", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>
                Paper Title (Optional override)
              </label>
              <input
                value={arxivTitle}
                onChange={(e) => setArxivTitle(e.target.value)}
                placeholder="Leave blank to auto-detect from arXiv"
                style={{ width: "100%", padding: "10px 14px" }}
              />
            </div>

            <button
              onClick={handleArxivIngest}
              disabled={loading || !arxivId.trim()}
              style={{
                padding: "12px",
                background: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              {loading ? "Ingesting..." : "Ingest into Knowledge Graph"}
            </button>

            {ingestStatus && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "12px",
                  borderRadius: "8px",
                  background: ingestStatus.startsWith("Success")
                    ? "rgba(16, 185, 129, 0.15)"
                    : "rgba(239, 68, 68, 0.15)",
                  color: ingestStatus.startsWith("Success") ? "#34d399" : "#f87171",
                  fontSize: "13px",
                }}
              >
                {ingestStatus}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: PDF Upload */}
      {activeTab === "upload" && (
        <div className="arl-card" style={{ maxWidth: "680px" }}>
          <h2 style={{ fontSize: "18px", color: "#f8fafc", marginBottom: "8px" }}>
            Upload Research PDF
          </h2>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "20px" }}>
            Upload your local PDF preprints or whitepapers. PyMuPDF will extract sections, abstracts, and authors, storing them in your lab knowledge base.
          </p>

          <form onSubmit={handleFileUpload} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                border: "2px dashed rgba(255, 255, 255, 0.15)",
                borderRadius: "10px",
                padding: "30px",
                textAlign: "center",
                background: "rgba(255, 255, 255, 0.02)",
              }}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFileToUpload(e.target.files[0])}
                style={{ display: "none" }}
                id="pdf-upload"
              />
              <label
                htmlFor="pdf-upload"
                style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}
              >
                <span style={{ fontSize: "36px" }}>📄</span>
                <span style={{ color: "#60a5fa", fontWeight: "600", fontSize: "14px" }}>
                  {fileToUpload ? fileToUpload.name : "Click to select a PDF file"}
                </span>
                <span style={{ color: "#64748b", fontSize: "12px" }}>
                  Supported format: .pdf (Up to 50MB)
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !fileToUpload}
              style={{
                padding: "12px",
                background: "#8b5cf6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {loading ? "Processing PDF..." : "Upload & Vectorize PDF"}
            </button>

            {uploadStatus && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "12px",
                  borderRadius: "8px",
                  background: uploadStatus.startsWith("Success")
                    ? "rgba(16, 185, 129, 0.15)"
                    : "rgba(239, 68, 68, 0.15)",
                  color: uploadStatus.startsWith("Success") ? "#34d399" : "#f87171",
                  fontSize: "13px",
                }}
              >
                {uploadStatus}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}