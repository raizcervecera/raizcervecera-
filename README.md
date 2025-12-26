# Raíz Cervecera — Panel Admin con Supabase (Auth + RLS)

Este paquete conecta el panel de administración a **Supabase** para persistir el catálogo,
con **Row Level Security (RLS)** que exige **rol `admin`** del usuario autenticado en Supabase.

## Contenido
- Páginas públicas: `index.html`, `cervezas.html`, `origen.html`, `contacto.html`
- Panel: `admin/index.html` + módulo `admin/supabase-client.js`
- `supabase.sql`: esquema + políticas RLS
- `netlify.toml`: RBAC de Netlify para proteger `/admin/*`
- `login.html`: acceso con Netlify Identity (gating del lado servidor)

## Pasos de integración (Supabase)
1. **Crear proyecto** en Supabase y obtener `SUPABASE_URL` y `SUPABASE_ANON_KEY`.
2. En `admin/supabase-client.js`, reemplaza `TU_PROJECT` y `TU_ANON_KEY`.
3. En Supabase Studio → SQL Editor, **ejecuta** el contenido de `supabase.sql`.
4. **Crea el usuario admin** en Supabase Auth (Email/Password) y obtén su `user_id` (UUID).
5. Inserta el rol admin para ese usuario:
   ```sql
   insert into public.user_roles(user_id, role)
   values ('<UUID_DEL_ADMIN>', 'admin');
   ```

> Referencias: RLS y JWT en Supabase; `createClient` en JS. Ver docs oficiales.

## Flujo de acceso
- Netlify protege `/admin/*` (solo rol `admin` en Netlify).
- Dentro del panel, el usuario **inicia sesión en Supabase** (Email/Password).
- **RLS** permite **insert/update/delete** en `catalogo` **solo** si el `auth.uid()`
  existe en `public.user_roles` con rol `admin`. Los no-admin podrán **leer**.

## Notas
- `contacto.html` usa Formspree (reemplaza `TU_ID_FORMSPREE`).
- Para dominio y HTTPS, gestiona en Netlify.
