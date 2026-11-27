import React from "react";
import logoIcon from "../assets/logo_icon.png";
import logoFull from "../assets/logo_full.png";

/**
 * ProjectLogo Component
 * Centralized official logo component for Autonomous Research Lab.
 * Renders the custom circular emblem or horizontal banner lockup.
 */
export default function ProjectLogo({ size = 38, variant = "icon", style = {}, className = "" }) {
  if (variant === "full") {
    return (
      <img
        src={logoFull}
        alt="Autonomous Research Lab"
        className={className}
        style={{
          height: `${size}px`,
          width: "auto",
          maxWidth: "100%",
          objectFit: "contain",
          display: "block",
          borderRadius: "8px",
          ...style,
        }}
      />
    );
  }

  // Circular Icon Variant
  return (
    <div
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: "0 4px 14px rgba(0, 180, 255, 0.22)",
        overflow: "hidden",
        background: "#030814",
        ...style,
      }}
    >
      <img
        src={logoIcon}
        alt="Autonomous Lab Emblem"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
}
