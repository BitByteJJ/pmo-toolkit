// HowItWasBuilt — Documentation page for StratAlign
// Shows the tools, prompts, and process used to build the app.
// Requested by Sonia Lovely (Jackson's wife) via LinkedIn.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2, Sparkles, Layers, FileText, ChevronDown, ChevronUp,
  Github, Globe, Cpu, Palette, Database, Zap, BookOpen,
  Copy, Check,
} from 'lucide-react';
import { useLocation } from 'wouter';
import BottomNav from '@/components/BottomNav';

// ── Data ─────────────────────────────────────────────────────────────────────

const TOOLS = [
  {
    category: 'Frontend',
    color: '#0ea5e9',
    bg: '#F0F9FF',
    icon: Globe,
    items: [
      { name: 'React 19 + TypeScript', desc: 'Component-based UI with full type safety' },
      { name: 'Vite 7', desc: 'Lightning-fast dev server and build tool' },
      { name: 'Tailwind CSS 4', desc: 'Utility-first styling with OKLCH colour tokens' },
      { name: 'Framer Motion', desc: 'Smooth animations and spring physics' },
      { name: 'Wouter', desc: 'Lightweight client-side routing' },
      { name: 'Lucide React', desc: 'Consistent icon library (stroke-based)' },
    ],
  },
  {
    category: 'Backend',
    color: '#10b981',
    bg: '#ECFDF5',
    icon: Database,
    items: [
      { name: 'Express 4 + tRPC 11', desc: 'Type-safe API layer — no REST boilerplate' },
      { name: 'Drizzle ORM + MySQL', desc: 'Schema-first database with type inference' },
      { name: 'Manus OAuth', desc: 'One-click authentication via Manus platform' },
      { name: 'AWS S3', desc: 'File storage for generated documents' },
    ],
  },
  {
    category: 'AI & Generation',
    color: '#6366f1',
    bg: '#EEF2FF',
    icon: Sparkles,
    items: [
      { name: 'Manus Built-in LLM API', desc: 'Powers AI Tool Finder recommendations and content generation' },
      { name: 'Google Cloud Text-to-Speech', desc: 'AI-powered audio narration for card deep dives — converts written content to natural-sounding speech via the Google TTS API' },
      { name: 'jsPDF', desc: 'Client-side PDF generation with landscape support' },
      { name: 'docx (npm)', desc: 'Word document generation with footers and tables' },
      { name: 'Whisper API', desc: 'Voice transcription (available for future features)' },
    ],
  },
  {
    category: 'Design & Assets',
    color: '#f59e0b',
    bg: '#FEF3C7',
    icon: Palette,
    items: [
      { name: 'Sora + Inter fonts', desc: 'Display + body typeface pairing via Google Fonts' },
      { name: 'Custom illustrations', desc: '198 fine-line caricature card illustrations — generated via Manus image generation' },
      { name: 'Deck cover art', desc: '8 full-bleed deck cover illustrations — generated and hosted on Manus CDN' },
      { name: 'shadcn/ui', desc: 'Accessible component primitives (dialogs, tooltips, toasts)' },
    ],
  },
  {
    category: 'Infrastructure',
    color: '#8b5cf6',
    bg: '#F5F3FF',
    icon: Cpu,
    items: [
      { name: 'Manus Platform', desc: 'Hosting, CI/CD, secrets management, and analytics' },
      { name: 'localStorage', desc: 'Client-side persistence for progress, bookmarks, and auto-saved templates' },
      { name: 'GitHub (private)', desc: 'Source code version control — public release coming soon' },
    ],
  },
];

