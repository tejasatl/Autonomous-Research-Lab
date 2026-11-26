import { useState, useEffect } from "react";
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

  // NLI Verification and Multimodal State
  const [verifications, setVerifications] = useState({});
  const [verifyingId, setVerifyingId] = useState(null);
  const [multimodals, setMultimodals] = useState({});
  const [loadingMmId, setLoadingMmId] = useState(null);

  // BibTeX & ArXiv Daemon Alerts State
  const [bibtexMap, setBibtexMap] = useState({});
  const [copiedBibId, setCopiedBibId] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [crawlingArxiv, setCrawlingArxiv] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  async function loadAlerts() {
    try {
      const res = await api.get("/arxiv/alerts");
      setAlerts(res.data.alerts || []);
    } catch {
      setAlerts([]);
    }
  }

  async function handleTriggerArxivCrawl() {
    setCrawlingArxiv(true);
    try {
      const res = await api.post("/arxiv/crawl-now", { limit: 5 });
      alert(`arXiv Crawler Finished: Scanned ${res.data.preprints_scanned} preprints. Indexed ${res.data.new_papers_indexed} new papers with ${res.data.new_alerts_generated} gap alerts.`);
      loadAlerts();
    } catch (err) {
      alert("Crawl failed: " + (err.response?.data?.detail || err.message));
    }
    setCrawlingArxiv(false);
  }

  async function handleExportBibtexLibrary() {
    try {
      const res = await api.get("/bibtex/library");
      const bibText = res.data.bibtex || "";
      const blob = new Blob([bibText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "autonomous_research_lab.bib";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to export BibTeX: " + (err.response?.data?.detail || err.message));
    }
  }

  async function handleLoadBibtex(paperId) {
    if (bibtexMap[paperId]) {
      // Toggle off
      setBibtexMap(prev => {
        const next = { ...prev };
        delete next[paperId];
        return next;
      });
      return;
    }
    try {
      const res = await api.get(`/bibtex/paper/${paperId}`);
      setBibtexMap(prev => ({ ...prev, [paperId]: res.data.bibtex }));
    } catch (err) {
      alert("Failed to load BibTeX: " + (err.response?.data?.detail || err.message));
    }
  }

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

  async function handleVerify(paperId) {
    setVerifyingId(paperId);
    try {
      const res = await api.post(`/verify/paper/${paperId}`);
      setVerifications(prev => ({ ...prev, [paperId]: res.data }));
    } catch (err) {
      alert("Verification error: " + (err.response?.data?.detail || err.message));
    }
    setVerifyingId(null);
  }

  async function handleLoadMultimodal(paperId) {
    setLoadingMmId(paperId);
    try {
      const res = await api.get(`/papers/${paperId}/multimodal`);
      setMultimodals(prev => ({ ...prev, [paperId]: res.data }));
    } catch (err) {
      alert("Multimodal load error: " + (err.response?.data?.detail || err.message));
    }
    setLoadingMmId(null);
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
      setUploadStatus(`Success: ${res.data.message || "PDF uploaded and indexed successfully!"}`);
      setFileToUpload(null);
    } catch (err) {
      setUploadStatus(
        `Upload error: ${err.response?.data?.detail || "Could not process PDF file."}`
      );
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: "1150px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: "24px", color: "#0f172a", margin: 0 }}>
            Literature Search & Citation Library Manager
          </h1>
          <p style={{ fontSize: "14px", color: "#94a3b8", marginTop: "6px" }}>
            Query vector index, verify citation grounding with NLI, extract multimodal figures, and export standardized BibTeX libraries.
          </p>
        </div>

        <button
          onClick={handleExportBibtexLibrary}
          style={{
            padding: "8px 16px",
            background: "rgba(168, 85, 247, 0.15)",
            border: "1px solid #a855f7",
            color: "#c084fc",
            borderRadius: "6px",
            fontSize: "12.5px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Export Full .bib Library
        </button>
      </div>

      {/* Autonomous ArXiv Daemon Alerts Banner */}
      {alerts.length > 0 && (
        <div style={{ background: "rgba(56, 189, 248, 0.08)", border: "1px solid rgba(56, 189, 248, 0.25)", borderRadius: "10px", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "16px" }}></span>
              <strong style={{ fontSize: "13.5px", color: "#38bdf8" }}>
                Autonomous arXiv Daemon Alerts ({alerts.length} Active)
              </strong>
            </div>
            <div style={{ fontSize: "12.5px", color: "#334155", marginTop: "4px" }}>
              Latest: <strong>{alerts[0].paper_title}</strong> (arXiv:{alerts[0].paper_id}) correlates with frontier: <span style={{ color: "#34d399" }}>{alerts[0].matched_gap}</span>
            </div>
          </div>

          <button
            onClick={handleTriggerArxivCrawl}
            disabled={crawlingArxiv}
            style={{
              padding: "6px 14px",
              background: "#38bdf8",
              color: "#0f172a",
              border: "none",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            {crawlingArxiv ? "Crawling..." : "Crawl arXiv Now"}
          </button>
        </div>
      )}

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
            cursor: "pointer",
          }}
        >
          Semantic Search & Verification
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
            cursor: "pointer",
          }}
        >
          Direct arXiv Ingest
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
            cursor: "pointer",
          }}
        >
           Upload PDF Preprint
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
              placeholder="Search by keywords, concept, or author (e.g., Transformer, Edge AI, Privacy)..."
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
                cursor: "pointer",
              }}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          <div>
            <div style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "12px" }}>
              Found {papers.length} results
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {papers.map((paper, index) => {
                const ver = verifications[paper.paper_id];
                const mm = multimodals[paper.paper_id];
                const bib = bibtexMap[paper.paper_id];

                return (
                  <div key={index} className="arl-card" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                      <div>
                        <h3 style={{ fontSize: "17px", color: "#0f172a", margin: 0 }}>
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
                      <p style={{ fontSize: "13.5px", color: "#334155", margin: 0, lineHeight: "1.5" }}>
                        {paper.abstract}
                      </p>
                    )}

                    {/* Action Bar */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        ID: {paper.paper_id}
                      </span>

                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleLoadBibtex(paper.paper_id)}
                          style={{
                            padding: "6px 14px",
                            background: bib ? "rgba(59, 130, 246, 0.2)" : "rgba(255, 255, 255, 0.08)",
                            border: "1px solid rgba(255, 255, 255, 0.15)",
                            color: bib ? "#60a5fa" : "#f8fafc",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                        >
                          BibTeX
                        </button>

                        <button
                          onClick={() => handleVerify(paper.paper_id)}
                          disabled={verifyingId === paper.paper_id}
                          style={{
                            padding: "6px 14px",
                            background: "rgba(16, 185, 129, 0.15)",
                            border: "1px solid #10b981",
                            color: "#34d399",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                        >
                          {verifyingId === paper.paper_id ? "Verifying NLI..." : "Verify Grounding (NLI)"}
                        </button>

                        <button
                          onClick={() => handleLoadMultimodal(paper.paper_id)}
                          disabled={loadingMmId === paper.paper_id}
                          style={{
                            padding: "6px 14px",
                            background: "rgba(168, 85, 247, 0.15)",
                            border: "1px solid #a855f7",
                            color: "#c084fc",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                        >
                          {loadingMmId === paper.paper_id ? "Extracting..." : " Figures & Tables"}
                        </button>
                      </div>
                    </div>

                    {/* BibTeX Code Panel */}
                    {bib && (
                      <div style={{ background: "#050811", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: "700" }}>
                            Standardized BibTeX Citation:
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(bib);
                              setCopiedBibId(paper.paper_id);
                              setTimeout(() => setCopiedBibId(null), 2000);
                            }}
                            style={{ background: "transparent", border: "none", color: copiedBibId === paper.paper_id ? "#34d399" : "#38bdf8", fontSize: "11.5px", cursor: "pointer", fontWeight: "600" }}
                          >
                            {copiedBibId === paper.paper_id ? "Copied!" : "Copy BibTeX"}
                          </button>
                        </div>
                        <pre style={{ margin: 0, fontSize: "12px", color: "#93c5fd", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
                          {bib}
                        </pre>
                      </div>
                    )}

                    {/* NLI Verification Panel */}
                    {ver && (
                      <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>
                              Citation Factuality Report:
                            </span>
                            <span className={`arl-badge ${ver.risk_level === "LOW" ? "arl-badge-green" : ver.risk_level === "MODERATE" ? "arl-badge-amber" : "arl-badge-red"}`}>
                              {ver.risk_level} Risk
                            </span>
                          </div>
                          <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                            Grounding: <strong style={{ color: "#34d399" }}>{ver.grounding_score}%</strong> • Hallucination: <strong style={{ color: "#f87171" }}>{ver.hallucination_rate}%</strong>
                          </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "240px", overflowY: "auto" }}>
                          {(ver.verified_claims || []).slice(0, 5).map((c, i) => (
                            <div key={i} style={{ fontSize: "12px", padding: "8px", borderRadius: "6px", background: c.verdict === "ENTAILMENT" ? "rgba(16, 185, 129, 0.08)" : c.verdict === "CONTRADICTION" ? "rgba(239, 68, 68, 0.08)" : "rgba(245, 158, 11, 0.08)", borderLeft: `3px solid ${c.verdict === "ENTAILMENT" ? "#10b981" : c.verdict === "CONTRADICTION" ? "#ef4444" : "#f59e0b"}` }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                                <strong style={{ color: c.verdict === "ENTAILMENT" ? "#34d399" : c.verdict === "CONTRADICTION" ? "#f87171" : "#fbbf24" }}>
                                  [{c.verdict}] (Confidence: {Math.round(c.confidence * 100)}%)
                                </strong>
                              </div>
                              <div style={{ color: "#334155" }}>{c.claim}</div>
                              {c.matched_source_span && (
                                <div style={{ color: "#94a3b8", fontSize: "11px", marginTop: "4px", fontStyle: "italic" }}>
                                  ↳ Evidence: "{c.matched_source_span}"
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Multimodal Panel */}
                    {mm && (
                      <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(168, 85, 247, 0.3)", borderRadius: "8px", padding: "14px" }}>
                        <div style={{ fontSize: "13px", fontWeight: "700", color: "#c084fc", marginBottom: "8px" }}>
                           Extracted Multimodal Assets ({mm.total_figures} Figures, {mm.total_tables} Tables)
                        </div>
                        {mm.message && (
                          <div style={{ fontSize: "12px", color: "#94a3b8" }}>{mm.message}</div>
                        )}
                        {mm.figures && mm.figures.length > 0 && (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", marginTop: "10px" }}>
                            {mm.figures.map((fig, fIdx) => (
                              <div key={fIdx} style={{ background: "#050811", borderRadius: "6px", padding: "8px", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <div style={{ fontSize: "11px", color: "#38bdf8", marginBottom: "4px" }}>{fig.figure_id} (Page {fig.page})</div>
                                <div style={{ fontSize: "10px", color: "#64748b" }}>Dimensions: {fig.width} x {fig.height} px</div>
                              </div>
                            ))}
                          </div>
                        )}
                        {mm.tables && mm.tables.length > 0 && (
                          <div style={{ marginTop: "10px", fontSize: "12px", color: "#334155" }}>
                            {mm.tables.length} structured LaTeX/CSV tables indexed for tabular reasoning.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

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
          <h2 style={{ fontSize: "18px", color: "#0f172a", marginBottom: "8px" }}>
            Ingest Paper Directly from arXiv
          </h2>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "20px" }}>
            Provide the arXiv identifier (e.g. <code>2312.00752</code> or <code>1706.03762</code>). The system will fetch the paper metadata, parse the text, compute vector embeddings, and add it to your Knowledge Graph.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ fontSize: "13px", color: "#334155", display: "block", marginBottom: "6px" }}>
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
              <label style={{ fontSize: "13px", color: "#334155", display: "block", marginBottom: "6px" }}>
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
          <h2 style={{ fontSize: "18px", color: "#0f172a", marginBottom: "8px" }}>
            Upload Research PDF
          </h2>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "20px" }}>
            Upload your local PDF preprints or whitepapers. PyMuPDF will extract sections, abstracts, figures, and authors, storing them in your lab knowledge base.
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
                style={{ display: "block", margin: "0 auto 10px" }}
              />
              <span style={{ fontSize: "13px", color: "#64748b" }}>
                Select a .pdf document from your computer
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || !fileToUpload}
              style={{
                padding: "12px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {loading ? "Analyzing PDF..." : "Upload & Extract Multimodal Assets"}
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