# Raíz Cervecera — Sitio estático (GitHub Pages)

- Branding oscuro + logo.
- Menú (Inicio, Cervezas, Origen, Contacto).
- **Imagen de portada** en el hero.
- **Cervezas** desde `cervezas.json`.
- **Origen** con texto real.
- **Contacto** con **Formspree** y **scroll suave**.
- Footer con **redes sociales**.

## Publicación
1. Sube todo a la **raíz** del repo `raizcervecera/raizcervecera`:
   `index.html`, `styles.css`, `cervezas.json`, `scripts/main.js`, `assets/logo.jpg`, `assets/icon-instagram.svg`, `assets/icon-facebook.svg`, `README.md`.
2. **Settings → Pages**: *Deploy from a branch*, `main` y **/ (root)**.
3. Visita: `https://raizcervecera.github.io/raizcervecera/`.

## Formspree
- Reemplaza `TU_ID_FORMSPREE` en `index.html` por tu ID real (`f/xxxxx`).

## Desarrollo local
```bash
python -m http.server 8080
# Abre http://localhost:8080/
```
