// src/pages/Home.jsx
import React from "react";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About"; 

export default function Home() {
  return (
    <>

      {/* ===== Hero (stage + mascot) ===== */}
      <Hero />

      {/* ===== Toolkit / What I Do ===== */}
      <section id="what-i-do" className="relative py-20 bg-[--navy-800] text-[--ink]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[--blue-300] text-3xl md:text-4xl font-bold mb-4">What I Do</h2>
          <p className="opacity-90 max-w-2xl">
            (Placeholder) Brief overview of UX research, UI, systems, and prototyping. Replace this with your real toolkit section.
          </p>
        </div>
      </section>

      {/* ===== About ===== */}
      <section id="about" className="bg-[--navy-900]">
        <About />
      </section>
    </>
  );
}
