// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Welcome from "@/components/Welcome";
import Home from "@/pages/Home";
import RouteIris from "@/components/RouteIris"; // ✨ new overlay

function Layout({ children }) {
  const location = useLocation();
  const onWelcome = location.pathname === "/";

  return (
    <div className="min-h-screen bg-[--navy-900] text-[--ink] antialiased overflow-x-hidden">
      {!onWelcome && <Header />}
      <main className={onWelcome ? "" : "pt-20"}>
        {children}
      </main>
      {!onWelcome && <Footer />}
      <Toaster />
      <RouteIris /> {/* sits on top for transitions */}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Welcome is root */}
          <Route path="/" element={<Welcome />} />
          {/* Portfolio one-pager */}
          <Route path="/work" element={<Home />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
