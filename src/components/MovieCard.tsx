"use client";

import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Calendar, Clock, Star, Users } from 'lucide-react';

interface MovieCardProps {
  movie: {
    title: string;
    year: string;
    rated: string;
    released: string;
    runtime: string;
    genre: string;
    director: string;
    actors: string;
    plot: string;
    poster: string | null;
    imdbRating: string;
  };
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - (rect.left + rect.width / 2));
    y.set(event.clientY - (rect.top + rect.height / 2));
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full"
    >
      <div 
        className="glass p-6 md:p-8 flex flex-col md:flex-row gap-8 relative overflow-hidden group"
        onMouseMove={handleMouse}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: 1000 }}
      >
        <motion.div 
          className="w-full md:w-64 flex-shrink-0 z-10"
          style={{ rotateX, rotateY }}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group-hover:border-cyan-400/30 group-hover:shadow-[0_0_40px_rgba(0,242,255,0.12)] transition-all duration-500">
            {movie.poster ? (
              <img 
                src={movie.poster} 
                alt={movie.title} 
                className="w-full h-auto object-cover transform scale-105 group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-slate-800 flex items-center justify-center">
                <span className="text-slate-500 font-bold uppercase tracking-widest">No Poster</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        </motion.div>

        <div className="flex-1 z-10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-cyan-400/10 border border-cyan-400/20 rounded-full text-cyan-300 text-xs font-bold uppercase tracking-wider glow-cyan">
                {movie.year}
              </span>
              <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-300 text-xs font-bold uppercase tracking-wider">
                {movie.rated}
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-400/10 border border-amber-400/20 rounded-full text-amber-300 text-xs font-bold uppercase">
                <Star size={12} className="fill-amber-300" />
                {movie.imdbRating}
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-white via-white to-slate-400 bg-clip-text text-transparent">
              {movie.title}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-cyan-400" />
                <span>{movie.released}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-cyan-400" />
                <span>{movie.runtime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-cyan-400" />
                <span>{movie.genre}</span>
              </div>
            </div>

            <p className="text-lg leading-relaxed text-slate-400 mb-8 max-w-2xl italic border-l-2 border-cyan-400/30 pl-6 bg-cyan-400/5 py-4 rounded-r-lg">
              &quot;{movie.plot}&quot;
            </p>

            <div className="space-y-4 pt-6 border-t border-white/5">
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase font-bold text-slate-500 tracking-widest">Directed By</span>
                <span className="text-white font-medium">{movie.director}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase font-bold text-slate-500 tracking-widest">Featuring</span>
                <span className="text-white font-medium">{movie.actors}</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-cyan-400/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default MovieCard;
