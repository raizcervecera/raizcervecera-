# Raíz Cervecera — Sitio multipágina con RBAC

Incluye:
- index.html (Inicio)
- cervezas.html
- origen.html
- contacto.html (formulario con Formspree)
- admin/index.html (panel protegido)
- login.html (pantalla de acceso)
- netlify.toml (RBAC con rol admin)

## Publicación en Netlify
1. Conecta el repo y habilita Identity.
2. Invita a andres.rh78@gmail.com y asigna rol `admin`.
3. Verifica acceso: /admin/ → 401 sin login, 200 con rol.
