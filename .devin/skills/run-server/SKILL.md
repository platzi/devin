---
name: run-server
description: Levanta el servidor de desarrollo preguntando siempre si conectar a Supabase local o producción
triggers:
  - user
  - model
allowed-tools:
  - read
  - grep
  - glob
  - exec
permissions:
  allow:
    - Exec(npm run dev)
    - Exec(npm run dev:prod)
    - Exec(lsof)
---

Levanta el servidor de desarrollo de ShipLog.

**Regla obligatoria: nunca elijas el entorno por tu cuenta.** Aunque el usuario
haya elegido uno antes en esta misma sesión, o aunque el contexto sugiera cuál
quiere, siempre pregunta primero.

## Pasos

1. Pregunta con la herramienta `ask_user_question` (una sola pregunta, header
   `Entorno`) contra qué backend debe correr:

   - **Local** — `npm run dev`, carga `.env.local`, apunta a
     `http://127.0.0.1:54321`. Requiere `npm run supabase:start` levantado.
   - **Producción** — `npm run dev:prod`, carga `.env.prod`, apunta al proyecto
     `shiplog` (`vqgfncthlboknponemqs`). Los datos que escribas son reales.

2. Si eligió local, comprueba que el Supabase local esté arriba antes de
   levantar Next. Si no responde, avísalo y ofrece correr `npm run supabase:start`.

3. Arranca el script correspondiente como comando en segundo plano
   (`timeout: 0`) y espera a que imprima el "Ready".

4. Reporta la URL real donde quedó escuchando. El puerto 3000 suele estar
   ocupado, así que Next cae a 3001 u otro: lee el puerto del output, no lo
   asumas.

5. Si eligió producción, recuérdale en una línea que el login por magic link
   todavía depende de que el Site URL y los redirect URLs del proyecto remoto
   incluyan el puerto en uso.

## Contexto del proyecto

- Los perfiles se seleccionan con `dotenv-cli` desde `package.json`; no hay
  scripts de shell intermedios.
- `next dev` autocarga `.env.local` siempre, pero `process.env` (lo que inyecta
  `dotenv -e`) tiene prioridad, así que `dev:prod` sí apunta a producción.
- Para builds aplica lo mismo: `npm run build` (local) y `npm run build:prod`.
  Las variables `NEXT_PUBLIC_*` se inlinean en tiempo de build.
