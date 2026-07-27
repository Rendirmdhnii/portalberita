-- Alter table ads to add image_mobile_url column
ALTER TABLE public.ads 
ADD COLUMN IF NOT EXISTS image_mobile_url text;
