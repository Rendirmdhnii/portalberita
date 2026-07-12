import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabaseClient';

export default function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ judul: '', youtube_id: '', deskripsi: '' });
  const [processing, setProcessing] = useState(false);

  useEffect(() => { fetchVideos(); }, []);

  const fetchVideos = async () => {
    setLoading(true);
    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    setVideos(data || []);
    setLoading(false);
  };

  const showFlash = (msg) => { setFlash(msg); setTimeout(() => setFlash(''), 3000); };

  const extractYoutubeId = (input) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = input.match(regExp);
    return (match && match[2].length === 11) ? match[2] : input;
  };

  const handleEdit = (video) => {
    setEditItem(video);
    setForm({ judul: video.judul, youtube_id: video.youtube_id, deskripsi: video.deskripsi || '' });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus video ini?')) return;
    await supabase.from('videos').delete().eq('id', id);
    showFlash('Video berhasil dihapus.');
    fetchVideos();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    const youtube_id = extractYoutubeId(form.youtube_id);
    const payload = { judul: form.judul, youtube_id, deskripsi: form.deskripsi };
    try {
      if (editItem) {
        const { error } = await supabase.from('videos').update(payload).eq('id', editItem.id);
        if (error) throw error;
        showFlash('Video berhasil diperbarui.');
      } else {
        const { error } = await supabase.from('videos').insert([payload]);
        if (error) throw error;
        showFlash('Video berhasil ditambahkan.');
      }
      setShowForm(false); setEditItem(null); setForm({ judul: '', youtube_id: '', deskripsi: '' });
      fetchVideos();
    } catch (err) {
      showFlash('Error: ' + (err.message || 'Gagal menyimpan.'));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AdminLayout>
      <Head><title>Kelola Video - PojokTV</title></Head>

      {flash && (
        <div className="mb-6 p-4 bg-green-100 border-2 border-green-300 rounded-lg text-green-900 text-base font-bold">{flash}</div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg border border-gray-300 font-bold text-base transition-colors shadow-sm">
            ← Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Video (YouTube Embed)</h1>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditItem(null); setForm({ judul: '', youtube_id: '', deskripsi: '' }); }}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold text-base shadow-sm transition-colors"
        >
          + Tambah Video Baru
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-xl mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{editItem ? 'Edit Video' : 'Tambah Video Baru'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Judul Video</label>
              <input type="text" value={form.judul} onChange={e => setForm({ ...form, judul: e.target.value })} required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" placeholder="Contoh: Liputan Khusus Pemilu 2024" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">YouTube ID atau URL</label>
              <input type="text" value={form.youtube_id} onChange={e => setForm({ ...form, youtube_id: e.target.value })} required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" placeholder="dQw4w9WgXcQ atau https://youtube.com/watch?v=..." />
              <p className="text-xs text-gray-500 mt-1">Bisa paste URL lengkap YouTube atau hanya Video ID-nya saja.</p>
            </div>
            {form.youtube_id && (
              <div>
                <p className="text-xs text-gray-700 font-bold mb-1">Preview:</p>
                <img src={`https://img.youtube.com/vi/${extractYoutubeId(form.youtube_id)}/hqdefault.jpg`} alt="Thumbnail YouTube" className="h-32 object-cover rounded border border-gray-200" />
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Deskripsi (opsional)</label>
              <textarea value={form.deskripsi} onChange={e => setForm({ ...form, deskripsi: e.target.value })} rows="3" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" placeholder="Deskripsi singkat video..."></textarea>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={processing} className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-red-700 disabled:opacity-60">
                {processing ? 'Menyimpan...' : (editItem ? 'Simpan Perubahan' : 'Tambah Video')}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-200">Batal</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-20 text-center text-gray-400">Memuat data...</div>
        ) : videos.length === 0 ? (
          <div className="col-span-3 py-20 text-center text-gray-500 font-bold bg-white rounded-xl border border-gray-200">
            Belum ada video terdaftar. Klik &quot;+ Tambah Video Baru&quot; untuk memulai.
          </div>
        ) : (
          videos.map(video => (
            <div key={video.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="aspect-video w-full bg-black">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${video.youtube_id}`}
                  title={video.judul}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{video.judul}</h3>
                <p className="text-xs text-gray-500 mb-3">ID: {video.youtube_id}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(video)} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-900 px-3 py-2 rounded-lg border border-blue-300 font-bold text-sm">Edit</button>
                  <button onClick={() => handleDelete(video.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-900 px-3 py-2 rounded-lg border border-red-300 font-bold text-sm">Hapus</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
