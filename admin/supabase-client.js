import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Configura tu proyecto Supabase (Dashboard → Project Settings → API)
const SUPABASE_URL = 'https://TU_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'TU_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: true, persistSession: true }
});

const statusEl = document.getElementById('su-status');
function setStatus(msg, ok=true){ if(!statusEl) return; statusEl.textContent = msg; statusEl.style.color = ok ? '#d8a63a' : '#ff6b6b'; }

// Login/Logout Supabase
const btnLogin = document.getElementById('su-login');
const btnLogout = document.getElementById('su-logout');
btnLogin?.addEventListener('click', async ()=>{
  const email = document.getElementById('su-email').value.trim();
  const pass = document.getElementById('su-pass').value;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
  if(error){ setStatus(error.message, false); } else { setStatus('Sesión Supabase activa'); }
});
btnLogout?.addEventListener('click', async ()=>{
  await supabase.auth.signOut();
  setStatus('Sesión Supabase cerrada');
});

// Tabla
const tbody = document.querySelector('#catalog-table tbody');
function renderTable(items){
  tbody.innerHTML = '';
  items.forEach(it=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${it.nombre}</td><td>${it.estilo}</td><td>${it.abv}%</td><td>${it.ibu}</td><td>${it.stock}</td>`;
    tbody.appendChild(tr);
  });
}

// Cargar catálogo (lectura)
async function loadCatalog(){
  const { data, error } = await supabase.from('catalogo').select('*').order('id', { ascending: true });
  if(error){ setStatus(error.message, false); return; }
  renderTable(data||[]);
}

document.getElementById('btn-load')?.addEventListener('click', loadCatalog);

// Export CSV
function toCSV(items){
  const header = ['Nombre','Estilo','ABV','IBU','Stock'];
  const rows = items.map(it=>[it.nombre,it.estilo,it.abv,it.ibu,it.stock]);
  const csv = [header, ...rows].map(r=>r.join(',')).join('
');
  return csv;
}

document.getElementById('btn-export')?.addEventListener('click', async ()=>{
  const { data } = await supabase.from('catalogo').select('*').order('id', { ascending: true });
  const blob = new Blob([toCSV(data||[])], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'catalogo.csv'; a.click(); URL.revokeObjectURL(url);
});

// Alta (requiere rol admin via RLS)
const form = document.getElementById('quick-add');
const addStatus = document.getElementById('add-status');
form?.addEventListener('submit', async (ev)=>{
  ev.preventDefault();
  const fd = new FormData(form);
  const item = {
    nombre: String(fd.get('nombre')).trim(),
    estilo: String(fd.get('estilo')).trim(),
    abv: Number(fd.get('abv')),
    ibu: Number(fd.get('ibu')),
    stock: Number(fd.get('stock'))
  };
  const { error } = await supabase.from('catalogo').insert(item);
  if(error){ addStatus.textContent = 'Permiso denegado o error: ' + error.message; addStatus.style.color = '#ff6b6b'; return; }
  addStatus.textContent = 'Agregado correctamente'; addStatus.style.color = '#d8a63a';
  await loadCatalog();
  form.reset();
});
