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
