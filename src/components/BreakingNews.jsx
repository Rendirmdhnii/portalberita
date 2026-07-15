import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function BreakingNews() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    async function fetchBreaking() {
      try {
        const { data } = await supabase
          .from('berita')
          .select('*')
          .eq('status', 'Published')
          .order('created_at', { ascending: false })
          .limit(5);
        setNews(data || []);
      } catch (err) {
        console.error('Error loading breaking news:', err);
      }
    }
    fetchBreaking();
  }, []);

  const displayNews = news.length > 0 ? [...news, ...news, ...news] : [];

  return (
    <div className="flex items-center h-10 w-full overflow-hidden border-b border-gray-200 bg-[#0B162C]">
      {/* Label BREAKING NEWS - merah solid */}
      <div className="bg-[#DC2626] text-white px-4 h-full flex items-center font-bold uppercase text-sm [clip-path:polygon(0_0,_100%_0,_90%_100%,_0_100%)] shrink-0 select-none pr-8">
        BREAKING NEWS
      </div>

      {/* Ticker text area - Navy, teks putih */}
      <div className="ticker-content flex-grow overflow-hidden relative h-full flex items-center bg-[#0B162C] min-w-0 pl-3">
        {news.length === 0 ? (
          <span className="text-sm text-white font-semibold">Memuat berita terbaru...</span>
        ) : (
          <div className="ticker-track flex items-center gap-12 whitespace-nowrap" id="breaking-ticker">
            {displayNews.map((post, idx) => (
              <span key={`${post.id}-${idx}`} className="ticker-item text-sm font-bold text-white hover:text-red-400 hover:underline transition-colors cursor-pointer flex items-center">
                <span className="ticker-bullet text-gray-400 font-extrabold mr-3 select-none text-base">•</span>
                <Link href={`/berita/${post.slug}`}>{post.title}</Link>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
