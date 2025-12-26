// Menú móvil + año en footer + render catálogo + Formspree + scroll suave
const toggleBtn=document.querySelector('.nav-toggle');
const nav=document.getElementById('site-nav');
if(toggleBtn&&nav){toggleBtn.addEventListener('click',()=>{const isOpen=nav.classList.toggle('open');toggleBtn.setAttribute('aria-expanded',String(isOpen));});}
const yearEl=document.getElementById('year');
if(yearEl) yearEl.textContent=new Date().getFullYear();

// Render de cervezas
async function cargarCervezas(){
  try{
    const res=await fetch('cervezas.json');
    const items=await res.json();
    const grid=document.getElementById('cervezas-grid');
    grid.innerHTML='';
    items.forEach(it=>{
      const card=document.createElement('article');
      card.className='card';
      card.innerHTML=`
        <div class="card-header">
          <h3 class="card-title">${it.nombre}</h3>
          <span class="badge">${it.estilo}</span>
        </div>
        <div class="card-body">
          <p><strong>ABV:</strong> ${it.abv}% · <strong>IBU:</strong> ${it.ibu}</p>
          <p>${it.descripcion}</p>
        </div>`;
      grid.appendChild(card);
    });
  }catch(e){console.error('Error cargando cervezas:',e);}
}

cargarCervezas();

// Formspree
const form=document.getElementById('contact-form');
const statusEl=document.getElementById('form-status');
if(form){
  form.addEventListener('submit',async(ev)=>{
    ev.preventDefault();
    const data=new FormData(form);
    try{
      const res=await fetch(form.action,{method:'POST',body:data,headers:{'Accept':'application/json'}});
      if(res.ok){
        statusEl.textContent='¡Gracias! Te contactaremos pronto.';
        statusEl.style.color='#d8a63a';
        form.reset();
      }else{
        const err=await res.json();
        statusEl.textContent=err.errors?err.errors.map(e=>e.message).join(' · '):'No se pudo enviar, intenta nuevamente.';
        statusEl.style.color='#ff6b6b';
      }
    }catch(e){
      statusEl.textContent='Error de conexión. Inténtalo más tarde.';
      statusEl.style.color='#ff6b6b';
    }
  });
}

// Scroll suave a secciones (incluido Contacto)
function enableSmoothScroll(){
  const links=document.querySelectorAll('a[href^="#"]');
  links.forEach(link=>{
    link.addEventListener('click',(ev)=>{
      const href=link.getAttribute('href');
      const targetId=href&&href.startsWith('#')?href.slice(1):null;
      const target=targetId?document.getElementById(targetId):null;
      if(target){
        ev.preventDefault();
        target.scrollIntoView({behavior:'smooth',block:'start'});
        if(nav&&nav.classList.contains('open')){
          nav.classList.remove('open');
          if(toggleBtn) toggleBtn.setAttribute('aria-expanded','false');
        }
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', enableSmoothScroll);


// ---- Admin: inicio de sesión con verificación local (demo) ----
// ATENCIÓN: Esto es solo demostración. En producción use un proveedor real (Netlify Identity, Firebase, Supabase).
// Configuración básica
const ADMIN_EMAIL = 'admin@raizcervecera.cl';
// Hash SHA-256 de la contraseña por defecto 'raiz-admin-2025' (hex):
const ADMIN_PASS_HASH = 'a3dd9fca7e8a19a4fb5dcf51a1bcd82bbf9f76dbf54b0b7125c1a7ac3b66c2ce';

// Utilidad: generar SHA-256 (hex)
async function sha256Hex(str){
  const enc = new TextEncoder();
  const data = enc.encode(str);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(hash);
  return Array.from(bytes).map(b=>b.toString(16).padStart(2,'0')).join('');
}

function isAdmin(){
  try{ const s = JSON.parse(localStorage.getItem('rc_admin')); return s && s.email === ADMIN_EMAIL && s.ok === true; }catch(e){ return false; }
}

function showAdminUI(){
  const guard = document.getElementById('admin-guard');
  const panel = document.getElementById('admin-panel');
  if(!guard || !panel) return;
  if(isAdmin()){
    guard.hidden = true; panel.hidden = false;
    const userEl = document.getElementById('admin-user'); if(userEl) userEl.textContent = ADMIN_EMAIL;
    // Render de cervezas
    fetch('cervezas.json').then(r=>r.json()).then(items=>{
      const ul = document.getElementById('admin-cervezas'); if(!ul) return;
      ul.innerHTML='';
      items.forEach(it=>{ const li=document.createElement('li'); li.textContent = `${it.nombre} — ${it.estilo} (${it.abv}% ABV, ${it.ibu} IBU)`; ul.appendChild(li); });
    });
  } else {
    guard.hidden = false; panel.hidden = true;
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  showAdminUI();
  const form = document.getElementById('admin-login');
  const status = document.getElementById('admin-status');
  const logoutBtn = document.getElementById('admin-logout');

  if(form){
    form.addEventListener('submit', async (ev)=>{
      ev.preventDefault();
      const email = document.getElementById('admin-email').value.trim();
      const pass = document.getElementById('admin-password').value;
      if(email !== ADMIN_EMAIL){ status.textContent='Email no autorizado'; status.style.color='#ff6b6b'; return; }
      const h = await sha256Hex(pass);
      if(h !== ADMIN_PASS_HASH){ status.textContent='Contraseña incorrecta'; status.style.color='#ff6b6b'; return; }
      localStorage.setItem('rc_admin', JSON.stringify({ ok:true, email }));
      status.textContent='Sesión iniciada'; status.style.color='#d8a63a';
      showAdminUI();
    });
  }
  if(logoutBtn){ logoutBtn.addEventListener('click', ()=>{ localStorage.removeItem('rc_admin'); showAdminUI(); }); }
});
