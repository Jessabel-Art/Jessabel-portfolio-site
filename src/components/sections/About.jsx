// src/pages/About.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Download, Loader2, CheckCircle, BarChart3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

// assets
import portraitSvg from "@/assets/images/about-portrait.svg";
import resumePdf from "@/assets/resume/jessy-ux-resume.pdf";
import ccriLogo from "@/assets/images/ccri.png";
import wguLogo from "@/assets/images/wgu.png";
import fullsailLogo from "@/assets/images/fullsail.jpg";

/* ------------------ Copy ------------------ */
const COPY = {
  overviewTitle: "Business centered UX strategist and product designer",
  overview: [
    "I did not begin by calling myself a designer. I found my footing at New Urban Arts, sketching, rearranging space, and testing how small decisions change how people move. I joined the NUA on the Move team and helped plan a new studio. That was my first lesson that design is a chain of choices that shape behavior.",
    "The same instincts carried into digital work. I started building ecommerce sites for small businesses, tuning SEO, and smoothing flows so people could buy what they came for. In larger organizations I worked on intranets and system implementations that served big teams. I mapped messy processes, drew the real journey on paper, and rebuilt steps so the tool matched the job.",
    "Freelance projects kept me close to founders. I helped translate rough ideas into visual systems, wrote copy that met the interface halfway, and crafted simple paths that welcomed a first wave of customers. It felt like tuning an engine until it runs clean.",
    "Today I combine a creative background with more than fifteen years in business to ship work that is clear, grounded, and a little bit daring. I design research backed interfaces, organize information, prototype with intent, and build systems that hold up under real use. Along the way I earned a B.S. in Business Administration Management, a UX Certificate from Full Sail University, and I completed my MBA, which sharpened the strategy behind the pixels.",
  ],
  education: [
    {
      key: "mba",
      faceLogo: wguLogo,
      faceAlt: "WGU",
      degree: "Master of Business Administration",
      school: "Western Governors University",
    },
    {
      key: "bs",
      faceLogo: wguLogo,
      faceAlt: "WGU",
      degree: "Bachelor of Science in Business Administration, Management",
      school: "Western Governors University",
    },
    {
      key: "ux",
      faceLogo: fullsailLogo,
      faceAlt: "Full Sail University",
      degree: "Certificate in User Experience",
      school: "Full Sail University",
    },
    {
      key: "as",
      faceLogo: ccriLogo,
      faceAlt: "CCRI",
      degree: "Associate of Science in Business Administration",
      school: "Community College of Rhode Island",
    },
  ],
  timeline: [
    { yr: "2011", label: "Design Intern • NUA on the Move", sub: "Helped plan the new studio and learned spatial problem solving." },
    { yr: "2014", label: "Early Web + SEO", sub: "Ecommerce builds and usability fixes for small businesses." },
    { yr: "2015–2018", label: "Platform Usability", sub: "Fintech and insurance. Mapped flows, informed features, improved handoffs." },
    { yr: "2018–2022", label: "Systems Implementation Lead", sub: "Healthcare SaaS. Internal platform rollouts with focus on adoption." },
    { yr: "2022–Present", label: "UX/UI Designer & Consultant", sub: "Research, UI, and design systems for startups and small teams." },
  ],
};

/* ------------------ Animation presets ------------------ */
const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
  viewport: { once: true, amount: 0.35 },
};
const neonTextShadow = "0 1px 0 rgba(0,0,0,.28), 0 8px 22px rgba(0,0,0,.30)";

/* ------------------ Tiny WebAudio chime ------------------ */
function useChime(enabled = true) {
  const ctxRef = useRef(null);
  useEffect(() => {
    if (!enabled) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) ctxRef.current = new AC();
    return () => {
      try { ctxRef.current?.close(); } catch {}
    };
  }, [enabled]);

  const blip = (f = 880, t = 0.08, g = 0.05) => {
    const ctx = ctxRef.current;
    if (!enabled || !ctx) return;
    const now = ctx.currentTime;
    const o = ctx.createOscillator();
    const gain = ctx.createGain();
    o.type = "sine";
    o.frequency.value = f;
    gain.gain.value = g;
    o.connect(gain).connect(ctx.destination);
    o.start(now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + t);
    o.stop(now + t + 0.02);
  };
  return blip;
}

