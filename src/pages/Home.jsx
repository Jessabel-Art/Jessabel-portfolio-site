// src/pages/Home.jsx
import React from 'react';

// Existing sections (adjust paths/names as needed)
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import MyToolkit from '@/components/sections/MyToolkit';
// New CTA section
import ConnectCTA from '@/components/sections/ConnectCTA';

export default function Home() {
  return (
    <>
      <Hero />
      <MyToolkit />
      <About />
      {/* <Work /> */}
      {/* <Testimonials /> */}
      <ConnectCTA />
      {/* <Footer /> */}
    </>
  );
}
