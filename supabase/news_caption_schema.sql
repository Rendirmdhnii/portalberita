-- SQL Migration: Add image_caption to public.berita
-- Execute this query in the Supabase SQL Editor:

-- Add image_caption column if it doesn't exist
ALTER TABLE public.berita 
ADD COLUMN IF NOT EXISTS image_caption text;
