import { motion } from 'framer-motion';
import { glowHover } from '@/lib/motionPresets';
import { Link } from 'react-router-dom';

export default function CaseCard({ project, onQuickPeek }) {
  return (
    <motion.article
      {...glowHover}
      className="group rounded-xl overflow-hidden ring-1 ring-white/10 bg-[--navy-800] flex flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={project.cover}
          alt={`${project.title} cover`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <button
          onClick={onQuickPeek}
          className="absolute bottom-3 right-3 text-xs rounded-md bg-black/50 backdrop-blur px-2 py-1 ring-1 ring-white/15 hover:bg-black/60"
        >
          Quick Peek
        </button>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-medium">{project.title}</h3>
        <p className="text-xs opacity-70 mt-0.5">{project.role}</p>
        <p className="text-sm opacity-80 mt-2 flex-1">{project.blurb}</p>
        <div className="mt-3">
          <Link to={project.href} className="text-sm underline underline-offset-4 opacity-90">
            View case study
          </Link>
        </div>
      </div>
    </motion.article>
  );
}