const PROMPTS = [
  {
    category: 'Content Generation',
    color: '#6366f1',
    icon: Sparkles,
    prompts: [
      {
        title: 'Card Deep Dive',
        prompt: `You are a senior project management expert. For the PM tool/technique "{CARD_TITLE}" ({CARD_ID}), write a deep dive with exactly 5 sections:
1. Core Concept — what it is and why it matters (2-3 sentences)
2. How It Works — step-by-step process (4-6 numbered steps)
3. Real-World Example — a specific, named project scenario (3-4 sentences)
4. Common Mistakes — 3 pitfalls with brief explanations
5. When NOT to Use — 2-3 situations where this tool is inappropriate

Use plain English. No jargon unless defined. Each section should be self-contained.`,
      },
      {
        title: 'Case Study',
        prompt: `Write a real-world case study for the PM tool "{CARD_TITLE}". Structure:
- Company/Project: [Real organisation name and project]
- Challenge: [Specific problem they faced — 2 sentences]
- How they used {CARD_TITLE}: [Concrete actions taken — 3-4 sentences]
- Outcome: [Measurable result with numbers if possible — 2 sentences]
- Key lesson: [One actionable takeaway — 1 sentence]

Use only verifiable, publicly documented examples. Cite the source.`,
      },
      {
        title: 'Glossary Term',
        prompt: `Define the PM term "{TERM}" for a glossary aimed at early-career project managers.
Format:
- Definition: [1-2 clear sentences, no jargon]
- In practice: [How it appears in real projects — 1 sentence]
- Related terms: [2-3 linked concepts]
- Related cards: [List card IDs from this set: {CARD_IDS}]`,
      },
      {
        title: 'Template Fields',
        prompt: `Design a fillable working template for the PM tool "{CARD_TITLE}". 
The template should help a project manager actually USE this tool on a real project.
Include:
- A metadata section (project name, date, owner, status)
- 3-5 main sections relevant to how this tool is used
- At least one table with appropriate columns
- A checklist of key steps or criteria
- A notes/actions section

Return as structured JSON matching this schema: {SCHEMA}`,
      },
    ],
  },
  {
    category: 'AI Tool Finder',
    color: '#0ea5e9',
    icon: Cpu,
    prompts: [
      {
        title: 'Tool Recommendation System Prompt',
        prompt: `You are an expert project management advisor with 20+ years of experience across industries. 
A project manager has described their challenge. Your job is to recommend 4-6 PM tools, techniques, or frameworks from the provided catalogue that would most help them.

For each recommendation:
1. Explain specifically WHY this tool helps their situation (not generic benefits)
2. Note any prerequisites or context needed
3. Rank them by relevance (most relevant first)

Be direct and practical. Avoid recommending tools that require organisational change unless the user mentions they have authority to make changes.

CARD CATALOGUE:
{CATALOGUE}

USER'S CHALLENGE:
{USER_INPUT}

Return JSON: { summary: string, recommendations: [{ cardId, title, deckId, reason, rank }] }`,
      },
    ],
  },
  {
    category: 'Illustration Generation',
    color: '#f59e0b',
    icon: Palette,
    prompts: [
      {
        title: 'Card Illustration Style',
        prompt: `Create a fine-line illustration for the PM concept "{CARD_TITLE}". 

Style requirements:
- Fine-line pen illustration, minimal colour palette (2-3 colours max)
- Friendly caricature style — slightly exaggerated, warm and approachable
- White or very light background
- Square format, centred composition
- No text or labels in the image
- Represents the concept metaphorically (e.g., RACI Matrix = people at a table with roles)
- Professional but not corporate — think "illustrated textbook" aesthetic`,
      },
      {
        title: 'Deck Cover Art',
        prompt: `Create a full-bleed deck cover illustration for the "{DECK_TITLE}" deck in a PM toolkit app.

Style: Rich editorial illustration, warm colour palette based on {DECK_COLOR}. 
Show a scene of project managers or teams using the tools in this deck.
Composition: Portrait orientation, main subject in upper-centre, supporting elements below.
Mood: Confident, collaborative, modern — not corporate clip art.
No text. High detail. Suitable as a book cover.`,
      },
    ],
  },
];

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Content Architecture',
    desc: 'Defined the 8-deck structure based on the PMBOK framework and flash card deck concept. Mapped 198 cards across Project Phases, Archetyping, Methodologies, People, Process, Business Environment, Tools, and Advanced Techniques. The Manus built-in LLM was used throughout to generate and refine all card content, with animations designed and iterated using AI-assisted prompts.',
    color: '#0284C7',
  },
  {
    step: '02',
    title: 'Data Modelling',
    desc: 'Designed the card schema (id, title, deckId, tags, difficulty, proTip, relatedCards) and wrote all 198 card entries in pmoData.ts. Standardised IDs (P1–P21, PR1–PR21, T1–T43, etc.) for consistent cross-referencing.',
    color: '#10b981',
  },
  {
    step: '03',
    title: 'Content Generation',
    desc: 'Used AI prompts (above) to generate deep dives, case studies, glossary entries, and template schemas for all 198 cards. Each piece was reviewed and edited for accuracy, then stored in static TypeScript data files.',
    color: '#6366f1',
  },
  {
    step: '04',
    title: 'Illustration Pipeline',
    desc: 'Generated 198 card illustrations and 8 deck covers using the Manus image generation API. Each illustration was uploaded to the Manus CDN and referenced by card ID in toolImages.ts.',
    color: '#f59e0b',
  },
  {
    step: '05',
    title: 'UI Development',
    desc: 'Built the React app with a mobile-first design. Key decisions: dark navy home screen, frosted glass nav bars, physical card-deck aesthetic for deck covers, and a Duolingo-inspired Learning Journey game. Animations throughout — card flips, spring physics on deck hovers, staggered list entrances, and progress bar fills — are all powered by Framer Motion.',
    color: '#8b5cf6',
  },
  {
    step: '06',
    title: 'Template Library',
    desc: 'Built a fillable template system for all 198 cards with rich form fields (dynamic tables, date pickers, checklists). PDF generation uses jsPDF with landscape support for wide tables; Word generation uses the docx library.',
    color: '#ec4899',
  },
  {
    step: '07',
    title: 'AI Integration',
    desc: 'Wired the Manus LLM API to power the AI Tool Finder. The system prompt includes a compact 198-card catalogue and returns ranked recommendations with specific reasons. Responses are cached in localStorage. Google Cloud Text-to-Speech (TTS) was integrated to generate audio narrations for card deep dives — each card\'s content is sent to the Google TTS API and the resulting audio is streamed directly in the browser.',
    color: '#ef4444',
  },
  {
    step: '08',
    title: 'QA & Validation',
    desc: 'Ran multi-pass validation scripts to verify card counts, ID consistency, cross-references, and template coverage. Fixed 815 ID replacements across 14 files. All 41 vitest tests pass.',
    color: '#0ea5e9',
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all hover:opacity-80"
      style={{ background: copied ? '#ECFDF5' : '#F1F5F9', color: copied ? '#10b981' : '#64748b' }}
    >
      {copied ? <Check size={11} strokeWidth={2.5} /> : <Copy size={11} strokeWidth={2} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

function PromptCard({ title, prompt }: { title: string; prompt: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
      >
        <span className="text-[13px] font-semibold text-slate-200">{title}</span>
        {expanded ? <ChevronUp size={14} strokeWidth={2} className="text-slate-400 shrink-0" /> : <ChevronDown size={14} strokeWidth={2} className="text-slate-400 shrink-0" />}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Prompt</span>
                <CopyButton text={prompt} />
              </div>
              <pre
                className="text-[11.5px] leading-relaxed text-slate-300 whitespace-pre-wrap font-mono bg-white/5 rounded-lg p-3 border border-white/8"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                {prompt}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function HowItWasBuilt() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'process' | 'tools' | 'prompts'>('process');

  const tabs = [
    { id: 'process', label: 'Process', icon: Layers },
    { id: 'tools',   label: 'Tech Stack', icon: Code2 },
    { id: 'prompts', label: 'Prompt Library', icon: Sparkles },
  ] as const;

  return (
    <div className="min-h-screen bg-card pb-24">
      {/* Header */}
      <div
        className="pt-12 pb-6 px-4"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)' }}
      >
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
              <Code2 size={22} strokeWidth={1.8} className="text-indigo-300" />
            </div>
            <div>
              <h1
                className="text-[22px] font-black text-white leading-tight"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                How It Was Built
              </h1>
              <p className="text-[12px] text-indigo-300 mt-0.5">StratAlign — build documentation</p>
            </div>
          </div>

          <p className="text-[13px] text-indigo-200 leading-relaxed opacity-80">
            The full technical documentation for StratAlign — the tech stack, AI prompts, and build process. 
            Source code will be available on GitHub soon.
          </p>


        </div>
      </div>

      {/* Tab bar */}
      <div
        className="sticky z-40 bg-card border-b border-white/8"
        style={{ top: '48px' }}
      >
        <div className="flex" style={{ maxWidth: '480px', margin: '0 auto' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 text-[12px] font-semibold transition-colors relative"
              style={{ color: activeTab === tab.id ? '#8b5cf6' : '#94a3b8' }}
            >
              <tab.icon size={13} strokeWidth={activeTab === tab.id ? 2.4 : 1.8} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: '#8b5cf6' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 16px' }}>

        {/* ── PROCESS TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'process' && (
          <div className="pt-5 space-y-4">
            <p className="text-[12px] text-slate-400 leading-relaxed">
              StratAlign was built over several days using an AI-assisted development workflow. 
              Here's the end-to-end process from content architecture to deployment.
            </p>
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-3"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black text-white shrink-0 mt-0.5"
                  style={{ backgroundColor: step.color }}
                >
                  {step.step}
                </div>
                <div className="flex-1 pb-4 border-b border-white/8 last:border-0">
                  <h3 className="text-[14px] font-bold text-slate-100 mb-1">{step.title}</h3>
                  <p className="text-[12px] text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}

            {/* Stats */}
            <div className="rounded-2xl p-4 mt-2" style={{ background: 'linear-gradient(135deg, #EEF2FF, #F0F9FF)' }}>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3">Build stats</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'PM cards', value: '198' },
                  { label: 'Decks', value: '8' },
                  { label: 'Illustrations', value: '206' },
                  { label: 'Templates', value: '198' },
                  { label: 'Glossary terms', value: '158' },
                  { label: 'Case studies', value: '198' },
                  { label: 'Deep dives', value: '198' },
                  { label: 'Vitest tests', value: '41' },
                ].map(stat => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">{stat.label}</span>
                    <span className="text-[13px] font-black text-indigo-700">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TOOLS TAB ───────────────────────────────────────────────────── */}
        {activeTab === 'tools' && (
          <div className="pt-5 space-y-5">
            {TOOLS.map((section, i) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: section.bg }}
                  >
                    <section.icon size={14} strokeWidth={1.8} style={{ color: section.color }} />
                  </div>
                  <h3 className="text-[13px] font-bold text-slate-200">{section.category}</h3>
                </div>
                <div className="space-y-2">
                  {section.items.map(item => (
                    <div
                      key={item.name}
                      className="flex items-start gap-3 px-3.5 py-3 rounded-xl"
                      style={{ backgroundColor: section.bg }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                        style={{ backgroundColor: section.color }}
                      />
                      <div>
                        <div className="text-[12.5px] font-semibold text-slate-200">{item.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* GitHub CTA */}
            <div className="rounded-2xl p-4 border border-white/10 flex items-center gap-3">
              <Github size={20} strokeWidth={1.8} className="text-slate-400 shrink-0" />
              <div className="flex-1">
                <div className="text-[13px] font-bold text-slate-200">Source Code</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  GitHub repository coming soon — watch Jackson Joy's LinkedIn for the announcement.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PROMPTS TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'prompts' && (
          <div className="pt-5 space-y-6">
            <p className="text-[12px] text-slate-400 leading-relaxed">
              These are the AI prompts used to generate the content in StratAlign. 
              Copy and adapt them for your own PM content projects. 
              Variables in {'{CURLY_BRACES}'} should be replaced with your specific values.
            </p>
            {PROMPTS.map((section, i) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <section.icon size={14} strokeWidth={1.8} style={{ color: section.color }} />
                  <h3 className="text-[13px] font-bold text-slate-200">{section.category}</h3>
                </div>
                <div className="space-y-2">
                  {section.prompts.map(p => (
                    <PromptCard key={p.title} title={p.title} prompt={p.prompt} />
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Disclaimer */}
            <div className="rounded-xl bg-amber-50 border border-amber-100 p-3.5">
              <p className="text-[11px] text-amber-700 leading-relaxed">
                <span className="font-bold">Note:</span> AI-generated content was reviewed and edited for accuracy before inclusion. 
                All case studies reference publicly documented events. Deep dives and glossary entries 
                are based on established PM frameworks (PMBOK, PRINCE2, Agile Manifesto, etc.).
              </p>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
