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

  if (news.length === 0) {
    return (
      <div className="ticker-bar bg-slate-900 border-b border-slate-800 h-10 w-full flex items-center">
        <div className="ticker-label bg-red-650 text-white text-xs font-black px-4 flex items-center h-full shrink-0 uppercase tracking-wider select-none">
          ⚠️ BREAKING NEWS
        </div>
        <div className="flex-1 bg-slate-900 h-full flex items-center pl-4 text-xs text-slate-400">
          Memuat berita terbaru...
        </div>
      </div>
    );
  }

  // Duplicate items to ensure seamless infinite scrolling loop
  const displayNews = [...news, ...news, ...news];

  return (
    <div className="ticker-bar bg-slate-900 border-b border-slate-800 h-10 w-full flex items-center overflow-hidden">
      {/* Label */}
      <div className="ticker-label bg-red-650 text-white text-xs font-black px-4 flex items-center h-full shrink-0 uppercase tracking-wider relative z-10 select-none">
        ⚠️ BREAKING NEWS
      </div>
      
      {/* Track path */}
      <div className="ticker-content flex-grow overflow-hidden relative h-full flex items-center bg-slate-900 min-w-0">
        <div className="ticker-track flex items-center gap-12 whitespace-nowrap" id="breaking-ticker">
          {displayNews.map((post, idx) => (
            <span key={`${post.id}-${idx}`} className="ticker-item text-sm font-semibold text-white hover:text-red-400 hover:underline transition-colors cursor-pointer flex items-center">
              <span className="ticker-bullet text-red-500 font-extrabold mr-3 select-none text-base">•</span>
              <Link href={`/berita/${post.slug}`}>{post.title}</Link>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
