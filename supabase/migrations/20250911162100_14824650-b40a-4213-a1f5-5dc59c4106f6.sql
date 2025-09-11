-- Create affiliate pages table for customizable link-in-bio pages
CREATE TABLE public.affiliate_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  theme_color TEXT DEFAULT '#3B82F6',
  is_published BOOLEAN DEFAULT false,
  social_links JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.affiliate_pages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view published affiliate pages" 
ON public.affiliate_pages 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Users can manage their own affiliate page" 
ON public.affiliate_pages 
FOR ALL 
USING (auth.uid() = affiliate_id)
WITH CHECK (auth.uid() = affiliate_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_affiliate_pages_updated_at
BEFORE UPDATE ON public.affiliate_pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate unique username suggestions
CREATE OR REPLACE FUNCTION public.generate_affiliate_username(base_name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  clean_name TEXT;
  final_username TEXT;
  counter INTEGER := 0;
BEGIN
  -- Clean the base name to create a username
  clean_name := lower(trim(regexp_replace(base_name, '[^a-zA-Z0-9]', '', 'g')));
  clean_name := substring(clean_name from 1 for 20);
  
  -- If clean_name is empty, use 'user'
  IF clean_name = '' THEN
    clean_name := 'user';
  END IF;
  
  final_username := clean_name;
  
  -- Check for uniqueness and add counter if needed
  WHILE EXISTS (SELECT 1 FROM public.affiliate_pages WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := clean_name || counter::text;
  END LOOP;
  
  RETURN final_username;
END;
$$;