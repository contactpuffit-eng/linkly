-- Create ENUMs first
CREATE TYPE user_role AS ENUM ('admin', 'vendor', 'affiliate');
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'rejected', 'returned');
CREATE TYPE product_category AS ENUM ('electronics', 'fashion', 'food', 'health', 'home', 'sports', 'other');

-- Table utilisateurs avec rôles
CREATE TABLE public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role user_role DEFAULT 'affiliate',
  username TEXT UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  theme_color TEXT DEFAULT '#3B82F6',
  landing_page_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Table produits
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  commission_pct DECIMAL(5,2) NOT NULL,
  media_url TEXT,
  website_url TEXT,
  category product_category DEFAULT 'other',
  is_active BOOLEAN DEFAULT true,
  restaurant_address TEXT,
  restaurant_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products policies
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Vendors can manage their own products" ON public.products FOR ALL USING (auth.uid() = vendor_id);

-- Table liens d'affiliation
CREATE TABLE public.affiliate_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  affiliate_code TEXT UNIQUE NOT NULL,
  promo_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(affiliate_id, product_id)
);

-- Enable RLS on affiliate_products
ALTER TABLE public.affiliate_products ENABLE ROW LEVEL SECURITY;

-- Affiliate products policies
CREATE POLICY "Users can view their own affiliate products" ON public.affiliate_products FOR SELECT USING (auth.uid() = affiliate_id);
CREATE POLICY "System can manage affiliate products" ON public.affiliate_products FOR ALL USING (true);

-- Table demandes d'affiliation
CREATE TABLE public.affiliate_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  status request_status DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(affiliate_id, product_id)
);

-- Enable RLS on affiliate_requests
ALTER TABLE public.affiliate_requests ENABLE ROW LEVEL SECURITY;

-- Affiliate requests policies
CREATE POLICY "Affiliates can view their own requests" ON public.affiliate_requests FOR SELECT USING (auth.uid() = affiliate_id);
CREATE POLICY "Affiliates can create requests" ON public.affiliate_requests FOR INSERT WITH CHECK (auth.uid() = affiliate_id);
CREATE POLICY "Vendors can view requests for their products" ON public.affiliate_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.products WHERE id = product_id AND vendor_id = auth.uid())
);
CREATE POLICY "Vendors can update requests for their products" ON public.affiliate_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.products WHERE id = product_id AND vendor_id = auth.uid())
);

-- Table statistiques de liens
CREATE TABLE public.affiliate_link_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  affiliate_code TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'view', 'click'
  user_ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on affiliate_link_stats
ALTER TABLE public.affiliate_link_stats ENABLE ROW LEVEL SECURITY;

-- Affiliate link stats policies
CREATE POLICY "Users can view their own stats" ON public.affiliate_link_stats FOR SELECT USING (auth.uid() = affiliate_id);
CREATE POLICY "System can insert stats" ON public.affiliate_link_stats FOR INSERT WITH CHECK (true);

-- Table commandes
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  affiliate_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  affiliate_code TEXT,
  amount DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2),
  customer_email TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  status order_status DEFAULT 'pending',
  is_returned BOOLEAN DEFAULT false,
  return_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Orders policies
CREATE POLICY "Vendors can view orders for their products" ON public.orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.products WHERE id = product_id AND vendor_id = auth.uid())
);
CREATE POLICY "Affiliates can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = affiliate_id);
CREATE POLICY "System can manage orders" ON public.orders FOR ALL USING (true);

