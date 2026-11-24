import React from "react";

export default function Loading({ text = "Loading..." }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "12px",
        height: "220px",
        color: "#475569",
      }}
    >
      <div
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          border: "3px solid #e2e8f0",
          borderTopColor: "#2563eb",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <div style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>
        {text}
      </div>
    </div>
  );
}
