import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      if (data.session) {
        router.push('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <Head>
        <title>Log in - PojokTV</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center justify-center">
        <Link className="flex flex-col items-center justify-center group" href="/">
          <div className="font-black tracking-tighter leading-none mb-2 flex items-baseline justify-center">
            <span className="text-gray-900 text-5xl sm:text-6xl group-hover:text-red-600 transition-colors">Pojok</span>
            <span className="text-red-600 text-4xl sm:text-5xl ml-0.5">TV.com</span>
          </div>
          <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase text-center mt-1">
            Portal Berita Terkini & Terpercaya
          </span>
        </Link>
      </div>

      <div className="mt-8 mx-auto w-full max-w-md">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-xl border-t-[5px] border-red-600 sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700">Email Address</label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-shadow"
                  required
                  autoComplete="username"
                  placeholder="Masukkan email..."
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700">Password</label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-shadow"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-black tracking-wider text-white bg-red-600 hover:bg-red-700 focus:outline-none transition-all cursor-pointer relative z-50 disabled:opacity-60"
              >
                {loading ? 'Memproses...' : 'LOG IN SEKARANG'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} PojokTV.com - Hak Cipta Dilindungi.</p>
      </div>
    </div>
  );
}
