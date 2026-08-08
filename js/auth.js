(function authFoundation(global){
  'use strict';
  if(global.LEFUSIL_AUTH)return;
  const STORAGE_KEY='lefusil_auth_session';
  const config=global.LEFUSIL_RUNTIME_CONFIG||{};
  const base=String(config.supabaseUrl||'').replace(/\/$/,'');
  const key=String(config.supabasePublishableKey||'');
  const configured=Boolean(base&&key);
  let state={status:'loading',user:null,profile:null,role:'guest'};
  const emit=()=>global.dispatchEvent(new CustomEvent('lefusil:auth-change',{detail:{...state,configured}}));
  const read=()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY))}catch{return null}};
  const write=session=>session?localStorage.setItem(STORAGE_KEY,JSON.stringify(session)):localStorage.removeItem(STORAGE_KEY);
  async function request(path,{token,method='GET',body}={}){const response=await fetch(`${base}${path}`,{method,headers:{apikey:key,Authorization:`Bearer ${token||key}`,'Content-Type':'application/json',Accept:'application/json'},body:body?JSON.stringify(body):undefined});if(!response.ok){const payload=await response.json().catch(()=>({}));throw new Error(payload.msg||payload.message||payload.error_description||'Authentication request failed.')}return response.status===204?null:response.json()}
  async function hasRole(token,role){return Boolean(await request('/rest/v1/rpc/has_role',{token,method:'POST',body:{requested_role:role}}))}
  async function resolveIdentity(session){const user=await request('/auth/v1/user',{token:session.access_token});const [profile,admin,managerRoles]=await Promise.all([request(`/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=id,display_name,email,is_active&limit=1`,{token:session.access_token}).then(rows=>rows?.[0]||null).catch(()=>null),hasRole(session.access_token,'super_admin'),Promise.all(['catalog_manager','media_manager','crm_manager'].map(role=>hasRole(session.access_token,role)))]);if(profile&&profile.is_active===false)throw new Error('This account is inactive.');state={status:'authenticated',user,profile,role:admin?'admin':managerRoles.some(Boolean)?'manager':'customer'};emit();return state}
  async function refresh(session){if(!session?.refresh_token)throw new Error('No persistent session.');const next=await request('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token:session.refresh_token}});write(next);return resolveIdentity(next)}
  async function init(){if(!configured){state={status:'unavailable',user:null,profile:null,role:'guest'};emit();return state}const session=read();if(!session){state={status:'guest',user:null,profile:null,role:'guest'};emit();return state}try{return await refresh(session)}catch{write(null);state={status:'guest',user:null,profile:null,role:'guest'};emit();return state}}
  async function signIn(email,password){if(!configured)throw new Error('Authentication is not configured yet.');const session=await request('/auth/v1/token?grant_type=password',{method:'POST',body:{email:String(email).trim(),password:String(password)}});write(session);return resolveIdentity(session)}
  async function signOut(){const session=read();if(configured&&session?.access_token)await request('/auth/v1/logout',{token:session.access_token,method:'POST'}).catch(()=>null);write(null);state={status:configured?'guest':'unavailable',user:null,profile:null,role:'guest'};emit()}
  const canManage=()=>state.status==='authenticated'&&['manager','admin'].includes(state.role);
  global.LEFUSIL_AUTH={init,signIn,signOut,canManage,getState:()=>({...state,configured})};

  function renderAccount(){const mount=document.querySelector('[data-mobile-account]'),panel=document.querySelector('#accountPanel');if(!mount||!panel)return;const current=global.LEFUSIL_AUTH.getState();if(current.status==='authenticated'){const adminLink=['manager','admin'].includes(current.role)?'<a href="admin.html">Admin Panel</a>':'';mount.innerHTML=`<strong>My Account</strong><a href="favorites.html">Favorites</a><a href="appointment.html">Appointments</a>${adminLink}<button type="button" data-auth-signout>Sign Out</button>`}else mount.innerHTML='<button type="button" data-account-open>Sign In</button>';panel.querySelector('[data-auth-unavailable]').hidden=current.status!=='unavailable';panel.querySelector('button[type="submit"]').disabled=current.status==='unavailable'}
  document.addEventListener('submit',async event=>{const form=event.target.closest('[data-auth-form]');if(!form)return;event.preventDefault();const message=form.querySelector('[data-auth-message]'),data=new FormData(form);message.textContent='';try{await signIn(data.get('email'),data.get('password'));form.reset();document.querySelector('#accountPanel')?.setAttribute('aria-hidden','true')}catch(error){message.textContent=error.message}});
  document.addEventListener('click',event=>{if(event.target.closest('[data-account-open]'))document.querySelector('#accountPanel')?.setAttribute('aria-hidden','false');if(event.target.closest('[data-account-close]'))document.querySelector('#accountPanel')?.setAttribute('aria-hidden','true');if(event.target.closest('[data-auth-signout]'))signOut()});
  global.addEventListener('lefusil:auth-change',renderAccount);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>init().then(renderAccount),{once:true});else init().then(renderAccount);
})(window);
