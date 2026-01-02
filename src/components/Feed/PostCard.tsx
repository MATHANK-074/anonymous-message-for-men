import { useState } from 'react';
import { MessageCircle, Calendar, Trash2 } from 'lucide-react';
import { Post, Reply } from '../../lib/supabase';
import { formatDistanceToNow } from '../../utils/dateUtils';

interface PostCardProps {
  post: Post;
  replies: Reply[];
  isOwner: boolean;
  onDelete: (postId: string) => void;
  onReply: (postId: string) => void;
  onViewReplies: (postId: string) => void;
}

export default function PostCard({
  post,
  replies,
  isOwner,
  onDelete,
  onReply,
  onViewReplies,
}: PostCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const categoryColors = {
    academic: 'bg-blue-100 text-blue-700',
    personal: 'bg-green-100 text-green-700',
    general: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
            A
          </div>
          <div>
            <p className="font-semibold text-gray-800">Anonymous Student</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-3 h-3" />
              {formatDistanceToNow(post.created_at)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              categoryColors[post.category as keyof typeof categoryColors] || categoryColors.general
            }`}
          >
            {post.category}
          </span>
          {isOwner && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed mb-4">{post.content}</p>

      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => onViewReplies(post.id)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{replies.length} Replies</span>
        </button>
        <button
          onClick={() => onReply(post.id)}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
        >
          Reply Anonymously
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Post?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(post.id);
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
