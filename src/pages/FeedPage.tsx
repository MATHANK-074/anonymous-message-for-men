import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Post, Reply } from '../lib/supabase';
import PostCard from '../components/Feed/PostCard';
import CreatePostModal from '../components/Feed/CreatePostModal';
import ViewRepliesModal from '../components/Feed/ViewRepliesModal';
import ReplyModal from '../components/Feed/ReplyModal';
import { LogOut, Plus, MessageCircle } from 'lucide-react';

export default function FeedPage() {
  const { user, signOut } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [replies, setReplies] = useState<Record<string, Reply[]>>({});
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showReplies, setShowReplies] = useState<string | null>(null);
  const [replyToPost, setReplyToPost] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    const { data: postsData } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (postsData) {
      setPosts(postsData);

      const { data: repliesData } = await supabase
        .from('replies')
        .select('*')
        .order('created_at', { ascending: true });

      if (repliesData) {
        const repliesByPost: Record<string, Reply[]> = {};
        repliesData.forEach((reply) => {
          if (!repliesByPost[reply.post_id]) {
            repliesByPost[reply.post_id] = [];
          }
          repliesByPost[reply.post_id].push(reply);
        });
        setReplies(repliesByPost);
      }
    }
    setLoading(false);
  };

  const handleDeletePost = async (postId: string) => {
    await supabase.from('posts').delete().eq('id', postId);
    loadPosts();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Anonymous Support</h1>
              <p className="text-xs text-gray-500">Share your concerns safely</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => setShowCreatePost(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Share Your Thoughts Anonymously
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No posts yet</h3>
            <p className="text-gray-600">Be the first to share your thoughts anonymously!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                replies={replies[post.id] || []}
                isOwner={post.user_id === user?.id}
                onDelete={handleDeletePost}
                onReply={(postId) => setReplyToPost(postId)}
                onViewReplies={(postId) => setShowReplies(postId)}
              />
            ))}
          </div>
        )}
      </div>

      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          onSuccess={() => {
            setShowCreatePost(false);
            loadPosts();
          }}
        />
      )}

      {showReplies && (
        <ViewRepliesModal
          postId={showReplies}
          post={posts.find((p) => p.id === showReplies)!}
          replies={replies[showReplies] || []}
          currentUserId={user?.id || ''}
          onClose={() => setShowReplies(null)}
          onReplyDeleted={loadPosts}
        />
      )}

      {replyToPost && (
        <ReplyModal
          postId={replyToPost}
          onClose={() => setReplyToPost(null)}
          onSuccess={() => {
            setReplyToPost(null);
            loadPosts();
          }}
        />
      )}
    </div>
  );
}
