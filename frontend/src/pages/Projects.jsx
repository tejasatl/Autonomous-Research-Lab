import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const res = await api.get("/projects");
      setProjects(res.data || []);
    } catch {
      setProjects([]);
    }
    setLoading(false);
  }

  async function createProject(e) {
    e.preventDefault();
    if (!newTitle.trim() || !newTopic.trim()) {
      alert("Please enter a project title and topic.");
      return;
    }

    try {
      const newProj = {
        title: newTitle,
        topic: newTopic,
        notes: newNotes,
        status: "In Progress",
        created_at: new Date().toISOString().split("T")[0],
        papers_count: 0,
        gaps_count: 0,
      };
      await api.post("/projects", newProj);
      setShowModal(false);
      setNewTitle("");
      setNewTopic("");
      setNewNotes("");
      loadProjects();
    } catch {
      alert("Failed to create project.");
    }
  }

  async function deleteProject(id) {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete project.");
    }
  }

  const filteredProjects = projects.filter((p) => {
    if (filter === "all") return true;
    return p.status?.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div style={{ maxWidth: "1150px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", color: "#f8fafc" }}>
            Research Projects Workspace
          </h1>
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>
            Organize, track, and execute your AI research initiatives and grant milestones.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            background: "#3b82f6",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          + New Project
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px" }}>
        {["all", "in progress", "planning", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              border: filter === tab ? "1px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.1)",
              background: filter === tab ? "#3b82f6" : "rgba(255, 255, 255, 0.05)",
              color: filter === tab ? "white" : "#94a3b8",
              cursor: "pointer",
              textTransform: "capitalize",
              fontWeight: filter === tab ? "600" : "500",
              fontSize: "13px",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading && (
        <div className="arl-card" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
          Loading active lab projects...
        </div>
      )}

      {!loading && filteredProjects.length === 0 && (
        <div className="arl-card" style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>📁</div>
          <h3>No research projects found</h3>
          <p style={{ fontSize: "13.5px", marginTop: "4px" }}>
            Create a new initiative above to link literature, formulate hypotheses, and execute experiments.
          </p>
        </div>
      )}

      {/* Project Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "18px",
        }}
      >
        {filteredProjects.map((proj) => (
          <div
            key={proj.id}
            className="arl-card"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span
                  className={
                    proj.status === "Completed"
                      ? "arl-badge arl-badge-green"
                      : proj.status === "Planning"
                      ? "arl-badge arl-badge-amber"
                      : "arl-badge arl-badge-blue"
                  }
                >
                  {proj.status || "In Progress"}
                </span>

                <button
                  onClick={() => deleteProject(proj.id)}
                  title="Delete Project"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#64748b",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  ✕
                </button>
              </div>

              <h2 style={{ fontSize: "18px", color: "#f8fafc", marginTop: "12px", marginBottom: "6px" }}>
                {proj.title}
              </h2>

              <p style={{ color: "#cbd5e1", fontSize: "13.5px", lineHeight: "1.5" }}>
                <strong>Topic:</strong> {proj.topic}
              </p>

              {proj.notes && (
                <p style={{ color: "#94a3b8", fontSize: "12.5px", fontStyle: "italic", marginTop: "8px" }}>
                  {proj.notes}
                </p>
              )}
            </div>

            <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "14px" }}>
              <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "#64748b", marginBottom: "12px" }}>
                <span>📅 {proj.created_at || "Recent"}</span>
                <span>📄 {proj.papers_count || 0} Papers</span>
                <span>🔍 {proj.gaps_count || 0} Gaps</span>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <Link
                  to="/copilot"
                  style={{
                    flex: 1,
                    textAlign: "center",
                    textDecoration: "none",
                    background: "rgba(59, 130, 246, 0.12)",
                    border: "1px solid rgba(59, 130, 246, 0.25)",
                    color: "#93c5fd",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    fontSize: "12.5px",
                    fontWeight: "600",
                  }}
                >
                  🚀 Copilot
                </Link>

                <Link
                  to="/research-team"
                  style={{
                    flex: 1,
                    textAlign: "center",
                    textDecoration: "none",
                    background: "rgba(16, 185, 129, 0.12)",
                    border: "1px solid rgba(16, 185, 129, 0.25)",
                    color: "#6ee7b7",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    fontSize: "12.5px",
                    fontWeight: "600",
                  }}
                >
                  🤖 Team
                </Link>

                <Link
                  to="/writing"
                  style={{
                    flex: 1,
                    textAlign: "center",
                    textDecoration: "none",
                    background: "rgba(139, 92, 246, 0.12)",
                    border: "1px solid rgba(139, 92, 246, 0.25)",
                    color: "#c4b5fd",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    fontSize: "12.5px",
                    fontWeight: "600",
                  }}
                >
                  ✍ Write
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            className="arl-card"
            style={{
              width: "100%",
              maxWidth: "500px",
              padding: "28px",
              background: "#101726",
            }}
          >
            <h2 style={{ color: "#f8fafc", fontSize: "18px", margin: 0 }}>Create Research Project</h2>
            <form onSubmit={createProject} style={{ marginTop: "18px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", color: "#cbd5e1", fontSize: "12.5px", marginBottom: "6px" }}>
                  Project Title
                </label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Edge ViT Quantization"
                  style={{ width: "100%", padding: "10px 14px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", color: "#cbd5e1", fontSize: "12.5px", marginBottom: "6px" }}>
                  Research Topic / Domain
                </label>
                <input
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="e.g. 4-bit Quantization for Vision Transformers on ARM"
                  style={{ width: "100%", padding: "10px 14px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", color: "#cbd5e1", fontSize: "12.5px", marginBottom: "6px" }}>
                  Description / Hypothesis Notes
                </label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="State target milestones or research questions..."
                  rows={3}
                  style={{ width: "100%", padding: "10px 14px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "6px",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "#cbd5e1",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 20px",
                    borderRadius: "6px",
                    border: "none",
                    background: "#3b82f6",
                    color: "white",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
