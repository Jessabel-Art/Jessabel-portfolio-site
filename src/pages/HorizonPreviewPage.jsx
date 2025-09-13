import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet";

const HorizonPreviewPage = () => {
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  const cursorRef = useRef(null);
  const heroShapeRef = useRef(null);
  const philosophyShapeRef = useRef(null);
  const contactShapeRef = useRef(null);
  const floatingDotsRef = useRef([]);
  const revealRefs = useRef([]);

  // Helper to attach a ref to lists
  const setFloatingDotRef = (el, i) => {
    floatingDotsRef.current[i] = el;
  };
  const setRevealRef = (el, i) => {
    if (el) revealRefs.current[i] = el;
  };

  useEffect(() => {
    // --- Custom cursor ---
    const cursor = cursorRef.current;
    if (!cursor) return;

    let rafId = null;
    let mouseX = 0, mouseY = 0;

    const move = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const tick = () => {
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      rafId = null;
    };

    // hover enlarge via event delegation
    const onMouseOver = (e) => {
      const t = e.target.closest("a, .nav-pill, .contact-button, button");
      if (!t) return;
      cursor.classList.add("hover");
    };
    const onMouseOut = (e) => {
      const t = e.target.closest("a, .nav-pill, .contact-button, button");
      if (!t) return;
      cursor.classList.remove("hover");
    };

    // Hide custom cursor when tabbing for a11y
    const onKeyDown = (e) => {
      if (e.key === "Tab") cursor.style.display = "none";
    };
    const onMouseDown = () => (cursor.style.display = "");

    document.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onMouseDown);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onMouseDown);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    // --- Parallax on scroll ---
    const hero = heroShapeRef.current;
    const philo = philosophyShapeRef.current;
    const contact = contactShapeRef.current;

    let rafId = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const scrolled = window.pageYOffset || document.documentElement.scrollTop || 0;
        if (hero) hero.style.transform = `translate(-50%, -50%) translateY(${scrolled * 0.10}px)`;
        if (philo) philo.style.transform = `translate(-50%, -50%) rotate(-15deg) translateY(${scrolled * 0.06}px)`;
        if (contact) contact.style.transform = `translateY(calc(-50% + ${scrolled * 0.08}px))`;
        rafId = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    // --- Mouse parallax for floating dots ---
    let rafId = null;
    let nx = 0, ny = 0;

    const onMouseMove = (e) => {
      nx = e.clientX / window.innerWidth - 0.5;
      ny = e.clientY / window.innerHeight - 0.5;
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const tick = () => {
      floatingDotsRef.current.forEach((dot, idx) => {
        if (!dot) return;
        const speed = (idx + 1) * 0.3;
        const x = nx * speed * 30;
        const y = ny * speed * 30;
        dot.style.transform = `translate(${x}px, ${y}px)`;
      });
      rafId = null;
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    // --- Reveal on scroll ---
    const opts = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          io.unobserve(entry.target);
        }
      });
    }, opts);

    revealRefs.current.forEach((el) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(50px)";
      el.style.transition = "all 0.8s ease";
      io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  const css = `
    * { margin:0; padding:0; box-sizing:border-box; }
    body.horizon-preview-scope { cursor: none; }
    .hp-root { font-family: 'Georgia','Times New Roman',serif; background:#f4f1eb; color:#3a2f2a; overflow-x:hidden; min-height:100vh; }

    /* Custom Cursor */
    .cursor {
      width:20px; height:20px; border:2px solid #d2691e; border-radius:50%;
      position:fixed; top:0; left:0; pointer-events:none; z-index:9999;
      transition: width .1s ease, height .1s ease, background .1s ease, transform .03s linear;
      mix-blend-mode:difference; transform: translate(-50%, -50%);
    }
    .cursor.hover { width:40px; height:40px; background:rgba(210,105,30,.2); }

    /* Navigation */
    .nav { position:fixed; top:40px; right:50px; z-index:100; display:flex; gap:40px; }
    .nav-pill {
      background:rgba(255,255,255,.9); -webkit-backdrop-filter:blur(10px); backdrop-filter:blur(10px);
      border-radius:25px; padding:12px 24px; color:#3a2f2a; text-decoration:none; font-size:15px; font-weight:400; letter-spacing:.5px;
      transition: all .3s ease; border:1px solid rgba(210,105,30,.2);
    }
    .nav-pill:hover, .nav-pill.active { background:#d2691e; color:#fff; transform: translateY(-2px); }
    .nav-pill.contact { background:#8b4513; color:#fff; }
    .nav-pill.contact:hover { background:#a0522d; }

    /* Brand */
    .brand {
      position:fixed; top:40px; left:50px; z-index:100;
      background:rgba(255,255,255,.9); -webkit-backdrop-filter:blur(10px); backdrop-filter:blur(10px);
      border-radius:25px; padding:12px 24px; border:1px solid rgba(210,105,30,.2);
    }
    .brand-initial { font-size:24px; font-weight:700; color:#d2691e; margin-right:10px; }
    .brand-title { font-size:14px; color:#3a2f2a; font-weight:400; }

    .content { position:relative; z-index:10; }

    /* Hero */
    .hero { height:100vh; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; }
    .hero-shape {
      position:absolute; width:400px; height:400px;
      background:linear-gradient(135deg, #d2691e, #cd853f);
      border-radius:50%; top:50%; left:50%; transform: translate(-50%, -50%);
      z-index:1; box-shadow: 0 40px 100px rgba(0,0,0,0.15);
    }
    .hero-name { position:absolute; z-index:3; top:50%; left:50%; transform: translate(-50%, -60%); text-align:center; }
    .hero-name h1 { font-size:clamp(3rem, 8vw, 7rem); font-weight:300; color:#3a2f2a; line-height:.9; margin-bottom:0; }
    .hero-name .first-name { position:relative; z-index:4; }
    .hero-name .last-name { color:#fff; position:relative; z-index:2; margin-top:-20px; text-shadow: 0 4px 18px rgba(0,0,0,0.15); }

    /* Philosophy */
    .philosophy { padding:150px 5%; position:relative; overflow:hidden; }
    .philosophy-shape {
      position:absolute; width:600px; height:300px; background:#fff; border-radius:50px;
      top:50%; left:50%; transform: translate(-50%, -50%) rotate(-15deg);
      z-index:1; box-shadow:0 20px 40px rgba(0,0,0,0.1);
    }
    .philosophy-text { position:relative; z-index:3; text-align:center; max-width:600px; margin:0 auto; }
    .philosophy-text p { font-size:clamp(1.5rem, 4vw, 3rem); font-weight:300; color:#3a2f2a; line-height:1.3; font-style:italic; }
    .philosophy-text .highlight { font-style:normal; font-weight:400; }

    /* About */
    .about { padding:150px 5%; position:relative; }
    .about-container { max-width:1200px; margin:0 auto; position:relative; }
    .about-intro { margin-bottom:100px; }
    .about-intro h2 { font-size:clamp(2.5rem, 6vw, 5rem); font-weight:300; color:#3a2f2a; margin-bottom:2rem; }
    .about-subtitle { background:rgba(139,69,19,.1); color:#8b4513; padding:8px 20px; border-radius:20px; display:inline-block; font-size:16px; margin-bottom:40px; }
    .about-content { display:grid; grid-template-columns:1fr 1fr; gap:100px; align-items:start; position:relative; }
    .about-text { font-size:18px; line-height:1.7; color:#3a2f2a; }
    .about-text p { margin-bottom:25px; }
    .about-visual { position:relative; }
    .about-shape {
      width:300px; height:300px; background:linear-gradient(135deg, #daa520, #b8860b);
      border-radius:50%; position:relative; overflow:hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.12);
    }
    .about-image {
      width:200px; height:250px; background:#8b4513; position:absolute; bottom:-20px; left:50px; border-radius:10px; z-index:2;
      box-shadow: 0 18px 40px rgba(0,0,0,0.2);
    }

    /* Circular Text */
    .circular-text { position:absolute; top:-50px; right:-50px; width:200px; height:200px; z-index:3; }
    .circular-text svg { width:100%; height:100%; animation: rotate 20s linear infinite; }
    .circular-text text { font-size:14px; font-weight:400; fill:#8b4513; letter-spacing:2px; }
    @keyframes rotate { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }

    /* Portfolio */
    .portfolio { padding:150px 5%; background:linear-gradient(135deg, #f4f1eb 0%, #ede7df 100%); }
    .portfolio-header { text-align:center; margin-bottom:100px; }
    .portfolio-header h2 { font-size:clamp(2.5rem, 6vw, 5rem); font-weight:300; color:#3a2f2a; margin-bottom:2rem; }

    .project-grid { max-width:1200px; margin:0 auto; display:grid; gap:100px; }
    .project-card { position:relative; padding:80px 0; }
    .project-shape { position:absolute; background:#fff; border-radius:40px; box-shadow:0 20px 40px rgba(0,0,0,0.1); z-index:1; }
    .project-card:nth-child(odd) .project-shape { width:70%; height:200px; top:50px; left:0; transform: rotate(-3deg); }
    .project-card:nth-child(even) .project-shape {
      width:60%; height:220px; top:40px; right:0; transform: rotate(2deg);
      background: linear-gradient(135deg, #d2691e, #cd853f);
    }
    .project-content { position:relative; z-index:3; padding:40px; }
    .project-card:nth-child(odd) .project-content { margin-left:40%; }
    .project-card:nth-child(even) .project-content { margin-right:40%; color:#fff; }
    .project-title { font-size:2.5rem; font-weight:300; margin-bottom:20px; line-height:1.2; }
    .project-description { font-size:18px; line-height:1.6; margin-bottom:30px; }
    .project-tags { display:flex; gap:15px; flex-wrap:wrap; }
    .project-tag { background:rgba(139,69,19,.1); color:#8b4513; padding:8px 16px; border-radius:20px; font-size:14px; }
    .project-card:nth-child(even) .project-tag { background:rgba(255,255,255,.2); color:#fff; }

    /* Contact */
    .contact { padding:150px 5%; position:relative; overflow:hidden; }
    .contact-shape {
      position:absolute; width:500px; height:500px;
      background:linear-gradient(135deg, #8b4513, #a0522d);
      border-radius:50%; top:50%; right:-100px; transform: translateY(-50%);
      z-index:1; box-shadow: 0 30px 80px rgba(0,0,0,0.2);
    }
    .contact-content { max-width:600px; position:relative; z-index:3; }
    .contact h2 { font-size:clamp(2.5rem, 6vw, 5rem); font-weight:300; color:#3a2f2a; margin-bottom:30px; }
    .contact p { font-size:20px; line-height:1.6; color:#3a2f2a; margin-bottom:50px; }
    .contact-button {
      background:#d2691e; color:#fff; padding:20px 40px; border-radius:30px; text-decoration:none; font-size:18px; font-weight:500; display:inline-block;
      transition: all .3s ease; border:none; cursor:pointer;
      box-shadow: 0 14px 28px rgba(210,105,30,.18);
    }
    .contact-button:hover { background:#b8571a; transform: translateY(-3px); box-shadow: 0 18px 34px rgba(210,105,30,.28); }

    /* Floating Elements */
    .floating-elements { position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:0; }
    .floating-dot { position:absolute; width:8px; height:8px; background:#d2691e; border-radius:50%; opacity:.3; animation: floatDot 15s ease-in-out infinite; }
    .floating-dot:nth-child(1) { top:20%; left:10%; animation-delay:0s; }
    .floating-dot:nth-child(2) { top:60%; right:15%; animation-delay:-5s; }
    .floating-dot:nth-child(3) { bottom:30%; left:70%; animation-delay:-10s; }
    @keyframes floatDot { 0%,100%{ transform:translateY(0);} 50%{ transform:translateY(-30px);} }

    /* Responsive */
    @media (max-width: 768px) {
      .nav { top:20px; right:20px; gap:10px; }
      .nav-pill { font-size:12px; padding:8px 16px; }
      .brand { top:20px; left:20px; padding:8px 16px; }
      .hero-shape { width:300px; height:300px; }
      .philosophy-shape { width:90%; height:200px; transform: translate(-50%, -50%) rotate(-10deg); }
      .about-content { grid-template-columns:1fr; gap:50px; }
      .project-card:nth-child(odd) .project-content,
      .project-card:nth-child(even) .project-content { margin-left:0; margin-right:0; }
      .project-shape { position:relative !important; width:100% !important; height:auto !important; transform:none !important; margin-bottom:20px; }
      .contact-shape { width:300px; height:300px; right:-150px; }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .circular-text svg { animation: none; }
      .floating-dot { animation: none; }
      .cursor { transition: none; }
    }
  `;

  // Smooth scroll + active nav
  const onNavClick = (e, href) => {
    e.preventDefault();
    if (href !== "#contact" && href !== "#values") {
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // Mark active
    const links = document.querySelectorAll(".nav-pill");
    links.forEach((l) => l.classList.remove("active"));
    e.currentTarget.classList.add("active");
  };

  // Scope body cursor hiding to this page only
  useEffect(() => {
    document.body.classList.add("horizon-preview-scope");
    return () => document.body.classList.remove("horizon-preview-scope");
  }, []);

  return (
    <div className="hp-root">
      <Helmet>
        <title>Maya Rodriguez — UX Designer (Preview)</title>
      </Helmet>

      {/* Custom Cursor */}
      <div className="cursor" ref={cursorRef} aria-hidden="true" />

      {/* Floating Elements */}
      <div className="floating-elements">
        <div className="floating-dot" ref={(el) => setFloatingDotRef(el, 0)} />
        <div className="floating-dot" ref={(el) => setFloatingDotRef(el, 1)} />
        <div className="floating-dot" ref={(el) => setFloatingDotRef(el, 2)} />
      </div>

      {/* Brand */}
      <div className="brand">
        <span className="brand-initial">M</span>
        <span className="brand-title">UX Designer</span>
      </div>

      {/* Navigation */}
      <nav className="nav" aria-label="Preview navigation">
        <a href="#portfolio" className="nav-pill" onClick={(e) => onNavClick(e, "#portfolio")}>Portfolio</a>
        <a href="#values" className="nav-pill" onClick={(e) => onNavClick(e, "#values")}>My Values</a>
        <a href="#about" className="nav-pill" onClick={(e) => onNavClick(e, "#about")}>What I Do</a>
        <a href="#contact" className="nav-pill contact" onClick={(e) => onNavClick(e, "#contact")}>Contact</a>
      </nav>

      {/* Main Content */}
      <div className="content">
        {/* Hero */}
        <section className="hero" aria-label="Hero">
          <div className="hero-shape" ref={heroShapeRef} />
          <div className="hero-name">
            <h1>
              <div className="first-name">Maya</div>
              <div className="last-name">Rodriguez</div>
            </h1>
          </div>
        </section>

        {/* Philosophy */}
        <section className="philosophy" id="values" aria-label="Design philosophy">
          <div className="philosophy-shape" ref={philosophyShapeRef} />
          <div className="philosophy-text">
            <p>At the heart of <span className="highlight">Design</span> is an opportunity to <span className="highlight">problem solve.</span></p>
          </div>
        </section>

        {/* About */}
        <section id="about" className="about" aria-labelledby="about-heading">
          <div className="about-container">
            <div className="about-intro" ref={(el) => setRevealRef(el, 0)}>
              <h2 id="about-heading">Hi there, I'm Maya.</h2>
              <div className="about-subtitle">Also Maya, or M</div>
            </div>

            <div className="about-content" ref={(el) => setRevealRef(el, 1)}>
              <div className="about-text">
                <p>A San Francisco-based award-winning UX designer with 8 years of experience in creating meaningful digital experiences that bridge human needs with business goals.</p>
                <p>I'm passionate about coffee culture (I've mapped every specialty coffee shop within a 10-mile radius), love getting lost in art museums, and believe that the best design solutions come from truly understanding the people we're designing for.</p>
                <p>Currently leading design at a health tech startup, where we're reimagining how people interact with their wellness journey through thoughtful, accessible design.</p>
              </div>

              <div className="about-visual">
                <div className="about-shape">
                  <div className="about-image" />
                </div>

                <div className="circular-text" aria-hidden="true">
                  <svg viewBox="0 0 200 200">
                    <path id="circle" d="M 100, 100 m -75, 0 a 75, 75 0 1, 1 150, 0 a 75, 75 0 1, 1 -150, 0" fill="none" />
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

        {/* Portfolio */}
        <section id="portfolio" className="portfolio" aria-labelledby="portfolio-heading">
          <div className="portfolio-header" ref={(el) => setRevealRef(el, 2)}>
            <h2 id="portfolio-heading">Selected Work</h2>
          </div>

          <div className="project-grid">
            {[
              {
                title: "WellnessPal Mobile App",
                desc: "Redesigned a mental health tracking app, increasing daily active users by 280% through personalized mood insights and gentle nudging mechanisms.",
                tags: ["Mobile Design", "User Research", "Health Tech"],
              },
              {
                title: "FinanceFlow Dashboard",
                desc: "Created an intuitive financial planning platform for millennials, simplifying complex investment data into actionable insights and increasing user engagement by 150%.",
                tags: ["Web Design", "Data Visualization", "FinTech"],
              },
              {
                title: "EcoMarket Platform",
                desc: "Designed an end-to-end sustainable shopping experience that connected eco-conscious consumers with local vendors, reducing cart abandonment by 40%.",
                tags: ["E-commerce", "Sustainability", "User Journey"],
              },
            ].map((p, i) => (
              <div className="project-card" key={p.title} ref={(el) => setRevealRef(el, 3 + i)}>
                <div className="project-shape" />
                <div className="project-content">
                  <h3 className="project-title">{p.title}</h3>
                  <p className="project-description">{p.desc}</p>
                  <div className="project-tags">
                    {p.tags.map((t) => (
                      <span className="project-tag" key={t}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="contact" aria-labelledby="contact-heading">
          <div className="contact-shape" ref={contactShapeRef} />
          <div className="contact-content" ref={(el) => setRevealRef(el, 6)}>
            <h2 id="contact-heading">Let's Create Something Beautiful</h2>
            <p>
              I'm always excited to collaborate on projects that make a meaningful impact. Whether you're looking for a design partner or want to chat about the intersection of UX and human psychology, I'd love to connect.
            </p>
            <a href="mailto:hello@mayarodriguez.design" className="contact-button">Start a Conversation</a>
          </div>
        </section>
      </div>

      {/* Page-scoped styles */}
      <style>{css}</style>
    </div>
  );
};

export default HorizonPreviewPage;
