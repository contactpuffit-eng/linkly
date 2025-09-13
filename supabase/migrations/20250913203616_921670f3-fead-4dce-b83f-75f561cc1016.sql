-- Create public bucket for landing page media if it doesn't exist
insert into storage.buckets (id, name, public)
values ('landing-page-media', 'landing-page-media', true)
on conflict (id) do nothing;

-- Allow public read access to files in this bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
      AND tablename = 'objects' 
      AND policyname = 'Public can read landing media'
  ) THEN
    CREATE POLICY "Public can read landing media"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'landing-page-media');
  END IF;
END
$$;

-- Allow uploads to this bucket (no auth requirement) - scoped only to this bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
      AND tablename = 'objects' 
      AND policyname = 'Anyone can upload landing media'
  ) THEN
    CREATE POLICY "Anyone can upload landing media"
    ON storage.objects
    FOR INSERT
    TO public
    WITH CHECK (bucket_id = 'landing-page-media');
  END IF;
END
$$;