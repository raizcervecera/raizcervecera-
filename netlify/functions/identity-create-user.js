// netlify/functions/identity-create-user.js
export async function handler(event, context){
  if(event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  const body = JSON.parse(event.body || '{}');
  const { email, password, confirm } = body;
  if(!email || !password){
    return { statusCode: 400, body: JSON.stringify({ msg: 'email y password requeridos' }) };
  }
  // Identity admin token & URL from function context
  let identityUrl, adminToken;
  try {
    // Newer contexts: custom.netlify base64
    if(context.clientContext && context.clientContext.custom && context.clientContext.custom.netlify){
      const decoded = JSON.parse(Buffer.from(context.clientContext.custom.netlify, 'base64').toString('utf-8'));
      identityUrl = decoded.identity.url; adminToken = decoded.identity.token.access_token || decoded.identity.token;
    }
    // Fallback
    if(!identityUrl && context.clientContext && context.clientContext.identity){
      identityUrl = context.clientContext.identity.url; adminToken = context.clientContext.identity.token.access_token || context.clientContext.identity.token;
    }
  } catch(err){}
  if(!identityUrl || !adminToken){
    return { statusCode: 401, body: JSON.stringify({ msg: 'No admin token in context' }) };
  }
  const url = `${identityUrl}/admin/users`;
  try{
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ email, password, confirm: !!confirm })
    });
    const data = await resp.json().catch(()=>({}));
    return { statusCode: resp.status, body: JSON.stringify(data) };
  }catch(err){
    return { statusCode: 500, body: JSON.stringify({ msg: err.message }) };
  }
}
