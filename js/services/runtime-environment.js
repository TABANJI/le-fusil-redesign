(function runtimeEnvironment(global){
  'use strict';
  const raw=global.LEFUSIL_RUNTIME_CONFIG||{},local=['localhost','127.0.0.1',''].includes(location.hostname)||location.protocol==='file:';
  const safe=value=>String(value||'').trim(),placeholder=value=>/^(?:replace|example|todo|to_be_confirmed)/i.test(value);
  const url=safe(raw.supabaseUrl),key=safe(raw.supabasePublishableKey),validUrl=(()=>{try{return /^https:$/.test(new URL(url).protocol)&&/\.supabase\.co$/i.test(new URL(url).hostname)}catch{return false}})();
  const configured=validUrl&&key.length>=20&&!placeholder(key),production=!local&&raw.environment==='production';
  const mode=configured?'production':local?'demo':'configuration-error';
  const publicMessage=mode==='configuration-error'?'Online enquiries are temporarily unavailable. Please retry later.':'';
  global.LEFUSIL_RUNTIME={mode,configured,production,config:configured?{supabaseUrl:url,supabasePublishableKey:key,publicSiteUrl:safe(raw.publicSiteUrl),adminAllowedEmail:safe(raw.adminAllowedEmail)}:{},publicMessage,assertProduction(){if(mode!=='production')throw new Error(mode==='demo'?'Demo data provider active.':'Production data service is not configured.')}};
})(window);
