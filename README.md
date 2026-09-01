# ShipLog

Bitácora de desarrollo: registra qué construiste en cada proyecto y míralo agrupado por semana. Ver `plan.md`.

## Desarrollo local

Requiere Node 22 y Docker (para Supabase local).

```bash
npm install
npm run supabase:start     # imprime API URL y publishable key
cp .env.example .env.local # pega la publishable key
npm run dev                # http://localhost:3000
```

Login por magic link: escribe un correo en `/login` y abre el enlace en Mailpit (http://127.0.0.1:54324). El seed crea `demo@shiplog.local` con un proyecto de ejemplo.

Otros comandos: `npm run supabase:reset` (recrea DB + seed), `npm run db:types` (regenera `src/lib/database.types.ts`), `npm run lint`, `npm run typecheck`, `npm run build`.
