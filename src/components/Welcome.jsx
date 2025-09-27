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

/* Auto-load every *-icon.svg/png in /assets/icons
   Use eager + ?url so Vite emits real URLs in prod. */
const iconModules = import.meta.glob("@/assets/icons/*-icon.{svg,png}", {
  eager: true,
  query: "?url",
  import: "default",
});
// keep a stable, deterministic order
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

  const DEFAULT_ORBIT_OFFSET_VH = 70;
  const DEFAULT_ORBIT_WIDTH_VW  = 42;
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
  const [unlocked, setUnlocked] = useState(false);

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

  /* XP charge (8s) + unlock chord — depends ONLY on ready/unlocked */
  useEffect(() => {
    if (!ready || unlocked) return;
    let raf;
    const start = performance.now();
    const DURATION = 8000;

    const tick = (t) => {
      const p = Math.min(1, (t - start) / DURATION);
      setXp(Math.round(p * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setUnlocked(true);
        chordRef.current?.(523.25, 0.06, 0.24);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready, unlocked]);

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

  /* Dome orbit + cursor magnet + falling stars + icon beeps */
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

    return () => {
      window.removeEventListener("pointermove", onMove);
      wrappers.forEach((el) => el.removeEventListener("mouseenter", onEnter));
      gsap.killTweensOf(wrappers);
    };
  }, [ready, prefersReduced, orbitOffset, orbitWidth, ground, iconUrls.length]);

  useEffect(() => {
    if (!showBubble) return;
    const t = setTimeout(() => {
      // noop—just ensuring initial render happened; CSS handles the entrance
    }, 1200);
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

  // Mascot emotes cycle: tilt → bounce → wink (quick alt flash)
  const emotePhase = useRef(0);
  const onMascotClick = () => {
    if (!ready) return;
    blipRef.current?.(880, 0.06, "square", 0.06);
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

  // FX helpers
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

  const onEnterClick = (e) => {
    if (!unlocked) { e.preventDefault(); return; }

    // center of the button for the iris origin
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // trigger the overlay
    window.dispatchEvent(new CustomEvent("start-iris", { detail: { x, y } }));

    // whoosh sfx
    whoosh(0.35, 380, 1400, 0.05);

    // delay route change to let the wipe play under 600ms
    e.preventDefault();
    setTimeout(() => { 
      // navigate to portfolio
      navigate("/work");
    }, 560);
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

      {/* Watermark — top-left */}
      <a href="/" className={s.watermark} aria-label="Jessabel.art (home)">
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

      {/* Bottom UI: XP + gated ENTER */}
      <div className={s.bottomUi}>
        <div className={s.xpWrap} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={xp}>
          <div className={s.xpTrack}>
            <div className={s.xpFill} style={{ width: `${xp}%` }} />
          </div>
          <div className={s.xpLabel}>{xp}%</div>
        </div>

        <Link to="/" className={s.enterBtn} aria-disabled={!unlocked} onClick={onEnterClick}>
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
      </div>
    </section>
  );
}

/* ---------- Dev tuners ---------- */
function GroundTuner({ value, setValue, defaultValue }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const onKey = (e) => {
      const k = e.key.toLowerCase();
      if (k === "g") setVisible((v) => !v);
      if (k === "s") localStorage.setItem("welcome-ground-vh", String(value));
      if (k === "r") { localStorage.removeItem("welcome-ground-vh"); setValue(defaultValue); }
      const step = e.shiftKey ? 0.1 : e.altKey ? 5 : 1;
      if (e.key === "ArrowUp")   setValue((v) => +(Math.max(0, v - step).toFixed(2)));
      if (e.key === "ArrowDown") setValue((v) => +(Math.min(100, v + step).toFixed(2)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [value, setValue, defaultValue]);

  if (!visible) return null;

  return (
    <>
      <div style={{
        position:"fixed", inset:0, pointerEvents:"none", zIndex:50,
        background:"repeating-linear-gradient(to bottom, rgba(0,255,255,.05) 0, rgba(0,255,255,.05) 1px, transparent 1px, transparent 10vh)"
      }}/>
      <div style={{
        position:"fixed", left:0, right:0, top:`${value}vh`, height:0,
        borderTop:"2px dashed rgba(0,255,255,.9)", zIndex:60, pointerEvents:"none"
      }}/>
      <div style={{
        position:"fixed", left:12, bottom:12, zIndex:70, background:"rgba(0,0,0,.55)", color:"#fff",
        fontFamily:"ui-monospace, Menlo, monospace", fontSize:12, padding:"8px 10px",
        border:"1px solid rgba(0,255,255,.25)", borderRadius:8,
        boxShadow:"0 8px 20px rgba(0,0,0,.25)", pointerEvents:"none"
      }}>
        <div>ground (vh): <strong>{value.toFixed(2)}</strong></div>
        <div>↑/↓: ±1 • Shift: ±0.1 • Alt: ±5 • G: toggle • S: save • R: reset</div>
      </div>
    </>
  );
}

function OrbitTuner({ width, setWidth, offset, setOffset, defaultWidth, defaultOffset }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const onKey = (e) => {
      const k = e.key.toLowerCase();
      if (k === "o") setVisible((v) => !v);
      if (k === "p") {
        localStorage.setItem("welcome-orbit-width-vw", String(width));
        localStorage.setItem("welcome-orbit-offset-vh", String(offset));
      }
      if (k === "u") {
        localStorage.removeItem("welcome-orbit-width-vw");
        localStorage.removeItem("welcome-orbit-offset-vh");
        setWidth(defaultWidth); setOffset(defaultOffset);
      }
      const step = e.shiftKey ? 0.2 : e.altKey ? 5 : 1;
      if (k === "h") setWidth((v) => +(Math.max(20, v - step).toFixed(2)));
      if (k === "l") setWidth((v) => +(Math.min(100, v + step).toFixed(2)));
      if (k === "j") setOffset((v) => +(Math.max(5,  v - step).toFixed(2)));
      if (k === "k") setOffset((v) => +(Math.min(95, v + step).toFixed(2)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [width, offset, setWidth, setOffset, defaultWidth, defaultOffset]);

  if (!visible) return null;

  return (
    <div style={{
      position:"fixed", right:12, bottom:12, zIndex:70, background:"rgba(0,0,0,.55)", color:"#fff",
      fontFamily:"ui-monospace, Menlo, monospace", fontSize:12, padding:"8px 10px",
      border:"1px solid rgba(0,255,255,.25)", borderRadius:8,
      boxShadow:"0 8px 20px rgba(0,0,0,.25)", pointerEvents:"none"
    }}>
      <div>orbit width (vw): <strong>{width.toFixed(2)}</strong> — H/L ±</div>
      <div>orbit offset (vh): <strong>{offset.toFixed(2)}</strong> — J/K ±</div>
      <div>O: toggle • P: save • U: reset</div>
    </div>
  );
}
