-- Ajouter une politique pour permettre la visualisation des produits de test
CREATE POLICY "Allow viewing test products"
ON public.products
FOR SELECT
USING (vendor_id IS NULL OR vendor_id = '00000000-0000-0000-0000-000000000000'::uuid);