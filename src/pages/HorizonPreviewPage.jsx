import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";

/**
 * HorizonPreviewPage — animated pass
 * Restores/keeps:
 * - Custom cursor
 * - Floating dots (float + mouse parallax)
 * - Parallax on scroll (hero/philosophy/contact shapes)
 * - Smooth-scroll nav + active state
 * - IntersectionObserver reveal-on-scroll
 * - Circular text overlapping gold circle (animated)
 * - Normal-sized nav pills
 */
export default function HorizonPreviewPage() {
  const prefersReducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  // Refs
  const cursorRef = useRef(null);
  const heroSphereRef = useRef(null);
  const philoShapeRef = useRef(null);
  const contactShapeRef = useRef(null);
  const circularTextRef = useRef(null);
  const dotsRef = useRef([]);
  const revealRefs = useRef([]);
  const setRevealRef = (el) => el && revealRefs.current.push(el);

  const [motionOn, setMotionOn] = useState(!prefersReducedMotion);

  // ----- Custom cursor
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    let rafId = null;
    let x = 0, y = 0;
    const move = (e) => { x = e.clientX; y = e.clientY; if (!rafId) rafId = requestAnimationFrame(tick); };
    const tick = () => { cursor.style.transform = `translate(${x}px, ${y}px)`; rafId = null; };
    const over = (e) => { if (e.target.closest("a, button, .nav-pill, .contact-button")) cursor.classList.add("hover"); };
    const out  = (e) => { if (e.target.closest("a, button, .nav-pill, .contact-button")) cursor.classList.remove("hover"); };
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

  // ----- Circular text rotation (independent of reduced motion but slower if reduced)
  useEffect(() => {
    const el = circularTextRef.current;
    if (!el) return;
    let angle = 0;
    let rafId;
    const speed = prefersReducedMotion ? 0.05 : 0.2;
    const rotate = () => { angle = (angle + speed) % 360; el.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`; rafId = requestAnimationFrame(rotate); };
    rafId = requestAnimationFrame(rotate);
    return () => cancelAnimationFrame(rafId);
  }, [prefersReducedMotion]);

  // ----- Parallax on scroll
  useEffect(() => {
    if (!motionOn) return;
    const hero = heroSphereRef.current;
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

  // ----- Floating dots: float + mouse parallax
  useEffect(() => {
    if (!motionOn) return;
    let rafId = null;
    let nx = 0, ny = 0;
    const onMove = (e) => { nx = e.clientX / window.innerWidth - 0.5; ny = e.clientY / window.innerHeight - 0.5; if (!rafId) rafId = requestAnimationFrame(tick); };
    const tick = () => {
      dotsRef.current.forEach((dot, i) => {
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

  // ----- Reveal on scroll
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("reveal-in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
    revealRefs.current.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // ----- Smooth scroll nav + active state
  const onNavClick = (e, href) => {
    e.preventDefault();
    const t = document.querySelector(href);
    if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
    document.querySelectorAll(".nav-pill").forEach((n) => n.classList.remove("active"));
    e.currentTarget.classList.add("active");
  };

  return (
    <div className="hp-root">
      <Helmet><title>Jessabel — UX Strategist</title></Helmet>

      {/* Preview control */}
      <div className="preview-controls" role="group" aria-label="Preview controls">
        <button className="toggle" onClick={() => setMotionOn((v) => !v)} aria-pressed={motionOn}>
          {motionOn ? "Motion: On" : "Motion: Off"}
        </button>
      </div>

      {/* Custom Cursor */}
      <div className="cursor" ref={cursorRef} aria-hidden />

      {/* Floating elements layer */}
      <div className="floating-elements" aria-hidden>
        <div className="floating-dot" ref={(el) => (dotsRef.current[0] = el)} />
        <div className="floating-dot" ref={(el) => (dotsRef.current[1] = el)} />
        <div className="floating-dot" ref={(el) => (dotsRef.current[2] = el)} />
      </div>

      {/* Brand */}
      <div className="brand"><span className="brand-initial">J</span><span className="brand-title">UX Designer</span></div>

      {/* Navigation */}
      <nav className="nav" aria-label="Preview navigation">
        <a href="#about"   className="nav-pill"         onClick={(e)=>onNavClick(e,"#about")}>About</a>
        <a href="#values"  className="nav-pill"         onClick={(e)=>onNavClick(e,"#values")}>My Values</a>
        <a href="#whatido" className="nav-pill"         onClick={(e)=>onNavClick(e,"#whatido")}>What I Do</a>
        <a href="#contact" className="nav-pill contact" onClick={(e)=>onNavClick(e,"#contact")}>Contact</a>
      </nav>

      <main id="main" className="content" tabIndex={-1}>
        {/* Hero */}
        <section className="hero" aria-label="Hero">
          <div className="hero-sphere" ref={heroSphereRef} />
          <div className="hero-name">
            <h1>Hi, I'm Jessabel</h1>
          </div>
        </section>

        {/* Philosophy */}
        <section className="philosophy" id="values" aria-label="Design philosophy">
          <div className="philosophy-shape" ref={philoShapeRef} />
          <div className="philosophy-text" ref={setRevealRef}>
            <p>At the heart of <span className="highlight">Design</span> is an opportunity to<span className="highlight"> problem solve.</span></p>
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
              </div>
              <div className="about-visual">
                <div className="about-shape">
                  <div className="about-image" aria-hidden />
                  {/* Circular text overlaps gold circle */}
                  <div className="circular-text" ref={circularTextRef} aria-hidden>
                    <svg viewBox="0 0 220 220">
                      <path id="circle" d="M 110,110 m -85,0 a 85,85 0 1,1 170,0 a 85,85 0 1,1 -170,0" fill="none" />
                      <text><textPath href="#circle">PROBLEM SOLVING • EMPATHY • CREATIVITY • PROBLEM SOLVING •</textPath></text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What I Do */}
        <section id="whatido" className="whatido" aria-labelledby="what-heading">
          <h2 id="what-heading" className="whatido-heading" ref={setRevealRef}>Let's see how I may help you</h2>
          <div className="whatido-grid">
            {['Website Audit','UI/UX Design','Mentorship','Design Workshops','Consulting'].map((s)=> (
              <div className="whatido-circle" key={s} ref={setRevealRef}><span>{s}</span></div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="contact" aria-labelledby="contact-heading">
          <div className="contact-shape" ref={contactShapeRef} />
          <div className="contact-content" ref={setRevealRef}>
            <h2 id="contact-heading">Let's Create Something Beautiful</h2>
            <p>I love partnering on meaningful products. Want a quick gut‑check or a deeper UX audit? Pick a path below.</p>
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
  --sh-xs:0 2px 6px rgba(0,0,0,.06); --sh-sm:0 6px 18px rgba(0,0,0,.10); --sh-md:0 14px 28px rgba(0,0,0,.14); --sh-lg:0 30px 80px rgba(0,0,0,.20);
}
*{box-sizing:border-box}
.hp-root{font-family: Georgia, serif; background:var(--paper); color:var(--ink); overflow-x:hidden}

/* preview control */
.preview-controls{position:fixed; z-index:110; bottom:20px; left:20px}
.preview-controls .toggle{background:#fff; border:1px solid rgba(0,0,0,.08); border-radius:999px; padding:8px 14px; cursor:pointer; box-shadow:var(--sh-xs)}
.preview-controls .toggle:focus{outline:2px solid var(--brand-1); outline-offset:2px}

/* cursor */
.cursor{width:20px; height:20px; border:2px solid var(--brand-1); border-radius:50%; position:fixed; top:0; left:0; pointer-events:none; z-index:120; mix-blend-mode:difference; transform:translate(-50%, -50%); transition:width .12s,height .12s, background .12s, transform .03s linear}
.cursor.hover{width:40px; height:40px; background:rgba(210,105,30,.22)}

/* nav + brand */
.nav{position:fixed; top:32px; right:32px; z-index:100; display:flex; gap:10px; flex-wrap:wrap; align-items:center}
.nav-pill{background:rgba(255,255,255,.92); backdrop-filter:blur(10px); border-radius:9999px; padding:8px 16px; min-height:36px; display:inline-flex; align-items:center; line-height:1; border:1px solid rgba(210,105,30,.2); color:var(--ink); text-decoration:none; font-size:14px; letter-spacing:.2px; box-shadow:var(--sh-xs); transition:transform .18s ease, background .18s ease, color .18s ease}
.nav-pill:hover,.nav-pill.active{background:var(--brand-1); color:#fff; transform:translateY(-2px)}
.nav-pill.contact{background:var(--brand-3); color:#fff}
.brand{position:fixed; top:32px; left:32px; z-index:100; background:rgba(255,255,255,.9); backdrop-filter:blur(10px); border-radius:25px; padding:10px 18px; border:1px solid rgba(210,105,30,.2)}
.brand-initial{font-size:20px; font-weight:700; color:var(--brand-1); margin-right:8px}
.brand-title{font-size:13px}

.content{position:relative; z-index:10}

/* hero */
.hero{height:100vh; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden}
.hero-sphere{position:absolute; width:min(60vw, 520px); aspect-ratio:1/1; top:50%; left:50%; transform:translate(-50%, -50%); border-radius:50%; background: radial-gradient(120% 120% at 35% 30%, #fff8, #0000 45%), radial-gradient(60% 60% at 65% 70%, #0004, #0000 55%), radial-gradient(100% 100% at 50% 50%, var(--brand-2), var(--brand-1)); box-shadow:var(--sh-lg)}
.hero-name{text-align:center; position:absolute; z-index:3; top:50%; left:50%; transform:translate(-50%, -58%)}
.hero-name h1{font-size:clamp(3rem, 9vw, 7rem); font-weight:300; margin:0}

/* philosophy */
.philosophy{padding:120px 5%; position:relative; overflow:hidden}
.philosophy-shape{position:absolute; width:min(90%, 740px); height:280px; background:#fff; border-radius:50px; top:50%; left:50%; transform:translate(-50%, -50%) rotate(-12deg); box-shadow:var(--sh-sm)}
.philosophy-text{position:relative; text-align:center; max-width:700px; margin:0 auto}
.philosophy-text p{font-size:clamp(1.5rem, 4vw, 3rem); font-style:italic; line-height:1.25}
.highlight{font-style:normal; font-weight:600}

/* about */
.about{padding:120px 5%}
.about-container{max-width:1200px; margin:0 auto}
.about-intro h2{font-size:clamp(2.2rem,5vw,3.5rem); font-weight:300; margin-bottom:20px}
.about-subtitle{display:inline-block; background:rgba(139,69,19,.10); color:var(--brand-3); padding:6px 14px; border-radius:999px; margin-bottom:30px}
.about-content{display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center}
.about-text{line-height:1.7}
.about-visual{position:relative; display:flex; justify-content:center; align-items:center}
.about-shape{width:320px; height:320px; border-radius:50%; background: linear-gradient(135deg, var(--gold-1), var(--gold-2)); position:relative; box-shadow:var(--sh-md)}
.about-image{width:200px; height:240px; background: var(--brand-3); border-radius:14px; position:absolute; bottom:-12px; left:50%; transform:translateX(-50%)}
.circular-text{position:absolute; top:6px; right:-14px; width:230px; height:230px; transform:translate(-50%,-50%); z-index:3; pointer-events:none}
.circular-text svg{width:100%; height:100%}

/* what i do */
.whatido{padding:140px 5%; text-align:center; background: var(--paper-2)}
.whatido-heading{font-size:clamp(2rem,6vw,4rem); font-weight:300; margin-bottom:60px}
.whatido-grid{display:flex; flex-wrap:wrap; justify-content:center; gap:36px}
.whatido-circle{width:180px; height:180px; border-radius:50%; background:#fff; border:1px solid #ddd; display:flex; justify-content:center; align-items:center; box-shadow:0 8px 20px rgba(0,0,0,.08); transition: transform .2s ease, box-shadow .2s ease}
.whatido-circle:hover{transform:translateY(-4px); box-shadow:var(--sh-md)}

/* contact */
.contact{padding:140px 5%; position:relative; overflow:hidden}
.contact-shape{position:absolute; width:460px; height:460px; border-radius:50%; background:linear-gradient(135deg, var(--brand-3), var(--brand-4)); top:50%; right:-120px; transform:translateY(-50%); box-shadow:var(--sh-lg)}
.contact-content{position:relative; max-width:640px}
.contact h2{font-size:clamp(2rem,5vw,3rem); margin-bottom:20px}
.contact p{font-size:1.2rem; margin-bottom:30px}
.cta-row{display:flex; gap:14px; flex-wrap:wrap}
.contact-button{background:var(--brand-1); color:#fff; padding:14px 28px; border-radius:999px; text-decoration:none; display:inline-block}
.secondary{padding:12px 20px; background:#fff; border:1px solid #ddd; border-radius:10px; text-decoration:none}

/* floating dots */
.floating-elements{position:fixed; inset:0; pointer-events:none; z-index:0}
.floating-dot{position:absolute; width:8px; height:8px; background:var(--brand-1); border-radius:50%; opacity:.3; animation:floatDot 15s ease-in-out infinite}
.floating-dot:nth-child(1){top:20%; left:10%; animation-delay:0s}
.floating-dot:nth-child(2){top:58%; right:15%; animation-delay:-5s}
.floating-dot:nth-child(3){bottom:30%; left:70%; animation-delay:-10s}
@keyframes floatDot{0%,100%{transform:translateY(0)} 50%{transform:translateY(-30px)}}

/* reveals */
.about-intro, .about-content, .philosophy-text, .whatido-heading, .whatido-circle, .contact-content{opacity:0; transform:translateY(50px); transition: opacity .6s ease, transform .6s ease}
.reveal-in{opacity:1 !important; transform:translateY(0) !important}

/* responsive */
@media (max-width: 992px){ .about-content{gap:48px} }
@media (max-width: 768px){
  .nav{top:16px; right:16px; gap:8px}
  .brand{top:16px; left:16px}
  .about-content{grid-template-columns:1fr}
  .contact-shape{width:320px; height:320px; right:-160px}
}
`;