/* ------------------ Pixel helpers ------------------ */
function burstAt(layerEl, x, y, colors = ["#18E1FF", "#6EC8FF", "#A06CFF", "#FF7AE1", "#7AFF9A"]) {
  if (!layerEl) return;
  const rect = layerEl.getBoundingClientRect();
  const cx = x - rect.left;
  const cy = y - rect.top;
  const count = 18 + Math.floor(Math.random() * 12);
  for (let i = 0; i < count; i++) {
    const dot = document.createElement("span");
    const size = 2 + Math.random() * 3;
    dot.style.position = "absolute";
    dot.style.left = `${cx}px`;
    dot.style.top = `${cy}px`;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.borderRadius = "2px";
    dot.style.background = colors[i % colors.length];
    dot.style.boxShadow = "0 0 12px rgba(24,225,255,.45)";
    dot.style.pointerEvents = "none";
    dot.style.willChange = "transform, opacity";
    layerEl.appendChild(dot);
    const angle = Math.random() * Math.PI * 2;
    const dist = 24 + Math.random() * 56;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    const dur = 0.9 + Math.random() * 0.6;
    dot.animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        { transform: `translate(${dx}px,${dy}px) scale(.86)`, opacity: 0 },
      ],
      { duration: dur * 1000, easing: "cubic-bezier(.22,.7,.25,1)", fill: "forwards" }
    ).onfinish = () => dot.remove();
  }
}

