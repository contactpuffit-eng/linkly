-- Corriger les avertissements de sécurité pour les fonctions
CREATE OR REPLACE FUNCTION public.generate_unique_slug(title_text TEXT, vendor_uuid UUID)
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Créer le slug de base à partir du titre
  base_slug := lower(trim(regexp_replace(title_text, '[^a-zA-Z0-9\s]', '', 'g')));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  
  -- Limiter la longueur
  base_slug := substring(base_slug from 1 for 50);
  
  final_slug := base_slug;
  
  -- Vérifier l'unicité et ajouter un compteur si nécessaire
  WHILE EXISTS (SELECT 1 FROM public.landing_pages WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter::text;
  END LOOP;
  
  RETURN final_slug;
END;
$$;