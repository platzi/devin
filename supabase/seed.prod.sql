-- Seed de PRODUCCIÓN. No se ejecuta en local: config.toml usa
-- [db.seed] sql_paths = ["./seed.sql"], que no incluye este archivo.
--
-- Requisito: el usuario dueño ya debe existir en auth.users, creado por el
-- flujo normal de Auth (magic link o Admin API). Este script NO inserta en
-- auth.users; solo resuelve el id por email.
--
-- Es idempotente: se puede correr varias veces sin duplicar.

do $$
declare
  v_email   text := 'erasmoh@gmail.com';
  v_user_id uuid;
  v_project uuid;
begin
  select id into v_user_id from auth.users where email = v_email;

  if v_user_id is null then
    raise exception 'No existe un usuario con email %. Créalo primero vía magic link o Admin API.', v_email;
  end if;

  insert into public.projects (user_id, name, slug, description, repo_url, status, is_public)
  values (
    v_user_id,
    'ShipLog',
    'shiplog',
    'Bitácora de desarrollo: registra lo que envías a producción y su costo en tokens.',
    'https://github.com/erasmoh/shiplog',
    'active',
    false
  )
  on conflict (user_id, slug) do nothing;

  select id into v_project
  from public.projects
  where user_id = v_user_id and slug = 'shiplog';

  insert into public.entries (project_id, user_id, title, body, kind, tags, shipped_at, tokens, cost_usd)
  select v_project, v_user_id, d.title, d.body, d.kind, d.tags, d.shipped_at, d.tokens, d.cost_usd
  from (values
    ('Análisis inicial y preguntas de clarificación',
     'Exploración del alcance de ShipLog y dudas abiertas antes de decidir el modelo.',
     'other', '{plan}'::text[], date '2026-09-01', 14200, 0.4100),

    ('Plan del producto: modelo de datos, pantallas y fases',
     'Decisiones por defecto, esquema de projects/entries y división en fases.',
     'other', '{plan,docs}'::text[], date '2026-09-01', 26800, 0.7900),

    ('Scaffold Next.js + Supabase con auth magic link',
     'Proyecto base, cliente de Supabase y login sin contraseña por correo.',
     'feature', '{infra,auth}'::text[], date '2026-09-01', 61500, 1.8400),

    ('CRUD de proyectos y entradas con timeline semanal',
     'Alta, edición y borrado, más la vista agrupada por semana ISO.',
     'feature', '{ui,crud}'::text[], date '2026-09-01', 88300, 2.6500),

    ('Añade .env.example',
     'Plantilla de variables de entorno para levantar el proyecto.',
     'other', '{infra,docs}'::text[], date '2026-09-01', 3100, 0.0900),

    ('Arregla el redirect del magic link en local',
     'Glob en additional_redirect_urls para aceptar cualquier ruta local.',
     'bugfix', '{auth}'::text[], date '2026-09-01', 9700, 0.2800),

    ('Redirects del magic link hacia la app móvil',
     'Soporte para el esquema shiplog:// y para Expo Go.',
     'feature', '{auth,mobile}'::text[], date '2026-09-02', 17400, 0.5200),

    ('Costo por entrada: columnas tokens y cost_usd',
     'Migración 0002 para registrar consumo de tokens y gasto en USD.',
     'feature', '{db,costos}'::text[], date '2026-09-02', 12600, 0.3700),

    ('Rediseño de la interfaz con shadcn/ui',
     'Componentes base, estilos unificados y footer.',
     'refactor', '{ui}'::text[], date '2026-09-02', 74900, 2.2300),

    ('Proyecto de Supabase en producción con el esquema aplicado',
     'Alta del proyecto en la nube y ejecución de las migraciones core y entry_cost.',
     'feature', '{infra,db}'::text[], date '2026-09-03', 21500, 0.6400)
  ) as d(title, body, kind, tags, shipped_at, tokens, cost_usd)
  where not exists (
    select 1 from public.entries e
    where e.project_id = v_project and e.title = d.title
  );
end $$;