/* ------------------ About Component ------------------ */
export default function About() {
  const prefersReduced = useReducedMotion();
  const chime = useChime(!prefersReduced);
  const rootRef = useRef(null);
  const fxRef = useRef(null);
  const [showMobileDock, setShowMobileDock] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState({ resume: false, process: false });
  const [silhouette, setSilhouette] = useState(false);

  // show mobile CTA dock only while About is in view
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const io = new IntersectionObserver(([entry]) => setShowMobileDock(entry.isIntersecting), { threshold: 0.2 });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  /* ---------- Timeline rail fill ---------- */
  const tlRef = useRef(null);
  const { scrollYProgress: tlProg } = useScroll({ target: tlRef, offset: ["start 75%", "end 25%"] });
  const tlFill = useTransform(tlProg, [0, 1], [0, 1]);

  // CTA loader
  const onCTA = (key) => () => {
    setLoadingBtn((s) => ({ ...s, [key]: true }));
    setTimeout(() => setLoadingBtn((s) => ({ ...s, [key]: false })), 900);
  };

  // Portrait tilt + pixels + long-press silhouette
  const onPortraitMove = (e) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -8;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 10;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };
  const onPortraitLeave = (e) => { e.currentTarget.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)"; };
  const onPortraitClick = (e) => { burstAt(fxRef.current, e.clientX, e.clientY); };
  useEffect(() => {
    const el = document.getElementById("about-portrait-card");
    if (!el) return;
    let t;
    const start = () => { clearTimeout(t); t = setTimeout(() => setSilhouette((v) => !v), 650); };
    const clear = () => clearTimeout(t);
    el.addEventListener("pointerdown", start);
    el.addEventListener("pointerup", clear);
    el.addEventListener("pointerleave", clear);
    return () => { el.removeEventListener("pointerdown", start); el.removeEventListener("pointerup", clear); el.removeEventListener("pointerleave", clear); };
  }, []);

  return (
    <section id="about" ref={rootRef} className="relative bg-[--navy-900] text-[--ink] overflow-hidden">
      <div ref={fxRef} className="pointer-events-none absolute inset-0 z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* ===== Header ===== */}
        <motion.h2 {...fadeUp} className="text-4xl md:text-5xl font-extrabold text-[--blue-300] mb-8 md:mb-10" style={{ textShadow: neonTextShadow }}>
          I turn complex ideas into intuitive, human-centered experiences.
        </motion.h2>

        {/* ===== Overview row (summary left + portrait right) ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-start">
          <motion.div {...fadeUp}>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[--blue-300] mb-4" style={{ textShadow: neonTextShadow }}>
              {COPY.overviewTitle}
            </h3>
            <div className="space-y-5">
              {COPY.overview.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.04 }}
                  className="text-lg md:text-xl leading-relaxed md:leading-8"
                  style={{ textShadow: neonTextShadow }}
                >
                  {i === 0 ? <PixelDrift text={p} /> : p}
                </motion.p>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap gap-3">
              <NeonCTA loading={loadingBtn.resume} onClick={onCTA("resume")} href={resumePdf} download iconLeft={<Download className="h-4 w-4 mr-2" />}>
                Download Resume
              </NeonCTA>
              <NeonCTA loading={loadingBtn.process} onClick={onCTA("process")} to="/ux-process" iconRight={<ArrowRight className="h-4 w-4 ml-2" />}>
                View My UX Process
              </NeonCTA>
            </div>
          </motion.div>

          {/* Portrait card + chips */}
          <motion.div
            id="about-portrait-card"
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.05 }}
            className="relative w-full max-w-[560px] lg:justify-self-end rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_24px_60px_rgba(0,0,0,.22)]"
            style={{ transformStyle: "preserve-3d", transition: "transform .22s ease" }}
            onMouseMove={onPortraitMove}
            onMouseLeave={onPortraitLeave}
            onClick={onPortraitClick}
            whileHover={{ boxShadow: "0 0 0 2px rgba(24,225,255,.25), 0 20px 54px rgba(0,0,0,.28)" }}
          >
            <div className="relative p-5">
              <img
                src={portraitSvg}
                alt="Digital portrait of Jessy"
                className="w-full h-auto rounded-2xl select-none pointer-events-none"
                style={{ filter: silhouette ? "grayscale(1) contrast(1.15) brightness(.9)" : "none", transition: "filter .25s ease" }}
              />
              <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{ boxShadow: "inset 0 0 80px rgba(0,0,0,.24), inset 0 0 150px rgba(0,0,0,.18)" }} />
            </div>

            {/* expertise chips */}
            <div className="px-5 pb-5">
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Chip icon={<CheckCircle className="w-4 h-4" />} title="Human-centered" sub="Clear, inclusive flows" />
                <Chip icon={<BarChart3 className="w-4 h-4" />} title="Data-informed" sub="Decisions & metrics" />
                <Chip icon={<Sparkles className="w-4 h-4" />} title="Systems + UI" sub="Design systems & craft" />
              </ul>
            </div>
          </motion.div>
        </div>

        {/* ===== Education Coin-Flip Row (logo face → degree back) ===== */}
        <div className="mt-16 md:mt-20">
          <h4 className="text-2xl md:text-3xl font-extrabold text-[--blue-300] mb-5" style={{ textShadow: neonTextShadow }}>
            Education
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
            {COPY.education.map((ed) => (
              <FlipCoin
                key={ed.key}
                logo={ed.faceLogo}
                logoAlt={ed.faceAlt}
                degree={ed.degree}
                school={ed.school}
              />
            ))}
          </div>
        </div>

        {/* ===== Timeline (fills as you scroll) ===== */}
        <div ref={tlRef} className="relative mt-16 md:mt-20">
          <h4 className="text-2xl md:text-3xl font-extrabold text-[--blue-300] mb-6" style={{ textShadow: neonTextShadow }}>
            Journey
          </h4>
          <div className="absolute left-2 sm:left-4 top-0 bottom-0 w-[6px] rounded-full bg-white/5" />
          <motion.div
            className="absolute left-[11px] sm:left-[13px] top-0 w-[2px] origin-top rounded-full"
            style={{ scaleY: tlFill, height: "100%", background: "linear-gradient(180deg,#18E1FF,#A06CFF)", boxShadow: "0 0 14px rgba(24,225,255,.22)" }}
          />
          <div className="space-y-8 md:space-y-10">
            {COPY.timeline.map((row, i) => (
              <TimelineItem key={`${row.yr}-${i}`} row={row} onEnter={() => chime(660 + i * 30, 0.07, 0.045)} />
            ))}
          </div>
        </div>

        {/* Desktop CTA repeat */}
        <div className="hidden sm:flex items-center gap-3 mt-12">
          <NeonCTA loading={loadingBtn.resume} onClick={onCTA("resume")} href={resumePdf} download iconLeft={<Download className="h-4 w-4 mr-2" />}>
            Download Resume
          </NeonCTA>
          <NeonCTA loading={loadingBtn.process} onClick={onCTA("process")} to="/ux-process" iconRight={<ArrowRight className="h-4 w-4 ml-2" />}>
            View My UX Process
          </NeonCTA>
        </div>
      </div>

      {/* Mobile sticky CTA dock */}
      {showMobileDock && (
        <div className="sm:hidden fixed left-0 right-0 bottom-3 px-4 z-40">
          <div className="rounded-2xl border border-white/10 bg-[rgba(7,13,29,.82)] backdrop-blur-md p-2 shadow-[0_18px_40px_rgba(0,0,0,.35)]">
            <div className="flex gap-2">
              <NeonCTA loading={loadingBtn.resume} onClick={onCTA("resume")} href={resumePdf} download small iconLeft={<Download className="h-4 w-4 mr-1.5" />}>
                Resume
              </NeonCTA>
              <NeonCTA loading={loadingBtn.process} onClick={onCTA("process")} to="/ux-process" small iconRight={<ArrowRight className="h-4 w-4 ml-1.5" />}>
                UX Process
              </NeonCTA>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ------------------ Small components ------------------ */

function PixelDrift({ text }) {
  const prefersReduced = useReducedMotion();
  const words = useMemo(() => text.split(" "), [text]);
  if (prefersReduced) return text;
  return (
    <span>
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          initial={{ y: "0.7em", opacity: 0, filter: "blur(6px)" }}
          whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.5, delay: i * 0.035, ease: "easeOut" }}
          className="inline-block mr-[0.3ch]"
          style={{ willChange: "transform, filter" }}
        >
          {w}
        </motion.span>
      ))}
    </span>
  );
}

