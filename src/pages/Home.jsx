// src/pages/Home.jsx
import React from "react";
import Hero from "@/components/sections/Hero";
import MyToolkit from '@/components/sections/MyToolkit';
import About from "@/components/sections/About"; 

export default function Home() {
  return (
    <>
      {/* ===== Hero (stage + mascot) ===== */}
      <Hero />
      <MyToolkit /> {/* <= right here, below Hero */}
      {/* ...rest of the homepage sections */}

      {/* ===== About ===== */}
      <section id="about" className="bg-[--navy-900]">
        <About />
      </section>
    </>
  );
}
