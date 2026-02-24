/**
 * WelcomeModal — shown once on first visit to guide new users.
 *
 * Stored in localStorage under key 'pmo-welcome-seen'.
 * Offers two paths:
 *   1. "Help me find the right tool" → /ai-suggest (AI Tool Finder)
 *   2. "I'll explore on my own" → dismisses modal
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Layers, ArrowRight, X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const STORAGE_KEY = 'pmo-welcome-seen';
const TOUR_KEY = 'stratalign_onboarding_done';

export default function WelcomeModal() {
  const { isDark } = useTheme();
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
              background: isDark ? '#0f1c30' : '#ffffff',
              boxShadow: isDark
                ? '0 24px 64px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)'
                : '0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.06)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Top accent bar */}
            <div className="h-1.5 w-full" style={{ background: 'linear-gradient(to right, #4F46E5, #7C3AED, #a855f7)' }} />

            {/* Close button */}
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 p-1.5 rounded-full transition-colors"
              style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
              aria-label="Close"
            >
              <X size={14} className={isDark ? 'text-slate-300' : 'text-slate-600'} />
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
                className="text-xl font-black leading-tight mb-2"
                style={{ fontFamily: 'Sora, sans-serif', color: isDark ? '#f1f5f9' : '#0f172a' }}
              >
                Welcome to StratAlign
              </h2>
              <p className="text-sm leading-relaxed mb-5" style={{ color: isDark ? '#94a3b8' : '#475569' }}>
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
                  className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all active:scale-[0.98]"
                  style={{
                    border: isDark ? '1.5px solid rgba(255,255,255,0.12)' : '1.5px solid rgba(0,0,0,0.1)',
                    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)' }}
                  >
                    <Layers size={16} className={isDark ? 'text-slate-300' : 'text-slate-600'} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold leading-tight" style={{ color: isDark ? '#cbd5e1' : '#334155' }}>
                      I'll explore on my own
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                      Browse all 8 decks and 198 cards
                    </p>
                  </div>
                </button>
              </div>

              {/* Footnote */}
              <p className="text-[10px] text-center mt-4" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
                You won't see this again — it's a one-time welcome.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
