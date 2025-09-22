import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";

/**
 * HorizonPreviewPage — Field-Guide Portfolio (Preview)
 * - Earthy palette (paper/ink/gold/browns) with gentle accent pops
 * - Keeps: custom cursor, floating dots, reveal-on-scroll, smooth-scroll nav, minimal parallax
 * - Sections: Prologue, About, Workbench, Field Notes, Results, Finale
 * - Zero external assets required; gradients stand in for images
 */
export default function HorizonPreviewPage() {
  const prefersReducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  // Refs
  const cursorRef = useRef(null);
  const dotsRef = useRef([]);
  const revealRefs = useRef([]);
  const setRevealRef = (el) => el && revealRefs.current.push(el);

  const prologueShapeRef = useRef(null);
  const aboutDiscRef = useRef(null);
  const finaleSealRef = useRef(null);

  const [motionOn, setMotionOn] = useState(!prefersReducedMotion);

  // ---------- Custom cursor (ring + hover enlarge) ----------
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    let rafId = null;
    let x = 0,
      y = 0;

    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!rafId) rafId = requestAnimationFrame(tick);
    };
    const tick = () => {
      cursor.style.transform = `translate(${x}px, ${y}px)`;
      rafId = null;
    };

    const over = (e) => {
      if (e.target.closest("a, button, .nav-pill, .peek-btn")) cursor.classList.add("hover");
    };
    const out = (e) => {
      if (e.target.closest("a, button, .nav-pill, .peek-btn")) cursor.classList.remove("hover");
    };
    const onKeyDown = (e) => e.key === "Tab" && (cursor.style.display = "none");
    const onMouseDown = () => (cursor.style.display = "");

    document.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onMouseDown);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // ---------- Floating dots: gentle mouse parallax ----------
  useEffect(() => {
    if (!motionOn) return;
    let rafId = null;
    let nx = 0,
      ny = 0;
    const onMove = (e) => {
      nx = e.clientX / window.innerWidth - 0.5;
      ny = e.clientY / window.innerHeight - 0.5;
      if (!rafId) rafId = requestAnimationFrame(tick);
    };
    const tick = () => {
      dotsRef.current.forEach((dot, i) => {
        if (!dot) return;
        const speed = (i + 1) * 0.25;
        const x = nx * speed * 26;
        const y = ny * speed * 26;
        dot.style.transform = `translate(${x}px, ${y}px)`;
      });
      rafId = null;
    };
    document.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      document.removeEventListener("mousemove", onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [motionOn]);

  // ---------- Reveal on scroll ----------
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealRefs.current.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // ---------- Smooth-scroll + active nav ----------
  useEffect(() => {
    const links = document.querySelectorAll(".nav-pill");
    const sections = ["#prologue", "#about", "#workbench", "#fieldnotes", "#results", "#contact"].map(
      (id) => document.querySelector(id)
    );
    const onClick = (e) => {
      const href = e.currentTarget.getAttribute("href");
      if (!href?.startsWith("#")) return;
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    links.forEach((a) => a.addEventListener("click", onClick));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = `#${entry.target.id}`;
          if (entry.isIntersecting) {
            document.querySelectorAll(".nav-pill").forEach((n) => n.classList.remove("active"));
            document.querySelector(`.nav-pill[href="${id}"]`)?.classList.add("active");
          }
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach((s) => s && io.observe(s));

    return () => {
      links.forEach((a) => a.removeEventListener("click", onClick));
      io.disconnect();
    };
  }, []);

  // ---------- Tiny parallax on a few shapes ----------
  useEffect(() => {
    if (!motionOn) return;
    let rafId = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const s = window.scrollY || 0;
        if (prologueShapeRef.current) {
          prologueShapeRef.current.style.transform = `translate(-50%, -50%) translateY(${Math.min(40, s * 0.06)}px) rotate(-10deg)`;
        }
        if (aboutDiscRef.current) {
          aboutDiscRef.current.style.transform = `translate(-50%, -50%) translateY(${Math.min(28, s * 0.04)}px)`;
        }
        if (finaleSealRef.current) {
          finaleSealRef.current.style.transform = `translate(-50%, -50%) translateY(${Math.min(36, s * 0.05)}px)`;
        }
        rafId = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [motionOn]);

  // ---------- Demo data ----------
  const projects = [
    {
      title: "Onboarding Portal",
      role: "UX Lead",
      time: "6 weeks",
      problem: "New users struggled to finish setup; support tickets spiked after day 2.",
      process: "Mapped flows, simplified copy, introduced progressive disclosure and inline help.",
      outcome: "↑18% week-1 activation, ↓32% setup time.",
    },
    {
      title: "Scheduling App",
      role: "Product Designer",
      time: "3 months",
      problem: "Mobile scheduling required 8+ taps; high drop-off on step 3.",
      process: "Task analysis → reduced screens → sticky summary + one-hand controls.",
      outcome: "↓41% abandon, CSAT +0.6.",
    },
    {
      title: "Client Dashboard",
      role: "Researcher & UI",
      time: "8 weeks",
      problem: "Stakeholders couldn’t find billing or reports quickly.",
      process: "Card sort, IA revamp, surface most-used actions and alerts.",
      outcome: "↓55% support contacts on billing/reporting.",
    },
  ];

  const results = [
    { label: "Task success", value: "+18%" },
    { label: "Time to complete", value: "−32%" },
    { label: "Abandon rate", value: "−41%" },
    { label: "Support contacts", value: "−55%" },
    { label: "CSAT", value: "+0.6" },
  ];

  return (
    <div className="hp-root">
      <Helmet>
        <title>Jessabel — Field-Guide Portfolio (Preview)</title>
      </Helmet>

      {/* Controls */}
      <div className="preview-controls" role="group" aria-label="Preview controls">
        <button className="toggle" onClick={() => setMotionOn((v) => !v)} aria-pressed={motionOn}>
          {motionOn ? "Motion: On" : "Motion: Off"}
        </button>
      </div>

      {/* Custom Cursor */}
      <div className="cursor" ref={cursorRef} aria-hidden />

      {/* Floating dust motes */}
      <div className="floating-elements" aria-hidden>
        <div className="floating-dot" ref={(el) => (dotsRef.current[0] = el)} />
        <div className="floating-dot" ref={(el) => (dotsRef.current[1] = el)} />
        <div className="floating-dot" ref={(el) => (dotsRef.current[2] = el)} />
      </div>

      {/* Brand */}
      <div className="brand">
        <span className="brand-initial">J</span>
        <span className="brand-title">UX Designer</span>
      </div>

      {/* Navigation */}
      <nav className="nav" aria-label="Site navigation">
        <a href="#prologue" className="nav-pill active">
          Prologue
        </a>
        <a href="#about" className="nav-pill">
          About
        </a>
        <a href="#workbench" className="nav-pill">
          Workbench
        </a>
        <a href="#fieldnotes" className="nav-pill">
          Field Notes
        </a>
        <a href="#results" className="nav-pill">
          Results
        </a>
        <a href="#contact" className="nav-pill contact">
          Contact
        </a>
      </nav>

      <main className="content" id="main" tabIndex={-1}>
        {/* ================= PROLOGUE ================= */}
        <section id="prologue" className="section prologue">
          <div className="prologue-shape" ref={prologueShapeRef} />
          <div className="prologue-copy" ref={setRevealRef}>
            <h1>
              Design is how I{" "}
              <span className="inkline">
                remove friction
              </span>{" "}
              and earn trust.
            </h1>
            <p>
              A field guide to my practice—curiosity, systems thinking, and careful craft. Earthy
              interfaces, humane outcomes.
            </p>
          </div>
        </section>

        {/* ================= ABOUT ================= */}
        <section id="about" className="section about">
          <div className="about-grid">
            <div className="about-text" ref={setRevealRef}>
              <h2>Hi, I’m Jessabel.</h2>
              <p>
                I align human needs with business outcomes—turning research into clear flows,
                interfaces, and decisions. My background across ops and strategy means I design for
                both people and outcomes.
              </p>
              <p>
                I prefer tactile, warm UIs—paper textures, gentle shadows, and tiny sparks of color
                where it matters.
              </p>
              <div className="cta-row">
                <a className="btn-primary" href="#fieldnotes">
                  View case cards
                </a>
                <a className="btn-outline" href="#contact">
                  Work with me
                </a>
              </div>
            </div>
            <div className="about-visual">
              <div className="about-disc" ref={aboutDiscRef} aria-hidden />
              <div className="about-photo" aria-hidden />
              <div className="circular-text" aria-hidden>
                <svg viewBox="0 0 220 220">
                  <path
                    id="circle"
                    d="M 110,110 m -85,0 a 85,85 0 1,1 170,0 a 85,85 0 1,1 -170,0"
                    fill="none"
                  />
                  <text>
                    <textPath href="#circle">
                      EMPATHY • CREATIVITY • PROBLEM SOLVING • EMPATHY • CREATIVITY •
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ================= WORKBENCH ================= */}
        <section id="workbench" className="section workbench">
          <h2 className="center" ref={setRevealRef}>
            Workbench
          </h2>
          <p className="center sub" ref={setRevealRef}>
            Pins on my apron: research, IA, prototyping, design systems, accessibility.
          </p>
          <ul className="tool-pins">
            {[
              "UX Research",
              "Usability Testing",
              "Information Architecture",
              "Wireframing",
              "Prototyping",
              "Design Systems",
              "Accessibility (WCAG)",
              "Figma",
              "UI Design",
              "Analytics",
            ].map((t) => (
              <li key={t} className="pin" ref={setRevealRef}>
                <span className="dot" />
                {t}
              </li>
            ))}
          </ul>
        </section>

        {/* ================= FIELD NOTES (projects) ================= */}
        <section id="fieldnotes" className="section fieldnotes">
          <h2 className="center" ref={setRevealRef}>
            Field Notes: Selected Work
          </h2>
          <p className="center sub" ref={setRevealRef}>
            Index-card summaries. Peek to see Problem → Process → Outcome.
          </p>
          <div className="cards">
            {projects.map((p, idx) => (
              <FieldCard key={idx} project={p} />
            ))}
          </div>
        </section>

        {/* ================= RESULTS ================= */}
        <section id="results" className="section results">
          <h2 ref={setRevealRef}>Results</h2>
          <div className="rail-wrap">
            <div className="rail" aria-hidden />
            <div className="rail-fill" aria-hidden />
            <ul className="metrics">
              {results.map((r, i) => (
                <li className="metric" key={r.label} ref={setRevealRef}>
                  <span className="metric-badge">{r.value}</span>
                  <span className="metric-label">{r.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ================= FINALE / CONTACT ================= */}
        <section id="contact" className="section contact">
          <div className="seal" ref={finaleSealRef} aria-hidden />
          <div className="contact-content" ref={setRevealRef}>
            <h2>Let’s create something beautiful</h2>
            <p>
              Quick gut-check or a deeper engagement—happy to help. Two easy paths below.
            </p>
            <div className="cta-row">
              <a
                className="btn-primary"
                href="mailto:hello@jessabel.art?subject=Quick%20gut-check"
              >
                15-min gut-check
              </a>
              <a
                className="btn-outline"
                href="mailto:hello@jessabel.art?subject=Project%20inquiry"
              >
                Project inquiry
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Back to top */}
      <a href="#prologue" className="backtotop" aria-label="Back to top">
        ↑
      </a>

      <style>{css}</style>
    </div>
  );
}

/* ------------ Small card component (local state) ------------ */
function FieldCard({ project }) {
  const [open, setOpen] = useState(false);
  return (
    <article className={`card ${open ? "open" : ""}`}>
      <div className="thumb" aria-hidden />
      <header className="card-head">
        <h3>{project.title}</h3>
        <div className="meta">
          <span>{project.role}</span>
          <span>•</span>
          <span>{project.time}</span>
        </div>
      </header>

      <button
        type="button"
        className="peek-btn"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Hide peek" : "Peek"}
      </button>

      <div className="peek">
        <dl>
          <dt>Problem</dt>
          <dd>{project.problem}</dd>
          <dt>Process</dt>
          <dd>{project.process}</dd>
          <dt>Outcome</dt>
          <dd>
            {project.outcome} <span className="chip">Case study →</span>
          </dd>
        </dl>
      </div>
    </article>
  );
}

/* ===================== CSS ===================== */
const css = `
:root{
  /* Earthy palette */
  --brand-1:#d2691e; --brand-2:#cd853f; --brand-3:#8b4513; --brand-4:#a0522d;
  --gold-1:#daa520; --gold-2:#b8860b; --ink:#3a2f2a;
  --paper:#f4f1eb; --paper-2:#ede7df; --paper-3:#e7dfd4;
  /* Accent sweep used sparingly */
  --accent-a:#ff3ea5; --accent-b:#00c2b2;
  /* Shadows */
  --sh-xs:0 2px 6px rgba(0,0,0,.06);
  --sh-sm:0 6px 18px rgba(0,0,0,.10);
  --sh-md:0 14px 28px rgba(0,0,0,.14);
  --sh-lg:0 30px 80px rgba(0,0,0,.20);
}

*{box-sizing:border-box}
html,body,#root{height:100%}
body{margin:0}
.hp-root{font-family: Georgia, serif; background:var(--paper); color:var(--ink); overflow-x:hidden}

/* Controls */
.preview-controls{position:fixed; z-index:110; bottom:20px; left:20px}
.preview-controls .toggle{background:#fff; border:1px solid rgba(0,0,0,.08); border-radius:999px; padding:8px 14px; cursor:pointer; box-shadow:var(--sh-xs)}
.preview-controls .toggle:focus{outline:2px solid var(--brand-1); outline-offset:2px}

/* Cursor */
.cursor{width:20px; height:20px; border:2px solid var(--brand-1); border-radius:50%; position:fixed; top:0; left:0; pointer-events:none; z-index:120; mix-blend-mode:multiply; transform:translate(-50%, -50%); transition:width .12s,height .12s, background .12s, transform .03s linear}
.cursor.hover{width:42px; height:42px; background:rgba(210,105,30,.22)}

/* Brand + Nav */
.brand{position:fixed; top:24px; left:24px; z-index:100; background:rgba(255,255,255,.92); backdrop-filter:blur(10px); border-radius:22px; padding:10px 16px; border:1px solid rgba(210,105,30,.22)}
.brand-initial{font-weight:800; color:var(--brand-1); margin-right:8px}
.brand-title{font-size:13px}

.nav{position:fixed; top:24px; right:24px; z-index:100; display:flex; gap:8px; flex-wrap:wrap; align-items:center}
.nav-pill{background:rgba(255,255,255,.92); backdrop-filter:blur(10px); border-radius:9999px; padding:8px 16px; min-height:36px; display:inline-flex; align-items:center; line-height:1; border:1px solid rgba(210,105,30,.18); color:var(--ink); text-decoration:none; font-size:14px; letter-spacing:.2px; box-shadow:var(--sh-xs); transition:transform .18s ease, background .18s ease, color .18s ease}
.nav-pill:hover,.nav-pill.active{background:var(--brand-1); color:#fff; transform:translateY(-2px)}
.nav-pill.contact{background:var(--brand-3); color:#fff}

/* Content wrapper */
.content{position:relative; z-index:10}

/* Sections */
.section{padding:110px 5%}
.section h2{font-size:clamp(2rem,5vw,3rem); margin:0 0 8px}
.section .sub{color:#6a594f}

/* Prologue */
.prologue{position:relative; padding-top:140px; padding-bottom:140px; overflow:hidden}
.prologue-shape{position:absolute; width:min(90%, 760px); height:300px; background:#fff; border-radius:48px; top:50%; left:50%; transform:translate(-50%, -50%) rotate(-10deg); box-shadow:var(--sh-sm)}
.prologue-copy{position:relative; max-width:900px; margin:0 auto; text-align:center}
.prologue-copy h1{font-size:clamp(2.2rem,6.5vw,4.2rem); line-height:1.08; margin:0 0 14px}
.inkline{background:linear-gradient(120deg,var(--gold-1),var(--gold-2)); -webkit-background-clip:text; background-clip:text; color:transparent}
.prologue-copy p{font-size:clamp(1.1rem,2.6vw,1.4rem); color:#6a594f}

/* About */
.about .about-grid{display:grid; grid-template-columns:1.2fr .8fr; gap:60px; align-items:center; max-width:1200px; margin:0 auto}
.about h2{font-size:clamp(2rem,5vw,3.2rem); margin-bottom:10px}
.about p{font-size:1.05rem; line-height:1.7; color:#6a594f}
.about .cta-row{display:flex; gap:10px; margin-top:14px; flex-wrap:wrap}
.btn-primary{background:linear-gradient(135deg,var(--accent-a),var(--accent-b)); color:#0b0f1a; padding:12px 18px; border-radius:999px; text-decoration:none; box-shadow:var(--sh-sm)}
.btn-outline{background:#fff; color:var(--ink); border:1px solid #d5c8b6; padding:11px 16px; border-radius:999px; text-decoration:none}
.about-visual{position:relative; min-height:360px}
.about-disc{position:absolute; top:48%; left:50%; transform:translate(-50%, -50%); width:340px; height:340px; border-radius:50%; background:linear-gradient(135deg,var(--gold-1),var(--gold-2)); box-shadow:var(--sh-md)}
.about-photo{position:absolute; bottom:-10px; left:50%; transform:translateX(-50%); width:220px; height:260px; border-radius:18px; background:
  radial-gradient(120% 140% at 30% 25%, #ffffffaa, transparent 40%),
  linear-gradient(135deg,#b07a5a,#6c4b3a); box-shadow:0 18px 40px rgba(0,0,0,.18); border:1px solid rgba(255,255,255,.5)}
.circular-text{position:absolute; top:4px; right:-10px; width:230px; height:230px; pointer-events:none}
.circular-text svg{width:100%; height:100%}
.circular-text text{font-size:14px; letter-spacing:.18em; fill:#553d33}

/* Workbench (pins) */
.workbench{background:var(--paper-2); border-block:1px solid #e4dbcf}
.center{text-align:center}
.tool-pins{margin:24px auto 0; display:flex; flex-wrap:wrap; gap:12px; justify-content:center; max-width:1000px}
.pin{display:inline-flex; align-items:center; gap:8px; padding:10px 14px; background:#fff; border:1px solid #e5d9ca; border-radius:999px; font-weight:600; box-shadow:var(--sh-xs); transition:transform .18s ease, box-shadow .18s ease}
.pin:hover{transform:translateY(-2px); box-shadow:var(--sh-sm)}
.pin .dot{width:10px; height:10px; border-radius:50%; background:var(--accent-a)}

/* Field Notes (index cards) */
.fieldnotes{background:var(--paper)}
.cards{display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:18px; max-width:1200px; margin:18px auto 0}
.card{position:relative; border-radius:18px; background:#fff; border:1px solid #e5d9ca; box-shadow:0 10px 24px rgba(0,0,0,.06); overflow:hidden; transition:transform .18s ease, box-shadow .18s ease}
.card:hover{transform:translateY(-4px); box-shadow:var(--sh-md)}
.card .thumb{height:160px; background:
  linear-gradient(0deg, rgba(0,0,0,.08), rgba(0,0,0,.08)),
  linear-gradient(135deg,#caa27f,#8a5f45); filter:saturate(.7); transition:filter .2s ease}
.card:hover .thumb{filter:saturate(1)}
.card-head{padding:14px 14px 4px}
.card-head h3{margin:0 0 4px; font-size:1.2rem}
.card-head .meta{font-size:.9rem; color:#6a594f; display:flex; gap:8px; align-items:center}
.peek-btn{margin:10px 14px 12px; padding:8px 12px; background:linear-gradient(135deg,var(--accent-a),var(--accent-b)); color:#0b0f1a; border:none; border-radius:10px; cursor:pointer; box-shadow:var(--sh-xs)}
.peek{display:grid; grid-template-columns:1fr; gap:6px; padding:0 14px 16px; max-height:0; overflow:hidden; transition:max-height .26s ease}
.card.open .peek{max-height:300px}
.peek dt{font-weight:700; margin-top:6px}
.peek dd{margin:4px 0 0; color:#6a594f}
.chip{display:inline-block; margin-left:8px; padding:2px 8px; border-radius:999px; background:linear-gradient(135deg,var(--accent-a),var(--accent-b)); color:#0b0f1a; font-weight:700}

/* Results (rail + metrics) */
.results{background:var(--paper-3)}
.results h2{margin-bottom:12px}
.rail-wrap{position:relative; max-width:900px; margin:0 auto}
.rail{position:absolute; left:10px; top:0; bottom:0; width:6px; border-radius:999px; background:linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.12))}
.rail-fill{position:absolute; left:12px; top:0; width:2px; height:100%; transform-origin:top; background:linear-gradient(180deg,var(--accent-a),var(--accent-b)); opacity:.9; animation:fill 3s ease forwards}
@keyframes fill{from{transform:scaleY(0)} to{transform:scaleY(1)}}
.metrics{list-style:none; margin:0; padding:0 0 0 40px; display:grid; gap:14px}
.metric{display:flex; align-items:center; gap:12px; background:#fff; border:1px solid #e5d9ca; border-radius:14px; padding:12px 14px; box-shadow:var(--sh-xs)}
.metric-badge{display:inline-flex; align-items:center; justify-content:center; min-width:64px; height:30px; border-radius:999px; color:#0b0f1a; font-weight:800; background:linear-gradient(135deg,var(--accent-a),var(--accent-b))}
.metric-label{color:#6a594f; font-weight:600}

/* Finale */
.contact{position:relative; overflow:hidden}
.seal{position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:360px; height:360px; border-radius:50%; background:linear-gradient(135deg,var(--gold-1),var(--gold-2)); box-shadow:var(--sh-lg); opacity:.95}
.contact-content{position:relative; max-width:680px; margin:0 auto; text-align:center}
.contact h2{font-size:clamp(2rem,5vw,3rem); margin-bottom:10px}
.contact p{color:#6a594f; margin-bottom:16px}

/* Floating dust motes */
.floating-elements{position:fixed; inset:0; pointer-events:none; z-index:0}
.floating-dot{position:absolute; width:8px; height:8px; background:var(--brand-1); border-radius:50%; opacity:.25; animation:floatDot 15s ease-in-out infinite}
.floating-dot:nth-child(1){top:20%; left:10%; animation-delay:0s}
.floating-dot:nth-child(2){top:58%; right:15%; animation-delay:-5s}
.floating-dot:nth-child(3){bottom:30%; left:70%; animation-delay:-10s}
@keyframes floatDot{0%,100%{transform:translateY(0)} 50%{transform:translateY(-26px)}}

/* Reveal */
.prologue-copy, .about-text, .pin, .cards, .results h2, .metrics, .contact-content, .center, .sub{opacity:0; transform:translateY(40px); transition:opacity .6s ease, transform .6s ease}
.reveal-in{opacity:1 !important; transform:translateY(0) !important}

/* Back to top */
.backtotop{position:fixed; right:18px; bottom:18px; width:40px; height:40px; border-radius:999px; background:#fff; color:#333; display:grid; place-items:center; border:1px solid #e5d9ca; text-decoration:none; box-shadow:var(--sh-xs)}

/* Responsive */
@media (max-width: 980px){
  .about .about-grid{grid-template-columns:1fr; gap:36px}
  .seal{width:300px; height:300px}
}
@media (max-width: 740px){
  .nav{top:16px; right:16px}
  .brand{top:16px; left:16px}
  .section{padding:90px 5%}
}
`;
