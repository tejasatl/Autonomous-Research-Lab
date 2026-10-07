import { Link, useLocation } from "react-router-dom";

export default function Navbar() {

  const location = useLocation();

  const token = localStorage.getItem("token");

  let username = "";

  if (token) {

    try {

      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      username =
        payload.sub ||
        payload.username ||
        payload.email ||
        "Researcher";

    } catch {

      username = "Researcher";

    }

  }

  const logout = () => {

    localStorage.removeItem("token");

    window.location.href = "/login";

  };

  const linkStyle = (path) => ({

    color:
      location.pathname === path
        ? "#00d4ff"
        : "white",

    textDecoration: "none",

    fontWeight:
      location.pathname === path
        ? "bold"
        : "normal",

    padding: "8px 10px",

    borderRadius: "6px"

  });

  return (

    <nav
      style={{

        background: "#111827",

        color: "white",

        padding: "15px 20px",

        display: "flex",

        flexWrap: "wrap",

        alignItems: "center",

        gap: "12px"

      }}
    >

      <Link to="/" style={linkStyle("/")}>
        Dashboard
      </Link>

      <Link to="/chat" style={linkStyle("/chat")}>
        Chat
      </Link>

      <Link to="/graph" style={linkStyle("/graph")}>
        Graph
      </Link>

      <Link to="/authors" style={linkStyle("/authors")}>
        Authors
      </Link>

      <Link to="/timeline" style={linkStyle("/timeline")}>
        Timeline
      </Link>

      <Link to="/memory" style={linkStyle("/memory")}>
        Memory
      </Link>

      <Link to="/gaps" style={linkStyle("/gaps")}>
        Research Gaps
      </Link>

      <Link
        to="/proposal"
        style={linkStyle("/proposal")}
      >
        Proposal
      </Link>

      <Link
        to="/research-team"
        style={linkStyle("/research-team")}
      >
        Research Team
      </Link>

      <Link
        to="/clusters"
        style={linkStyle("/clusters")}
      >
        Clusters
      </Link>

      <Link
        to="/communities"
        style={linkStyle("/communities")}
      >
        Communities
      </Link>

      <Link
        to="/neo4j"
        style={linkStyle("/neo4j")}
      >
        Neo4j
      </Link>

      <Link
        to="/search"
        style={linkStyle("/search")}
      >
        Search
      </Link>

      <Link
        to="/research_cycle"
        style={linkStyle("/research_cycle")}
      >
        Research Cycle
      </Link>

      <Link
        to="/copilot"
        style={linkStyle("/copilot")}
      >
        Copilot
      </Link>

      <Link
        to="/experiment-planner"
        style={linkStyle("/experiment-planner")}
      >
        Experiment Planner
      </Link>

      <Link
        to="/research-intelligence"
        style={linkStyle("/research-intelligence")}
      >
        Intelligence
      </Link>

      <Link
        to="/projects"
        style={linkStyle("/projects")}
      >
        Projects
      </Link>

      <Link
        to="/writing"
        style={linkStyle("/writing")}
      >
        Writing
      </Link>

      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}
      >

        {!token && (

          <>

            <Link
              to="/login"
              style={linkStyle("/login")}
            >
              Login
            </Link>

            <Link
              to="/register"
              style={linkStyle("/register")}
            >
              Register
            </Link>

          </>

        )}

        {token && (

          <>

            <span
              style={{
                color: "#00d4ff",
                fontWeight: "bold"
              }}
            >
              👋 {username}
            </span>

            <Link
              to="/profile"
              style={linkStyle("/profile")}
            >
              Profile
            </Link>

            <button
              onClick={logout}
              style={{

                padding: "8px 14px",

                background: "#ef4444",

                color: "white",

                border: "none",

                borderRadius: "6px",

                cursor: "pointer"

              }}
            >
              Logout
            </button>

          </>

        )}

      </div>

    </nav>

  );

}