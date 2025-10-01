import React, { useEffect, useRef } from 'react';

export default function ParticleMist({ density = 30 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nodes = Array.from({ length: density }).map(() => {
      const p = document.createElement('span');
      p.className = 'absolute block rounded-full';
      const size = 2 + Math.random()*3;
      p.style.width = p.style.height = `${size}px`;
      p.style.left = `${Math.random()*100}%`;
      p.style.top = `${Math.random()*100}%`;
      p.style.background = 'rgba(255,255,255,0.28)';
      p.style.filter = 'blur(0.2px)';
      const driftX = (Math.random()*2 - 1) * 30;
      const driftY = 20 + Math.random()*60;
      const dur = 4000 + Math.random()*5000;
      p.animate(
        [
          { transform: 'translate(0px,0px)', opacity: 0.7 },
          { transform: `translate(${driftX}px, ${driftY}px)`, opacity: 0.0 }
        ],
        { duration: dur, easing: 'ease-out', iterations: Infinity, delay: Math.random()*1500 }
      );
      el.appendChild(p);
      return p;
    });
    return () => nodes.forEach(n => n.remove());
  }, [density]);

  return <div ref={ref} className="absolute inset-0 pointer-events-none" aria-hidden="true" />;
}
