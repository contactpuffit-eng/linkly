-- Ajouter une politique pour permettre les tests sans authentification
CREATE POLICY "Allow test landing pages creation"
ON public.landing_pages
FOR INSERT
WITH CHECK (vendor_id = '00000000-0000-0000-0000-000000000000'::uuid OR auth.uid() = vendor_id);