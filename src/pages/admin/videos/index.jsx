import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';

export default function VideoIndex() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form states
  const [judul, setJudul] = useState('');
  const [link, setLink] = useState('');

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data, error: fetchErr } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchErr) throw fetchErr;
      setVideos(data || []);
    } catch (err) {
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const extractYoutubeId = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|live\/|shorts\/)|youtu\.be\/).+$/;
    if (!youtubeRegex.test(url)) return null;

    try {
      const cleanedUrl = url.trim();

      // Case 1: youtu.be/<id>
      if (cleanedUrl.includes('youtu.be/')) {
        const parts = cleanedUrl.split('youtu.be/');
        if (parts[1]) {
          const id = parts[1].split(/[?#&]/)[0];
          if (id.length === 11) return id;
        }
      }

      // Case 2: youtube.com/live/<id>
      if (cleanedUrl.includes('/live/')) {
        const parts = cleanedUrl.split('/live/');
        if (parts[1]) {
          const id = parts[1].split(/[?#&]/)[0];
          if (id.length === 11) return id;
        }
      }

      // Case 3: youtube.com/shorts/<id>
      if (cleanedUrl.includes('/shorts/')) {
        const parts = cleanedUrl.split('/shorts/');
        if (parts[1]) {
          const id = parts[1].split(/[?#&]/)[0];
          if (id.length === 11) return id;
        }
      }

      // Case 4: watch?v=<id> or embed/<id>
      const regExp = /^.*(v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = cleanedUrl.match(regExp);
      if (match && match[2] && match[2].length === 11) {
        return match[2];
      }

      return null;
    } catch (e) {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      const ytId = extractYoutubeId(link);
      if (!ytId) {
        throw new Error('Format link YouTube tidak valid. Harap masukkan tautan video YouTube yang benar.');
      }

      const { error: insertError } = await supabase
        .from('videos')
        .insert([
          {
            judul,
            link,
            youtube_id: ytId
          }
        ]);

      if (insertError) throw insertError;

      setJudul('');
      setLink('');
      setMessage('Video YouTube berhasil ditambahkan dan ditayangkan.');
      fetchVideos();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setError(err.message || 'Gagal menambahkan video.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus video ini dari Pojok Video?')) {
      try {
        const { error: deleteErr } = await supabase
          .from('videos')
          .delete()
          .eq('id', id);

        if (deleteErr) throw deleteErr;

        setMessage('Video berhasil dihapus.');
        fetchVideos();
        setTimeout(() => setMessage(''), 4000);
      } catch (err) {
        alert('Gagal menghapus video: ' + err.message);
      }
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Kelola Pojok Video - PojokTV</title>
      </Head>

      {message && (
        <div className="mb-6 p-4 bg-green-100 border-2 border-green-300 rounded-lg text-green-900 text-base font-bold">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 border-2 border-red-300 rounded-lg text-red-900 text-base font-bold">
          {error}
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Kelola Pojok Video</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Tambah Video */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h3 className="font-bold text-gray-900 mb-4 text-lg border-b pb-2">Tambah Video Baru</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-base font-bold text-gray-800 mb-1">Judul Video</label>
              <input
                type="text"
                value={judul}
                onChange={e => setJudul(e.target.value)}
                placeholder="Cth: Detik-detik Pengesahan Pengurus DPC PKB"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-base font-bold text-gray-800 mb-1">Link URL YouTube</label>
              <input
                type="text"
                value={link}
                onChange={e => setLink(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium"
                required
              />
              <p className="text-xs text-gray-700 mt-1 leading-relaxed">Klik di atas untuk menempelkan link video YouTube dari browser Anda.</p>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md text-base transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
            >
              {processing ? 'Menyimpan...' : 'Simpan & Tayangkan Video'}
            </button>
          </form>
        </div>

        {/* Tabel Daftar Video */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-950 text-lg">Daftar Video Tayang</h3>
            <p className="text-sm text-gray-700 mt-0.5">Terdapat {videos.length} video tayang di Pojok Video</p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400 font-bold">
              <i className="fa-solid fa-spinner animate-spin mr-2"></i>Memuat video...
            </div>
          ) : videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <p className="font-bold text-lg">Belum ada video tayang</p>
              <p className="text-base mt-1">Tambahkan video YouTube pertama Anda di form sebelah kiri.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-base">
                <thead className="bg-gray-50 text-sm uppercase text-gray-800 font-bold border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4">Preview</th>
                    <th className="px-6 py-4">Judul Video</th>
                    <th className="px-6 py-4">YouTube ID</th>
                    <th className="px-6 py-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {videos.map(video => (
                    <tr key={video.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4">
                        <img
                          src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                          alt={video.judul}
                          className="h-12 w-24 object-cover rounded-md border border-gray-300 bg-gray-100"
                        />
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">{video.judul}</td>
                      <td className="px-6 py-4 font-mono text-sm text-gray-700">{video.youtube_id}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(video.id)}
                          className="text-red-700 hover:text-red-900 font-bold text-sm bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg border border-red-300 transition-colors cursor-pointer"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
