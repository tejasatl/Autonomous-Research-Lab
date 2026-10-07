import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import GraphExplorer from "./pages/GraphExplorer";
import Authors from "./pages/Authors";
import Timeline from "./pages/Timeline";
import Memory from "./pages/Memory";
import ResearchGaps from "./pages/ResearchGaps";
import ProposalGenerator from "./pages/ProposalGenerator";
import ResearchTeam from "./pages/ResearchTeam";
import Clusters from "./pages/Clusters";
import Communities from "./pages/Communities";
import Neo4jExplorer from "./pages/Neo4jExplorer";
import SearchPapers from "./pages/SearchPapers";
import ResearchCycle from "./pages/ResearchCycle";
import Copilot from "./pages/Copilot";
import ExperimentPlanner from "./pages/ExperimentPlanner";
import ResearchIntelligence from "./pages/ResearchIntelligence";
import Projects from "./pages/Projects";
import WritingAssistant from "./pages/WritingAssistant";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

function WithLayout({ children }) {
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Lab App Routes with Full Modern Layout */}
        <Route
          path="/"
          element={
            <WithLayout>
              <Dashboard />
            </WithLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <WithLayout>
              <Dashboard />
            </WithLayout>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <WithLayout>
                <Projects />
              </WithLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/research_cycle"
          element={
            <WithLayout>
              <ResearchCycle />
            </WithLayout>
          }
        />
        <Route
          path="/copilot"
          element={
            <ProtectedRoute>
              <WithLayout>
                <Copilot />
              </WithLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/research-team"
          element={
            <ProtectedRoute>
              <WithLayout>
                <ResearchTeam />
              </WithLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <WithLayout>
              <Chat />
            </WithLayout>
          }
        />
        <Route
          path="/graph"
          element={
            <WithLayout>
              <GraphExplorer />
            </WithLayout>
          }
        />
        <Route
          path="/authors"
          element={
            <WithLayout>
              <Authors />
            </WithLayout>
          }
        />
        <Route
          path="/timeline"
          element={
            <WithLayout>
              <Timeline />
            </WithLayout>
          }
        />
        <Route
          path="/clusters"
          element={
            <WithLayout>
              <Clusters />
            </WithLayout>
          }
        />
        <Route
          path="/communities"
          element={
            <WithLayout>
              <Communities />
            </WithLayout>
          }
        />
        <Route
          path="/neo4j"
          element={
            <WithLayout>
              <Neo4jExplorer />
            </WithLayout>
          }
        />
        <Route
          path="/search"
          element={
            <WithLayout>
              <SearchPapers />
            </WithLayout>
          }
        />
        <Route
          path="/gaps"
          element={
            <ProtectedRoute>
              <WithLayout>
                <ResearchGaps />
              </WithLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/experiment-planner"
          element={
            <ProtectedRoute>
              <WithLayout>
                <ExperimentPlanner />
              </WithLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/proposal"
          element={
            <ProtectedRoute>
              <WithLayout>
                <ProposalGenerator />
              </WithLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/writing"
          element={
            <ProtectedRoute>
              <WithLayout>
                <WritingAssistant />
              </WithLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/research-intelligence"
          element={
            <ProtectedRoute>
              <WithLayout>
                <ResearchIntelligence />
              </WithLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/memory"
          element={
            <ProtectedRoute>
              <WithLayout>
                <Memory />
              </WithLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <WithLayout>
                <Profile />
              </WithLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}