-- Usuario demo (entra por magic link en /login → Mailpit http://127.0.0.1:54324)
insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change, email_change_token_current
) values (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'demo@shiplog.local', '',
  now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(),
  '', '', '', '', ''
);

insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values (
  gen_random_uuid(), '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001',
  '{"sub":"00000000-0000-0000-0000-000000000001","email":"demo@shiplog.local"}',
  'email', now(), now(), now()
);

insert into public.projects (id, user_id, name, slug, description, repo_url, status)
values (
  '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001',
  'ShipLog', 'shiplog', 'Bitácora de desarrollo con resumen semanal.',
  'https://github.com/erasmoh/shiplog', 'active'
);

insert into public.entries (project_id, user_id, title, body, kind, tags, shipped_at) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001',
   'Plan del producto', 'Decisiones, modelo de datos y fases.', 'other', '{plan}', current_date - 8),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001',
   'Scaffold Next.js + Supabase', 'Auth con magic link y RLS.', 'feature', '{infra,auth}', current_date - 1),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001',
   'CRUD de proyectos y entradas', 'Timeline agrupada por semana ISO.', 'feature', '{ui}', current_date);
