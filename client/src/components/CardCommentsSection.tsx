import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Trash2, Edit2, Check, X } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface CommentItemProps {
  comment: {
    id: number;
    content: string;
    createdAt: number;
    userId: number;
    userName: string;
    userAvatar?: string | null;
  };
  currentUserId?: number;
  isAdmin?: boolean;
  onDelete: (id: number) => void;
  onEdit: (id: number, content: string) => void;
}

function CommentItem({ comment, currentUserId, isAdmin, onDelete, onEdit }: CommentItemProps) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const isOwn = comment.userId === currentUserId;

  const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="flex gap-3"
    >
      {/* Avatar */}
      <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0 mt-0.5">
        {comment.userAvatar
          ? <img src={comment.userAvatar} alt={comment.userName} className="w-7 h-7 rounded-full object-cover" />
          : comment.userName.charAt(0).toUpperCase()
        }
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="text-xs font-bold text-stone-700">{comment.userName}</span>
          <span className="text-[10px] text-stone-400">{timeAgo(comment.createdAt)}</span>
        </div>

        {editing ? (
          <div className="flex gap-2 items-end">
            <textarea
              value={editText}
              onChange={e => setEditText(e.target.value)}
              className="flex-1 text-xs text-stone-700 bg-stone-50 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 border border-stone-200"
              rows={2}
              autoFocus
            />
            <div className="flex flex-col gap-1">
              <button
                onClick={() => { onEdit(comment.id, editText); setEditing(false); }}
                className="w-6 h-6 rounded-lg bg-indigo-500 flex items-center justify-center"
              >
                <Check size={11} className="text-white" />
              </button>
              <button
                onClick={() => { setEditing(false); setEditText(comment.content); }}
                className="w-6 h-6 rounded-lg bg-stone-200 flex items-center justify-center"
              >
                <X size={11} className="text-stone-500" />
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-stone-600 leading-relaxed">{comment.content}</p>
        )}
      </div>

      {/* Actions */}
      {(isOwn || isAdmin) && !editing && (
        <div className="flex items-center gap-1 shrink-0">
          {isOwn && (
            <button
              onClick={() => setEditing(true)}
              className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-stone-100"
            >
              <Edit2 size={11} className="text-stone-300 hover:text-stone-500" />
            </button>
          )}
          <button
            onClick={() => onDelete(comment.id)}
            className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-red-50"
          >
            <Trash2 size={11} className="text-stone-300 hover:text-red-400" />
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default function CardCommentsSection({ cardId }: { cardId: string }) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const utils = trpc.useUtils();

  const { data: comments = [], isLoading } = trpc.comments.list.useQuery({ cardId });

  const postMutation = trpc.comments.post.useMutation({
    onSuccess: () => {
      utils.comments.list.invalidate({ cardId });
      setNewComment('');
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.comments.delete.useMutation({
    onSuccess: () => utils.comments.list.invalidate({ cardId }),
    onError: (err) => toast.error(err.message),
  });

  const editMutation = trpc.comments.edit.useMutation({
    onSuccess: () => utils.comments.list.invalidate({ cardId }),
    onError: (err) => toast.error(err.message),
  });

  const handlePost = () => {
    if (!newComment.trim()) return;
    if (!user) {
      toast.error('Sign in to post a comment');
      return;
    }
    postMutation.mutate({ cardId, content: newComment.trim() });
  };

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle size={15} className="text-indigo-500" />
        <h3 className="text-xs font-black text-stone-500 uppercase tracking-[0.1em]">
          Discussion {comments.length > 0 && `(${comments.length})`}
        </h3>
      </div>

      {/* Comment input */}
      {user ? (
        <div className="flex gap-2 mb-4">
          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0 mt-0.5">
            {user.avatar
              ? <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
              : user.name.charAt(0).toUpperCase()
            }
          </div>
          <div className="flex-1 flex gap-2 items-end">
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Share a thought, tip, or question…"
              className="flex-1 text-xs text-stone-700 bg-stone-50 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 border border-stone-200"
              rows={2}
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handlePost(); }}
            />
            <button
              onClick={handlePost}
              disabled={!newComment.trim() || postMutation.isPending}
              className="w-8 h-8 rounded-xl flex items-center justify-center disabled:opacity-40 transition-opacity"
              style={{ backgroundColor: '#4F46E5' }}
            >
              <Send size={13} className="text-white" />
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-4 px-4 py-3 rounded-xl bg-indigo-50 text-xs text-indigo-600 font-medium">
          <button
            onClick={() => {
              const state = btoa(JSON.stringify({ origin: window.location.origin, returnPath: window.location.pathname }));
              window.location.href = `${import.meta.env.VITE_OAUTH_PORTAL_URL ?? 'https://manus.im'}/oauth/authorize?app_id=${import.meta.env.VITE_APP_ID}&state=${state}`;
            }}
            className="underline"
          >
            Sign in
          </button>
          {' '}to join the discussion
        </div>
      )}

      {/* Comments list */}
      {isLoading ? (
        <div className="text-xs text-stone-400 text-center py-4">Loading comments…</div>
      ) : comments.length === 0 ? (
        <div className="text-xs text-stone-400 text-center py-4">
          No comments yet. Be the first to share a thought!
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {comments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={user?.id}
                isAdmin={user?.role === 'admin'}
                onDelete={(id) => deleteMutation.mutate({ id })}
                onEdit={(id, content) => editMutation.mutate({ id, content })}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
