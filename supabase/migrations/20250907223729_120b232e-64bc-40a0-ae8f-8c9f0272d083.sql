-- Fix search path security warnings for all functions
CREATE OR REPLACE FUNCTION public.generate_affiliate_code(affiliate_uuid UUID, product_uuid UUID) 
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result TEXT;
BEGIN
  result := 'AFF_' || UPPER(SUBSTRING(affiliate_uuid::text, 1, 8)) || '_' || UPPER(SUBSTRING(product_uuid::text, 1, 8));
  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_promo_code(affiliate_uuid UUID, product_uuid UUID) 
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result TEXT;
BEGIN
  result := 'PROMO_' || UPPER(SUBSTRING(affiliate_uuid::text, 1, 6)) || '_' || UPPER(SUBSTRING(product_uuid::text, 1, 6));
  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION public.approve_affiliate_request(request_id UUID) 
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.update_order_status(order_id UUID, new_status order_status) 
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.scan_qr_code(qr_code_param TEXT, sale_amount NUMERIC) 
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.wallets (user_id)
  VALUES (NEW.user_id);
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;