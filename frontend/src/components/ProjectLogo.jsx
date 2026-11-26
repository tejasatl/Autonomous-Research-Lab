import React from "react";
import Icon from "./Icons";

/**
 * ProjectLogo Component
 * Centralized logo component for the Autonomous Research Lab.
 * When a custom image is provided in assets, it renders the custom image.
 * Otherwise, it renders a sleek, modern brand logo frame.
 */
export default function ProjectLogo({ size = 38, style = {} }) {
  // If a custom uploaded logo image is available, render it
  // (Ready for user's logo file upload)
  const customLogoSrc = null; // Set to "/assets/logo.png" or imported image when provided

  if (customLogoSrc) {
    return (
      <img
        src={customLogoSrc}
        alt="Autonomous Lab Logo"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "10px",
          objectFit: "contain",
          display: "block",
          ...style,
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "12px",
        background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
        color: "#ffffff",
        flexShrink: 0,
        ...style,
      }}
    >
      <Icon name="sparkles" size={Math.round(size * 0.52)} color="#ffffff" strokeWidth={2} />
    </div>
  );
}
