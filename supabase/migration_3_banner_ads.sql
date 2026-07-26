-- SQL Migration: Add 3 Responsive Banner Image Columns to `ads` table
-- Run this query in your Supabase SQL Editor

ALTER TABLE ads 
ADD COLUMN IF NOT EXISTS desktop_image_url TEXT,
ADD COLUMN IF NOT EXISTS tablet_image_url TEXT,
ADD COLUMN IF NOT EXISTS mobile_image_url TEXT;

-- Backfill legacy data so existing ads remain functional across all screen sizes
UPDATE ads 
SET desktop_image_url = COALESCE(desktop_image_url, image),
    tablet_image_url = COALESCE(tablet_image_url, image),
    mobile_image_url = COALESCE(mobile_image_url, image_mobile_url, image)
WHERE desktop_image_url IS NULL;
