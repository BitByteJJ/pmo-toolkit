import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Plus, Share2, Lock, Globe, Trash2, ArrowLeft,
  BookOpen, ChevronRight, Copy, Check, ExternalLink, Edit2
} from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/hooks/useAuth';
import { getCardById } from '@/lib/pmoData';
import BottomNav from '@/components/BottomNav';
import { toast } from 'sonner';

function LoginPrompt() {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen pb-24 flex flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: '#F5F3EE' }}>
      <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mb-4">
        <Users size={28} className="text-indigo-600" />
      </div>
      <h2 className="text-xl font-bold text-stone-800 mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
        Team Collections
      </h2>
      <p className="text-sm text-stone-500 mb-6 max-w-xs">
        Sign in to create shared collections, collaborate with your team, and share card sets with colleagues.
      </p>
      <button
        onClick={() => {
          const state = btoa(JSON.stringify({ origin: window.location.origin, returnPath: '/team' }));
          window.location.href = `${import.meta.env.VITE_OAUTH_PORTAL_URL ?? 'https://manus.im'}/oauth/authorize?app_id=${import.meta.env.VITE_APP_ID}&state=${state}`;
        }}
        className="px-6 py-3 rounded-2xl text-white font-bold text-sm"
        style={{ backgroundColor: '#4F46E5' }}
      >
        Sign in to continue
      </button>
      <BottomNav />
    </div>
  );
}

interface Collection {
  id: number;
  name: string;
  description?: string | null;
  isPublic: boolean;
  shareToken?: string | null;
  createdAt: number;
  updatedAt: number;
  ownerId: number;
}

function CollectionCard({ collection, isOwned, onOpen, onDelete }: {
  collection: Collection;
  isOwned: boolean;
  onOpen: () => void;
  onDelete?: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyShareLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (collection.shareToken) {
      const url = `${window.location.origin}/shared/${collection.shareToken}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Share link copied!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-4 cursor-pointer"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
      onClick={onOpen}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${collection.isPublic ? 'bg-green-100' : 'bg-stone-100'}`}>
              {collection.isPublic
                ? <Globe size={10} className="text-green-600" />
                : <Lock size={10} className="text-stone-500" />
              }
            </div>
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide">
              {collection.isPublic ? 'Public' : 'Private'} · {isOwned ? 'Owner' : 'Member'}
            </span>
          </div>
          <h3 className="text-sm font-bold text-stone-800 truncate" style={{ fontFamily: 'Sora, sans-serif' }}>
            {collection.name}
          </h3>
          {collection.description && (
            <p className="text-xs text-stone-400 mt-0.5 line-clamp-2">{collection.description}</p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {collection.isPublic && collection.shareToken && (
            <button
              onClick={copyShareLink}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-stone-100 transition-colors"
              title="Copy share link"
            >
              {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} className="text-stone-400" />}
            </button>
          )}
          {isOwned && onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
              title="Delete collection"
            >
              <Trash2 size={13} className="text-stone-300 hover:text-red-400" />
            </button>
          )}
          <ChevronRight size={14} className="text-stone-300" />
        </div>
      </div>
    </motion.div>
  );
}

function CreateCollectionModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const utils = trpc.useUtils();

  const createMutation = trpc.team.createCollection.useMutation({
    onSuccess: () => {
      utils.team.listCollections.invalidate();
      onCreated();
      toast.success('Collection created!');
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        className="w-full max-w-lg bg-white rounded-t-3xl p-6 pb-10"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-stone-800" style={{ fontFamily: 'Sora, sans-serif' }}>
            New Collection
          </h3>
          <button onClick={onClose} className="text-stone-400 text-sm">Cancel</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1 block">Name *</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. My current project toolkit"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              maxLength={255}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1 block">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What is this collection for?"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
              rows={3}
              maxLength={1000}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`w-10 h-6 rounded-full transition-colors relative ${isPublic ? 'bg-indigo-500' : 'bg-stone-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${isPublic ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
            <div>
              <p className="text-sm font-semibold text-stone-700">{isPublic ? 'Public' : 'Private'}</p>
              <p className="text-xs text-stone-400">{isPublic ? 'Anyone with the link can view' : 'Only you and invited members'}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => createMutation.mutate({ name, description, isPublic })}
          disabled={!name.trim() || createMutation.isPending}
          className="w-full mt-6 py-3 rounded-2xl text-white font-bold text-sm disabled:opacity-50 transition-opacity"
          style={{ backgroundColor: '#4F46E5' }}
        >
          {createMutation.isPending ? 'Creating…' : 'Create Collection'}
        </button>
      </motion.div>
    </div>
  );
}

function CollectionDetailView({ collectionId, onBack }: { collectionId: number; onBack: () => void }) {
  const { data, isLoading } = trpc.team.getCollection.useQuery({ id: collectionId });
  const utils = trpc.useUtils();
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const removeCard = trpc.team.removeCard.useMutation({
    onSuccess: () => utils.team.getCollection.invalidate({ id: collectionId }),
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pb-24 flex items-center justify-center" style={{ backgroundColor: '#F5F3EE' }}>
        <div className="text-stone-400 text-sm">Loading collection…</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen pb-24 flex items-center justify-center" style={{ backgroundColor: '#F5F3EE' }}>
        <div className="text-stone-400 text-sm">Collection not found</div>
      </div>
    );
  }

  const isOwner = data.ownerId === user?.id;

  const copyShareLink = () => {
    if (data.shareToken) {
      navigator.clipboard.writeText(`${window.location.origin}/shared/${data.shareToken}`);
      toast.success('Share link copied!');
    }
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#F5F3EE' }}>
      {/* Header */}
      <div className="sticky top-0 z-20 px-4 pt-6 pb-3" style={{ backgroundColor: '#F5F3EE' }}>
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
            <ArrowLeft size={16} className="text-stone-600" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-stone-800 truncate" style={{ fontFamily: 'Sora, sans-serif' }}>
              {data.name}
            </h1>
            <p className="text-[10px] text-stone-400">
              {data.cards.length} card{data.cards.length !== 1 ? 's' : ''} · by {data.owner?.name ?? 'Unknown'}
            </p>
          </div>
          {data.isPublic && data.shareToken && (
            <button
              onClick={copyShareLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-xs font-semibold text-indigo-600 shadow-sm"
            >
              <Share2 size={12} />
              Share
            </button>
          )}
        </div>
        {data.description && (
          <p className="text-xs text-stone-500 mb-2">{data.description}</p>
        )}
      </div>

      {/* Cards */}
      <div className="px-4 space-y-2">
        {data.cards.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen size={32} className="mx-auto text-stone-300 mb-3" />
            <p className="text-sm text-stone-400">No cards yet</p>
            <p className="text-xs text-stone-300 mt-1">Add cards from any card detail page</p>
          </div>
        ) : (
          data.cards.map(({ cardId }) => {
            const card = getCardById(cardId);
            if (!card) return null;
            return (
              <motion.div
                key={cardId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 flex items-center gap-3"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ backgroundColor: '#4F46E5' }}
                >
                  {card.code}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-stone-800 truncate" style={{ fontFamily: 'Sora, sans-serif' }}>
                    {card.title}
                  </h4>
                  <p className="text-xs text-stone-400 truncate">{card.tagline}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => navigate(`/card/${cardId}`)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-stone-100"
                  >
                    <ExternalLink size={13} className="text-stone-400" />
                  </button>
                  {isOwner && (
                    <button
                      onClick={() => removeCard.mutate({ collectionId: collectionId, cardId })}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50"
                    >
                      <Trash2 size={13} className="text-stone-300 hover:text-red-400" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <BottomNav />
    </div>
  );
}

export default function TeamCollectionsPage() {
  const { user, isLoading } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data, isLoading: collectionsLoading } = trpc.team.listCollections.useQuery(undefined, {
    enabled: !!user,
  });
  const utils = trpc.useUtils();

  const deleteCollection = trpc.team.deleteCollection.useMutation({
    onSuccess: () => {
      utils.team.listCollections.invalidate();
      toast.success('Collection deleted');
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F3EE' }}>
        <div className="text-stone-400 text-sm">Loading…</div>
      </div>
    );
  }

  if (!user) return <LoginPrompt />;

  if (selectedId !== null) {
    return <CollectionDetailView collectionId={selectedId} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#F5F3EE' }}>
      {/* Header */}
      <div className="sticky top-0 z-20 px-4 pt-6 pb-3" style={{ backgroundColor: '#F5F3EE' }}>
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-black text-stone-800" style={{ fontFamily: 'Sora, sans-serif' }}>
            Team Collections
          </h1>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-xs font-bold"
            style={{ backgroundColor: '#4F46E5' }}
          >
            <Plus size={14} />
            New
          </button>
        </div>
        <p className="text-xs text-stone-400">Share curated card sets with your team</p>
      </div>

      <div className="px-4 space-y-4">
        {collectionsLoading ? (
          <div className="text-center py-12 text-stone-400 text-sm">Loading collections…</div>
        ) : (
          <>
            {/* Owned collections */}
            {(data?.owned ?? []).length > 0 && (
              <div>
                <h2 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.12em] mb-2">Your Collections</h2>
                <div className="space-y-2">
                  {data!.owned.map(col => (
                    <CollectionCard
                      key={col.id}
                      collection={col}
                      isOwned={true}
                      onOpen={() => setSelectedId(col.id)}
                      onDelete={() => deleteCollection.mutate({ id: col.id })}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Shared with me */}
            {(data?.shared ?? []).length > 0 && (
              <div>
                <h2 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.12em] mb-2">Shared With Me</h2>
                <div className="space-y-2">
                  {data!.shared.map(col => (
                    <CollectionCard
                      key={col.id}
                      collection={col}
                      isOwned={false}
                      onOpen={() => setSelectedId(col.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {(data?.owned ?? []).length === 0 && (data?.shared ?? []).length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                  <Users size={28} className="text-indigo-400" />
                </div>
                <h3 className="text-base font-bold text-stone-700 mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                  No collections yet
                </h3>
                <p className="text-sm text-stone-400 mb-6 max-w-xs mx-auto">
                  Create your first collection to organise cards for a project or share with your team.
                </p>
                <button
                  onClick={() => setShowCreate(true)}
                  className="px-5 py-2.5 rounded-2xl text-white font-bold text-sm"
                  style={{ backgroundColor: '#4F46E5' }}
                >
                  Create First Collection
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {showCreate && (
          <CreateCollectionModal
            onClose={() => setShowCreate(false)}
            onCreated={() => setShowCreate(false)}
          />
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
