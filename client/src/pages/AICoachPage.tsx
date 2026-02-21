// StratAlign — AI Coach Page
// Design: "Clarity Cards" — chat interface with card recommendation chips
import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, RefreshCw, ExternalLink, ChevronLeft } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { invokeLLM, Message } from '@/lib/llm';
import { CARDS, DECKS, getCardById, getDeckById } from '@/lib/pmoData';

// Build a compact card catalogue for the system prompt
const CARD_CATALOGUE = CARDS.map(c => `${c.code}|${c.title}|${c.tagline}`).join('\n');

const SYSTEM_PROMPT = `You are the StratAlign AI Coach — a friendly, practical project management advisor. You help people at all experience levels, from complete beginners to seasoned PMs.

You have access to a library of 144 project management cards across 8 decks:
${CARD_CATALOGUE}

When a user describes a challenge, you:
1. Acknowledge their situation with empathy and plain language (no jargon unless explained)
2. Recommend 2–4 specific cards from the library that will help, using their exact codes (e.g. T1, M2, process-5)
3. Briefly explain WHY each card is relevant to their specific situation
4. Give one concrete first action they can take today

Format card recommendations like this: **[T1] Gantt Chart** — reason it helps.

Keep responses concise (under 250 words). Use plain language. If the user is a beginner, explain any PM terms you use.`;

const STARTER_PROMPTS = [
  "I've just been given my first project and I don't know where to start",
  "My project is running over budget and I'm not sure what to do",
  "There's conflict in my team and it's slowing everything down",
  "My stakeholders keep changing what they want",
  "I need to present project progress to senior leadership",
  "My project scope keeps growing and I'm losing control",
];

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  cardRefs?: string[]; // card codes extracted from the response
}

function extractCardCodes(text: string): string[] {
  const matches = text.match(/\[([A-Za-z0-9-]+)\]/g) ?? [];
  return matches
    .map(m => m.slice(1, -1))
    .filter(code => CARDS.some(c => c.code === code || c.id === code));
}

