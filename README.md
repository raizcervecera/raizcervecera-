# Raíz Cervecera — sitio multi‑página

Se generaron páginas independientes, enlazadas desde el menú:
- `index.html` → Inicio
- `cervezas.html` → Cervezas
- `origen.html` → Origen
- `contacto.html` → Contacto
- `admin.html` → Admin (proteger con Netlify Identity / rol `admin`)

### Cómo publicar
- GitHub Pages o Netlify: sube todos los archivos a la **raíz** del repo.
- Para **Netlify Identity + RBAC**: ajusta `netlify.toml` y asigna rol `admin` a tu usuario.

### Notas
- El menú vincula a cada archivo `.html`.
- En `contacto.html` el formulario usa Formspree (reemplaza `TU_ID_FORMSPREE`).
