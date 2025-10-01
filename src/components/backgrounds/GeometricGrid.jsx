// src/components/backgrounds/GeometricGrid.jsx
import React from "react";

/**
 * Persistent, subtle grid background.
 * Sits behind the whole app (pointer-events: none).
 */
export default function GeometricGrid() {
  return (
    <div
      className="fixed inset-0 -z-50 pointer-events-none"
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Tiny dot at intersections for extra texture */}
          <pattern id="gridPattern" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.25" />
            <circle cx="0" cy="0" r="0.35" fill="rgba(255,255,255,0.07)" />
          </pattern>
          <radialGradient id="vignette" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
          </radialGradient>
        </defs>

        {/* Base color (navy-ish) — tweak to your CSS var if you like */}
        <rect width="100%" height="100%" fill="var(--navy-900, #0b1020)" />
        {/* Grid */}
        <rect width="100%" height="100%" fill="url(#gridPattern)" />
        {/* Gentle vignette for depth */}
        <rect width="100%" height="100%" fill="url(#vignette)" />
      </svg>
    </div>
  );
}
