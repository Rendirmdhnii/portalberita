-- SQL Migration: Add sort_order for Dynamic Sorting in public.categories
-- Execute this query in the Supabase SQL Editor:

-- 1. Add sort_order column if it doesn't exist
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;

-- 2. Populate existing categories with sequential values based on their current order (alphabetical by name)
-- This ensures they are not all 0, preventing swap logic issues on existing items.
WITH ordered_categories AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY name ASC) as row_num
  FROM public.categories
)
UPDATE public.categories c
SET sort_order = oc.row_num
FROM ordered_categories oc
WHERE c.id = oc.id;

-- 3. (Optional) Create function and trigger to automatically assign max sort_order for dashboard/SQL inserts
CREATE OR REPLACE FUNCTION public.trg_set_category_sort_order_func()
RETURNS trigger AS $$
BEGIN
  IF NEW.sort_order IS NULL OR NEW.sort_order = 0 THEN
    NEW.sort_order := COALESCE((SELECT MAX(sort_order) FROM public.categories), 0) + 1;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_category_sort_order ON public.categories;

CREATE TRIGGER trg_set_category_sort_order
BEFORE INSERT ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.trg_set_category_sort_order_func();
