# ShipLog — Plan de diseño

Dirección visual para ShipLog. Complementa a `plan.md`, que cubre producto y
modelo de datos; este documento solo decide cómo se ve y por qué.

Estado: aprobado como plan, **sin implementar**. La sección "Ejecución" al final
lista los pasos concretos.

## Sujeto, audiencia, trabajo

- **Sujeto:** la bitácora de a bordo de un maker: qué enviaste, qué día, de qué
  tipo, y cuánto costó en tokens y dólares.
- **Audiencia:** devs indie que trabajan asistidos por IA y quieren ver el gasto
  acumulado contra el avance real.
- **Trabajo principal:** anotar un envío en segundos y poder leer la columna de
  costo como se lee un estado de cuenta.

La materia prima es registro tabulado con lecturas numéricas: `entries` guarda
`tokens` y `cost_usd`, y el proyecto ya suma un "Total invertido". De ahí sale
todo lo demás. No es un CRUD de notas, es un libro de cuentas de lo que costó
enviar.

## Color

Referencia material: las hojas de copia al carbón de los formularios de
registro — papel azul pálido, reglas impresas, y el rojo contable para lo que
sale de la caja.

| Nombre   | Hex       | Rol                                          |
|----------|-----------|----------------------------------------------|
| `sheet`  | `#EDF0F2` | papel, azul-gris pálido                      |
| `ink`    | `#16202B` | texto, azul-tinta (cromático a propósito)    |
| `rule`   | `#C3CDD4` | reglas impresas del formulario, separadores  |
| `carbon` | `#F0E7C8` | franja de la columna de costo                |
| `debit`  | `#9E2B36` | único color fuerte: cifras de costo          |

`debit` es rojo contable porque el costo es dinero que sale: el color codifica el
signo, no decora. El `ink` es deliberadamente azulado; un `#111` tintado es el
tell habitual de página generada.

**Cambio a los badges de tipo.** Hoy `feature/bugfix/refactor/other` usan cuatro
pastillas pastel (emerald/rose/sky/zinc) definidas en `KIND_BADGE_CLASS`
(`src/components/timeline.tsx`) y `KIND_CLASS` (`src/lib/constants.ts`). Compiten
con la columna de costo. El tipo pasa a ser una abreviatura en su propia
columna (`FEA` `FIX` `REF` `—`) en tinta, sin fondo. Cuatro colores menos ⇒ el
rojo vuelve a significar algo.

## Tipografía

**Una sola familia: Archivo** (variable, ejes de peso y ancho). Es una grotesca
diseñada para documentos y formularios, y el ancho variable da un masthead con
carácter sin traer una segunda familia. Sustituye a Geist, que es el default del
scaffold.

- Masthead / nombre de proyecto: ~600, ancho expandido, tracking negativo.
- Cuerpo y UI: 400.
- Cifras: misma familia con `font-variant-numeric: tabular-nums`. **Verificar el
  soporte de `tnum` al instalarla**; si falla, la alternativa es IBM Plex Sans,
  que sí lo trae.

No hay familia mono. Un mono para etiquetas pequeñas de datos es un tell; lo que
las columnas necesitan de verdad son cifras tabulares, que es otra cosa.

Escala (Bringhurst, razón 1.5 truncada a enteros): `12 / 14 / 16 / 21 / 32`.
Cuerpo 16/1.45. Ancho de línea máximo 68 caracteres en descripciones y en el
`body` de las entradas.

Sin versalitas en etiquetas, sin eyebrows, sin acentuar una sola palabra del
titular.

## Layout

La página de proyecto **es la hoja de registro**. Texto alineado a la izquierda;
todas las cifras alineadas a la derecha sobre un mismo eje vertical. Ese eje,
compartido entre el total del proyecto, los subtotales de semana y el costo de
cada fila, es la idea estructural del diseño.

```
┌───────────────────────────────────────────────────────────────┐
│ Proyectos /  Activo                                           │
│ SHIPLOG                                    2 481 900 tokens   │  ← total en la cabeza
│ bitácora de envíos · github.com/x/shiplog          $ 41.20    │     de la columna
├──────┬─────┬──────────────────────────────────────┬───────────┤
│      │     │  ¿qué enviaste hoy?           [Anotar]│          │  ← el form es la
├──────┴─────┴──────────────────────────────────────┴───────────┤     línea en blanco
│ Semana del 1 sep                     4 envíos    12 400  $2.10│  ← subtotal semanal
│ mié 3  FEA  Auth con magic link                   8 100  $1.40│
│        #auth #supabase                                        │
│ mar 2  FIX  Puerto 3000 ocupado en dev              900  $0.15│
│ lun 1  REF  Extraer groupByWeek                   3 400  $0.55│
├───────────────────────────────────────────────────────────────┤
│ Semana del 25 ago                    2 envíos     5 200  $0.90│
└───────────────────────────────────────────────────────────────┘
```

Tres decisiones que salen del contenido:

