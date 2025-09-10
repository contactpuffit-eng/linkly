-- Améliorer la table products pour la gestion complète
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS min_stock_alert INTEGER DEFAULT 5;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS weight NUMERIC DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS dimensions TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS shipping_class TEXT DEFAULT 'standard';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku TEXT UNIQUE;

-- Créer une table pour les paramètres de livraison par vendeur
CREATE TABLE IF NOT EXISTS public.vendor_shipping_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  base_shipping_cost NUMERIC DEFAULT 500,
  free_shipping_threshold NUMERIC DEFAULT 5000,
  processing_days INTEGER DEFAULT 2,
  express_shipping_cost NUMERIC DEFAULT 800,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on vendor_shipping_settings
ALTER TABLE public.vendor_shipping_settings ENABLE ROW LEVEL SECURITY;

-- Politique pour les paramètres de livraison
CREATE POLICY "Vendors can manage their shipping settings" ON public.vendor_shipping_settings
  FOR ALL USING (auth.uid() = vendor_id);

-- Créer une table pour le suivi des stocks
CREATE TABLE IF NOT EXISTS public.stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id),
  movement_type TEXT NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment')),
  quantity INTEGER NOT NULL,
  reason TEXT,
  order_id UUID REFERENCES public.orders(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID
);

-- Enable RLS on stock_movements
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

-- Politique pour les mouvements de stock
CREATE POLICY "Vendors can view their stock movements" ON public.stock_movements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.products 
      WHERE products.id = stock_movements.product_id 
      AND (products.vendor_id = auth.uid() OR products.vendor_id IS NULL)
    )
  );

CREATE POLICY "System can manage stock movements" ON public.stock_movements
  FOR ALL USING (true);

-- Trigger pour mettre à jour le stock automatiquement
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_product_stock
  AFTER INSERT OR UPDATE ON public.stock_movements
  FOR EACH ROW
  EXECUTE FUNCTION update_product_stock();