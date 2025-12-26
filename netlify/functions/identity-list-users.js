// netlify/functions/identity-list-users.js
export async function handler(event, context){
  const body = JSON.parse(event.body || '{}');
  const { filter } = body;
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
  const url = `${identityUrl}/admin/users${filter ? `?filter=${encodeURIComponent(filter)}` : ''}`;
  try{
    const resp = await fetch(url, { headers: { Authorization: `Bearer ${adminToken}` } });
    const data = await resp.json();
    // Some APIs return users list under 'data' or direct array; normalize
    const users = Array.isArray(data) ? data : (data.users || data.data || []);
    const count = users.length;
    return { statusCode: 200, body: JSON.stringify({ users, count }) };
  }catch(err){
    return { statusCode: 500, body: JSON.stringify({ msg: err.message }) };
  }
}