function Chip({ icon, title, sub }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl px-4 py-3 border border-white/10 bg-white/5 shadow-sm flex items-start gap-2 hover:shadow-md transition"
    >
      <span className="mt-0.5 text-[--cyan-400]">{icon}</span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs opacity-80">{sub}</p>
      </div>
    </motion.li>
  );
}

// Education coin: front = LOGO, back = DEGREE (opaque) + neon hover glow
function FlipCoin({ logo, logoAlt, degree, school }) {
  const [flipped, setFlipped] = useState(false);
  const prefersReduced = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={() => setFlipped((v) => !v)}
      className="relative aspect-square rounded-full w-full max-w-[220px] mx-auto select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      style={{ perspective: "1000px", background: "transparent" }}
      aria-pressed={flipped}
      aria-label={`${degree} — ${school}`}
      title={`${degree} • ${school}`}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="relative w-full h-full rounded-full ring-1 ring-white/12 shadow-[0_14px_32px_rgba(0,0,0,.18)]"
        style={{ transformStyle: "preserve-3d" }}
        whileHover={{
          boxShadow:
            "0 0 0 2px rgba(24,225,255,.35), 0 0 38px rgba(24,225,255,.35), 0 18px 46px rgba(0,0,0,.32)",
          scale: prefersReduced ? 1 : 1.02,
        }}
      >
        {/* Neon halo (hover) */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-[-10%] rounded-full"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: prefersReduced ? 0 : 0.25, ease: "easeOut" }}
          style={{
            background:
              "radial-gradient(60% 60% at 50% 50%, rgba(24,225,255,.22), rgba(24,225,255,0) 70%)",
            filter: "blur(10px)",
          }}
        />

        {/* FRONT FACE (opaque) */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden grid place-items-center"
          style={{
            backfaceVisibility: "hidden",
            background: "rgba(7,13,29,0.98)",        // opaque, no bleed-through
            transform: "translateZ(1px)",
          }}
        >
          <img
            src={logo}
            alt={`${logoAlt} logo`}
            className="max-w-[62%] max-h-[62%] object-contain"
            style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,.35))" }}
          />
        </div>

        {/* BACK FACE (opaque) */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden grid place-items-center px-4 text-center"
          style={{
            transform: "rotateY(180deg) translateZ(1px)",
            backfaceVisibility: "hidden",
            background: "rgba(7,13,29,0.98)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/10" />
          <div className="z-10">
            <div
              className="leading-snug font-extrabold"
              style={{
                fontSize: "clamp(14px,1.9vw,18px)",
                color: "var(--ink)",
                textShadow:
                  "0 1px 0 rgba(0,0,0,.28), 0 6px 16px rgba(0,0,0,.28)",
              }}
            >
              {degree}
            </div>
            <div className="mt-1.5 text-[11px] sm:text-xs opacity-85">{school}</div>
          </div>
        </div>
      </motion.div>
    </motion.button>
  );
}

function TimelineItem({ row, onEnter }) {
  const [seen, setSeen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.35 }}
      onViewportEnter={() => { if (!seen) { onEnter?.(); setSeen(true); } }}
      className="relative pl-10 sm:pl-16"
    >
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: [0.8, 1.06, 1], opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, times: [0, 0.6, 1] }}
        className="absolute left-0.5 sm:left-1.5 top-2 w-4 h-4 sm:w-5 sm:h-5 rounded-full"
        style={{ background: "linear-gradient(135deg,#18E1FF,#6EC8FF)", boxShadow: "0 0 16px rgba(24,225,255,.35)" }}
      />
      <div className="rounded-2xl p-5 bg-white/5 border border-white/10 shadow-md hover:shadow-lg transition-shadow">
        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold" style={{ background: "linear-gradient(135deg,#18E1FF,#6EC8FF)", color: "var(--navy-900)" }}>
          {row.yr}
        </span>
        <h5 className="mt-3 text-lg font-bold">{row.label}</h5>
        <p className="opacity-90 text-[15px]">{row.sub}</p>
      </div>
    </motion.div>
  );
}

