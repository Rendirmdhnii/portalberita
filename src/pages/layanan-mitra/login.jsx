import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      if (data.session) {
        router.push('/layanan-mitra/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      <Head>
        <title>Authentication</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      {/* Decorative dark ambient light blobs for premium visual depth */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-red-950/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-slate-800/10 blur-[120px] pointer-events-none" />

      {/* Animation Stylesheet */}
      <style>{`
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up-fade {
          animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="w-full max-w-md animate-slide-up-fade z-10">
        {/* LOGO */}
        <div className="text-center mb-10">
          <img src="/logo-pojoktv.png" alt="PojokTV" className="grayscale opacity-40 hover:opacity-100 transition-opacity duration-500 w-64 sm:w-72 md:w-80 h-auto mx-auto object-contain drop-shadow-md" />
        </div>

        {/* LOGIN CARD */}
        <div className="bg-slate-800/90 border border-slate-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl py-10 px-8 sm:px-10 backdrop-blur-sm">

          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-200 text-sm font-medium flex items-start gap-3 animate-pulse">
              <i className="fa-solid fa-triangle-exclamation mt-0.5 text-red-400"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2">
                User ID
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-900/90 border border-slate-700 text-white rounded-xl pl-11 pr-4 py-3.5 block w-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/80 transition-all duration-200 placeholder-slate-500"
                  placeholder="nama@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-300 mb-2">
                Key
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <i className="fa-solid fa-lock"></i>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-900/90 border border-slate-700 text-white rounded-xl pl-11 pr-4 py-3.5 block w-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/80 transition-all duration-200 placeholder-slate-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !email.trim() || !password.trim()}
                className="w-full flex justify-center items-center gap-2.5 py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-[0_0_20px_rgba(220,38,38,0.25)] hover:shadow-[0_0_30px_rgba(220,38,38,0.45)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin"></i>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-right-to-bracket"></i>
                    <span>Continue</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5">
            <i className="fa-solid fa-arrow-left-long"></i> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
