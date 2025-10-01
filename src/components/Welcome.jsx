// Welcome.jsx
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
gsap.registerPlugin(MotionPathPlugin);
gsap.ticker.lagSmoothing(1000, 16);

import heroBg     from "@/assets/images/bg-welcome.svg";
import spotlight  from "@/assets/images/spotlight-radial.svg";
import mascotMain from "@/assets/mascot/mascot-main.png";
import mascotAlt  from "@/assets/mascot/mascot-alt.png";

import s from "./welcome.module.css";

const DEV = import.meta.env.MODE !== "production";

/* Auto-load every *-icon.svg/png in /assets/icons — eager + ?url so prod emits real URLs */
const iconModules = import.meta.glob("@/assets/icons/*-icon.{svg,png}", {
  eager: true,
  query: "?url",
  import: "default",
});
const iconUrls = Object.entries(iconModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, url]) => url);

/* ---------- Lightweight WebAudio toolkit (memoized) ---------- */
function useAudio(muted) {
  const ctxRef = useRef(null);
  const ensure = useCallback(() => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctxRef.current = AC ? new AC() : null;
    }
    return ctxRef.current;
  }, []);

  const blip = useCallback(
    (f = 880, dur = 0.07, type = "sine", gain = 0.08) => {
      if (muted) return;
      const ctx = ensure(); if (!ctx) return;
      const t0 = ctx.currentTime;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.value = f; g.gain.value = gain;
      g.gain.setTargetAtTime(0, t0 + dur * 0.4, 0.02);
      o.connect(g).connect(ctx.destination);
      o.start(t0); o.stop(t0 + dur);
    },
    [ensure, muted]
  );

  const whoosh = useCallback(
    (dur = 0.35, startF = 400, endF = 1200, gain = 0.06) => {
      if (muted) return;
      const ctx = ensure(); if (!ctx) return;
      const t0 = ctx.currentTime;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sawtooth"; g.gain.value = 0;
      o.connect(g).connect(ctx.destination);
      o.frequency.setValueAtTime(startF, t0);
      o.frequency.exponentialRampToValueAtTime(endF, t0 + dur);
      g.gain.linearRampToValueAtTime(gain, t0 + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.start(t0); o.stop(t0 + dur + 0.02);
    },
    [ensure, muted]
  );

  const chord = useCallback(
    (root = 523.25 /* C5 */, gain = 0.05, dur = 0.22) => {
      if (muted) return;
      const ctx = ensure(); if (!ctx) return;
      const freqs = [root, root * 1.25, root * 1.5];
      const t0 = ctx.currentTime;
      const nodes = freqs.map((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "triangle"; o.frequency.value = f;
        g.gain.value = 0;
        o.connect(g).connect(ctx.destination);
        o.start(t0 + i * 0.02);
        g.gain.linearRampToValueAtTime(gain, t0 + 0.05 + i * 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.05 + i * 0.02 + dur);
        o.stop(t0 + 0.08 + i * 0.02 + dur);
        return { o, g };
      });
      return () => nodes.forEach(({ o }) => o.stop());
    },
    [ensure, muted]
  );

  return useMemo(() => ({ blip, whoosh, chord }), [blip, whoosh, chord]);
}