1. **El form de entrada es la siguiente línea en blanco de la hoja**, arriba de
   la semana actual, no una tarjeta flotante. Anotar se ve como escribir en el
   libro.
2. **Subtotal por semana.** `groupByWeek` ya existe y ya muestra "N ships";
   darle su suma de tokens y dólares convierte la agrupación en información en
   vez de en un separador.
3. **Sin marcadores numerados** (01/02/03). Es una secuencia cronológica, pero
   la fecha ya la ordena; numerarla sería redundante.

Dashboard: mismo eje, una línea por proyecto, y la única jerarquía visual es el
estado (`Activo` en tinta plena, `En pausa` y `Terminado` desaturados a `rule`).

```
┌───────────────────────────────────────────────────────────────┐
│ Bitácoras                                        [Nuevo]      │
├───────────────────────────────────────────────────────────────┤
│ ShipLog          Activo      último envío mié 3   $41.20      │
│ Portafolio       En pausa     hace 3 semanas       $6.80      │
└───────────────────────────────────────────────────────────────┘
```

## Principios

- **Un solo lugar audaz:** la columna de costo (franja `carbon` + cifras
  `debit`). Todo lo demás es tinta sobre papel y reglas.
- **El radio codifica jerarquía:** `0` en la hoja, filas y reglas; `2px` solo en
  controles interactivos. Hoy `--radius: 0.625rem` se aplica a todo por igual, lo
  que borra la distinción entre superficie y control.
- **Cero sombras.** La separación la dan las reglas impresas, como en un
  formulario real.
- **Movimiento:** un único momento, y responde a una acción — al guardar una
  entrada, su costo se suma visiblemente al total de la semana y del proyecto.
  Sin fade-and-slide-up por sección, sin hover que levante filas.
- **Piso de calidad:** foco de teclado visible sobre `ink`,
  `prefers-reduced-motion` respetado, colapso a móvil escondiendo la columna de
  tokens y conservando la de dólares, contraste AA (`ink` sobre `sheet` ≈ 14:1;
  `debit` sobre `carbon` ≈ 6:1).
- **Modo oscuro:** no invertir. La tinta pasa a ser el papel (`#16202B`), las
  reglas suben a `#2C3B49` y `debit` se aclara a `#D9646E` para mantener
  contraste.

## Revisión del plan

Tres cosas cambiaron en la pasada de crítica, y conviene no revertirlas sin
motivo:

1. **Descartado:** fondo crema, display serif de alto contraste, acento terracota
   y entradas en tarjetas redondeadas idénticas. Es el cluster genérico y no dice
   nada de una app cuyo dato central es una cifra de dinero.
2. **Quitada la segunda familia tipográfica** (había un serif para el masthead).
   No aportaba información; una sola familia con eje de ancho hace el mismo
   trabajo.
3. **Reducido de cinco colores señal a uno.** Los cuatro badges de tipo pasaron a
   abreviaturas en tinta para que el rojo del costo sea el único acento.

Riesgo consciente: la hoja reglada roza el look broadsheet. Lo que la separa es
que las reglas son las columnas de datos reales y hay una franja de color con
función, no filetes decorativos ni columnas de periódico.

## Ejecución

Pasos en orden, con los archivos que toca cada uno.

1. **Tokens de color y radio** — `src/app/globals.css`. Sustituir las variables
   `oklch` neutras de `:root` y `.dark` por la paleta de arriba. Bajar `--radius`
   a `0` y añadir un token aparte para controles (`2px`). Revisar los helpers de
   `@layer components` (`.card`, `.btn-*`), que hoy asumen bordes redondeados y
   fondo de tarjeta.
2. **Tipografía** — `src/app/layout.tsx` (donde se cargan las fuentes Geist) y
   `--font-sans` / `--font-heading` en `globals.css`. Instalar Archivo vía
   `next/font/google`, confirmar `tnum`, definir la escala.
3. **Hoja de registro** — `src/components/timeline.tsx`. Es el cambio central:
   pasar de `Card` por entrada a filas sobre un eje numérico compartido, mover
   `KIND_BADGE_CLASS` a abreviaturas en tinta y añadir el subtotal por semana
   sobre los grupos que ya devuelve `groupByWeek` (`src/lib/week.ts`).
4. **Cabecera de proyecto** — `src/app/(app)/projects/[slug]/page.tsx`. El
   "Total invertido" deja de ser una línea de texto suelta y se alinea al eje de
   la columna de costo. `totals()` ya calcula lo necesario.
5. **Form como línea en blanco** — `src/components/entry-form.tsx`, integrado al
   tope de la hoja en lugar de ir en su propio bloque.
6. **Dashboard** — `src/app/(app)/page.tsx`, una línea por proyecto con el mismo
   eje.
7. **Resto de pantallas** — `login`, `projects/new`, `projects/[slug]/edit`,
   `footer`, y los primitivos de `src/components/ui/` que hereden radio y sombra.
8. **Verificación** — revisar a 375px de ancho, foco de teclado, contraste, y
   `prefers-reduced-motion` en la única animación.
