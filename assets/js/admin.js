// Admin panel logic
(function(){
  const LOCAL_USER = 'admin';
  const LOCAL_PASS = 'admin2025';

  const el = (id) => document.getElementById(id);
  const status = (id, msg, ok=true) => {
    const s = el(id);
    s.textContent = msg || '';
    s.style.color = ok ? '#14b8a6' : '#ef4444';
  };

  // Local login (client-side gating)
  el('btnLocalLogin').addEventListener('click', () => {
    const u = el('adminUser').value.trim();
    const p = el('adminPass').value;
    if (u === LOCAL_USER && p === LOCAL_PASS) {
      localStorage.setItem('rc_admin_session', '1');
      el('local-login').classList.add('hidden');
      el('adminApp').classList.remove('hidden');
      status('localLoginStatus', '');
    } else {
      status('localLoginStatus', 'Credenciales inválidas', false);
    }
  });

  // Helper to call Netlify Functions
  async function fn(path, method='POST', body=null){
    const headers = { 'Content-Type': 'application/json' };
    const resp = await fetch(`/.netlify/functions/${path}`, {
      method, headers, body: body ? JSON.stringify(body) : undefined
    });
    const text = await resp.text();
    try { return { ok: resp.ok, status: resp.status, data: JSON.parse(text) }; }
    catch { return { ok: resp.ok, status: resp.status, data: text }; }
  }

  // Create user
  el('btnCreate').addEventListener('click', async () => {
    const email = el('nuEmail').value.trim();
    const password = el('nuPass').value;
    const confirm = el('nuConfirm').checked;
    if(!email || !password) return status('createStatus', 'Email y contraseña requeridos', false);
    const r = await fn('identity-create-user', 'POST', { email, password, confirm });
    status('createStatus', r.ok ? `Creado: ${email}` : `Error (${r.status}): ${r.data && r.data.msg || r.data}`, r.ok);
  });

  // Disable user (mark role disabled)
  el('btnDisable').addEventListener('click', async () => {
    const id = el('duId').value.trim();
    if(!id) return status('disableStatus', 'ID requerido', false);
    const r = await fn('identity-disable-user', 'PUT', { id });
    status('disableStatus', r.ok ? `Deshabilitado: ${id}` : `Error (${r.status}): ${r.data && r.data.msg || r.data}`, r.ok);
  });

  // Delete user
  el('btnDelete').addEventListener('click', async () => {
    const id = el('delId').value.trim();
    if(!id) return status('deleteStatus', 'ID requerido', false);
    const r = await fn('identity-delete-user', 'DELETE', { id });
    status('deleteStatus', r.ok ? `Eliminado: ${id}` : `Error (${r.status}): ${r.data && r.data.msg || r.data}`, r.ok);
  });

  // List users
  el('btnList').addEventListener('click', async () => {
    const filter = el('luFilter').value.trim();
    const r = await fn('identity-list-users', 'POST', { filter });
    const tbody = document.querySelector('#usersTable tbody');
    tbody.innerHTML = '';
    if(r.ok && Array.isArray(r.data.users)){
      r.data.users.forEach(u => {
        const tr = document.createElement('tr');
        const roles = (u.app_metadata && u.app_metadata.roles) ? u.app_metadata.roles.join(',') : '';
        tr.innerHTML = `<td>${u.id}</td><td>${u.email}</td><td>${roles}</td><td>${u.created_at || ''}</td>`;
        tbody.appendChild(tr);
      });
      status('listStatus', `Total: ${r.data.count || r.data.users.length}`);
    } else {
      status('listStatus', `Error (${r.status}): ${r.data && r.data.msg || r.data}`, false);
    }
  });
})();
