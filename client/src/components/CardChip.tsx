// PMO Toolkit Navigator — Card Chip Component
// Design: "Clarity Cards" — monospace code badge with deck color

import { useLocation } from 'wouter';
import { CARDS, DECKS } from '@/lib/pmoData';

interface CardChipProps {
  code: string;
  size?: 'sm' | 'md';
}

export default function CardChip({ code, size = 'sm' }: CardChipProps) {
  const [, navigate] = useLocation();

  const card = CARDS.find(c => c.code === code || c.id === code);
  if (!card) {
    return (
      <span className={`inline-flex items-center font-mono bg-stone-100 text-stone-500 rounded px-1.5 py-0.5 ${size === 'sm' ? 'text-[10px]' : 'text-xs'}`}>
        {code}
      </span>
    );
  }

  const deck = DECKS.find(d => d.id === card.deckId);
  const bg = deck?.bgColor ?? '#F1F5F9';
  const text = deck?.textColor ?? '#1E293B';

  return (
    <button
      onClick={() => navigate(`/card/${card.id}`)}
      className={`inline-flex items-center font-mono rounded px-1.5 py-0.5 transition-opacity hover:opacity-75 ${size === 'sm' ? 'text-[10px]' : 'text-xs'}`}
      style={{ backgroundColor: bg, color: text }}
    >
      {card.code}
    </button>
  );
}
