import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staggerChildren, childFade } from '@/lib/motionPresets';

const ALL_TILES = [
  { id: 'heuristic', label: 'Heuristic Review', bucket: 'Research' },
  { id: 'interview',  label: 'User Interview',   bucket: 'Research' },
  { id: 'journey',    label: 'Journey Map',      bucket: 'Research' },
  { id: 'wireframe',  label: 'Wireframe',        bucket: 'Design' },
  { id: 'tokens',     label: 'Design Tokens',    bucket: 'Design' },
  { id: 'prototype',  label: 'Prototype',        bucket: 'Design' },
  { id: 'ab',         label: 'A/B Test',         bucket: 'Ship' },
  { id: 'handoff',    label: 'Dev Handoff',      bucket: 'Ship' },
  { id: 'releasen',   label: 'Release Notes',    bucket: 'Ship' }
];

export default function Playground() {
  const [tiles, setTiles] = useState(() => shuffle(ALL_TILES));
  const [placed, setPlaced] = useState({});
  const [time, setTime] = useState(60);
  const [over, setOver]   = useState(false);

  useEffect(() => {
    if (over) return;
    const t = setInterval(() => setTime(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [over]);

  useEffect(() => { if (time === 0) setOver(true); }, [time]);

  const score = useMemo(
    () => Object.values(placed).filter(Boolean).length,
    [placed]
  );

  function onDrop(targetBucket, tileId) {
    const correct = ALL_TILES.find(t => t.id === tileId)?.bucket === targetBucket;
    setPlaced(p => ({ ...p, [tileId]: correct }));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">UX Sort — 60s Challenge</h1>
        <div className="text-sm opacity-80">Time: {time}s · Score: {score}/9</div>
      </header>

      <main className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {['Research','Design','Ship'].map(bucket => (
          <DropZone key={bucket} bucket={bucket} onDrop={onDrop} />
        ))}
      </main>

      <motion.section
        className="mt-10 grid gap-3 md:grid-cols-3"
        variants={staggerChildren(0.05)}
        initial="hidden"
        animate="show"
      >
        {tiles.map(t => (
          <motion.button
            key={t.id}
            draggable
            onDragStart={e => e.dataTransfer.setData('text/plain', t.id)}
            variants={childFade}
            className={`rounded-md px-3 py-2 text-sm ring-1 ring-white/10 bg-[--navy-800]
                        ${placed[t.id] === true ? 'outline outline-1 outline-green-400/40' : ''} 
                        ${placed[t.id] === false ? 'outline outline-1 outline-rose-400/40'  : ''}`}
          >
            {t.label}
          </motion.button>
        ))}
      </motion.section>

      {over && (
        <div className="mt-8 p-4 rounded-lg bg-white/5 ring-1 ring-white/10">
          <p className="mb-1">Time! You sorted <strong>{score}</strong>/9 correctly.</p>
          <p className="text-sm opacity-80">
            Curious how I map process to outcomes? Head to <a href="/work" className="underline">Selected Work</a>.
          </p>
        </div>
      )}
    </div>
  );
}

function DropZone({ bucket, onDrop }) {
  return (
    <div
      onDragOver={e => e.preventDefault()}
      onDrop={e => onDrop(bucket, e.dataTransfer.getData('text/plain'))}
      className="rounded-xl p-4 min-h-[160px] bg-[--navy-900] ring-1 ring-white/10"
    >
      <h3 className="font-medium mb-2">{bucket}</h3>
      <p className="text-xs opacity-70">Drop items that belong here.</p>
    </div>
  );
}

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }