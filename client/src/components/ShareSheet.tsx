// ShareSheet — bottom-sheet social share panel
// Platforms: X/Twitter, LinkedIn, WhatsApp, Facebook, Copy link

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2, Check, Twitter, Linkedin, Facebook } from 'lucide-react';

interface ShareSheetProps {
  open: boolean;
  onClose: () => void;
  url: string;
  title: string;
  tagline?: string;
}

// WhatsApp icon (not in lucide)
function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function ShareSheet({ open, onClose, url, title, tagline }: ShareSheetProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${title}${tagline ? ` — ${tagline}` : ''}`);

  const platforms = [
    {
      name: 'X / Twitter',
      icon: <Twitter size={18} />,
      color: '#000000',
      bg: '#F0F0F0',
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin size={18} />,
      color: '#0A66C2',
      bg: '#E8F0FB',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: 'WhatsApp',
      icon: <WhatsAppIcon size={18} />,
      color: '#25D366',
      bg: '#E8F8EE',
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    },
    {
      name: 'Facebook',
      icon: <Facebook size={18} />,
      color: '#1877F2',
      bg: '#E7F0FD',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
  ];

  function handleCopy() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handlePlatformShare(href: string) {
    window.open(href, '_blank', 'noopener,noreferrer,width=600,height=500');
  }

  // Also try native share API on mobile
  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: tagline, url });
        onClose();
      } catch {
        // User cancelled or not supported — fall through to sheet
      }
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40"
            style={{ backdropFilter: 'blur(2px)' }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl px-5 pt-4 pb-10 max-w-lg mx-auto"
            style={{ boxShadow: '0 -8px 40px rgba(0,0,0,0.18)' }}
          >
            {/* Handle */}
            <div className="w-10 h-1 rounded-full bg-white/15 mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex-1 min-w-0 pr-3">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-0.5">Share</p>
                <h3 className="text-sm font-bold text-slate-200 leading-tight truncate">{title}</h3>
                {tagline && (
                  <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">{tagline}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="shrink-0 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/15 transition-colors"
              >
                <X size={13} className="text-slate-300" />
              </button>
            </div>

            {/* Platform buttons */}
            <div className="grid grid-cols-4 gap-3 mb-5">
              {platforms.map(p => (
                <button
                  key={p.name}
                  onClick={() => handlePlatformShare(p.href)}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-active:scale-95"
                    style={{ backgroundColor: p.bg, color: p.color }}
                  >
                    {p.icon}
                  </div>
                  <span className="text-[9px] font-semibold text-slate-300 text-center leading-tight">{p.name}</span>
                </button>
              ))}
            </div>

            {/* Copy link row */}
            <div
              className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3 cursor-pointer hover:bg-white/10 transition-colors"
              onClick={handleCopy}
            >
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                {copied
                  ? <Check size={15} className="text-emerald-500" />
                  : <Link2 size={15} className="text-slate-300" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-300">{copied ? 'Link copied!' : 'Copy link'}</p>
                <p className="text-[10px] text-slate-300 truncate">{url}</p>
              </div>
            </div>

            {/* Native share (mobile) */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="w-full mt-3 py-2.5 rounded-2xl text-xs font-bold text-slate-300 bg-white/10 hover:bg-white/15 transition-colors"
              >
                More options…
              </button>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
