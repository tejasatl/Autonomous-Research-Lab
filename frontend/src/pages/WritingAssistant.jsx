import { useState } from "react";
import api from "../services/api";
import Icon from "../components/Icons";

const SECTIONS = [
  "Abstract",
  "Introduction",
  "Related Work",
  "Methodology",
  "Experiments & Baselines",
  "Discussion & Broader Impact",
  "Conclusion",
];

const PRESET_TOPICS = [
  "A Distributed Framework for Privacy-Enhanced Vision Transformers on the Edge",
  "Frugal Quantization for Large Vision-Language Models",
  "Decentralized Federated Learning on Mobile Edge Devices",
  "Graph Neural Networks for Causal Inference in Genomics",
];

const VENUES = ["NeurIPS 2026", "ICLR 2026", "ICML 2026", "CVPR 2026", "IEEE Transactions"];

export default function WritingAssistant() {
  const [activeTab, setActiveTab] = useState("manuscript"); // 'manuscript' | 'review' | 'sections'
  const [topic, setTopic] = useState(PRESET_TOPICS[0]);
  const [venue, setVenue] = useState("NeurIPS 2026");

  // Single Section State
  const [section, setSection] = useState("Abstract");
  const [sectionResult, setSectionResult] = useState("");
  const [sectionLoading, setSectionLoading] = useState(false);

  // Full Manuscript State
  const [manuscriptData, setManuscriptData] = useState(null);
  const [manuscriptLoading, setManuscriptLoading] = useState(false);
  const [copiedTex, setCopiedTex] = useState(false);

  // Peer Review Committee State
  const [reviewInput, setReviewInput] = useState("");
  const [reviewData, setReviewData] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  // 1. Generate Full Manuscript
  async function handleGenerateManuscript() {
    if (!topic.trim()) {
      alert("Please provide a research paper topic.");
      return;
    }
    setManuscriptLoading(true);
    try {
      const res = await api.post("/manuscript/generate", {
        topic: topic.trim(),
        target_venue: venue,
      });
      setManuscriptData(res.data);
      setReviewInput(res.data.latex_code || "");
    } catch (err) {
      alert("Manuscript synthesis error: " + (err.response?.data?.detail || err.message));
    }
    setManuscriptLoading(false);
  }

  // Download Overleaf ZIP
  function handleDownloadZip() {
    if (!manuscriptData?.manuscript_id) return;
    const downloadUrl = `${api.defaults.baseURL || "http://127.0.0.1:8000"}/manuscript/download/${manuscriptData.manuscript_id}`;
    window.open(downloadUrl, "_blank");
  }

  // Export BibTeX Library
  async function handleDownloadBibtex() {
    try {
      const res = await api.get("/bibtex/library");
      const bibText = res.data.bibtex || "";
      const blob = new Blob([bibText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "references.bib";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to export BibTeX library: " + (err.response?.data?.detail || err.message));
    }
  }

  // 2. Submit to Peer Review Committee
  async function handleRunPeerReview() {
    const textToReview = reviewInput || (manuscriptData ? manuscriptData.latex_code : "");
    if (!textToReview.trim()) {
      alert("Please provide manuscript text or LaTeX code to review.");
      return;
    }
    setReviewLoading(true);
    try {
      const res = await api.post("/review/paper", {
        paper_title: topic,
        manuscript_text: textToReview,
      });
      setReviewData(res.data);
    } catch (err) {
      alert("Peer review error: " + (err.response?.data?.detail || err.message));
    }
    setReviewLoading(false);
  }

  // 3. Section Generator
  async function handleGenerateSection() {
    if (!topic.trim()) {
      alert("Please provide a topic.");
      return;
    }
    setSectionLoading(true);
    try {
      const res = await api.get("/writing", {
        params: { topic: topic, section: section },
      });
      setSectionResult(
        typeof res.data?.output === "string"
          ? res.data.output
          : JSON.stringify(res.data?.output || res.data, null, 2)
      );
    } catch {
      setSectionResult("Unable to generate academic section.");
    }
    setSectionLoading(false);
  }

  return (
    <div style={{ maxWidth: "1150px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "24px", color: "#f8fafc" }}>
          Academic Publishing Suite & Peer Review Committee
        </h1>
        <p style={{ fontSize: "14px", color: "#94a3b8" }}>
          Synthesize compile-ready NeurIPS/IEEE LaTeX manuscripts, export Overleaf ZIP archives with BibTeX citations, and simulate rigorous multi-agent peer reviews.
        </p>
      </div>

      {/* Main Tabs */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "12px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setActiveTab("manuscript")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              background: activeTab === "manuscript" ? "#2563eb" : "#f1f5f9",
              color: activeTab === "manuscript" ? "white" : "#475569",
              fontWeight: "600",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Full Conference Manuscript (Overleaf ZIP)
          </button>
          <button
            onClick={() => setActiveTab("review")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              background: activeTab === "review" ? "#2563eb" : "#f1f5f9",
              color: activeTab === "review" ? "white" : "#475569",
              fontWeight: "600",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Simulated Peer Review Committee
          </button>
          <button
            onClick={() => setActiveTab("sections")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              background: activeTab === "sections" ? "#2563eb" : "#f1f5f9",
              color: activeTab === "sections" ? "white" : "#475569",
              fontWeight: "600",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Section Drafting & Polishing
          </button>
        </div>

        <button
          onClick={handleDownloadBibtex}
          style={{
            padding: "6px 14px",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            color: "#1d4ed8",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "600",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Icon name="search" size={13} color="#2563eb" />
          <span>Export Lab BibTeX (.bib)</span>
        </button>
      </div>

      {/* Shared Control Bar */}
      <div className="arl-card" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div>
          <label style={{ fontSize: "13px", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>
            Target Research Paper Topic
          </label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Distributed Privacy-Preserving Vision Transformers on Edge Hardware..."
            style={{ width: "100%", padding: "12px 16px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "#64748b" }}>Quick Topics:</span>
          {PRESET_TOPICS.map((t, i) => (
            <button
              key={i}
              onClick={() => setTopic(t)}
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
              {t.slice(0, 42)}...
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: FULL CONFERENCE MANUSCRIPT */}
      {activeTab === "manuscript" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="arl-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <span style={{ fontSize: "13px", color: "#cbd5e1" }}>Target Conference:</span>
              <select
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "6px",
                  background: "#0f172a",
                  color: "#f8fafc",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                {VENUES.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleGenerateManuscript}
                disabled={manuscriptLoading}
                style={{
                  padding: "10px 20px",
                  background: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "13.5px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Icon name="sparkles" size={14} color="#ffffff" />
                <span>{manuscriptLoading ? "Synthesizing 8-Page Manuscript..." : "Synthesize Complete Manuscript"}</span>
              </button>
            </div>
          </div>

          {manuscriptLoading && (
            <div className="arl-card" style={{ textAlign: "center", padding: "50px", color: "#64748b" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
                <Icon name="proposal" size={32} color="#2563eb" />
              </div>
              <h3 style={{ color: "#0f172a" }}>Synthesizing Complete Conference Manuscript...</h3>
              <p style={{ fontSize: "14px", color: "#64748b" }}>
                Structuring formal problem formulation, integrating verified citations, drafting methodology, and compiling LaTeX macros.
              </p>
            </div>
          )}

          {manuscriptData && !manuscriptLoading && (
            <div className="arl-card" style={{ display: "flex", flexDirection: "column", gap: "16px", borderLeft: "4px solid #2563eb" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ fontSize: "18px", color: "#0f172a", margin: 0, fontWeight: "700" }}>
                    Manuscript Draft Ready ({manuscriptData.target_venue})
                  </h3>
                  <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                    ID: {manuscriptData.manuscript_id} • Package: {manuscriptData.zip_filename}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={handleDownloadZip}
                    style={{
                      padding: "8px 16px",
                      background: "#10b981",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "700",
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Icon name="download" size={13} color="#ffffff" />
                    <span>Download Overleaf ZIP Bundle</span>
                  </button>

                  <button
                    onClick={() => {
                      setReviewInput(manuscriptData.latex_code);
                      setActiveTab("review");
                    }}
                    style={{
                      padding: "8px 16px",
                      background: "#eff6ff",
                      border: "1px solid #bfdbfe",
                      color: "#1d4ed8",
                      borderRadius: "8px",
                      fontWeight: "600",
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Icon name="gaps" size={13} color="#2563eb" />
                    <span>Submit to Peer Review Committee</span>
                  </button>
                </div>
              </div>

              {/* Code Editor */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase", fontWeight: "700" }}>
                    LaTeX Source Code (main.tex):
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(manuscriptData.latex_code);
                      setCopiedTex(true);
                      setTimeout(() => setCopiedTex(false), 2000);
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: copiedTex ? "#34d399" : "#60a5fa",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    {copiedTex ? "Copied to Clipboard" : "Copy LaTeX"}
                  </button>
                </div>
                <textarea
                  value={manuscriptData.latex_code}
                  readOnly
                  rows={16}
                  style={{
                    width: "100%",
                    fontFamily: "monospace",
                    fontSize: "13px",
                    background: "#0b1120",
                    color: "#93c5fd",
                    padding: "14px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    lineHeight: "1.5",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SIMULATED PEER REVIEW COMMITTEE */}
      {activeTab === "review" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="arl-card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3 style={{ fontSize: "17px", color: "#f8fafc", margin: 0 }}>
              NeurIPS / ICLR Program Committee Review
            </h3>
            <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>
              Submit manuscript text or LaTeX code to simulate a 4-agent academic review committee: Theoretical Rigor, Empirical Validations, Novelty Reviewer, and Senior Area Chair Meta-Review.
            </p>

            <textarea
              value={reviewInput}
              onChange={(e) => setReviewInput(e.target.value)}
              placeholder="Paste abstract, paper text, or LaTeX manuscript code here..."
              rows={6}
              style={{
                width: "100%",
                padding: "12px",
                background: "#0b1120",
                color: "#e2e8f0",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.1)",
                fontFamily: "monospace",
                fontSize: "13px",
                boxSizing: "border-box",
              }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleRunPeerReview}
                disabled={reviewLoading}
                style={{
                  padding: "10px 20px",
                  background: "#8b5cf6",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "13.5px",
                  cursor: "pointer",
                }}
              >
                {reviewLoading ? "Deliberating Committee..." : "Deliberate Committee Review"}
              </button>
            </div>
          </div>

          {reviewLoading && (
            <div className="arl-card" style={{ textAlign: "center", padding: "50px", color: "#94a3b8" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}><Icon name="scale" size={32} color="#2563eb" /></div>
              <h3 style={{ color: "#f8fafc" }}>Reviewers Deliberating in Parallel...</h3>
              <p style={{ fontSize: "14px", color: "#94a3b8" }}>
                Reviewer 1 checking mathematical formalism • Reviewer 2 auditing baselines • Reviewer 3 comparing prior art • Area Chair synthesizing meta-review.
              </p>
            </div>
          )}

          {reviewData && !reviewLoading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Area Chair Decision Banner */}
              <div
                className="arl-card"
                style={{
                  borderLeft: `5px solid ${reviewData.decision.includes("Accept") ? "#10b981" : reviewData.decision.includes("Borderline") ? "#f59e0b" : "#ef4444"}`,
                  background: "rgba(15, 23, 42, 0.75)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase", fontWeight: "700" }}>
                      Area Chair Meta-Review & Decision
                    </span>
                    <h2 style={{ fontSize: "22px", color: "#f8fafc", margin: "4px 0 0" }}>
                      Final Decision: <span style={{ color: reviewData.decision.includes("Accept") ? "#34d399" : reviewData.decision.includes("Borderline") ? "#fbbf24" : "#f87171" }}>{reviewData.decision}</span>
                    </h2>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "28px", fontWeight: "800", color: "#f8fafc" }}>
                      {reviewData.average_score} <span style={{ fontSize: "14px", color: "#64748b" }}>/ 10</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#94a3b8" }}>Average Score</div>
                  </div>
                </div>

                <p style={{ fontSize: "14px", color: "#cbd5e1", marginTop: "12px", lineHeight: "1.6" }}>
                  {reviewData.meta_review}
                </p>

                {/* Rebuttal Strategy */}
                {reviewData.rebuttal_strategy && reviewData.rebuttal_strategy.length > 0 && (
                  <div style={{ marginTop: "16px", background: "rgba(59, 130, 246, 0.08)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "8px", padding: "14px" }}>
                    <div style={{ fontSize: "12px", fontWeight: "700", color: "#60a5fa", textTransform: "uppercase" }}>
                      Author Rebuttal Strategy (Action Plan to Flip Reviewers):
                    </div>
                    <ul style={{ margin: "8px 0 0", paddingLeft: "20px", color: "#e2e8f0", fontSize: "13px", lineHeight: "1.6" }}>
                      {reviewData.rebuttal_strategy.map((strat, sIdx) => (
                        <li key={sIdx}>{strat}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Individual Reviewer Cards Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
                {(reviewData.reviewers || []).map((rev, rIdx) => (
                  <div key={rIdx} className="arl-card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ fontSize: "15px", color: "#f8fafc" }}>{rev.reviewer_id}</strong>
                      <span className={`arl-badge ${rev.score >= 7 ? "arl-badge-green" : rev.score >= 5 ? "arl-badge-amber" : "arl-badge-red"}`}>
                        Score: {rev.score}/10
                      </span>
                    </div>

                    <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                      Confidence: {rev.confidence}/5
                    </div>

                    <div>
                      <div style={{ fontSize: "11px", color: "#34d399", fontWeight: "700", textTransform: "uppercase" }}>
                        Strengths
                      </div>
                      <ul style={{ margin: "4px 0 0", paddingLeft: "18px", fontSize: "12.5px", color: "#cbd5e1" }}>
                        {(rev.strengths || []).map((st, i) => (
                          <li key={i}>{st}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div style={{ fontSize: "11px", color: "#f87171", fontWeight: "700", textTransform: "uppercase" }}>
                        Weaknesses
                      </div>
                      <ul style={{ margin: "4px 0 0", paddingLeft: "18px", fontSize: "12.5px", color: "#cbd5e1" }}>
                        {(rev.weaknesses || []).map((wk, i) => (
                          <li key={i}>{wk}</li>
                        ))}
                      </ul>
                    </div>

                    {rev.comments && (
                      <p style={{ fontSize: "12px", color: "#94a3b8", fontStyle: "italic", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "8px", margin: 0 }}>
                        "{rev.comments}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SECTION DRAFTING */}
      {activeTab === "sections" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="arl-card" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: "#cbd5e1" }}>Section to Draft:</span>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              style={{
                padding: "8px 14px",
                borderRadius: "6px",
                background: "#0f172a",
                color: "#f8fafc",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              {SECTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <button
              onClick={handleGenerateSection}
              disabled={sectionLoading}
              style={{
                padding: "8px 18px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: "600",
                fontSize: "13px",
                cursor: "pointer",
                marginLeft: "auto",
              }}
            >
              {sectionLoading ? "Drafting..." : "Draft Academic Section"}
            </button>
          </div>

          {sectionResult && (
            <div className="arl-card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="arl-badge arl-badge-green">Drafted: {section}</span>
              </div>
              <pre style={{ whiteSpace: "pre-wrap", fontSize: "14px", lineHeight: "1.7", color: "#e2e8f0", margin: 0 }}>
                {sectionResult}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
