import React, { useEffect, useRef } from 'react';
import { burstEvents } from '@/lib/events';

export default function PixelBurst() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handler = () => {
      // Spawn ~60 pixel shards
      for (let i = 0; i < 60; i++) {
        const s = document.createElement('span');
        s.className = 'pointer-events-none absolute block';
        s.style.left = '50%';
        s.style.top = '50%';
        s.style.width = s.style.height = `${Math.floor(Math.random()*6)+4}px`;
        s.style.background = 'rgba(255,255,255,0.9)';
        s.style.transform = 'translate(-50%, -50%)';
        s.style.borderRadius = '2px';
        s.style.mixBlendMode = 'screen';

        // random direction/velocity
        const angle = Math.random() * Math.PI * 2;
        const speed = 80 + Math.random() * 340;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        const rot = Math.floor(Math.random()*360);
        const dur = 600 + Math.random()*700; // ms

        s.animate(
          [
            { transform: 'translate(-50%,-50%) scale(1) rotate(0deg)', opacity: 1 },
            { transform: `translate(calc(-50% + ${vx}px), calc(-50% + ${vy}px)) scale(0.8) rotate(${rot}deg)`, opacity: 0 }
          ],
          { duration: dur, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }
        ).onfinish = () => s.remove();

        el.appendChild(s);
      }
    };

    burstEvents.on(handler);
    return () => burstEvents.off(handler);
  }, []);

  return <div ref={ref} className="fixed inset-0 z-[90] pointer-events-none" aria-hidden="true" />;
}
