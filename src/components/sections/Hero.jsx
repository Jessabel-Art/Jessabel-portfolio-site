// src/components/sections/Hero.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import s from "./hero.module.css";

// Hero component: seamless header overlay, perfectly centered content
export default function Hero() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const taglineRef = useRef(null);
  const fxRef = useRef(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const titleNode = titleRef.current;
    if (!titleNode) return;

    // Split into spans so we can animate each letter
    const chars = splitCharsWithGradient(titleNode);

    if (prefersReduced) return;

    // Slightly slower, true "fall into scene"
    const EACH = 0.10;
    const DUR = 1.2;
    animateCharsSequentially(chars, fxRef.current, EACH, DUR);

    const total = (chars.length - 1) * EACH + DUR;

    gsap.fromTo(
      subtitleRef.current,
      { y: 18, opacity: 0, filter: "blur(10px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.75, ease: "power3.out", delay: total + 0.12 }
    );
    gsap.fromTo(
      taglineRef.current,
      { y: 18, opacity: 0, filter: "blur(10px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.75, ease: "power3.out", delay: total + 0.26 }
    );
  }, []);

  const gridUrl = `${import.meta.env.BASE_URL}hero-bg-grid.svg`;

  return (
    <section id="hero" className={s.root} aria-label="Intro">
      {/* Full-bleed video background */}
      <div aria-hidden className={s.fullBleedBg}>
        <video
          src="https://res.cloudinary.com/dqqee8c51/video/upload/v1759267558/hero-bg_r54b6e.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Grid overlay (unchanged) */}
      <div aria-hidden className={s.fullBleedOverlay} style={{ backgroundImage: `url(${gridUrl})` }} />

      {/* Content is always vertically and horizontally centered */}
      <div className={s.inner}>
        <div className={s.titleWrap}>
          <h1
            ref={titleRef}
            className={`${s.title} zeplin ${s.title3d} ${s.titleExtrude} ${s.glowOnHover || ""}`}
            style={{ margin: 0, fontWeight: 800 }}
          >
            Hi, I’m Jessy
          </h1>
        </div>

        {/* Subtitle + tagline (unchanged) */}
        <div
          aria-hidden
          className={s.subBrush}   // ⬅️ add this
          style={{
            position: "absolute",
            left: "40%",
            top: "68%",
            transform: "translate(-2%, -5%)",
            maxWidth: "min(52vw, 740px)",
            textAlign: "center",
          }}
        >
          <p
            ref={subtitleRef}
            className={`${s.subtitle} ${s.glowOnHover || ""}`}
            style={{ margin: 0, fontSize: "clamp(1.50rem, 2.3vw, 1.35rem)" }}
          >
            UX and UI Designer • Systems Thinker
          </p>

          <p
            ref={taglineRef}
            className={s.tagline}
            style={{ marginTop: "0.35rem", fontSize: "clamp(0.98rem, 2.0vw, 1.2rem)" }}
          >
            I design clear, human centered interfaces that ship. Beautiful, usable, measurable.
          </p>
        </div>
      </div>

      <div ref={fxRef} className={s.fx} aria-hidden />
    </section>
  );
}

/* --- Animation/text helper functions for GSAP --- */

const GRADIENT_STYLE = {
  color: "#fff",                  // solid fill (no gradient/clip)
  display: "inline-block",
  whiteSpace: "pre",
};

function splitCharsWithGradient(node) {
  const text = node.textContent || "";
  node.textContent = "";
  const spans = [];
  for (const ch of text) {
    const s = document.createElement("span");
    s.textContent = ch === " " ? "\u00A0" : ch;
    s.style.display = "inline-block";
    s.style.whiteSpace = "pre";
    Object.assign(s.style, GRADIENT_STYLE);
    node.appendChild(s);
    spans.push(s);
  }
  return spans;
}

function animateCharsSequentially(chars, layer, each = 0.10, dur = 1.2) {
  chars.forEach((el, i) => {
    gsap.fromTo(
      el,
      // start above the baseline so letters "fall" into place
      { y: -60, opacity: 0, rotate: -4, filter: "blur(12px)" },
      { y: 0, opacity: 1, rotate: 0, filter: "blur(0px)", duration: dur, ease: "power3.out", delay: i * each,
        onStart: () => burstOneChar(el, layer),
      }
    );
  });
}

function burstOneChar(el, layer) {
  if (!layer) return;
  const rainbow = ["#FF5D5D", "#FFB84D", "#FFE34D", "#71F56C", "#18E1FF", "#6EC8FF", "#A06CFF"];
  const L = layer.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2 - L.left;
  const cy = r.top + r.height / 2 - L.top;
  const count = 10 + Math.floor(Math.random() * 10);
  for (let i = 0; i < count; i++) {
    const dot = document.createElement("span");
    const size = 2 + Math.random() * 3.5;
    dot.style.position = "absolute";
    dot.style.left = `${cx}px`;
    dot.style.top = `${cy}px`;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.borderRadius = "2px";
    dot.style.background = rainbow[(i + Math.floor(Math.random() * 7)) % rainbow.length];
    dot.style.boxShadow = "0 0 12px rgba(24,225,255,.45)";
    dot.style.pointerEvents = "none";
    layer.appendChild(dot);
    const angle = Math.random() * Math.PI * 2;
    const dist = 22 + Math.random() * 44;
    gsap.to(dot, {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      opacity: 0,
      scale: 0.85,
      duration: 1.2 + Math.random() * 0.6,
      ease: "power3.out",
      onComplete: () => dot.remove(),
    });
  }
}
