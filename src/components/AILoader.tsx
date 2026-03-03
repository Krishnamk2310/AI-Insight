"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface AILoaderProps {
  step: string;
}

const AILoader: React.FC<AILoaderProps> = ({ step }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '3rem 1.5rem', maxWidth: '28rem', margin: '0 auto' }} className="glass-card relative overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5"
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative w-32 h-32 mb-8 z-10">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-purple-500/40"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-8 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(0,242,255,0.4)]"
          animate={{
            scale: [0.9, 1.1, 0.9],
            boxShadow: [
              "0 0 20px rgba(0,242,255,0.3)",
              "0 0 40px rgba(0,242,255,0.6)",
              "0 0 20px rgba(0,242,255,0.3)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute h-[2px] w-full bg-white/60 blur-[1px]"
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="w-10 h-10 bg-white/20 rounded-full blur-sm" />
        </motion.div>
      </div>

      <div style={{ textAlign: 'center', width: '100%' }} className="z-10">
        <motion.h3
          className="text-xl font-bold mb-3 tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent"
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {step}
        </motion.h3>
        
        <div className="flex gap-1 justify-center h-4 items-end mb-6">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-cyan-400 rounded-full"
              animate={{ height: ["20%", "100%", "20%"] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
            />
          ))}
        </div>

        <div style={{ textAlign: 'center', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 1rem', maxWidth: '250px', margin: '0 auto' }} className="text-[10px] font-mono text-cyan-400/60">
          {["EXTRACTING_PROPS", "PARSING_DOM", "SENTIMENT_ENGINE_ON", "META_SCAN_01"].map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            >
              • {tag}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AILoader;
