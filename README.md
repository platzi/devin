# Análisis de la idea

ShipLog es, en esencia, un registro (bitácora) de desarrollo: dos entidades centrales, **proyectos** y **entradas de avance** (los "ships" o logs) que pertenecen a un proyecto. Con Next.js + TypeScript + Tailwind, encaja con el stack ya usado en otros repos (nevetico, kufiapp, minifan usan Next.js + Supabase).

Antes de proponer el MVP y las tareas, se necesita aclarar varias cosas, agrupadas para responder rápido.

# Preguntas

**1. Autenticación y usuarios**
- ¿ShipLog es multiusuario (cada developer tiene su cuenta y ve solo sus proyectos) o es una herramienta personal solo para el usuario al inicio?
- Si lleva login, ¿prefieres magic link (como nevetico) o email + contraseña (como minifan/kufiapp)?

**2. Persistencia de datos**
- ¿Quieres usar Supabase como en los otros proyectos, u otra opción (SQLite/Postgres propio, o algo en memoria/local para el primer MVP)?

**3. Registro de avances: manual vs. automático**
- ¿Quieres que las entradas sean 100% manuales (el dev escribe qué construyó) o ya incluir la integración con GitHub desde el inicio?
- Recomendación: empezar manual y dejar GitHub para una fase posterior.

**4. Modelo de datos mínimo**
- Para un proyecto, ¿qué campos quieres? (ej: nombre, descripción, estado, link al repo, tech stack).
- Para una entrada de avance, ¿qué campos? (ej: fecha, título, descripción, tipo como feature/bugfix/refactor, tags).

**5. ¿Semanal o libre?**
- ¿Quieres que las entradas se agrupen/estructuren por semana, o que sean entradas libres con fecha y luego se visualicen por semana?

**6. Vistas / UI mínima**
- ¿Qué pantallas son imprescindibles para el MVP? (ej: lista de proyectos, detalle de un proyecto con su timeline de avances, formulario para crear proyecto/avance).
- ¿Necesitas una vista de resumen (dashboard) desde el día uno, o basta con lista + detalle?

**7. Alcance explícito del primer MVP**
- ¿Estarías de acuerdo con que el primer MVP sea solo CRUD de proyectos + CRUD de avances, sin auth compleja, sin GitHub y sin emails?
