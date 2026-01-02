import { useState } from 'react';
import Login from '../components/Auth/Login';
import SignUp from '../components/Auth/SignUp';
import { MessageCircle } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative z-10 w-full max-w-6xl flex items-center justify-center gap-12">
        <div className="hidden lg:block flex-1 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl shadow-2xl mb-6 transform hover:scale-110 transition-transform duration-300">
            <MessageCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Share Anonymously
          </h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto leading-relaxed">
            A safe space for students to share academic and personal stress concerns without revealing their identity.
          </p>
          <div className="mt-8 flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">100%</div>
              <div className="text-sm text-gray-600">Anonymous</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-600 mb-1">Safe</div>
              <div className="text-sm text-gray-600">Space</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600 mb-1">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          {isLogin ? (
            <Login onToggleMode={() => setIsLogin(false)} />
          ) : (
            <SignUp onToggleMode={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
}
