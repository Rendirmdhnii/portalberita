import Header from './Header';
import BreakingNews from './BreakingNews';
import Footer from './Footer';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Layout({ children, activeCategoryName }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data } = await supabase
          .from('categories')
          .select('*')
          .eq('status', 'Aktif')
          .order('sort_order', { ascending: true });
        if (data) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Error fetching categories in Layout:', err);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="w-full bg-white min-h-screen text-black font-sans overflow-x-hidden">
      <Header activeCategoryName={activeCategoryName} />
      <BreakingNews />
      <main className="w-full min-h-[50vh]">
        {children}
      </main>
      <Footer categories={categories} />
    </div>
  );
}
