import React, { useMemo, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/**
 * SkillsPourSection
 * Props:
 *  - title: string
 *  - subtitle: string
 *  - skills: string[]
 */
const SkillsPourSection = ({
  title = 'What I bring to every project',
  subtitle = 'A blend of research, structure, and craft that pours into outcomes.',
  skills = [],
}) => {
  const prefersReducedMotion = useReducedMotion();
  const rootRef = useRef(null);
  const inView = useInView(rootRef, { amount: 0.35, once: true });

  // Layout config
  const CUP_LEFT = 14;        // % from left
  const CUP_TOP = 16;         // % from top
  const GRID_LEFT = 58;       // % from left where bubbles line up
  const GRID_TOP = 14;        // % from top where bubbles line up
  const COLS = 4;
  const GAP = 3.2;            // % gap between targets (relative to section width)
  const SIZE = 96;            // px diameter for chips

  // Precompute “landing” positions as percentages
  const targets = useMemo(() => {
    const arr = [];
    const rows = Math.ceil(skills.length / COLS);
    for (let i = 0; i < skills.length; i++) {
      const r = Math.floor(i / COLS);
      const c = i % COLS;
      arr.push({
        xPct: GRID_LEFT + c * GAP * 3.2, // spread out a touch more horizontally
        yPct: GRID_TOP + r * 18,          // nice vertical rhythm
      });
    }
    return arr;
  }, [skills]);

  return (
    <section
      ref={rootRef}
      className="relative py-16 md:py-20 bg-[#FEE6D4]"
      aria-label="Skills pour animation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-left space-y-3 sm:space-y-4 mb-8">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground">
            {title}
          </h2>
          <p className="text-[15px] sm:text-lg md:text-xl text-[hsl(var(--muted-foreground))] max-w-3xl">
            {subtitle}
          </p>
        </div>

        {/* Stage */}
        <div className="relative h-[540px] sm:h-[560px] md:h-[600px]">
          {/* Glass (subtle, “invisible” look) */}
          <GlassSVG
            style={{
              left: `${CUP_LEFT}%`,
              top: `${CUP_TOP}%`,
              width: '32%',
              height: '74%',
            }}
          />

          {/* Ground shadow for glass */}
          <div
            aria-hidden="true"
            className="absolute rounded-full"
            style={{
              left: `${CUP_LEFT + 6}%`,
              right: 'auto',
              bottom: '5%',
              width: '24%',
              height: '20px',
              background: 'radial-gradient(60% 60% at 50% 50%, rgba(0,0,0,.12), transparent 70%)',
              opacity: 0.35,
              filter: 'blur(2px)',
            }}
          />

          {/* Bubbles */}
          {skills.map((label, i) => {
            // start near the glass rim, each with small random x offset
            const startX = CUP_LEFT + (Math.random() * 6 - 3);
            const startY = CUP_TOP - 6 + (Math.random() * 2 - 1);

            const target = targets[i] || { xPct: GRID_LEFT, yPct: GRID_TOP };
            const delay = 0.12 * i;

            // Two-phase animation: drop, then slide to target (spring)
            const animate = prefersReducedMotion
              ? { left: `${target.xPct}%`, top: `${target.yPct}%`, opacity: 1 }
              : inView
                ? {
                    left: [`${startX}%`, `${startX + (Math.random() * 6 - 3)}%`, `${target.xPct}%`],
                    top: [`${startY}%`, `${startY + 22 + Math.random() * 16}%`, `${target.yPct}%`],
                    opacity: [0, 1, 1],
                  }
                : { left: `${startX}%`, top: `${startY}%`, opacity: 0 };

            const transition = prefersReducedMotion
              ? { duration: 0 }
              : inView
                ? [
                    { duration: 0.45, ease: 'easeIn', delay }, // drop
                    { duration: 0.55, ease: 'easeOut' },        // overshoot settle
                    { type: 'spring', stiffness: 200, damping: 18 }, // final spring
                  ]
                : { duration: 0.4 };

            return (
              <motion.button
                key={label}
                type="button"
                className="absolute grid place-items-center select-none will-change-transform"
                style={{
                  width: SIZE,
                  height: SIZE,
                  borderRadius: 9999,
                  left: `${startX}%`,
                  top: `${startY}%`,
                }}
                initial={{ opacity: 0 }}
                animate={animate}
                transition={transition}
                title={label}
                aria-label={label}
              >
                {/* chip */}
                <span
                  className={[
                    'w-full h-full rounded-full border-2 font-bold text-center leading-tight',
                    'transition-colors duration-300',
                    'text-[hsl(var(--foreground))] hover:text-white',
                    'backdrop-blur-[2px]',
                    'chip-sheen',
                  ].join(' ')}
                  style={{
                    borderColor: 'var(--btn-pink, #ff3ea5)',
                    background:
                      'linear-gradient(180deg, rgba(255,62,165,0) 0%, rgba(255,62,165,0.04) 100%)',
                  }}
                >
                  <span
                    className="grid place-items-center w-full h-full px-3 text-sm sm:text-base"
                    // prettier-ignore
                    style={{
                      // hover fill (deeper pink tone)
                      '--chip-fill':
                        'linear-gradient(135deg, #ff3ea5 0%, #d61a82 100%)',
                    }}
                  >
                    {label}
                  </span>
                </span>
                <style>{`
                  .chip-sheen:hover {
                    background: var(--chip-fill);
                    box-shadow: 0 18px 38px rgba(0,0,0,.18);
                  }
                `}</style>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsPourSection;

/* ----------------------------- */
/* Glass outline as an SVG       */
/* ----------------------------- */
const GlassSVG = ({ style }) => (
  <svg
    viewBox="0 0 520 720"
    className="absolute"
    style={style}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="glassStroke" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="rgba(255,255,255,.85)" />
        <stop offset="1" stopColor="rgba(255,255,255,.65)" />
      </linearGradient>
    </defs>
    {/* cup */}
    <path
      d="M110 80 L70 520 C60 620 180 660 260 660 C340 660 460 620 450 520 L410 80"
      fill="none"
      stroke="url(#glassStroke)"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.85"
    />
    {/* rim */}
    <path
      d="M120 84 Q260 62 400 84"
      fill="none"
      stroke="url(#glassStroke)"
      strokeWidth="10"
      strokeLinecap="round"
      opacity="0.8"
    />
  </svg>
);
