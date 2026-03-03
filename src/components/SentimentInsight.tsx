"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, TrendingUp, TrendingDown, AlignLeft } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SentimentInsightProps {
  summary: string;
  classification: string;
}

const SentimentInsight: React.FC<SentimentInsightProps> = ({ summary, classification }) => {
  const getSentimentStyles = (type: string) => {
    switch (type.toLowerCase()) {
      case 'positive':
        return {
          color: 'text-emerald-400',
          bg: 'bg-emerald-400/10',
          border: 'border-emerald-400/20',
          glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
          icon: <TrendingUp className="text-emerald-400" size={18} />
        };
      case 'negative':
        return {
          color: 'text-rose-400',
          bg: 'bg-rose-400/10',
          border: 'border-rose-400/20',
          glow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
          icon: <TrendingDown className="text-rose-400" size={18} />
        };
      default:
        return {
          color: 'text-amber-400',
          bg: 'bg-amber-400/10',
          border: 'border-amber-400/20',
          glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
          icon: <AlignLeft className="text-amber-400" size={18} />
        };
    }
  };

  const styles = getSentimentStyles(classification);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
      className="w-full"
    >
      <div className="glass p-8 relative overflow-hidden group border border-white/5">
        <motion.div 
          className={cn("absolute inset-0 opacity-10", styles.bg)}
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/20 rounded-xl border border-indigo-500/20">
                <Sparkles className="text-indigo-400" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white leading-tight">AI Audience Insight</h3>
                <p className="text-sm text-slate-500 font-medium">Synthetic Intelligence Analysis</p>
              </div>
            </div>

            <motion.div 
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-full border font-black uppercase tracking-widest text-sm",
                styles.bg, styles.border, styles.color, styles.glow
              )}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {styles.icon}
              {classification}
            </motion.div>
          </div>

          <div className="relative">
            <MessageCircle className="absolute -top-4 -left-4 text-white/5 w-16 h-16 pointer-events-none" />
            <motion.p 
              className="text-xl md:text-2xl leading-relaxed text-slate-200 font-medium tracking-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {summary}
            </motion.p>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-2">
              {[
                { initials: 'A', from: 'from-cyan-500', to: 'to-blue-600' },
                { initials: 'K', from: 'from-purple-500', to: 'to-pink-500' },
                { initials: 'R', from: 'from-amber-400', to: 'to-orange-500' },
              ].map((user, i) => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#1a1c23] bg-gradient-to-br ${user.from} ${user.to} flex items-center justify-center text-[10px] font-black text-white`}>
                  {user.initials}
                </div>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Based on top verified audience feedback
            </span>
          </div>
        </div>

        <div className={cn("absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-[80px] pointer-events-none", styles.glow)} />
      </div>
    </motion.div>
  );
};

export default SentimentInsight;
