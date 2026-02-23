/**
 * WelcomeModal — shown once on first visit to guide new users.
 *
 * Stored in localStorage under key 'pmo-welcome-seen'.
 * Offers two paths:
 *   1. "Help me find the right tool" → /decision (Decision Helper)
 *   2. "I'll explore on my own" → dismisses modal
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Layers, ArrowRight, X } from 'lucide-react';

const STORAGE_KEY = 'pmo-welcome-seen';
const TOUR_KEY = 'stratalign_onboarding_done';

export default function WelcomeModal() {
  const [visible, setVisible] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      // Small delay so the page renders first
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1');
    localStorage.setItem(TOUR_KEY, 'true'); // prevent tour from stacking
    setVisible(false);
  }

  function goToAIFinder() {
    localStorage.setItem(STORAGE_KEY, '1');
    localStorage.setItem(TOUR_KEY, 'true');
    setVisible(false);
    navigate('/ai-suggest');
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
          onClick={dismiss}
        >
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="w-full max-w-sm rounded-3xl overflow-hidden"
            style={{
              background: '#ffffff',
              boxShadow: '0 24px 64px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.1)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Top accent bar */}
            <div className="h-1.5 w-full" style={{ background: 'linear-gradient(to right, #4F46E5, #7C3AED, #a855f7)' }} />

            {/* Close button */}
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Close"
            >
              <X size={14} className="text-stone-400" />
            </button>

            <div className="px-6 pt-6 pb-7">
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}
              >
                <Sparkles size={26} className="text-white" />
              </div>

              {/* Headline */}
              <h2
                className="text-xl font-black text-stone-900 leading-tight mb-2"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Welcome to StratAlign
              </h2>
              <p className="text-sm text-stone-500 leading-relaxed mb-5">
                198 project management tools, techniques, and frameworks — all in one place.
                Not sure where to start? Let us point you in the right direction.
              </p>

              {/* Two options */}
              <div className="space-y-3">
                {/* Primary CTA */}
                <button
                  onClick={goToAIFinder}
                  className="w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}
                >
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white leading-tight">Help me find the right tool</p>
                    <p className="text-[11px] text-white/70 mt-0.5">Describe your challenge — AI picks the best tools</p>
                  </div>
                  <ArrowRight size={16} className="text-white/70 shrink-0" />
                </button>

                {/* Secondary CTA */}
                <button
                  onClick={dismiss}
                  className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all hover:bg-stone-50 active:scale-[0.98]"
                  style={{ border: '1.5px solid #e7e5e4' }}
                >
                  <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
                    <Layers size={16} className="text-stone-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-stone-700 leading-tight">I'll explore on my own</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">Browse all 8 decks and 198 cards</p>
                  </div>
                </button>
              </div>

              {/* Footnote */}
              <p className="text-[10px] text-stone-300 text-center mt-4">
                You won't see this again — it's a one-time welcome.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
