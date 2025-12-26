-- Supabase: esquema de catálogo + RLS por rol admin
-- Crear tipo de rol
create type public.app_role as enum ('admin');

-- Tabla de roles (mapa usuario-rol)
create table if not exists public.user_roles (
  user_id uuid references auth.users on delete cascade not null,
  role public.app_role not null,
  primary key (user_id, role)
);

-- Tabla de catálogo
create table if not exists public.catalogo (
  id bigserial primary key,
  nombre text not null,
  estilo text not null,
  abv numeric(3,1) not null,
  ibu int not null,
  stock int not null
);

-- Habilitar RLS
alter table public.catalogo enable row level security;

-- Lectura: autenticados pueden leer
create policy if not exists "auth pueden leer" on public.catalogo
  for select to authenticated using (true);

-- Escritura: solo usuarios con rol admin
create policy if not exists "solo admin insert" on public.catalogo
  for insert to authenticated
  with check (
    exists (
      select 1 from public.user_roles ur
      where ur.user_id = auth.uid() and ur.role = 'admin'
    )
  );

create policy if not exists "solo admin update" on public.catalogo
  for update to authenticated
  using (
    exists (
      select 1 from public.user_roles ur
      where ur.user_id = auth.uid() and ur.role = 'admin'
    )
  );

create policy if not exists "solo admin delete" on public.catalogo
  for delete to authenticated
  using (
    exists (
      select 1 from public.user_roles ur
      where ur.user_id = auth.uid() and ur.role = 'admin'
    )
  );