function NeonCTA({ children, to, href, download, onClick, loading, small, iconLeft, iconRight }) {
  const content = (
    <span className="inline-flex items-center justify-center">
      {iconLeft}
      {children}
      {iconRight}
    </span>
  );
  const classBase =
    "relative overflow-hidden rounded-full font-semibold text-[--navy-900] " +
    (small ? "h-10 px-4 text-sm" : "h-11 px-6") +
    " bg-[linear-gradient(135deg,#18E1FF,#6EC8FF)] shadow-lg " +
    "transition transform hover:brightness-[1.08] hover:shadow-[0_16px_40px_rgba(0,0,0,.22)] active:scale-[.98]";

  const Inner = () => (
    <span className="relative">
      <motion.span
        className="pointer-events-none absolute inset-0 opacity-25"
        initial={{ x: "-110%" }}
        whileHover={{ x: "110%" }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        style={{ background: "linear-gradient(120deg, transparent, rgba(255,255,255,.6), transparent)" }}
      />
      {loading && (
        <span className="absolute inset-0 grid place-items-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </span>
      )}
      <span className={loading ? "opacity-0" : "opacity-100"}>{content}</span>
    </span>
  );

  if (to) {
    return (
      <Button asChild onClick={onClick} className={classBase}>
        <Link to={to}><Inner /></Link>
      </Button>
    );
  }
  return (
    <Button asChild onClick={onClick} className={classBase}>
      <a href={href} download={download}><Inner /></a>
    </Button>
  );
}
