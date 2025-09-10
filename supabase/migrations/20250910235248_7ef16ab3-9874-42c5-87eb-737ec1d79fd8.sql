-- Corriger la fonction update_product_stock qui n'a pas de search_path défini
CREATE OR REPLACE FUNCTION public.update_product_stock()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.products 
  SET stock_quantity = stock_quantity + 
    CASE 
      WHEN NEW.movement_type = 'in' THEN NEW.quantity
      WHEN NEW.movement_type = 'out' THEN -NEW.quantity
      WHEN NEW.movement_type = 'adjustment' THEN NEW.quantity - COALESCE(OLD.quantity, 0)
      ELSE 0
    END
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$;