-- SQL Migration: Add posisi column for Strict 1-to-1 Routing Channels
-- Execute this query in the Supabase SQL Editor:

-- 1. Add posisi column with DEFAULT 'berita_terbaru'
ALTER TABLE public.berita 
ADD COLUMN IF NOT EXISTS posisi VARCHAR(20) DEFAULT 'berita_terbaru';

-- 2. Populate existing records based on the legacy posisi_layout / posisi_tampilan values
UPDATE public.berita 
SET posisi = CASE 
  WHEN posisi_tampilan = 'HEADLINE' OR posisi_layout = 'headline' THEN 'headline'
  WHEN posisi_tampilan = 'SOROTAN' OR posisi_layout = 'sorotan' THEN 'sorotan'
  ELSE 'berita_terbaru'
END;
