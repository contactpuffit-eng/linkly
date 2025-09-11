-- Créer un utilisateur de test pour les affiliés (seulement pour les tests)
-- D'abord, créer un profil de test dans la table profiles
INSERT INTO public.profiles (user_id, name, email, role) 
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Affilié Test',
  'affiliate.test@example.com',
  'affiliate'
) ON CONFLICT (user_id) DO NOTHING;

-- Créer un wallet pour cet utilisateur de test
INSERT INTO public.wallets (user_id, validated_balance, pending_balance, total_earned) 
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  0,
  0,
  0
) ON CONFLICT (user_id) DO NOTHING;