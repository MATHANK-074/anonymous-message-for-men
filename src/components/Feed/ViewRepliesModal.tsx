import { X, Trash2, Calendar } from 'lucide-react';
import { Post, Reply } from '../../lib/supabase';
import { supabase } from '../../lib/supabase';
import { formatDistanceToNow } from '../../utils/dateUtils';

interface ViewRepliesModalProps {
  postId: string;
  post: Post;
  replies: Reply[];
  currentUserId: string;
  onClose: () => void;
  onReplyDeleted: () => void;
}

export default function ViewRepliesModal({
  post,
  replies,
  currentUserId,
  onClose,
  onReplyDeleted,
}: ViewRepliesModalProps) {
  const handleDeleteReply = async (replyId: string) => {
    await supabase.from('replies').delete().eq('id', replyId);
    onReplyDeleted();
  };

  const categoryColors = {
    academic: 'bg-blue-100 text-blue-700',
    personal: 'bg-green-100 text-green-700',
    general: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Post & Replies</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
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
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  categoryColors[post.category as keyof typeof categoryColors] || categoryColors.general
                }`}
              >
                {post.category}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed">{post.content}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Replies ({replies.length})
            </h3>

            {replies.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No replies yet. Be the first to respond!
              </div>
            ) : (
              replies.map((reply) => (
                <div
                  key={reply.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        A
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Anonymous Supporter</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {formatDistanceToNow(reply.created_at)}
                        </div>
                      </div>
                    </div>
                    {reply.user_id === currentUserId && (
                      <button
                        onClick={() => handleDeleteReply(reply.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 leading-relaxed pl-11">{reply.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
