import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg-app, #090d16)",
        color: "var(--text-main, #f8fafc)",
        width: "100%",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Topbar />

        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 32px",
            background: "var(--bg-app, #090d16)",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}