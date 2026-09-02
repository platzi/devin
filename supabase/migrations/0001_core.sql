create extension if not exists "pgcrypto";

-- Proyectos -------------------------------------------------------------------
create table public.projects (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 80),
  slug        text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text,
  repo_url    text,
  status      text not null default 'active' check (status in ('active', 'paused', 'done')),
  is_public   boolean not null default false,
  created_at  timestamptz not null default now(),
  unique (user_id, slug)
);

-- Entradas ("ships") ----------------------------------------------------------
create table public.entries (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects (id) on delete cascade,
  user_id     uuid not null references auth.users (id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 140),
  body        text,
  kind        text not null default 'feature' check (kind in ('feature', 'bugfix', 'refactor', 'other')),
  tags        text[] not null default '{}',
  shipped_at  date not null default current_date,
  created_at  timestamptz not null default now()
);

create index entries_project_shipped_idx on public.entries (project_id, shipped_at desc);
create index projects_user_idx on public.projects (user_id);

-- RLS -------------------------------------------------------------------------
alter table public.projects enable row level security;
alter table public.entries  enable row level security;

create policy "projects: owner full access" on public.projects
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "projects: public read" on public.projects
  for select to anon, authenticated
  using (is_public);

create policy "entries: owner full access" on public.entries
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.projects p
      where p.id = project_id and p.user_id = (select auth.uid())
    )
  );

create policy "entries: public read" on public.entries
  for select to anon, authenticated
  using (exists (
    select 1 from public.projects p
    where p.id = project_id and p.is_public
  ));

-- Grants (Supabase no expone tablas nuevas automáticamente) -------------------
grant usage on schema public to anon, authenticated;
grant select on public.projects, public.entries to anon;
grant select, insert, update, delete on public.projects, public.entries to authenticated;
