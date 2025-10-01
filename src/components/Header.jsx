// src/components/Header.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const HEADER_HEIGHT = 80;          // px desktop
const HEADER_HEIGHT_MOBILE = 64;   // px mobile

const NAV_BG_ALPHA   = 0.38; // ← edit: desktop nav pill opacity
const BRAND_BG_ALPHA = 0.34; // ← edit: logo pill opacity

const links = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/welcome") return null;

  useEffect(() => setIsOpen(false), [location.pathname, location.hash]);

  const getHeaderOffset = () =>
    (typeof window !== "undefined" && window.innerWidth < 768)
      ? HEADER_HEIGHT_MOBILE
      : HEADER_HEIGHT;

  const scrollToIdWithOffset = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - getHeaderOffset() - 8;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const handleNav = useCallback(
    (id) => {
      if (id === "contact") {
        navigate("/contact");
        return;
      }
      const tryScroll = () => scrollToIdWithOffset(id);
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(tryScroll, 250);
        setTimeout(tryScroll, 650);
      } else {
        tryScroll();
      }
    },
    [location.pathname, navigate]
  );

  const activeId = location.pathname === "/contact" ? "contact" : "";

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-transparent"
      role="navigation"
      aria-label="Primary"
      style={{ height: "var(--header-h, 80px)", minHeight: "var(--header-h, 80px)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="flex items-center justify-between"
          style={{ height: "var(--header-h, 80px)", minHeight: "var(--header-h, 80px)" }}
        >
          {/* Brand with rounded background */}
          <div className="relative inline-flex items-center px-3 py-1 rounded-full">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 rounded-full"
              style={{
                background: `rgba(7,13,29, ${BRAND_BG_ALPHA})`, // ← opacity here
                border: "1px solid rgba(27, 197, 231, 0.64)",
                backdropFilter: "blur(10px) saturate(1.05)",
                WebkitBackdropFilter: "blur(10px) saturate(1.05)",
                boxShadow: "0 8px 30px rgba(0,0,0,.35)",
              }}
            />
            <Link
              to="/"
              className="select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-md"
              aria-label="Jessabel.Art — Home"
              style={{
                color: "var(--cyan-400)",
                textShadow: "0 0 12px rgba(24,225,255,.55), 0 1px 0 rgba(0,0,0,.35)",
                fontFamily: "'Playfair Display', ui-serif, Georgia, 'Times New Roman', serif",
                fontWeight: 900,
                letterSpacing: "-0.01em",
                fontSize: "clamp(22px, 2.4vw, 30px)",
              }}
            >
              Jessabel<span style={{ opacity: 0.95 }}>.Art</span>
            </Link>
          </div>

          {/* Desktop nav with rounded background */}
          <div className="hidden md:flex items-center">
            <div className="relative flex items-center gap-2 px-2 py-1">
              {/* background pill */}
              <div
                aria-hidden
                className="absolute inset-0 -z-10 rounded-full"
                style={{
                  background: `rgba(7,13,29, ${NAV_BG_ALPHA})`, // ← opacity here
                  border: "1px solid rgba(27, 197, 231, 0.64)",
                  backdropFilter: "blur(10px) saturate(1.05)",
                  WebkitBackdropFilter: "blur(10px) saturate(1.05)",
                  boxShadow: "0 8px 30px rgba(0,0,0,.35)",
                }}
              />
              {links.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className="relative px-3 py-2 font-semibold rounded-full"
                    style={{
                      color: isActive ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.78)",
                    }}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="relative z-10">{item.label}</span>
                    <span
                      className="absolute left-2 right-2 -bottom-0.5 h-[2px] overflow-hidden rounded-full"
                      aria-hidden
                    >
                      <motion.span
                        layoutId="nav-underline"
                        style={{ background: "linear-gradient(90deg, var(--cyan-400), var(--blue-300))" }}
                        className="block h-[2px] rounded-full"
                        animate={{ opacity: isActive ? 1 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen((v) => !v)}
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              className="rounded-full p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              style={{ color: "rgba(255,255,255,0.92)" }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer (unchanged) */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="drawer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden rounded-2xl border mb-3"
              style={{
                borderColor: "rgba(255,255,255,0.10)",
                background: "rgba(7,13,29,0.92)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="py-2 px-2">
                <div className="flex flex-col">
                  {links.map((item, i) => (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={["w-full h-11 px-4 rounded-lg font-semibold text-left", i !== 0 ? "mt-1.5" : ""].join(" ")}
                      style={{
                        color: "rgba(255,255,255,0.92)",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.10)",
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