-- Table portefeuilles
CREATE TABLE public.wallets (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  pending_balance DECIMAL(10,2) DEFAULT 0,
  validated_balance DECIMAL(10,2) DEFAULT 0,
  total_earned DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on wallets
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

-- Wallets policies
CREATE POLICY "Users can view their own wallet" ON public.wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own wallet" ON public.wallets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can manage wallets" ON public.wallets FOR ALL USING (true);

-- Table QR codes restaurant
CREATE TABLE public.restaurant_qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  qr_code TEXT UNIQUE NOT NULL,
  scans_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on restaurant_qr_codes
ALTER TABLE public.restaurant_qr_codes ENABLE ROW LEVEL SECURITY;

-- QR codes policies
CREATE POLICY "Users can view their own QR codes" ON public.restaurant_qr_codes FOR SELECT USING (auth.uid() = affiliate_id);
CREATE POLICY "System can manage QR codes" ON public.restaurant_qr_codes FOR ALL USING (true);

-- Fonction génération codes d'affiliation
CREATE OR REPLACE FUNCTION public.generate_affiliate_code(affiliate_uuid UUID, product_uuid UUID) 
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  result TEXT;
BEGIN
  result := 'AFF_' || UPPER(SUBSTRING(affiliate_uuid::text, 1, 8)) || '_' || UPPER(SUBSTRING(product_uuid::text, 1, 8));
  RETURN result;
END;
$$;

-- Fonction génération codes promo
CREATE OR REPLACE FUNCTION public.generate_promo_code(affiliate_uuid UUID, product_uuid UUID) 
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  result TEXT;
BEGIN
  result := 'PROMO_' || UPPER(SUBSTRING(affiliate_uuid::text, 1, 6)) || '_' || UPPER(SUBSTRING(product_uuid::text, 1, 6));
  RETURN result;
END;
$$;

-- Fonction approbation demandes
CREATE OR REPLACE FUNCTION public.approve_affiliate_request(request_id UUID) 
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  req_record RECORD;
  affiliate_code TEXT;
  promo_code TEXT;
  result JSON;
BEGIN
  -- Get request details
  SELECT * INTO req_record FROM public.affiliate_requests WHERE id = request_id;
  
  IF req_record IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Request not found');
  END IF;
  
  -- Generate codes
  affiliate_code := public.generate_affiliate_code(req_record.affiliate_id, req_record.product_id);
  promo_code := public.generate_promo_code(req_record.affiliate_id, req_record.product_id);
  
  -- Update request status
  UPDATE public.affiliate_requests 
  SET status = 'approved', updated_at = NOW() 
  WHERE id = request_id;
  
  -- Create affiliate product link
  INSERT INTO public.affiliate_products (affiliate_id, product_id, affiliate_code, promo_code)
  VALUES (req_record.affiliate_id, req_record.product_id, affiliate_code, promo_code);
  
  -- Create wallet if doesn't exist
  INSERT INTO public.wallets (user_id) 
  VALUES (req_record.affiliate_id) 
  ON CONFLICT (user_id) DO NOTHING;
  
  result := json_build_object(
    'success', true, 
    'affiliate_code', affiliate_code,
    'promo_code', promo_code
  );
  
  RETURN result;
END;
$$;

-- Fonction mise à jour statut commande
CREATE OR REPLACE FUNCTION public.update_order_status(order_id UUID, new_status order_status) 
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  order_record RECORD;
  result JSON;
BEGIN
  -- Get order details
  SELECT * INTO order_record FROM public.orders WHERE id = order_id;
  
  IF order_record IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Order not found');
  END IF;
  
  -- Update order status
  UPDATE public.orders 
  SET status = new_status, updated_at = NOW() 
  WHERE id = order_id;
  
  -- If order is delivered, validate commission
  IF new_status = 'delivered' AND order_record.affiliate_id IS NOT NULL THEN
    UPDATE public.wallets 
    SET validated_balance = validated_balance + COALESCE(order_record.commission_amount, 0),
        total_earned = total_earned + COALESCE(order_record.commission_amount, 0)
    WHERE user_id = order_record.affiliate_id;
  END IF;
  
  -- If order is returned, remove commission
  IF new_status = 'returned' AND order_record.affiliate_id IS NOT NULL THEN
    UPDATE public.wallets 
    SET validated_balance = validated_balance - COALESCE(order_record.commission_amount, 0)
    WHERE user_id = order_record.affiliate_id;
    
    UPDATE public.orders 
    SET is_returned = true 
    WHERE id = order_id;
  END IF;
  
  result := json_build_object('success', true, 'new_status', new_status);
  RETURN result;
END;
$$;

-- Fonction scanner QR restaurant
CREATE OR REPLACE FUNCTION public.scan_qr_code(qr_code_param TEXT, sale_amount NUMERIC) 
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  qr_record RECORD;
  commission_amount NUMERIC;
  product_record RECORD;
  result JSON;
BEGIN
  -- Get QR code details
  SELECT * INTO qr_record FROM public.restaurant_qr_codes WHERE qr_code = qr_code_param;
  
  IF qr_record IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'QR code not found');
  END IF;
  
  -- Get product details
  SELECT * INTO product_record FROM public.products WHERE id = qr_record.product_id;
  
  -- Calculate commission
  commission_amount := sale_amount * (product_record.commission_pct / 100);
  
  -- Update scan count
  UPDATE public.restaurant_qr_codes 
  SET scans_count = scans_count + 1, updated_at = NOW() 
  WHERE id = qr_record.id;
  
  -- Create order
  INSERT INTO public.orders (
    product_id, 
    affiliate_id, 
    affiliate_code, 
    amount, 
    commission_amount, 
    status
  ) VALUES (
    qr_record.product_id,
    qr_record.affiliate_id,
    qr_code_param,
    sale_amount,
    commission_amount,
    'delivered'
  );
  
  -- Update wallet
  UPDATE public.wallets 
  SET validated_balance = validated_balance + commission_amount,
      total_earned = total_earned + commission_amount
  WHERE user_id = qr_record.affiliate_id;
  
  result := json_build_object(
    'success', true, 
    'commission_amount', commission_amount,
    'scan_count', qr_record.scans_count + 1
  );
  
  RETURN result;
END;
$$;

-- Trigger pour créer wallet automatiquement
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.wallets (user_id)
  VALUES (NEW.user_id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_affiliate_requests_updated_at BEFORE UPDATE ON public.affiliate_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON public.wallets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_restaurant_qr_codes_updated_at BEFORE UPDATE ON public.restaurant_qr_codes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();