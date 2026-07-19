import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { slug, id } = req.body;

  if (!slug && !id) {
    return res.status(400).json({ error: 'Missing slug or id parameter' });
  }

  try {
    // 1. Fetch current views
    let selectQuery = supabase.from('berita').select('id, views');
    if (slug) {
      selectQuery = selectQuery.eq('slug', slug);
    } else {
      selectQuery = selectQuery.eq('id', id);
    }

    const { data: article, error: selectError } = await selectQuery.maybeSingle();

    if (selectError) {
      throw selectError;
    }

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    let currentViews = article.views || 0;

    // ALGORITMA SOCIAL PROOF (INJEKSI ANGKA ACAK):
    // Jika views masih di bawah 50 (termasuk anomali angka 35 saat ini),
    // sistem akan meng-generate angka acak antara 120 hingga 350 sebagai fondasi.
    if (currentViews < 50) {
      currentViews = Math.floor(Math.random() * (350 - 120 + 1)) + 120;
    }

    const newViews = currentViews + 1;

    // 2. Update database dengan angka baru
    const { data: updatedArticle, error: updateError } = await supabase
      .from('berita')
      .update({ views: newViews })
      .eq('id', article.id)
      .select('views')
      .single();

    if (updateError) {
      throw updateError;
    }

    return res.status(200).json({
      success: true,
      views: updatedArticle ? updatedArticle.views : newViews
    });
  } catch (err) {
    console.error('Error incrementing views:', err.message);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}
