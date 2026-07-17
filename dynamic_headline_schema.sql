-- SQL Migration: Add posisi_tampilan column for Dynamic Auto-Sliding Headlines
-- Execute this query in the Supabase SQL Editor:

-- 1. Add posisi_tampilan column with DEFAULT 'REGULER'
ALTER TABLE public.berita 
ADD COLUMN IF NOT EXISTS posisi_tampilan VARCHAR(20) DEFAULT 'REGULER';

-- 2. Populate existing records based on the legacy posisi_layout values
UPDATE public.berita 
SET posisi_tampilan = CASE 
  WHEN posisi_layout = 'headline' THEN 'HEADLINE'
  WHEN posisi_layout = 'sorotan' THEN 'SOROTAN'
  ELSE 'REGULER'
END
WHERE posisi_tampilan IS NULL OR posisi_tampilan = 'REGULER';
