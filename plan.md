# ShipLog — Plan

ShipLog es una bitácora de desarrollo: registras qué construiste en cada proyecto y obtienes un resumen semanal claro y compartible. Dos entidades centrales: **proyectos** y **entradas** ("ships").

Este documento toma decisiones por defecto para poder arrancar. Cualquier punto se puede corregir antes de empezar la Fase 1.

## Decisiones

| Tema | Decisión | Por qué |
|---|---|---|
| Usuarios | Multiusuario desde el inicio; cada usuario ve solo sus proyectos | Evita migrar después; RLS lo hace barato |
| Auth | Supabase Auth con magic link | Mismo patrón que nevetico, sin gestionar contraseñas |
| Persistencia | Supabase (Postgres + RLS) | Stack ya usado en nevetico/kufiapp/minifan |
| Entradas | Libres, con fecha; se agrupan por semana solo en la vista | Registrar debe ser rápido; la estructura semanal la aporta la UI |
| Origen de entradas | 100% manual en Fase 1 | GitHub se integra cuando el flujo manual esté probado |
| Emails | Ninguno en Fase 1 (solo el magic link de Supabase) | Fuera del núcleo |
| Diferenciador | Resumen semanal público y compartible por proyecto | Lo que convierte una nota en un "ship log" |

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Supabase: Auth, Postgres, RLS
- Deploy en Vercel

## Modelo de datos

```sql
projects
  id            uuid pk default gen_random_uuid()
  user_id       uuid not null references auth.users
  name          text not null
  slug          text not null            -- único por usuario
  description   text
  repo_url      text
  status        text not null default 'active'   -- active | paused | done
  is_public     boolean not null default false   -- habilita /p/[slug]
  created_at    timestamptz default now()
  unique (user_id, slug)

entries
  id            uuid pk default gen_random_uuid()
  project_id    uuid not null references projects on delete cascade
  user_id       uuid not null references auth.users
  title         text not null
  body          text                     -- markdown
  kind          text not null default 'feature'  -- feature | bugfix | refactor | other
  tags          text[] not null default '{}'
  shipped_at    date not null default current_date
  created_at    timestamptz default now()
  index (project_id, shipped_at desc)
```

RLS: `user_id = auth.uid()` para todo en ambas tablas. Lectura anónima de `projects` y `entries` solo cuando `projects.is_public = true`.

## Pantallas

| Ruta | Contenido |
|---|---|
| `/login` | Formulario de magic link |
| `/` | Lista de proyectos del usuario + botón crear |
| `/projects/new` | Formulario: nombre, descripción, repo_url, estado |
| `/projects/[slug]` | Detalle: cabecera del proyecto + timeline agrupada por semana + formulario rápido de entrada (título, tipo, fecha, body) |
| `/projects/[slug]/edit` | Editar / archivar / hacer público |
| `/p/[slug]` | Vista pública del proyecto (solo si `is_public`) |
| `/p/[slug]/week/[yyyy-ww]` | Resumen semanal público compartible |

## Fases

**Fase 1 — Núcleo (este es el MVP)**
- Scaffold Next.js + Supabase, migración SQL y RLS
- Auth con magic link, middleware de sesión
- CRUD de proyectos
- CRUD de entradas con formulario rápido en el detalle
- Timeline agrupada por semana (ISO)

**Fase 2 — Resumen compartible**
- Páginas públicas `/p/[slug]` y `/p/[slug]/week/[yyyy-ww]`
- Toggle `is_public` y copiar enlace
- Metadatos OG para compartir en redes

**Fase 3 — Automatización**
- Conectar repo de GitHub: sugerir entradas a partir de commits/PRs mergeados
- Recordatorio semanal por email (Resend) si no hubo entradas

## Fuera de alcance (por ahora)

- Equipos / proyectos compartidos entre usuarios
- Integraciones distintas a GitHub
- App móvil
