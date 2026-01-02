import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { X, Send } from 'lucide-react';

interface CreatePostModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreatePostModal({ onClose, onSuccess }: CreatePostModalProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);

    const { error } = await supabase.from('posts').insert({
      user_id: user?.id,
      content: content.trim(),
      category,
    });

    if (!error) {
      onSuccess();
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Share Anonymously</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Category
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCategory('academic')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                  category === 'academic'
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                Academic
              </button>
              <button
                type="button"
                onClick={() => setCategory('personal')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                  category === 'personal'
                    ? 'bg-green-100 text-green-700 border-2 border-green-500'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                Personal
              </button>
              <button
                type="button"
                onClick={() => setCategory('general')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                  category === 'general'
                    ? 'bg-gray-700 text-white border-2 border-gray-900'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                General
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Your Concern
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share what's on your mind. Remember, your identity will remain completely anonymous..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
              rows={8}
              required
            />
            <p className="mt-2 text-sm text-gray-500">
              {content.length} characters
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Privacy Notice:</span> Your post will be visible to all users,
              but your identity will remain completely anonymous. Only you will know which posts are yours.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              {loading ? 'Posting...' : 'Post Anonymously'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
