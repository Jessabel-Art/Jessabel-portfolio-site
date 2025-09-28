import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuickPeekModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur" onClick={onClose} />
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="relative z-10 w-[min(720px,92vw)] rounded-xl bg-[--navy-800] ring-1 ring-white/10 overflow-hidden"
          >
            <div className="aspect-[16/9] overflow-hidden">
              <img src={project.cover} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <p className="text-sm opacity-70">{project.role}</p>
              <ul className="mt-3 space-y-1 list-disc pl-5 text-sm">
                {project.bullets?.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
              <div className="mt-4 flex items-center justify-end gap-2">
                <button onClick={onClose} className="text-sm opacity-80 underline underline-offset-4">Close</button>
                <a href={project.href} className="text-sm opacity-90 underline underline-offset-4">Open case</a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}