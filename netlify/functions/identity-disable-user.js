// netlify/functions/identity-disable-user.js
export async function handler(event, context){
  if(event.httpMethod !== 'PUT') return { statusCode: 405, body: 'Method Not Allowed' };
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
    // Mark role disabled in app_metadata
    const resp = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ app_metadata: { roles: ['disabled'] } })
    });
    const data = await resp.json().catch(()=>({}));
    return { statusCode: resp.status, body: JSON.stringify(data) };
  }catch(err){
    return { statusCode: 500, body: JSON.stringify({ msg: err.message }) };
  }
}
