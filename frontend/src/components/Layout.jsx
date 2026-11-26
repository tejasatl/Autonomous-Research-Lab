import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-canvas, #e9edf2)",
        display: "flex",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="arl-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Studio Rounded Card Frame */}
      <div
        className="arl-layout-frame"
        style={{
          width: "100%",
          minHeight: "calc(100vh - 32px)",
          background: "#ffffff",
          borderRadius: "24px",
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.03)",
          display: "flex",
          overflow: "hidden",
          border: "1px solid rgba(226, 232, 240, 0.8)",
          position: "relative",
        }}
      >
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: "calc(100vh - 32px)",
            overflow: "hidden",
          }}
        >
          <Topbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

          <main
            className="arl-main-area"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "24px 30px",
              background: "#f8fafc",
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
