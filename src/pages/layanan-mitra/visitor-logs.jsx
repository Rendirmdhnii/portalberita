import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';

export default function VisitorLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data, error: fetchErr } = await supabase
        .from('sys_visitor_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(150);

      if (fetchErr) throw fetchErr;
      setLogs(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching visitor logs:', err);
      setError(err.message || 'Gagal mengambil data log.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchLogs();
    }, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const formatAccessTime = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const pad = (n) => String(n).padStart(2, '0');
    
    const dateNum = d.getDate();
    const monthName = months[d.getMonth()];
    const year = d.getFullYear();
    const hour = pad(d.getHours());
    const min = pad(d.getMinutes());
    
    return `${dateNum} ${monthName} ${year}, ${hour}:${min} WIB`;
  };

  return (
    <AdminLayout>
      <Head>
        <title>Pantauan Lalu Lintas Pengunjung - PojokTV</title>
      </Head>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 bg-white p-4 rounded-xl border border-gray-250/60 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              Pantauan Lalu Lintas Pengunjung <span className="text-[10px] sm:text-xs font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">REAL-TIME</span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">Menampilkan 150 aktivitas kunjungan terakhir di portal berita</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] sm:text-xs text-gray-600 font-bold bg-gray-50 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors">
            <input 
              type="checkbox" 
              checked={autoRefresh} 
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded text-emerald-650 focus:ring-emerald-500 border-gray-300"
            />
            <span>Auto Refresh (15s)</span>
          </label>
          
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <i className={`fa-solid fa-arrows-rotate ${loading ? 'animate-spin' : ''}`}></i>
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-750 text-sm font-bold flex items-center gap-3">
          <i className="fa-solid fa-triangle-exclamation text-red-500 text-base"></i>
          <span>{error}</span>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-250/60 overflow-hidden">
        {loading && logs.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-bold">
            <i className="fa-solid fa-satellite-dish animate-pulse text-4xl text-emerald-500 mb-3 block"></i>
            <span>Menghubungkan ke satelit pemantau...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-bold text-sm">
            <i className="fa-solid fa-box-open text-3xl text-gray-300 mb-3 block"></i>
            <span>Belum ada log lalu lintas data pengunjung.</span>
          </div>
        ) : (
          <div className="max-h-[65vh] overflow-y-auto overflow-x-auto relative">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm border-b border-gray-200 text-[11px] sm:text-xs uppercase text-gray-700 font-bold font-mono tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Waktu Akses</th>
                  <th className="px-6 py-3.5">Target IP</th>
                  <th className="px-6 py-3.5">Titik Lokasi</th>
                  <th className="px-6 py-3.5">Jejak URL</th>
                  <th className="px-6 py-3.5">Sistem Perangkat (User Agent)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-blue-50/40 transition-colors">
                    {/* Waktu Akses */}
                    <td className="px-6 py-3.5 text-xs text-gray-650 font-sans font-semibold">
                      {formatAccessTime(log.created_at)}
                    </td>
                    
                    {/* Target IP */}
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 shadow-sm">
                        {log.ip_address || '0.0.0.0'}
                      </span>
                    </td>
                    
                    {/* Titik Lokasi */}
                    <td className="px-6 py-3.5 text-sm font-medium text-slate-800 font-sans">
                      {log.city && log.city !== 'Unknown' ? log.city : 'N/A'}, {log.region && log.region !== 'Unknown' ? log.region : 'N/A'}
                      <span className="text-[10px] text-gray-400 font-mono ml-1.5 uppercase font-bold">
                        ({log.country || 'ID'})
                      </span>
                    </td>
                    
                    {/* Jejak URL */}
                    <td className="px-6 py-3.5 text-xs text-slate-500 font-mono max-w-[200px] truncate" title={log.visited_url}>
                      <a href={log.visited_url} target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">
                        {log.visited_url || '/'}
                      </a>
                    </td>
                    
                    {/* Sistem Perangkat */}
                    <td className="px-6 py-3.5 text-[11px] text-gray-400 font-mono max-w-[150px] sm:max-w-[200px] truncate" title={log.user_agent}>
                      {log.user_agent || 'Unknown Agent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Table Footer Stats */}
        {!loading && logs.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-150 text-[10px] sm:text-xs font-bold text-slate-500 font-mono flex items-center justify-between">
            <span>Menampilkan {logs.length} data pemantauan terenkripsi</span>
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistem Aktif
            </span>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
