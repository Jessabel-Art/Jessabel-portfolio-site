// src/App.jsx
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Welcome from "@/components/Welcome";
import Home from "@/pages/Home";
import Work from "@/pages/Work";
import Playground from "@/pages/Playground";
import RouteIris from "@/components/RouteIris";
import ContactPage from "@/pages/ContactPage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import ClientsPage from "@/pages/ClientsPage";
import ClientUploadPage from "@/pages/ClientUploadPage";
import UxProcess from "@/pages/UxProcess";

/* ---------- Scroll to top on route change ---------- */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // jump to top and reset focus for a11y
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const main = document.querySelector("main");
    if (main) main.focus?.();
  }, [pathname]);
  return null;
}

/* ---------- App Shell / Layout (header + footer) ---------- */
function Layout() {
  const location = useLocation();
  const onWelcome = location.pathname === "/";

  return (
    <div className="min-h-screen bg-[--navy-900] text-[--ink] antialiased overflow-x-hidden">
      <ScrollToTop />
      {!onWelcome && <Header />}

      {/* main is focusable to support focus reset on navigation */}
      <main className={onWelcome ? "" : "pt-20"} tabIndex={-1}>
        <Outlet />
      </main>

      {!onWelcome && <Footer />}

      {/* Global UI */}
      <Toaster />
      <RouteIris />
    </div>
  );
}

/* ---------- Router ---------- */
export default function App() {
  return (
    <Router>
      <Routes>
        {/* All pages share the Layout */}
        <Route element={<Layout />}>
          {/* Index (root) — Welcome is headerless */}
          <Route index element={<Welcome />} />

          {/* Primary pages */}
          <Route path="home" element={<Home />} />
          <Route path="work" element={<Work />} />
          <Route path="playground" element={<Playground />} />
          <Route path="about" element={<About />} />

          {/* Client portal & uploads */}
          <Route path="client-portal" element={<ClientsPage />} />
          <Route path="client-upload" element={<ClientUploadPage />} />

          {/* UX process (CTA target) */}
          <Route path="ux-process" element={<UXProcess />} />

          {/* Contact & Legal */}
          <Route path="contact" element={<ContactPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
