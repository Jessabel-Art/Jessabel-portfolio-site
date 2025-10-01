// src/App.jsx
import React, { useEffect } from "react";
import {
  BrowserRouter,
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
import "@/styles/fonts.css";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
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
    <BrowserRouter
      /* set if deploying under a subpath */
      // basename="/"
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Welcome />} />
          <Route path="home" element={<Home />} />
          <Route path="work" element={<Work />} />
          <Route path="playground" element={<Playground />} />
          <Route path="client-portal" element={<ClientsPage />} />
          <Route path="client-upload" element={<ClientUploadPage />} />
          <Route path="ux-process" element={<UxProcess />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
