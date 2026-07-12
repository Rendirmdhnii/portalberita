import Head from 'next/head';
import Link from 'next/link';

export default function AdminDashboardPlaceholder() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center font-sans p-6">
      <Head>
        <title>Dashboard Admin - PojokTV.com</title>
      </Head>
      <div className="text-center max-w-md w-full bg-slate-800 p-8 border border-slate-700 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold mb-4">🎉 Login Berhasil!</h1>
        <p className="text-slate-400 mb-6 text-sm">Selamat datang di Panel Admin PojokTV.com. Infrastruktur dashboard utama siap di-porting.</p>
        <Link href="/" className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all">
          Kembali ke Utama
        </Link>
      </div>
    </div>
  );
}
