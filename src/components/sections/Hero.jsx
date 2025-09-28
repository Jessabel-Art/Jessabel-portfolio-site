import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import heroBg from "@/assets/images/hero-bg.svg";
import s from "./hero.module.css";

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

    // slower, one-by-one
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

  return (
    <section id="hero" className={s.root} aria-label="Intro">
      {/* background */}
      <div aria-hidden className={s.fullBleedBg} style={{ backgroundImage: `url(${heroBg})` }} />
      <div aria-hidden className={s.toneMask} />
      <div aria-hidden className={s.vignette} />

      {/* copy */}
      <div className={s.inner}>
        <h1 ref={titleRef} className={`${s.title} ${s.glowOnHover}`}>
          Hi, I’m Jessy
        </h1>

        <p ref={subtitleRef} className={`${s.subtitle} ${s.glowOnHover}`}>
          UX and UI Designer • Systems Thinker
        </p>

        <p ref={taglineRef} className={s.tagline}>
          I design clear, human centered interfaces that ship. Beautiful, usable, measurable.
        </p>
      </div>

      {/* pixel burst layer */}
      <div ref={fxRef} className={s.fx} aria-hidden />
    </section>
  );
}

/* ---------- helpers ---------- */

const GRADIENT_STYLE = {
  backgroundImage: "linear-gradient(135deg, #3DFBFF, #18E1FF)",
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
      {
        y: 0,
        opacity: 1,
        rotate: 0,
        filter: "blur(0px)",
        duration: dur,
        ease: "power3.out",
        delay: i * each,
        onStart: () => burstOneChar(el, layer),
      }
    );
  });
}

function burstOneChar(el, layer) {
  if (!layer) return;
  const rainbow = ["#FF5D5D", "#FFB84D", "#FFE34D", "#71F56C", "#3DFBFF", "#18E1FF", "#A06CFF"];
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
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;

    gsap.to(dot, {
      x: dx,
      y: dy,
      opacity: 0,
      scale: 0.85,
      duration: 1.2 + Math.random() * 0.6,
      ease: "power3.out",
      onComplete: () => dot.remove(),
    });
  }
}
