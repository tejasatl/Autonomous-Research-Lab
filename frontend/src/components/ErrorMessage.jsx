import React from "react";
import Icon from "./Icons";

export default function ErrorMessage({ message = "Something went wrong." }) {
  return (
    <div
      style={{
        background: "#fff1f2",
        color: "#9f1239",
        border: "1px solid #fecdd3",
        borderRadius: "12px",
        padding: "14px 18px",
        marginBottom: "20px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "13.5px",
        fontWeight: "500",
      }}
    >
      <Icon name="x" size={16} color="#e11d48" strokeWidth={2.2} />
      <span>{message}</span>
    </div>
  );
}
