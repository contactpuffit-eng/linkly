-- Allow vendor_id to be null temporarily and update RLS policies
ALTER TABLE public.products ALTER COLUMN vendor_id DROP NOT NULL;

-- Update RLS policies to allow products with null vendor_id
DROP POLICY IF EXISTS "Vendors can manage their own products" ON public.products;

CREATE POLICY "Vendors can manage their own products" 
ON public.products 
FOR ALL 
USING (auth.uid() = vendor_id OR vendor_id IS NULL);

-- Allow anyone to insert products with null vendor_id for testing
DROP POLICY IF EXISTS "Anyone can insert products for testing" ON public.products;

CREATE POLICY "Anyone can insert products for testing" 
ON public.products 
FOR INSERT 
WITH CHECK (vendor_id IS NULL OR auth.uid() = vendor_id);