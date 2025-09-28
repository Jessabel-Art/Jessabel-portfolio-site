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
import UxProcess from "@/pages/UxProcess"; s

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const main = document.querySelector("main");
    main?.focus?.();
  }, [pathname]);
  return null;
}

function Layout() {
  const { pathname } = useLocation();
  const onWelcome = pathname === "/";

  return (
    <div className="min-h-screen bg-[--navy-900] text-[--ink] antialiased overflow-x-hidden">
      <ScrollToTop />
      {!onWelcome && <Header />}

      {/* main is focusable for a11y focus reset on route change */}
      <main className={onWelcome ? "" : "pt-20"} tabIndex={-1}>
        <Outlet />
      </main>

      {!onWelcome && <Footer />}

      <Toaster />
      <RouteIris />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          {/* Root (headerless welcome) */}
          <Route index element={<Welcome />} />

          {/* Primary pages */}
          <Route path="home" element={<Home />} />
          <Route path="work" element={<Work />} />
          <Route path="playground" element={<Playground />} />

          {/* Client portal & uploads */}
          <Route path="client-portal" element={<ClientsPage />} />
          <Route path="client-upload" element={<ClientUploadPage />} />

          {/* UX process (CTA target) */}
          <Route path="ux-process" element={<UxProcess />} />

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
