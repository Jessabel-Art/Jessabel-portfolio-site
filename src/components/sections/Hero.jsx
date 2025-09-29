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

    const chars = splitCharsWithGradient(titleNode);
    if (prefersReduced) return;

    const EACH = 0.12;
    const DUR = 1.1;
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

  const bgUrl   = `${import.meta.env.BASE_URL}hero-bg.svg`;
  const gridUrl = `${import.meta.env.BASE_URL}hero-bg-grid.svg`;

  // Image assets for the title lines
  const hiUrl = new URL("@/assets/images/hi-hero-text.png", import.meta.url).href;
  const imJessyUrl = new URL("@/assets/images/imjessy-hero-text.png", import.meta.url).href;

  return (
    <section id="hero" className={s.root} aria-label="Intro">
      <div aria-hidden className={s.fullBleedBg} style={{ backgroundImage: `url(${bgUrl})` }} />
      <div aria-hidden className={s.fullBleedOverlay} style={{ backgroundImage: `url(${gridUrl})` }} />

      {/* Content is always vertically and horizontally centered */}
      <div className={s.inner}>
        {/* Keep the original H1 for accessibility + GSAP bursts, but hide it visually */}
        <h1
          ref={titleRef}
          className={`${s.title} ${s.glowOnHover}`}
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        >
          Hi, I’m Jessy
        </h1>

        {/* Visible title as two PNG text lines */}
        <div
          aria-hidden
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // Responsive gap: tighter on phones, modest on large screens
            gap: "clamp(0.08rem, 0.6vw, 0.22rem)",
            width: "min(92vw, 1100px)",
            marginInline: "auto",
            position: "relative",
          }}
        >
          {/* Line 1: "Hi" — smaller, left oriented, shifted into the white-box area */}
          <img
            src={hiUrl}
            alt="Hi,"
            draggable="false"
            style={{
              alignSelf: "flex-start",
              width: "min(38vw, 280px)",
              height: "auto",
              imageRendering: "auto",
              userSelect: "none",
              // Shift right and slightly down responsively to hit that target spot
              transform: "translateX(clamp(10vw, 10vw, 10vw)) translateY(clamp(0.2rem, 0.9vw, 1.2rem))",
            }}
          />

          {/* Line 2: "I'm Jessy" — larger, centered */}
          <img
          src={imJessyUrl}
          alt="I’m Jessy"
          draggable="false"
          style={{
            alignSelf: "center",
            width: "min(240vw, 980px)", // bumped up size (was 160vw/820px)
            height: "auto",
            imageRendering: "auto",
            userSelect: "none",
            marginTop: "-3.8rem", // raises it slightly
            transform: "translateY(-0.3rem)", // fine-tune upward lift
            }}
          />
        </div>

        {/* === Repositioned subtitle + tagline === */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            // Anchor roughly where your white box sits; tweak these three values to taste
            left: "55%",
            top: "75%",
            transform: "translate(-2%, -2%)",
            maxWidth: "min(52vw, 740px)",
            textAlign: "left",
          }}
        >
          <p
            ref={subtitleRef}
            className={`${s.subtitle} ${s.glowOnHover}`}
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
        {/* ====================================== */}
      </div>

      <div ref={fxRef} className={s.fx} aria-hidden />
    </section>
  );
}

/* --- Animation/text helper functions for GSAP --- */

const GRADIENT_STYLE = {
  backgroundImage: "linear-gradient(135deg, #18E1FF, #6EC8FF)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
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
function animateCharsSequentially(chars, layer, each = 0.12, dur = 1.1) {
  chars.forEach((el, i) => {
    gsap.fromTo(
      el,
      { y: 38, opacity: 0, rotate: 6, filter: "blur(12px)" },
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
