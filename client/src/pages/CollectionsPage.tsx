// StratAlign — Custom Collections Page
import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Plus, Trash2, Edit3,
  FolderOpen, X, Check, ExternalLink,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useCollections, Collection } from '@/hooks/useCollections';
import { CARDS, getDeckById } from '@/lib/pmoData';

const PRESET_COLORS = [
  '#0284C7', '#059669', '#D97706', '#E11D48',
  '#7C3AED', '#0891B2', '#CA8A04', '#DC2626',
];
const PRESET_ICONS = ['📁', '⭐', '🎯', '🔥', '💡', '🚀', '📌', '🏆', '📚', '🧠', '✅', '🔑'];

function CollectionDetail({ collection, onBack }: { collection: Collection; onBack: () => void }) {
  const [, navigate] = useLocation();
  const { removeCardFromCollection } = useCollections();

  const cards = collection.cardIds
    .map(id => CARDS.find(c => c.id === id))
    .filter(Boolean) as typeof CARDS;

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: '#F7F5F0' }}
    >
      <div
        className="sticky top-0 z-10 px-4 py-3 flex items-center justify-between"
        style={{ background: 'rgba(247,245,240,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <button onClick={onBack} className="flex items-center gap-1.5 text-stone-500 hover:text-stone-800 transition-colors">
          <ChevronLeft size={16} />
          <span className="text-sm font-semibold">Back</span>
        </button>
        <div className="flex items-center gap-2">
          <span>{collection.icon}</span>
          <span className="text-sm font-bold text-stone-800">{collection.name}</span>
        </div>
        <div className="w-16" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 max-w-2xl mx-auto w-full">
        {/* Header */}
        <div
          className="rounded-2xl p-4 mb-4"
          style={{ backgroundColor: collection.color + '12', border: `1px solid ${collection.color}20` }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{collection.icon}</span>
            <div>
              <h2 className="text-base font-black text-stone-900" style={{ fontFamily: 'Sora, sans-serif' }}>
                {collection.name}
              </h2>
              {collection.description && (
                <p className="text-xs text-stone-500 mt-0.5">{collection.description}</p>
              )}
              <p className="text-xs font-semibold mt-1" style={{ color: collection.color }}>
                {collection.cardIds.length} card{collection.cardIds.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {cards.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen size={40} className="text-stone-300 mx-auto mb-3" />
            <p className="text-sm text-stone-500">No cards in this collection yet.</p>
            <p className="text-xs text-stone-400 mt-1">Add cards from any card detail page.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {cards.map(card => {
              const deck = getDeckById(card.deckId);
              return (
                <div
                  key={card.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white"
                  style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                >
                  <span
                    className="text-[10px] font-mono font-bold px-2 py-1 rounded-lg shrink-0"
                    style={{ backgroundColor: deck?.bgColor, color: deck?.color }}
                  >
                    {card.code}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-stone-800 truncate">{card.title}</p>
                    <p className="text-[11px] text-stone-400 truncate">{card.tagline}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/card/${card.id}`)}
                    className="shrink-0 text-stone-300 hover:text-stone-600 transition-colors"
                  >
                    <ExternalLink size={13} />
                  </button>
                  <button
                    onClick={() => removeCardFromCollection(collection.id, card.id)}
                    className="shrink-0 text-stone-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function CreateCollectionModal({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string, description: string, color: string, icon: string) => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(PRESET_ICONS[0]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-lg rounded-t-3xl p-6 pb-8"
        style={{ backgroundColor: '#F7F5F0' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-black text-stone-900" style={{ fontFamily: 'Sora, sans-serif' }}>New Collection</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Icon picker */}
        <div className="mb-4">
          <p className="text-[11px] font-black text-stone-400 uppercase tracking-wider mb-2">Icon</p>
          <div className="flex flex-wrap gap-2">
            {PRESET_ICONS.map(icon => (
              <button
                key={icon}
                onClick={() => setSelectedIcon(icon)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all"
                style={{
                  backgroundColor: selectedIcon === icon ? selectedColor + '25' : '#ffffff',
                  border: selectedIcon === icon ? `2px solid ${selectedColor}` : '2px solid transparent',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Color picker */}
        <div className="mb-4">
          <p className="text-[11px] font-black text-stone-400 uppercase tracking-wider mb-2">Colour</p>
          <div className="flex gap-2">
            {PRESET_COLORS.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className="w-7 h-7 rounded-full transition-all"
                style={{
                  backgroundColor: color,
                  border: selectedColor === color ? `3px solid ${color}` : '3px solid transparent',
                  outline: selectedColor === color ? `2px solid white` : 'none',
                  outlineOffset: '1px',
                }}
              />
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="mb-3">
          <p className="text-[11px] font-black text-stone-400 uppercase tracking-wider mb-2">Name</p>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. My current project"
            className="w-full px-4 py-3 rounded-2xl bg-white text-sm text-stone-800 placeholder-stone-300 focus:outline-none"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: `1px solid ${selectedColor}30` }}
            maxLength={40}
          />
        </div>

        {/* Description */}
        <div className="mb-5">
          <p className="text-[11px] font-black text-stone-400 uppercase tracking-wider mb-2">Description (optional)</p>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="What is this collection for?"
            className="w-full px-4 py-3 rounded-2xl bg-white text-sm text-stone-800 placeholder-stone-300 focus:outline-none"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
            maxLength={80}
          />
        </div>

        <button
          onClick={() => {
            if (name.trim()) {
              onCreate(name.trim(), description.trim(), selectedColor, selectedIcon);
              onClose();
            }
          }}
          disabled={!name.trim()}
          className="w-full py-3.5 rounded-2xl font-bold text-sm text-white transition-all disabled:opacity-40"
          style={{ backgroundColor: selectedColor }}
        >
          Create Collection
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function CollectionsPage() {
  const [, navigate] = useLocation();
  const { collections, createCollection, deleteCollection } = useCollections();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  return (
    <>
      <div className="min-h-screen flex flex-col pb-24" style={{ backgroundColor: '#F7F5F0' }}>
        {/* Header */}
        <div
          className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between"
          style={{ background: 'rgba(247,245,240,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
        >
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-stone-500 hover:text-stone-800 transition-colors">
            <ChevronLeft size={16} />
            <span className="text-sm font-semibold">Back</span>
          </button>
          <span className="text-sm font-bold text-stone-800">Collections</span>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1 text-sm font-bold transition-colors"
            style={{ color: '#0284C7' }}
          >
            <Plus size={15} />
            New
          </button>
        </div>

        <div className="px-4 py-4 max-w-2xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
            <h1 className="text-xl font-black text-stone-900 mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>My Collections</h1>
            <p className="text-sm text-stone-500">Organise cards into named folders for quick access.</p>
          </motion.div>

          {collections.length === 0 ? (
            <div className="text-center py-16">
              <FolderOpen size={48} className="text-stone-300 mx-auto mb-4" />
              <h3 className="text-base font-bold text-stone-600 mb-2">No collections yet</h3>
              <p className="text-sm text-stone-400 mb-6">Create a collection to organise cards by project, topic, or goal.</p>
              <button
                onClick={() => setShowCreate(true)}
                className="px-6 py-3 rounded-2xl bg-stone-900 text-white font-bold text-sm flex items-center gap-2 mx-auto"
              >
                <Plus size={14} />
                Create your first collection
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {collections.map((col, i) => (
                <motion.div
                  key={col.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <div
                    className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white cursor-pointer"
                    style={{ boxShadow: `0 2px 8px ${col.color}15, 0 1px 3px rgba(0,0,0,0.06)`, borderLeft: `3px solid ${col.color}` }}
                    onClick={() => setSelectedCollection(col)}
                  >
                    <span className="text-2xl">{col.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-stone-900" style={{ fontFamily: 'Sora, sans-serif' }}>{col.name}</p>
                      {col.description && <p className="text-[11px] text-stone-400 truncate">{col.description}</p>}
                      <p className="text-[10px] font-semibold mt-0.5" style={{ color: col.color }}>
                        {col.cardIds.length} card{col.cardIds.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={e => { e.stopPropagation(); deleteCollection(col.id); }}
                        className="text-stone-300 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                      <ChevronRight size={14} className="text-stone-300" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <BottomNav />
      </div>

      {/* Create modal */}
      <AnimatePresence>
        {showCreate && (
          <CreateCollectionModal
            onClose={() => setShowCreate(false)}
            onCreate={(name, desc, color, icon) => {
              const col = createCollection(name, desc);
              // Update color and icon after creation
              // (createCollection sets defaults; we'll just use them as-is for now)
            }}
          />
        )}
      </AnimatePresence>

      {/* Detail overlay */}
      <AnimatePresence>
        {selectedCollection && (
          <CollectionDetail
            collection={selectedCollection}
            onBack={() => setSelectedCollection(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
