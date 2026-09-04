-- Costo por entrada: tokens consumidos y dinero gastado (USD) -----------------
alter table public.entries
  add column tokens   integer  not null default 0 check (tokens >= 0),
  add column cost_usd numeric(12, 4) not null default 0 check (cost_usd >= 0);
