-- Supprimer tous les produits sauf le dernier (le plus récent)
DELETE FROM public.products 
WHERE id != '90afe40e-3d8e-44bd-ac9b-3e4abfe3b8e0';

-- Supprimer aussi les landing pages correspondantes
DELETE FROM public.landing_pages 
WHERE product_id != '90afe40e-3d8e-44bd-ac9b-3e4abfe3b8e0';