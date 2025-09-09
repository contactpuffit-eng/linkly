-- Temporarily allow public insertion for testing products
-- This allows testing without authentication
DROP POLICY IF EXISTS "Anyone can insert products for testing" ON public.products;

CREATE POLICY "Anyone can insert products for testing" 
ON public.products 
FOR INSERT 
WITH CHECK (true);

-- Also allow public to view and update products for testing
DROP POLICY IF EXISTS "Anyone can update products for testing" ON public.products;

CREATE POLICY "Anyone can update products for testing" 
ON public.products 
FOR UPDATE 
USING (true);