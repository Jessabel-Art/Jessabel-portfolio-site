import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";

export default function HorizonPreviewPage() {
  const prefersReducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  const cursorRef = useRef(null);
  const heroShapeRef = useRef(null);
  const philoShapeRef = useRef(null);
  const contactShapeRef = useRef(null);
  const floatingDotsRef = useRef([]);
  const revealRefs = useRef([]);
  const [motionOn, setMotionOn] = useState(!prefersReducedMotion);

  const setFloatingDotRef = (el, i) => (floatingDotsRef.current[i] = el);
  const setRevealRef = (el) => el && revealRefs.current.push(el);

  // custom cursor
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    let rafId = null;
    let x = 0, y = 0;

    const move = (e) => { x = e.clientX; y = e.clientY; if (!rafId) rafId = requestAnimationFrame(tick); };
    const tick = () => { cursor.style.transform = `translate(${x}px, ${y}px)`; rafId = null; };

    const onOver = (e) => { if (e.target.closest("a, button, .nav-pill, .contact-button")) cursor.classList.add("hover"); };
    const onOut  = (e) => { if (e.target.closest("a, button, .nav-pill, .contact-button")) cursor.classList.remove("hover"); };

    const onKeyDown = (e) => e.key === "Tab" && (cursor.style.display = "none");
    const onMouseDown = () => (cursor.style.display = "");

    document.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onMouseDown);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onMouseDown);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // scroll parallax
  useEffect(() => {
    if (!motionOn) return;
    const hero = heroShapeRef.current;
    const philo = philoShapeRef.current;
    const contact = contactShapeRef.current;
    let rafId = null;

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const s = window.pageYOffset || 0;
        if (hero)   hero.style.transform   = `translate(-50%, -50%) translateY(${Math.min(60, s * 0.10)}px)`;
        if (philo)  philo.style.transform  = `translate(-50%, -50%) rotate(-12deg) translateY(${Math.min(48, s * 0.06)}px)`;
        if (contact) contact.style.transform = `translateY(calc(-50% + ${Math.min(56, s * 0.08)}px))`;
        rafId = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (rafId) cancelAnimationFrame(rafId); };
  }, [motionOn]);

  // mouse parallax dots
  useEffect(() => {
    if (!motionOn) return;
    let rafId = null;
    let nx = 0, ny = 0;

    const onMove = (e) => {
      nx = e.clientX / window.innerWidth - 0.5;
      ny = e.clientY / window.innerHeight - 0.5;
      if (!rafId) rafId = requestAnimationFrame(tick);
    };
    const tick = () => {
      floatingDotsRef.current.forEach((dot, i) => {
        if (!dot) return;
        const speed = (i + 1) * 0.3;
        const x = nx * speed * 30;
        const y = ny * speed * 30;
        dot.style.transform = `translate(${x}px, ${y}px)`;
      });
      rafId = null;
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    return () => { document.removeEventListener("mousemove", onMove); if (rafId) cancelAnimationFrame(rafId); };
  }, [motionOn]);

  // reveal on scroll
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("reveal-in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });

    revealRefs.current.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const onNavClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    document.querySelectorAll(".nav-pill").forEach((l) => l.classList.remove("active"));
    e.currentTarget.classList.add("active");
  };

  return (
    <div className="hp-root">
      <Helmet><title>Preview — Warm UX Motion</title></Helmet>

      {/* a11y */}
      <a className="skip-link" href="#main">Skip to content</a>

      {/* Preview control */}
      <div className="preview-controls" role="group" aria-label="Preview controls">
        <button className="toggle" onClick={() => setMotionOn(v => !v)} aria-pressed={motionOn}>
          {motionOn ? "Motion: On" : "Motion: Off"}
        </button>
      </div>

      {/* Custom Cursor */}
      <div className="cursor" ref={cursorRef} aria-hidden="true" />

      {/* Floating Elements */}
      <div className="floating-elements" aria-hidden>
        <div className="floating-dot" ref={(el) => setFloatingDotRef(el, 0)} />
        <div className="floating-dot" ref={(el) => setFloatingDotRef(el, 1)} />
        <div className="floating-dot" ref={(el) => setFloatingDotRef(el, 2)} />
      </div>

      {/* Brand */}
      <div className="brand" aria-label="Brand">
        <span className="brand-initial">J</span>
        <span className="brand-title">UX Designer</span>
      </div>

      {/* Navigation */}
      <nav className="nav" aria-label="Preview navigation">
        <a href="#what-i-do" className="nav-pill" onClick={(e) => onNavClick(e, "#what-i-do")}>What I Do</a>
        <a href="#values" className="nav-pill" onClick={(e) => onNavClick(e, "#values")}>My Values</a>
        <a href="#about" className="nav-pill" onClick={(e) => onNavClick(e, "#about")}>About</a>
        <a href="#contact" className="nav-pill contact" onClick={(e) => onNavClick(e, "#contact")}>Contact</a>
      </nav>

      <main id="main" className="content" tabIndex={-1}>
        {/* Hero */}
        <section className="hero" aria-label="Hero">
          <div className="hero-sphere" ref={heroShapeRef} />
          <div className="hero-name">
            <h1><span className="first-name">Hi, I’m Jessabel</span></h1>
            <p className="tagline">UX Strategist crafting warm, data-backed experiences.</p>
          </div>
        </section>

        {/* Philosophy */}
        <section className="philosophy" id="values" aria-label="Design philosophy">
          <div className="philosophy-shape" ref={philoShapeRef} />
          <div className="philosophy-text">
            <p>At the heart of <span className="highlight">Design</span> is an opportunity to
              <span className="highlight"> problem solve.</span></p>
          </div>
        </section>

        {/* About */}
        <section id="about" className="about" aria-labelledby="about-heading">
          <div className="about-container">
            <div className="about-intro" ref={setRevealRef}>
              <h2 id="about-heading">Hi there, I'm Jessabel.</h2>
              <div className="about-subtitle">Also Jessy</div>
            </div>

            <div className="about-content" ref={setRevealRef}>
              <div className="about-text">
                <p>A designer and systems thinker aligning human needs with business outcomes. I translate research into clear flows, interfaces, and decisions.</p>
                <p>I love tactile, warm interfaces—coffee, museums, and maps of great spaces. I believe the best design emerges from empathy + evidence.</p>
                <div className="about-chips" role="list">
                  <span role="listitem" className="chip">Research</span>
                  <span role="listitem" className="chip">IA</span>
                  <span role="listitem" className="chip">Prototyping</span>
                  <span role="listitem" className="chip">Analytics</span>
                </div>
              </div>

              <div className="about-visual">
                <div className="about-shape">
                  <div className="about-image" aria-hidden />
                </div>
                {/* Circular text overlaps the gold circle, animates above it */}
                <div className="circular-text" aria-hidden>
                  <svg viewBox="0 0 220 220">
                    <path id="circle" d="M 110,110 m -85,0 a 85,85 0 1,1 170,0 a 85,85 0 1,1 -170,0" fill="none" />
                    <text>
                      <textPath href="#circle">
                        PROBLEM SOLVING • EMPATHY • CREATIVITY • PROBLEM SOLVING • EMPATHY •
                      </textPath>
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What I Do (replaces Selected Work) */}
        <section id="what-i-do" className="what-i-do" aria-labelledby="what-heading">
          <div className="service-arch" ref={setRevealRef}>
            <svg viewBox="0 0 1200 400" aria-hidden>
              <path id="arch" d="M50,350 Q600,-300 1150,350" fill="none" />
              <text className="arch-text"><textPath href="#arch">Let's see how I may help you</textPath></text>
            </svg>
          </div>

          <div className="services-wrap">
            {["Website Audit", "UI/UX Design", "Design Workshops", "Consulting", "Mentorship"].map((s) => (
              <div className="service-bubble" key={s}><span>{s}</span></div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="contact" aria-labelledby="contact-heading">
          <div className="contact-shape" ref={contactShapeRef} />
          <div className="contact-content" ref={setRevealRef}>
            <h2 id="contact-heading">Let's Create Something Beautiful</h2>
            <p>I love partnering on meaningful products. Want a quick gut-check or a deeper UX audit? Pick a path below.</p>
            <div className="cta-row">
              <a href="mailto:hello@jessabel.art" className="contact-button">Start a Conversation</a>
              <a href="#" className="secondary">View résumé</a>
            </div>
          </div>
        </section>
      </main>

      <style>{css}</style>
    </div>
  );
}

const css = `
:root{
  --brand-1:#d2691e; --brand-2:#cd853f; --brand-3:#8b4513; --brand-4:#a0522d;
  --gold-1:#daa520; --gold-2:#b8860b; --ink:#3a2f2a; --paper:#f4f1eb; --paper-2:#ede7df;
  --step--1:.875rem; --step-0:1rem; --step-1:1.25rem; --step-2:1.75rem; --step-3:2.5rem; --step-4:3.5rem; --step-5: clamp(3rem, 8vw, 7rem);
  --space-1:.25rem; --space-2:.5rem; --space-3:.75rem; --space-4:1rem; --space-5:1.5rem; --space-6:2rem; --space-7:2.5rem; --space-8:3rem; --space-10:4rem; --space-14:6rem;
  --sh-xs:0 2px 6px rgba(0,0,0,.06); --sh-sm:0 6px 18px rgba(0,0,0,.10); --sh-md:0 14px 28px rgba(0,0,0,.14); --sh-lg:0 30px 80px rgba(0,0,0,.20);
}
*{box-sizing:border-box}
.hp-root{font-family: Georgia, 'Times New Roman', serif; background:var(--paper); color:var(--ink); overflow-x:hidden}

/* a11y */
.skip-link{position:absolute; left:-999px; top:auto; width:1px; height:1px; overflow:hidden}
.skip-link:focus{left:20px; top:20px; width:auto; height:auto; background:#fff; padding:8px 12px; border-radius:8px; box-shadow:var(--sh-sm)}

/* preview control */
.preview-controls{position:fixed; z-index:110; bottom:20px; left:20px}
.preview-controls .toggle{background:#fff; border:1px solid rgba(0,0,0,.08); border-radius:999px; padding:8px 14px; cursor:pointer; box-shadow:var(--sh-xs)}
.preview-controls .toggle:focus{outline:2px solid var(--brand-1); outline-offset:2px}

/* cursor */
.cursor{width:20px; height:20px; border:2px solid var(--brand-1); border-radius:50%; position:fixed; top:0; left:0; pointer-events:none; z-index:120; mix-blend-mode:difference; transform:translate(-50%, -50%); transition:width .12s,height .12s, background .12s, transform .03s linear}
.cursor.hover{width:40px; height:40px; background:color-mix(in oklab, var(--brand-1) 25%, transparent)}

/* nav + brand */
.nav{position:fixed; top:28px; right:28px; z-index:100; display:flex; gap:10px; flex-wrap:wrap; align-items:center; max-width:min(90vw, 720px)}
.nav-pill{background:rgba(255,255,255,.92); backdrop-filter:blur(10px); border-radius:9999px; padding:8px 16px; min-height:36px; display:inline-flex; align-items:center; gap:8px; line-height:1; border:1px solid color-mix(in oklab, var(--brand-1) 20%, transparent); color:var(--ink); text-decoration:none; font-size:14px; letter-spacing:.2px; box-shadow:var(--sh-xs); transition:transform .18s ease, background .18s ease, color .18s ease}
.nav-pill:hover,.nav-pill.active{background:var(--brand-1); color:#fff; transform:translateY(-2px)}
.nav-pill:focus{outline:2px solid var(--brand-2); outline-offset:3px}
.nav-pill.contact{background:var(--brand-3); color:#fff}
.nav-pill.contact:hover{background:var(--brand-4)}
.brand{position:fixed; top:28px; left:28px; z-index:100; background:rgba(255,255,255,.9); backdrop-filter:blur(10px); border-radius:25px; padding:10px 18px; border:1px solid color-mix(in oklab, var(--brand-1) 20%, transparent)}
.brand-initial{font-size:20px; font-weight:700; color:var(--brand-1); margin-right:8px}
.brand-title{font-size:13px}

.content{position:relative; z-index:10}

/* hero */
.hero{height:100vh; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden}
.hero-sphere{position:absolute; width:min(60vw, 520px); aspect-ratio:1/1; top:50%; left:50%; transform:translate(-50%, -50%); border-radius:50%;
  background:
    radial-gradient(120% 120% at 35% 30%, #fff8, #0000 45%),
    radial-gradient(60% 60% at 65% 70%, #0004, #0000 55%),
    radial-gradient(100% 100% at 50% 50%, var(--brand-2), var(--brand-1));
  box-shadow: var(--sh-lg);}
.hero-name{text-align:center; position:absolute; z-index:3; top:50%; left:50%; transform:translate(-50%, -58%)}
.hero-name h1{font-weight:300; line-height:.92; font-size:var(--step-5); margin:0}
.hero-name .first-name{display:block}
.tagline{margin-top:var(--space-4); font-size:var(--step-1)}

/* philosophy */
.philosophy{padding:var(--space-14) 5%; position:relative; overflow:hidden}
.philosophy-shape{position:absolute; width:min(90%, 740px); height:300px; background:#fff; border-radius:50px; top:50%; left:50%; transform:translate(-50%, -50%) rotate(-12deg); box-shadow:var(--sh-sm)}
.philosophy-text{position:relative; text-align:center; max-width:700px; margin:0 auto}
.philosophy-text p{font-weight:300; font-size:clamp(1.5rem, 4vw, 3rem); line-height:1.25; font-style:italic}
.philosophy-text .highlight{font-style:normal; font-weight:500}

/* about */
.about{padding:var(--space-14) 5%; position:relative}
.about-container{max-width:1200px; margin:0 auto}
.about-intro h2{font-size:var(--step-4); font-weight:300; margin-bottom:var(--space-5)}
.about-subtitle{display:inline-block; background:color-mix(in oklab, var(--brand-3) 10%, #fff); color:var(--brand-3); padding:8px 16px; border-radius:999px}
.about-content{display:grid; grid-template-columns:1fr 1fr; gap:100px; align-items:start}
.about-text{font-size:var(--step-0); line-height:1.75}
.about-chips{display:flex; gap:8px; margin-top:var(--space-4); flex-wrap:wrap}
.chip{background:rgba(139,69,19,.08); color:var(--brand-3); padding:6px 12px; border-radius:999px; font-size:.875rem}
.about-visual{position:relative}
.about-shape{width:340px; height:340px; background:linear-gradient(135deg, var(--gold-1), var(--gold-2)); border-radius:50%; position:relative; overflow:hidden; box-shadow:var(--sh-md)}
.about-image{position:absolute; inset:auto 0 0 60px; width:220px; height:260px; background:linear-gradient(180deg, #5c3a2e, #8b4513); border-radius:14px; box-shadow:var(--sh-md)}
/* circular text overlaps gold circle */
.circular-text{position:absolute; top:-10px; right:-20px; width:220px; height:220px; z-index:4; pointer-events:none}
.circular-text svg{width:100%; height:100%; animation:rotate 20s linear infinite}
.circular-text text{font-size:14px; fill:var(--brand-3); letter-spacing:2px}
@keyframes rotate{from{transform:rotate(0)} to{transform:rotate(360deg)}}

/* WHAT I DO */
.what-i-do{padding:var(--space-14) 5%; background:linear-gradient(135deg, var(--paper) 0%, var(--paper-2) 100%); position:relative; overflow:hidden}
.service-arch{max-width:1200px;margin:0 auto;text-align:center}
.service-arch svg{width:100%;height:auto}
.arch-text{font-size:clamp(2.2rem,8vw,5rem);font-family: Georgia, 'Times New Roman', serif;fill:var(--brand-3)}
.services-wrap{max-width:1200px; margin:0 auto; display:flex; flex-wrap:wrap; gap:28px; align-items:center; justify-content:center; padding-top:var(--space-10)}
.services-wrap .service-bubble{width:clamp(180px,24vw,260px); aspect-ratio:1/1; border-radius:9999px; display:flex; align-items:center; justify-content:center; background:#fff; border:1px solid rgba(0,0,0,.12); box-shadow:var(--sh-sm); transition:transform .2s ease, box-shadow .2s ease}
.services-wrap .service-bubble:hover{transform:translateY(-4px); box-shadow:var(--sh-md)}
.services-wrap .service-bubble span{font-size:1.1rem; text-align:center; padding:0 12px; color:var(--ink)}

/* contact */
.contact{padding:var(--space-14) 5%; position:relative; overflow:hidden}
.contact-shape{position:absolute; width:520px; height:520px; background:linear-gradient(135deg, var(--brand-3), var(--brand-4)); border-radius:50%; top:50%; right:-120px; transform:translateY(-50%); box-shadow:var(--sh-lg)}
.contact-content{max-width:640px; position:relative}
.contact h2{font-size:var(--step-4); font-weight:300; margin:0 0 var(--space-3)}
.contact p{font-size:var(--step-1); line-height:1.6; margin:0 0 var(--space-6)}
.cta-row{display:flex; gap:16px; align-items:center; flex-wrap:wrap}
.contact-button{background:var(--brand-1); color:#fff; padding:16px 28px; border-radius:999px; text-decoration:none; font-size:var(--step-0); box-shadow:var(--sh-md); transition:transform .2s ease, box-shadow .2s ease}
.contact-button:hover{transform:translateY(-2px); box-shadow:var(--sh-lg)}
.secondary{padding:10px 14px; border-radius:10px; background:#fff; text-decoration:none; border:1px solid rgba(0,0,0,.06)}
.secondary:hover{box-shadow:var(--sh-sm)}

/* floating dots */
.floating-elements{position:fixed; inset:0; pointer-events:none; z-index:0}
.floating-dot{position:absolute; width:8px; height:8px; background:var(--brand-1); border-radius:50%; opacity:.3; animation:floatDot 15s ease-in-out infinite}
.floating-dot:nth-child(1){top:20%; left:10%; animation-delay:0s}
.floating-dot:nth-child(2){top:58%; right:15%; animation-delay:-5s}
.floating-dot:nth-child(3){bottom:30%; left:70%; animation-delay:-10s}
@keyframes floatDot{0%,100%{transform:translateY(0)} 50%{transform:translateY(-30px)}}

/* reveal */
.about-intro, .about-content, .service-arch, .contact-content{opacity:0; transform:translateY(50px); transition:opacity .6s ease, transform .6s ease}
.reveal-in{opacity:1 !important; transform:translateY(0) !important}

/* responsive */
@media (max-width: 992px){
  .about-content{gap:60px}
}
@media (max-width: 768px){
  .nav{top:16px; right:16px; gap:8px}
  .nav-pill{font-size:13px; padding:8px 12px; min-height:34px}
  .brand{top:16px; left:16px}
  .hero-sphere{width:min(74vw, 360px)}
  .about-content{grid-template-columns:1fr; gap:36px}
  .contact-shape{width:320px; height:320px; right:-160px}
  .circular-text{top:-6px; right:-6px; width:180px; height:180px}
  .services-wrap{gap:18px}
}

/* reduced motion */
@media (prefers-reduced-motion: reduce){
  .circular-text svg{animation:none}
  .floating-dot{animation:none}
}
`;