export default function Welcome() {
  const navigate = useNavigate();

  // Gate to prevent first-frame flicker
  const [ready, setReady] = useState(false);

  // Hover controls light (main on when NOT hovering)
  const [hoverLight, setHoverLight] = useState(false); // false = main on, true = alt
  const [muted, setMuted] = useState(() => localStorage.getItem("welcome-muted") === "1");

  // Ground + orbit tuners
  const DEFAULT_GROUND = 88.0;
  const [ground, setGround] = useState(() => {
    const saved = localStorage.getItem("welcome-ground-vh");
    return saved ? parseFloat(saved) : DEFAULT_GROUND;
  });

  const DEFAULT_ORBIT_OFFSET_VH = 80;
  const DEFAULT_ORBIT_WIDTH_VW  = 40;
  const [orbitOffset, setOrbitOffset] = useState(() => {
    const v = localStorage.getItem("welcome-orbit-offset-vh");
    return v ? parseFloat(v) : DEFAULT_ORBIT_OFFSET_VH;
  });
  const [orbitWidth, setOrbitWidth] = useState(() => {
    const v = localStorage.getItem("welcome-orbit-width-vw");
    return v ? parseFloat(v) : DEFAULT_ORBIT_WIDTH_VW;
  });

  // XP charge + lock
  const [xp, setXp] = useState(0);
  const xpBaselineRef = useRef(0);
  const unlockedRef = useRef(false);
  const [unlocked, setUnlocked] = useState(false);
  useEffect(() => { unlockedRef.current = unlocked; }, [unlocked]);

  // Bubble visibility (one-time per session)
  const [showBubble, setShowBubble] = useState(() => !sessionStorage.getItem("welc-bubble-dismissed"));
  const dismissBubble = () => {
    setShowBubble(false);
    sessionStorage.setItem("welc-bubble-dismissed", "1");
  };

  // Refs
  const sceneRef     = useRef(null);
  const parallaxRef  = useRef(null);
  const cursorDot    = useRef(null);
  const cursorRing   = useRef(null);
  const orbitWrapRef = useRef(null);
  const spotRef      = useRef(null);
  const sunSweepRef  = useRef(null);
  const fxLayerRef   = useRef(null);
  const enterBtnRef  = useRef(null);
  const watermarkRef = useRef(null);

  // Stable refs for audio calls inside effects
  const blipRef   = useRef(null);
  const chordRef  = useRef(null);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const { blip, whoosh, chord } = useAudio(muted);
  useEffect(() => { blipRef.current = blip; }, [blip]);
  useEffect(() => { chordRef.current = chord; }, [chord]);

  const vibrate = useCallback((pattern) => {
    try { if (navigator && "vibrate" in navigator) navigator.vibrate(pattern); } catch {}
  }, []);

  /* Return-visitor fast pass + mark seen */
  useEffect(() => {
    const seen = localStorage.getItem("welc-seen") === "1";
    if (seen) {
      xpBaselineRef.current = 100;
      setXp(100);
      setUnlocked(true);
    } else {
      xpBaselineRef.current = 0;
      setXp(0);
      localStorage.setItem("welc-seen", "1");
    }
  }, []);

  /* Preload critical images, then flip ready after two RAFs */
  useEffect(() => {
    let cancelled = false;
    const urls = [heroBg, spotlight, mascotMain, mascotAlt];
    const loadOne = (src) =>
      new Promise((res) => {
        const im = new Image();
        im.onload = im.onerror = () => res();
        im.src = src;
      });
    Promise.all(urls.map(loadOne)).then(() => {
      if (cancelled) return;
      requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
    });
    return () => { cancelled = true; };
  }, []);

  /* Persist mute */
  useEffect(() => {
    localStorage.setItem("welcome-muted", muted ? "1" : "0");
  }, [muted]);

  /* XP charge (~8s) — respects baseline + never fights manual gains */
  useEffect(() => {
    if (!ready || unlockedRef.current) return;
    let raf;
    const start = performance.now();
    const DURATION = 8000;
    const base = xpBaselineRef.current;

    const tick = (t) => {
      const p = Math.min(1, (t - start) / DURATION);
      const target = Math.round(base + p * (100 - base));
      setXp((prev) => Math.max(prev, target));
      if (p < 1 && !unlockedRef.current) {
        raf = requestAnimationFrame(tick);
      } else if (target >= 100 && !unlockedRef.current) {
        setUnlocked(true);
        chordRef.current?.(523.25, 0.06, 0.24);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  /* Helpers to award XP and unlock cleanly */
  const awardXp = useCallback((delta) => {
    setXp((prev) => {
      const next = Math.min(100, prev + delta);
      if (next >= 100 && !unlockedRef.current) {
        setUnlocked(true);
        chordRef.current?.(523.25, 0.06, 0.24);
        vibrate([10, 30, 10]);
      }
      return next;
    });
  }, [vibrate]);

  /* Parallax + cursor + CRT hotspot + click sparkles */
  useEffect(() => {
    if (!ready || !sceneRef.current || prefersReduced) return;
    const cleanups = [];

    const qx = gsap.quickTo(parallaxRef.current, "x", { duration: 0.25, ease: "power2.out" });
    const qy = gsap.quickTo(parallaxRef.current, "y", { duration: 0.25, ease: "power2.out" });

    const onMove = (e) => {
      const rect = sceneRef.current.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      qx(dx * 14); qy(dy * 6);

      gsap.to(cursorDot.current,  { x: e.clientX, y: e.clientY, duration: 0.08, ease: "power3" });
      gsap.to(cursorRing.current, { x: e.clientX, y: e.clientY, duration: 0.22, ease: "power3" });

      const rx = (e.clientX - rect.left) / rect.width;
      const ry = (e.clientY - rect.top) / rect.height;
      sceneRef.current.style.setProperty("--crt-spot-x", `${(rx * 100).toFixed(2)}%`);
      sceneRef.current.style.setProperty("--crt-spot-y", `${(ry * 100).toFixed(2)}%`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    cleanups.push(() => window.removeEventListener("pointermove", onMove));

    const onClick = (e) => {
      cursorRing.current?.classList.add(s.ping);
      setTimeout(() => cursorRing.current?.classList.remove(s.ping), 220);
      spawnSparkles(e.clientX, e.clientY, 10);
      blipRef.current?.(1100, 0.05, "sine", 0.05);
    };
    window.addEventListener("click", onClick);
    cleanups.push(() => window.removeEventListener("click", onClick));

    return () => cleanups.forEach((fn) => fn && fn());
  }, [ready, prefersReduced]);

  /* Puff burst on double-click / double-tap (CSS-driven) */
  useEffect(() => {
    if (!ready || !sceneRef.current) return;
    const root = sceneRef.current;
    const lastTapRef = { t: 0 };

    const spawnPuff = (x, y) => {
      if (!fxLayerRef.current) return;
      // main cloud
      const cloud = document.createElement("span");
      cloud.className = s.puff;
      cloud.style.left = `${x}px`;
      cloud.style.top  = `${y}px`;
      fxLayerRef.current.appendChild(cloud);
      cloud.addEventListener("animationend", () => cloud.remove());

      // drifting bits
      const N = 16;
      for (let i = 0; i < N; i++) {
        const el = document.createElement("span");
        el.className = s.puffBit;
        el.style.left = `${x}px`;
        el.style.top  = `${y}px`;
        const angle = (i / N) * Math.PI * 2 + (Math.random() * 0.6 - 0.3);
        const radius = 40 + Math.random() * 70;
        const dx = Math.cos(angle) * radius;
        const dy = Math.sin(angle) * radius * 0.7;
        el.style.setProperty("--dx", `${dx}px`);
        el.style.setProperty("--dy", `${dy}px`);
        el.style.setProperty("--dur", `${0.5 + Math.random() * 0.7}s`);
        fxLayerRef.current.appendChild(el);
        el.addEventListener("animationend", () => el.remove());
      }
      vibrate([8, 25, 8]);
      blipRef.current?.(220, 0.07, "sine", 0.05);
    };

    const onDblClick = (e) => spawnPuff(e.clientX, e.clientY);
    const onPointerDown = (e) => {
      const now = performance.now();
      if (now - lastTapRef.t < 350) spawnPuff(e.clientX, e.clientY);
      lastTapRef.t = now;
    };

    root.addEventListener("dblclick", onDblClick);
    root.addEventListener("pointerdown", onPointerDown);
    return () => {
      root.removeEventListener("dblclick", onDblClick);
      root.removeEventListener("pointerdown", onPointerDown);
    };
  }, [ready, vibrate]);

  /* Dome orbit + cursor magnet + falling stars + icon beeps + XP + puzzle */
  useEffect(() => {
    if (!ready || !orbitWrapRef.current || prefersReduced) return;

    const wrap = orbitWrapRef.current;
    const path = wrap.querySelector("path#domePath");
    const wrappers = wrap.querySelectorAll(`.${s.orbiterWrap}`);
    const baseDuration = window.matchMedia("(min-width: 1024px)").matches ? 14 : 11;

    gsap.killTweensOf(wrappers);

    wrappers.forEach((el, i) => {
      const start = i / wrappers.length;
      gsap.set(el, { opacity: 1 });
      gsap.to(el, {
        motionPath: {
          path,
          align: path,
          alignOrigin: [0.5, 0.5],
          start,
          end: 1 + start,
          autoRotate: false
        },
        duration: baseDuration,
        repeat: -1,
        ease: "none"
      });
      gsap.to(el, {
        keyframes: [
          { opacity: 1, at: 0 },
          { opacity: 0.25, at: 0.5 },
          { opacity: 1, at: 1 },
        ],
        duration: baseDuration,
        repeat: -1,
        ease: "none",
        delay: start * baseDuration,
      });
      el.querySelector(`.${s.nudge}`).style.setProperty("--nx", "0px");
      el.querySelector(`.${s.nudge}`).style.setProperty("--ny", "0px");
    });

    // Cursor magnet
    const onMove = (e) => {
      const R = 110;
      wrappers.forEach((el) => {
        const box = el.getBoundingClientRect();
        const cx = box.left + box.width / 2, cy = box.top + box.height / 2;
        const dx = e.clientX - cx, dy = e.clientY - cy; const d = Math.hypot(dx, dy);
        const child = el.querySelector(`.${s.nudge}`);
        if (d < R) {
          const k = (1 - d / R) * 6;
          child.style.setProperty("--nx", `${(dx / d) * k}px`);
          child.style.setProperty("--ny", `${(dy / d) * k}px`);
        } else {
          child.style.setProperty("--nx", `0px`);
          child.style.setProperty("--ny", `0px`);
        }
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Hover sfx + star
    const onEnter = (ev) => {
      const r = ev.currentTarget.getBoundingClientRect();
      spawnStar(r.left + r.width/2, r.top + r.height/2);

      const idx = Array.prototype.indexOf.call(wrappers, ev.currentTarget);
      const base = 523.25;
      const ratios = [1, 9/8, 5/4, 3/2, 5/3, 15/8, 2];
      const f = base * ratios[idx % ratios.length];
      blipRef.current?.(f, 0.07, "sine", 0.06);
    };
    wrappers.forEach((el) => el.addEventListener("mouseenter", onEnter, { passive: true }));

    // Puzzle target indices (10%, 50%, 90%)
    const n = wrappers.length || 1;
    const target = [Math.floor(n * 0.1), Math.floor(n * 0.5), Math.floor(n * 0.9)];
    const progressRef = { i: 0 };

    // Click = XP + puzzle advance + haptics
    const onIconClick = (ev) => {
      const idx = Array.prototype.indexOf.call(wrappers, ev.currentTarget);
      // progress the mini-sequence
      if (idx === target[progressRef.i]) {
        progressRef.i++;
        awardXp(8); // small accelerator per tap
        vibrate(12);
        if (progressRef.i >= target.length) {
          progressRef.i = 0;
          awardXp(20); // bonus for solving the 3-tap combo
          chordRef.current?.(659.25, 0.06, 0.32); // E5-ish sparkle
          vibrate([10, 30, 10, 30, 12]);
        }
      } else {
        // restart if this tap happens to be the first expected index
        progressRef.i = idx === target[0] ? 1 : 0;
        awardXp(5); // still a nudge
        vibrate(8);
      }
      // little star at click
      const r = ev.currentTarget.getBoundingClientRect();
      spawnStar(r.left + r.width/2, r.top + r.height/2);
    };
    wrappers.forEach((el) => el.addEventListener("click", onIconClick));

    return () => {
      window.removeEventListener("pointermove", onMove);
      wrappers.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("click", onIconClick);
      });
      gsap.killTweensOf(wrappers);
    };
  }, [ready, prefersReduced, orbitOffset, orbitWidth, ground, awardXp]);

  useEffect(() => {
    if (!showBubble) return;
    const t = setTimeout(() => { /* CSS handles entrance */ }, 1200);
    return () => clearTimeout(t);
  }, [showBubble]);

  /* Sun sweep (every ~12s) */
  useEffect(() => {
    if (!ready || !sunSweepRef.current || prefersReduced) return;
    const el = sunSweepRef.current;
    const tl = gsap.timeline({ repeat: -1, defaults: { ease: "sine.inOut" } });
    tl.fromTo(el, { xPercent: -120, opacity: 0.0 }, { xPercent: 120, opacity: 0.45, duration: 3.6 })
      .to(el, { opacity: 0, duration: 0.5 });
    return () => tl.kill();
  }, [ready, prefersReduced]);

  /* Heat shimmer (SVG turbulence) */
  useEffect(() => {
    if (!ready || prefersReduced) return;
    const freq = document.getElementById("welcome-shimmer-freq");
    if (!freq) return;
    let t = 0;
    const tick = () => {
      t += 0.0025;
      const base = 0.008 + Math.sin(t) * 0.002;
      freq.setAttribute("baseFrequency", base.toFixed(4));
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [ready, prefersReduced]);

  // Mascot emotes + small XP on click
  const emotePhase = useRef(0);
  const onMascotClick = () => {
    if (!ready) return;
    blipRef.current?.(880, 0.06, "square", 0.06);
    awardXp(10);
    vibrate(12);
    const wrap = document.querySelector(`.${s.mascotWrap}`); if (!wrap) return;
    const phase = emotePhase.current % 3;
    if (phase === 0) gsap.fromTo(wrap, { rotate: 0 }, { rotate: 6, yoyo: true, repeat: 1, duration: 0.12, ease: "power1.inOut" });
    else if (phase === 1) gsap.fromTo(wrap, { scale: 1 }, { scale: 1.06, yoyo: true, repeat: 1, duration: 0.16, ease: "back.out(2)" });
    else {
      const root = sceneRef.current;
      gsap.timeline()
        .to(root, { "--light": 0, duration: 0.06, ease: "none" })
        .to(root, { "--light": hoverLight ? 0 : 1, duration: 0.12, ease: "none" });
    }
    emotePhase.current++;
  };

  // FX helpers (sparkles + falling star)
  const spawnSparkles = (x, y, n = 10) => {
    if (!fxLayerRef.current) return;
    for (let i = 0; i < n; i++) {
      const sEl = document.createElement("span");
      sEl.className = s.spark;
      sEl.style.left = `${x}px`;
      sEl.style.top  = `${y}px`;
      sEl.style.setProperty("--dx", `${(Math.random()*2-1)*40}px`);
      sEl.style.setProperty("--dy", `${- (20 + Math.random()*40)}px`);
      sEl.style.setProperty("--dur", `${0.5 + Math.random()*0.6}s`);
      fxLayerRef.current.appendChild(sEl);
      sEl.addEventListener("animationend", () => sEl.remove());
    }
  };
  const spawnStar = (x, y) => {
    if (!fxLayerRef.current) return;
    const el = document.createElement("span");
    el.className = s.fallStar;
    el.style.left = `${x}px`;
    el.style.top  = `${y}px`;
    el.style.setProperty("--dy", `${window.innerHeight - y - 80}px`);
    fxLayerRef.current.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  };

  // Hold-to-enter (legacy single button) — kept, but we’ll use dual CTAs below
  useEffect(() => {
    const btn = enterBtnRef.current;
    if (!btn) return;

    let holdTimer = null;
    let holding = false;

    const start = () => {
      if (!unlockedRef.current) return;
      holding = true;
      btn.classList.add(s.holding);
      holdTimer = setTimeout(() => {
        if (!holding) return;
        const rect = btn.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        window.dispatchEvent(new CustomEvent("start-iris", { detail: { x, y } }));
        whoosh(0.35, 380, 1400, 0.05);
        vibrate([10, 40, 10]);
        navigate("/work");
      }, 600);
    };
    const cancel = () => {
      holding = false;
      btn.classList.remove(s.holding);
      if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
    };

    btn.addEventListener("pointerdown", start);
    btn.addEventListener("pointerup", cancel);
    btn.addEventListener("pointerleave", cancel);
    btn.addEventListener("pointercancel", cancel);

    return () => {
      btn.removeEventListener("pointerdown", start);
      btn.removeEventListener("pointerup", cancel);
      btn.removeEventListener("pointerleave", cancel);
      btn.removeEventListener("pointercancel", cancel);
    };
  }, [navigate, whoosh, vibrate]);

  // Secret long-press on watermark → fast unlock
  useEffect(() => {
    const el = watermarkRef.current;
    if (!el) return;
    let timer = null;
    let triggered = false;

    const down = () => {
      triggered = false;
      timer = setTimeout(() => {
        triggered = true;
        setXp(100);
        setUnlocked(true);
        chordRef.current?.(523.25, 0.08, 0.32);
        vibrate([8, 60, 8, 60, 8]);
      }, 900);
    };
    const up = (ev) => {
      if (timer) clearTimeout(timer);
      if (triggered) {
        ev.preventDefault?.();
        ev.stopPropagation?.();
      }
    };

    el.addEventListener("pointerdown", down, { passive: true });
    el.addEventListener("pointerup", up, { passive: false });
    el.addEventListener("pointerleave", up, { passive: false });
    el.addEventListener("pointercancel", up, { passive: false });

    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointerleave", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [vibrate]);

  const onEnterClick = (e) => {
    if (!unlocked) { e.preventDefault(); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    window.dispatchEvent(new CustomEvent("start-iris", { detail: { x, y } }));
    whoosh(0.35, 380, 1400, 0.05);
    e.preventDefault();
    setTimeout(() => navigate("/work"), 560);
  };

  // NEW: dual-option click (Showcase Mode → /home, Playground → /playground)
  const onOptionClick = (e, route) => {
    if (!unlocked) { e.preventDefault(); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    window.dispatchEvent(new CustomEvent("start-iris", { detail: { x, y } }));
    whoosh(0.35, 380, 1400, 0.05);
    e.preventDefault();
    setTimeout(() => navigate(route), 560);
  };

  return (
    <section
      id="welcome"
      ref={sceneRef}
      className={`${s.root} ${s.crt} ${ready ? s.ready : ""}`}
      style={{
        "--light": hoverLight ? 0 : 1,
        "--ground-y": `${ground}vh`,
        "--orbit-offset-y": `${orbitOffset}vh`,
        "--orbit-width": `${orbitWidth}vw`,
      }}
      aria-label="Welcome"
    >
      {/* Heat shimmer filter */}
      <svg className={s.hiddenSvg} aria-hidden width="0" height="0">
        <filter id="welcome-shimmer" x="-20%" y="-20%" width="140%" height="200%">
          <feTurbulence id="welcome-shimmer-freq" type="fractalNoise" baseFrequency="0.010" numOctaves="1" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="8" />
        </filter>
      </svg>

      {/* Watermark — top-left (secret long-press) */}
      <a ref={watermarkRef} href="/" className={s.watermark} aria-label="Jessabel.art (home)">
        <span className={s.watermarkHalo} aria-hidden />
        <span className={s.watermarkText}>Jessabel.art</span>
      </a>

      {/* Cursor + FX */}
      <div className={s.cursorLayer} aria-hidden>
        <div ref={cursorRing} className={s.cursorRing} />
        <div ref={cursorDot}  className={s.cursorDot} />
      </div>
      <div ref={fxLayerRef} className={s.fxLayer} aria-hidden />

      {/* DEV tuners */}
      {DEV && (
        <>
          <GroundTuner value={ground} setValue={setGround} defaultValue={DEFAULT_GROUND} />
          <OrbitTuner  width={orbitWidth} setWidth={setOrbitWidth}
                       offset={orbitOffset} setOffset={setOrbitOffset}
                       defaultWidth={DEFAULT_ORBIT_WIDTH_VW}
                       defaultOffset={DEFAULT_ORBIT_OFFSET_VH} />
        </>
      )}

      {/* Scene */}
      <div ref={parallaxRef} className={s.parallax}>
        <img src={heroBg} alt="" className={s.bg} />

        {/* Sun band with sweep + shimmer */}
        <div className={s.sunBand} style={{ filter: "url(#welcome-shimmer)" }}>
          <div ref={sunSweepRef} className={s.sunSweep} />
        </div>

        {/* Spotlight */}
        <div
          ref={spotRef}
          className={s.spot}
          style={{ backgroundImage: `url(${spotlight})` }}
          aria-hidden
          onMouseEnter={() => setHoverLight(true)}
          onMouseLeave={() => setHoverLight(false)}
        />

        {/* ——— Mascot speech bubble ——— */}
        {showBubble && (
          <div
            className={s.bubbleWrap}
            role="dialog"
            aria-live="polite"
            aria-label="Intro"
          >
            <div className={s.bubble}>
              <button className={s.bubbleClose} aria-label="Close" onClick={dismissBubble}>×</button>
              <div className={s.bubbleText}>
                Wanna peek the work?<span className={s.wiggle}> →</span>
              </div>
              <span className={s.bubbleTail} aria-hidden />
            </div>
          </div>
        )}

        {/* Mascot */}
        <div
          className={s.mascotWrap}
          onMouseEnter={() => setHoverLight(true)}
          onMouseLeave={() => setHoverLight(false)}
          onClick={onMascotClick}
          role="button"
          aria-label="Mascot"
        >
          <img src={mascotMain} alt="Jessabel mascot" className={`${s.mascotImg} ${s.mascotMain}`} />
          <img src={mascotAlt}  alt=""                  className={`${s.mascotImg} ${s.mascotAlt}`} />
        </div>

        {/* Grounded reflection + shadow */}
        <div className={s.mascotReflection} aria-hidden>
          <img src={mascotMain} alt="" className={s.refImg} />
        </div>
        <div className={s.shadow} aria-hidden />

        {/* Orbiting icons exactly over the dome */}
        <div ref={orbitWrapRef} className={s.orbitWrap} aria-hidden>
          <svg className={s.orbitSvg} viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet">
            <path id="domePath" d="M 50 250 A 250 200 0 0 1 550 250" fill="none" stroke="transparent" vectorEffect="non-scaling-stroke" />
          </svg>
          {iconUrls.map((src, i) => (
            <div key={i} className={s.orbiterWrap}>
              <div className={s.nudge}>
                <img src={src} alt="" className={s.orbiterImg} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top-right mute */}
      <button
        className={s.muteDock}
        onClick={() => { setMuted((m) => !m); blipRef.current?.(440, 0.05, "sine", 0.05); }}
        aria-label={muted ? "Unmute" : "Mute"}
      >
        <span className={s.muteGlyph}>{muted ? "🔇" : "🔊"}</span>
      </button>

      {/* Bottom UI: XP + dual options */}
      <div className={s.bottomUi}>
        <div className={s.xpWrap} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={xp}>
          <div className={s.xpTrack}>
            <div className={s.xpFill} style={{ width: `${xp}%` }} />
          </div>
          <div className={s.xpLabel}>{xp}%</div>
        </div>

        {/* NEW dual CTAs */}
        <div className={s.optionRow}>
          <Link
            to="/home" // was "/"
            className={`${s.optionBtn} ${s.tourBtn}`}
            aria-disabled={!unlocked}
            onClick={(e) => onOptionClick(e, "/home")}
          >
            <span className={s.optionText}>
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden focusable="false" style={{ marginRight: 10 }}>
                <path fill="currentColor" d="M3 12h18v2H3zM3 7h12v2H3zM3 17h12v2H3z"/>
              </svg>
              Showcase Mode
            </span>
          </Link>
        </div>

        {/* Legacy ENTER (kept; not rendered since we now have two options)
        <Link
          ref={enterBtnRef}
          to="/"
          className={s.enterBtn}
          aria-disabled={!unlocked}
          onClick={onEnterClick}
        >
          <svg className={s.holdSvg} viewBox="0 0 44 44" aria-hidden>
            <circle className={s.holdTrack} cx="22" cy="22" r="20" pathLength="100" />
            <circle className={s.holdProg}  cx="22" cy="22" r="20" pathLength="100" />
          </svg>
          <span className={s.enterRim}   aria-hidden />
          <span className={s.enterShine} aria-hidden />
          <span className={s.enterSheen} aria-hidden />
          <span className={s.enterText}>
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden focusable="false" style={{ marginRight: 10 }}>
              <path fill="currentColor" d="M12 4l-1.4 1.4 5.6 5.6H4v2h12.2l-5.6 5.6L12 20l8-8z"/>
            </svg>
            ENTER
          </span>
        </Link>
        */}
      </div>
    </section>
  );
}

/* ---------- Dev tuners (unchanged) ---------- */
function GroundTuner({ value, setValue, defaultValue }) { /* ...unchanged... */ }
function OrbitTuner({ width, setWidth, offset, setOffset, defaultWidth, defaultOffset }) { /* ...unchanged... */ }