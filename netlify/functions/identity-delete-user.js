// netlify/functions/identity-delete-user.js
export async function handler(event, context){
  if(event.httpMethod !== 'DELETE') return { statusCode: 405, body: 'Method Not Allowed' };
  const body = JSON.parse(event.body || '{}');
  const { id } = body;
  if(!id) return { statusCode: 400, body: JSON.stringify({ msg: 'id requerido' }) };
  let identityUrl, adminToken;
  try {
    if(context.clientContext && context.clientContext.custom && context.clientContext.custom.netlify){
      const decoded = JSON.parse(Buffer.from(context.clientContext.custom.netlify, 'base64').toString('utf-8'));
      identityUrl = decoded.identity.url; adminToken = decoded.identity.token.access_token || decoded.identity.token;
    }
    if(!identityUrl && context.clientContext && context.clientContext.identity){
      identityUrl = context.clientContext.identity.url; adminToken = context.clientContext.identity.token.access_token || context.clientContext.identity.token;
    }
  } catch(err){}
  if(!identityUrl || !adminToken){
    return { statusCode: 401, body: JSON.stringify({ msg: 'No admin token in context' }) };
  }
  const url = `${identityUrl}/admin/users/${id}`;
  try{
    const resp = await fetch(url, { method: 'DELETE', headers: { Authorization: `Bearer ${adminToken}` } });
    // DELETE may return empty body
    let data = {};
    try { data = await resp.json(); } catch(e){}
    return { statusCode: resp.status, body: JSON.stringify(data) };
  }catch(err){
    return { statusCode: 500, body: JSON.stringify({ msg: err.message }) };
  }
}
