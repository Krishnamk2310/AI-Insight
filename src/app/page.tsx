"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BrainCircuit } from 'lucide-react';
import MovieCard from '@/components/MovieCard';
import SentimentInsight from '@/components/SentimentInsight';
import AILoader from '@/components/AILoader';

interface MovieData {
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
}

interface InsightData {
  summary: string;
  classification: string;
}

export default function Home() {
  const [imdbId, setImdbId] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [insightData, setInsightData] = useState<InsightData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imdbId.trim()) return;

    setLoading(true);
    setError(null);
    setMovieData(null);
    setInsightData(null);

    try {
      setLoadingStep('INITIALIZING_CORE_SCAN');
      const movieRes = await fetch(`/api/movie?imdbId=${encodeURIComponent(imdbId.trim())}`);
      const movieJson = await movieRes.json();
      if (!movieRes.ok) throw new Error(movieJson.error || 'Failed to fetch movie details');
      setLoadingStep('EXTRACTING_PROPS');
      setMovieData(movieJson);

      setLoadingStep('SCRAPING_AUDIENCE_REVIEWS');
      const reviewsRes = await fetch(`/api/reviews?imdbId=${encodeURIComponent(imdbId.trim())}`);
      const reviewsJson = await reviewsRes.json();
      if (!reviewsRes.ok) throw new Error(reviewsJson.error || 'Failed to fetch reviews');

      setLoadingStep('AI_SENTIMENT_ANALYSIS');
      const sentimentRes = await fetch('/api/sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reviews: reviewsJson.reviews || [],
          title: movieJson.title
        })
      });
      const sentimentJson = await sentimentRes.json();
      if (!sentimentRes.ok) throw new Error(sentimentJson.error || 'Failed to analyze sentiment');
      setInsightData(sentimentJson);
      
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="mesh-gradient" />
      
      <main style={{ width: '100%', maxWidth: '56rem', margin: '0 auto', padding: '4rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-2.5 bg-gradient-to-br from-cyan-400 to-indigo-600 rounded-xl shadow-[0_0_20px_rgba(0,242,255,0.3)]">
              <BrainCircuit className="text-white" size={22} />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400">
              Next-Gen Movie Insights
            </span>
          </div>
          
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 900, letterSpacing: '-0.025em', lineHeight: 1, marginBottom: '1.5rem' }}>
            <span className="text-white">AI</span>
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">Insight</span>
          </h1>
          
          <p className="text-base md:text-lg text-slate-400 max-w-md mx-auto leading-relaxed mb-8">
            Unlocking deep audience sentiment and movie intelligence through advanced AI extraction.
          </p>
        </motion.header>

        <motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ width: '100%', maxWidth: '36rem', margin: '0 auto 4rem auto' }}
        >
          <div style={{ background: 'rgba(10, 15, 30, 0.5)', backdropFilter: 'blur(24px) saturate(1.4)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '6px', boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)', transition: 'all 0.3s ease' }} className="relative flex items-center">
            <div className="pl-4 text-slate-500">
              <Search size={22} />
            </div>
            <input 
              type="text" 
              className="w-full bg-transparent px-4 py-4 text-white placeholder-slate-600 font-bold outline-none text-lg"
              placeholder="Enter IMDb ID (e.g. tt0133093)"
              value={imdbId}
              onChange={(e) => setImdbId(e.target.value)}
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading || !imdbId.trim()}
              style={{ background: 'linear-gradient(135deg, #06b6d4, #4f46e5, #9333ea)', boxShadow: '0 4px 20px rgba(0,242,255,0.2)', borderRadius: '12px', padding: '14px 28px', transition: 'all 0.3s ease' }}
              className="text-white font-black hover:shadow-[0_6px_30px_rgba(0,242,255,0.3)] hover:scale-[1.03] active:scale-95 text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
            >
              Assemble
            </button>
          </div>
        </motion.form>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-xl mx-auto p-5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-center font-bold mb-8"
            >
              {error}
            </motion.div>
          )}

          {loading && (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex justify-center"
            >
              <AILoader step={loadingStep} />
            </motion.div>
          )}

          {!loading && movieData && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full flex flex-col gap-8"
            >
              <MovieCard movie={movieData} />
              {insightData && (
                <SentimentInsight 
                  summary={insightData.summary} 
                  classification={insightData.classification} 
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <motion.div 
        className="fixed top-1/4 right-16 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,242,255,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }}
        animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="fixed bottom-1/4 left-10 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(157,0,255,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }}
        animate={{ y: [0, 20, 0], x: [0, -10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div 
        className="fixed top-2/3 right-1/3 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.06) 0%, transparent 70%)', filter: 'blur(50px)' }}
        animate={{ y: [0, -20, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />
    </div>
  );
}
