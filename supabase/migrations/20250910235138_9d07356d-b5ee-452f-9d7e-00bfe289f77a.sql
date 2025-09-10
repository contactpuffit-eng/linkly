-- Créer une table pour les landing pages générées
CREATE TABLE IF NOT EXISTS public.landing_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL,
  product_id UUID NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  theme_id TEXT NOT NULL,
  customization JSONB NOT NULL,
  ai_data JSONB,
  media_urls JSONB DEFAULT '[]'::jsonb,
  is_published BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  conversions_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;

-- Policies pour landing_pages
CREATE POLICY "Vendors can manage their own landing pages" 
ON public.landing_pages 
FOR ALL 
USING (auth.uid() = vendor_id);

CREATE POLICY "Anyone can view published landing pages" 
ON public.landing_pages 
FOR SELECT 
USING (is_published = true);

-- Créer des buckets pour le storage
INSERT INTO storage.buckets (id, name, public) 
VALUES ('landing-page-media', 'landing-page-media', true)
ON CONFLICT (id) DO NOTHING;

-- Policies pour le storage des médias
CREATE POLICY "Users can upload their own landing page media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'landing-page-media' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own landing page media" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'landing-page-media' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Published landing page media is publicly viewable" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'landing-page-media');

CREATE POLICY "Users can update their own landing page media" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'landing-page-media' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own landing page media" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'landing-page-media' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Fonction pour générer des slugs uniques
CREATE OR REPLACE FUNCTION public.generate_unique_slug(title_text TEXT, vendor_uuid UUID)
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql;