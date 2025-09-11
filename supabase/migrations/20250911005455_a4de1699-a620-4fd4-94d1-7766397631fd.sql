-- Créer l'utilisateur démo directement dans auth.users pour les tests
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
) VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'demo@example.com',
    '$2a$10$dummy.hash.for.demo.user.only',
    now(),
    now(),
    now(),
    '',
    '',
    '',
    ''
) ON CONFLICT (id) DO NOTHING;

-- Créer le profil pour cet utilisateur de test
INSERT INTO public.profiles (user_id, name, email, role) 
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Utilisateur Démo',
  'demo@example.com',
  'affiliate'
) ON CONFLICT (user_id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  role = EXCLUDED.role;

-- Créer le wallet pour cet utilisateur de test
INSERT INTO public.wallets (user_id, validated_balance, pending_balance, total_earned) 
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  0,
  0,
  0
) ON CONFLICT (user_id) DO UPDATE SET
  validated_balance = EXCLUDED.validated_balance,
  pending_balance = EXCLUDED.pending_balance,
  total_earned = EXCLUDED.total_earned;