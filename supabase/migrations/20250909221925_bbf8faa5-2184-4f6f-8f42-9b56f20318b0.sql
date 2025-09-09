-- Create a test vendor profile for product testing
INSERT INTO public.profiles (user_id, name, email, role) 
VALUES (
  '00000000-0000-0000-0000-000000000000', 
  'Test Vendor', 
  'test@vendor.com', 
  'vendor'
) ON CONFLICT (user_id) DO NOTHING;