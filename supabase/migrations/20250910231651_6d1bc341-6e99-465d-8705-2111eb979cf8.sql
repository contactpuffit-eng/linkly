-- Améliorer la table orders pour l'e-commerce algérien
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_address TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS wilaya TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS commune TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'cash_on_delivery';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS notes TEXT;

-- Créer une table pour les wilayas d'Algérie
CREATE TABLE IF NOT EXISTS public.wilayas (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  shipping_cost NUMERIC DEFAULT 500
);

-- Insertion des wilayas d'Algérie avec coûts de livraison
INSERT INTO public.wilayas (code, name, shipping_cost) VALUES
('01', 'Adrar', 800),
('02', 'Chlef', 600),
('03', 'Laghouat', 700),
('04', 'Oum El Bouaghi', 650),
('05', 'Batna', 650),
('06', 'Béjaïa', 600),
('07', 'Biskra', 700),
('08', 'Béchar', 900),
('09', 'Blida', 400),
('10', 'Bouira', 500),
('11', 'Tamanrasset', 1200),
('12', 'Tébessa', 750),
('13', 'Tlemcen', 700),
('14', 'Tiaret', 650),
('15', 'Tizi Ouzou', 500),
('16', 'Alger', 300),
('17', 'Djelfa', 700),
('18', 'Jijel', 650),
('19', 'Sétif', 600),
('20', 'Saïda', 700),
('21', 'Skikda', 650),
('22', 'Sidi Bel Abbès', 700),
('23', 'Annaba', 700),
('24', 'Guelma', 700),
('25', 'Constantine', 650),
('26', 'Médéa', 500),
('27', 'Mostaganem', 650),
('28', 'MSila', 700),
('29', 'Mascara', 700),
('30', 'Ouargla', 800),
('31', 'Oran', 600),
('32', 'El Bayadh', 750),
('33', 'Illizi', 1000),
('34', 'Bordj Bou Arréridj', 600),
('35', 'Boumerdès', 400),
('36', 'El Tarf', 750),
('37', 'Tindouf', 1100),
('38', 'Tissemsilt', 650),
('39', 'El Oued', 800),
('40', 'Khenchela', 700),
('41', 'Souk Ahras', 750),
('42', 'Tipaza', 400),
('43', 'Mila', 650),
('44', 'Aïn Defla', 550),
('45', 'Naâma', 800),
('46', 'Aïn Témouchent', 650),
('47', 'Ghardaïa', 750),
('48', 'Relizane', 650),
('49', 'Timimoun', 900),
('50', 'Bordj Badji Mokhtar', 1200),
('51', 'Ouled Djellal', 750),
('52', 'Béni Abbès', 950),
('53', 'In Salah', 1000),
('54', 'In Guezzam', 1300),
('55', 'Touggourt', 800),
('56', 'Djanet', 1200),
('57', 'El MGhair', 850),
('58', 'El Meniaa', 800)
ON CONFLICT (code) DO NOTHING;

-- Enable RLS on wilayas table
ALTER TABLE public.wilayas ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read wilayas
CREATE POLICY "Everyone can read wilayas" ON public.wilayas FOR SELECT USING (true);