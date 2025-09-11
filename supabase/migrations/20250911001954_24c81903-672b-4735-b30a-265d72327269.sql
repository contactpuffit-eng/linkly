-- Supprimer les anciennes politiques restrictives et créer des nouvelles pour les tests
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Allow viewing test products" ON public.products; 
DROP POLICY IF EXISTS "Vendors can manage their own products" ON public.products;
DROP POLICY IF EXISTS "Anyone can insert products for testing" ON public.products;
DROP POLICY IF EXISTS "Anyone can update products for testing" ON public.products;

-- Créer des politiques plus permissives pour les tests
CREATE POLICY "Allow viewing all products" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Allow managing test products" 
ON public.products 
FOR ALL 
USING (vendor_id IS NULL OR vendor_id = '00000000-0000-0000-0000-000000000000'::uuid)
WITH CHECK (vendor_id IS NULL OR vendor_id = '00000000-0000-0000-0000-000000000000'::uuid);