function CardChip({ codeOrId }: { codeOrId: string }) {
  const [, navigate] = useLocation();
  const card = CARDS.find(c => c.code === codeOrId || c.id === codeOrId);
  const deck = card ? getDeckById(card.deckId) : null;
  if (!card || !deck) return null;
  return (
    <button
      onClick={() => navigate(`/card/${card.id}`)}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all hover:opacity-80 active:scale-95 mt-1"
      style={{ backgroundColor: deck.bgColor, color: deck.color, border: `1px solid ${deck.color}30` }}
    >
      <span className="font-mono">{card.code}</span>
      <span className="max-w-[120px] truncate">{card.title}</span>
      <ExternalLink size={9} />
    </button>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user';
  // Convert **bold** and card refs to styled text
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|\[[A-Za-z0-9-]+\][^—\n]*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: isUser ? '#1c1917' : '#EFF6FF' }}
      >
        {isUser ? <User size={13} className="text-white" /> : <Bot size={13} className="text-blue-600" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1.5`}>
        <div
          className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
          style={{
            backgroundColor: isUser ? '#1c1917' : '#ffffff',
            color: isUser ? '#fafaf9' : '#1c1917',
            boxShadow: isUser ? 'none' : '0 1px 4px rgba(0,0,0,0.07)',
          }}
        >
          {renderContent(msg.content)}
        </div>
        {/* Card chips */}
        {!isUser && msg.cardRefs && msg.cardRefs.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-1">
            {msg.cardRefs.map(code => (
              <CardChip key={code} codeOrId={code} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function AICoachPage() {
  const [, navigate] = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setStreamingText('');

    const history: Message[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: text.trim() },
    ];

    let fullResponse = '';
    try {
      await invokeLLM({
        messages: history,
        stream: true,
        onChunk: (chunk) => {
          fullResponse += chunk;
          setStreamingText(fullResponse);
        },
      });
    } catch (err) {
      // Fallback: try non-streaming
      try {
        fullResponse = await invokeLLM({ messages: history });
      } catch {
        fullResponse = "I'm having trouble connecting right now. Please try again in a moment.";
      }
    }

    const cardRefs = extractCardCodes(fullResponse);
    setMessages(prev => [...prev, { role: 'assistant', content: fullResponse, cardRefs }]);
    setStreamingText('');
    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function reset() {
    setMessages([]);
    setInput('');
    setStreamingText('');
    inputRef.current?.focus();
  }

  const isEmpty = messages.length === 0 && !loading;

  return (
    <div className="min-h-screen flex flex-col pb-24" style={{ backgroundColor: '#F7F5F0' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between"
        style={{
          background: 'rgba(247,245,240,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-stone-500 hover:text-stone-800 transition-colors">
          <ChevronLeft size={16} />
          <span className="text-sm font-semibold">Back</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
            <Sparkles size={13} className="text-blue-600" />
          </div>
          <span className="text-sm font-bold text-stone-800">AI Coach</span>
        </div>
        {messages.length > 0 && (
          <button onClick={reset} className="flex items-center gap-1 text-stone-400 hover:text-stone-700 transition-colors">
            <RefreshCw size={13} />
            <span className="text-xs font-semibold">New chat</span>
          </button>
        )}
        {messages.length === 0 && <div className="w-16" />}
      </div>

      {/* Messages area */}
      <div className="flex-1 px-4 py-4 space-y-4 max-w-2xl mx-auto w-full">
        {isEmpty && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="pt-4"
          >
            {/* Welcome card */}
            <div
              className="rounded-2xl p-5 mb-6 text-center"
              style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#DBEAFE' }}>
                <Sparkles size={22} className="text-blue-600" />
              </div>
              <h2 className="text-lg font-black text-stone-900 mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
                Your AI Project Coach
              </h2>
              <p className="text-sm text-stone-500 leading-relaxed">
                Describe any project challenge in plain language. I'll recommend the right tools and frameworks from the StratAlign library.
              </p>
            </div>

            {/* Starter prompts */}
            <p className="text-[11px] font-black text-stone-400 uppercase tracking-wider mb-3">Try asking about…</p>
            <div className="space-y-2">
              {STARTER_PROMPTS.map((prompt, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => sendMessage(prompt)}
                  className="w-full text-left px-4 py-3 rounded-2xl bg-white text-sm text-stone-700 font-medium hover:bg-stone-50 active:scale-[0.99] transition-all"
                  style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                >
                  {prompt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}

        {/* Streaming indicator */}
        {loading && streamingText && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: '#EFF6FF' }}>
              <Bot size={13} className="text-blue-600" />
            </div>
            <div
              className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
              style={{ backgroundColor: '#ffffff', color: '#1c1917', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}
            >
              {streamingText}
              <span className="inline-block w-1.5 h-4 bg-blue-400 ml-0.5 animate-pulse rounded-sm" />
            </div>
          </motion.div>
        )}

        {loading && !streamingText && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: '#EFF6FF' }}>
              <Bot size={13} className="text-blue-600" />
            </div>
            <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        className="sticky bottom-16 px-4 py-3 max-w-2xl mx-auto w-full"
        style={{
          background: 'rgba(247,245,240,0.95)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div
          className="flex items-end gap-2 rounded-2xl px-3 py-2 bg-white"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.07)' }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your project challenge…"
            rows={1}
            className="flex-1 resize-none text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none bg-transparent py-1.5 max-h-32"
            style={{ lineHeight: '1.5' }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all active:scale-95 disabled:opacity-40"
            style={{ backgroundColor: input.trim() && !loading ? '#1c1917' : '#e7e5e4' }}
          >
            <Send size={13} className={input.trim() && !loading ? 'text-white' : 'text-stone-400'} />
          </button>
        </div>
        <p className="text-center text-[9px] text-stone-400 mt-1.5">Press Enter to send · Shift+Enter for new line</p>
      </div>

      <BottomNav />
    </div>
  );
}
