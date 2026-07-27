(function siteConfiguration(global){
  'use strict';
  const pending=value=>!value||['TO_BE_CONFIRMED','REPLACE_BEFORE_PRODUCTION'].includes(value);
  const address='Yara Center, Jdeideh Boulevard, Jdeideh, Mount Lebanon, Lebanon';
  const mapSearchQuery=address;
  const location={
    venue:'Yara Center',street:'Jdeideh Boulevard',locality:'Jdeideh',region:'Mount Lebanon',country:'Lebanon',
    displayAddress:address,shortDisplay:'Yara Center · Jdeideh · Mount Lebanon',
    showroomLabel:'Jdeideh showroom',mapSearchQuery,
    localized:{
      en:{address:'Yara Center, Jdeideh Boulevard, Jdeideh, Mount Lebanon, Lebanon',short:'Yara Center · Jdeideh · Mount Lebanon',showroom:'Jdeideh showroom',visit:'Visit LE FUSIL in Jdeideh',directions:'Get Directions'},
      ar:{address:'يارا سنتر، بولفار الجديدة، الجديدة، جبل لبنان، لبنان',short:'Yara Center · Jdeideh · جبل لبنان',showroom:'صالة عرض الجديدة',visit:'زيارة LE FUSIL في الجديدة',directions:'الاتجاهات'},
      fr:{address:'Yara Center, boulevard de Jdeideh, Jdeideh, Mont-Liban, Liban',short:'Yara Center · Jdeideh · Mont-Liban',showroom:'Showroom de Jdeideh',visit:'Visiter LE FUSIL à Jdeideh',directions:'Itinéraire'}
    }
  };
  global.LEFUSIL_SITE_CONFIG={brandName:'LE FUSIL',legalBusinessName:'TO_BE_CONFIRMED',phone:'TO_BE_CONFIRMED',whatsapp:'TO_BE_CONFIRMED',email:'TO_BE_CONFIRMED',address,locality:location.locality,region:location.region,country:location.country,mapSearchQuery,mapsUrl:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapSearchQuery)}`,showroomLabel:location.showroomLabel,location,openingHours:{configured:false,timezone:'Asia/Beirut',days:[],notice:'Hours to be confirmed'},social:{instagram:'TO_BE_CONFIRMED',facebook:'TO_BE_CONFIRMED'},defaultLocale:'en',supportedLocales:['en','ar','fr'],localeLabels:{en:'English',ar:'العربية',fr:'Français'},currency:'USD',timezone:'Asia/Beirut',appointment:{enabled:true,maxAdvanceDays:180,timeWindows:['Morning','Afternoon','Evening']},consentVersion:'2026-07-draft',privacyPolicyVersion:'2026-07-draft',analytics:{enabled:false,debug:false},productionDomain:'REPLACE_BEFORE_PRODUCTION',pwa:{autoRegister:false},isConfigured:value=>!pending(value)};
  ['css/i18n.css','css/consent.css'].forEach(href=>{if(!document.querySelector(`link[href="${href}"]`)){const link=document.createElement('link');link.rel='stylesheet';link.href=href;document.head.append(link)}});

  function applyLocation(){
    const config=global.LEFUSIL_SITE_CONFIG,locale=global.LEFUSIL_LOCALE?.current||document.documentElement.lang||'en',copy=config.location.localized[locale]||config.location.localized.en;
    const replacements=new Map([['LE FUSIL · Yara Center · Jdeideh · Mount Lebanon',`LE FUSIL · ${copy.short}`],['Jdeideh Showroom',copy.showroom],['Jdeideh showroom',copy.showroom]]);
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;
    while(node=walker.nextNode()){if(node.parentElement?.closest('script,style,code'))continue;let value=node.nodeValue;replacements.forEach((replacement,source)=>{value=value.replaceAll(source,replacement)});value=value.replaceAll('in our Jdeideh showroom',`in our ${copy.showroom}`).replaceAll('inside our Jdeideh showroom',`inside our ${copy.showroom}`).replaceAll('showroom in Jdeideh',copy.showroom);node.nodeValue=value}
    document.querySelectorAll('img[alt*="in Beirut"]').forEach(image=>image.alt=image.alt.replace(' in Beirut',` in ${config.location.locality}`));
    document.querySelectorAll('[data-location-address]').forEach(node=>{node.textContent=copy.address;node.dir=locale==='ar'?'rtl':'ltr'});
    document.querySelectorAll('[data-location-short]').forEach(node=>{node.textContent=copy.short;node.dir=locale==='ar'?'rtl':'ltr'});
    document.querySelectorAll('[data-location-map]').forEach(link=>{link.href=config.mapsUrl;link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label',`${copy.directions}: ${copy.address}`)});
    if(!config.isConfigured(config.whatsapp))document.querySelectorAll('option').forEach(option=>{if(option.textContent.trim()==='WhatsApp')option.remove()});
    const contact=document.querySelector('.contact-visit-copy');if(contact&&!contact.querySelector('[data-showroom-location]')){const block=document.createElement('address');block.dataset.showroomLocation='';block.className='showroom-location';block.dir=locale==='ar'?'rtl':'ltr';const strong=document.createElement('strong');strong.textContent=copy.visit;const text=document.createElement('span');text.textContent=copy.address;block.append(strong,text);contact.querySelector('.contact-actions')?.before(block)}
    const footer=document.querySelector('.footer-brand');if(footer&&!footer.querySelector('[data-showroom-location]')){const line=document.createElement('p');line.dataset.showroomLocation='';line.textContent=copy.short;const directions=document.createElement('a');directions.href=config.mapsUrl;directions.target='_blank';directions.rel='noopener noreferrer';directions.textContent=copy.directions;directions.setAttribute('aria-label',`${copy.directions}: ${copy.address}`);footer.append(line,directions)}
    const viewing=document.querySelector('.private-viewing-inner>div');if(viewing&&!viewing.querySelector('[data-showroom-location]')){const line=document.createElement('p');line.dataset.showroomLocation='';line.textContent=copy.short;viewing.append(line)}
    const appointment=document.querySelector('.appointment-intro,.appointment-copy');if(appointment&&!appointment.querySelector('[data-showroom-location]')){const line=document.createElement('p');line.dataset.showroomLocation='';line.textContent=copy.short;appointment.append(line)}
    if(global.location.pathname.endsWith('legal-notice.html')){const legal=document.querySelector('.legal-content');if(legal&&!legal.querySelector('[data-showroom-location]')){const block=document.createElement('address');block.dataset.showroomLocation='';block.textContent=copy.address;legal.append(block)}}
    document.querySelectorAll('script[type="application/ld+json"]').forEach(script=>{try{const data=JSON.parse(script.textContent),entities=data['@graph']||[data];entities.forEach(entity=>{if(['Organization','LocalBusiness'].includes(entity['@type']))entity.address={'@type':'PostalAddress',streetAddress:'Yara Center, Jdeideh Boulevard',addressLocality:config.locality,addressRegion:config.region,addressCountry:'LB'}});script.textContent=JSON.stringify(data)}catch{}});
    if(global.location.pathname.endsWith('contact.html')){
      const seo={en:{title:'Visit LE FUSIL | Jdeideh Showroom, Mount Lebanon',description:'Visit the LE FUSIL sporting arms showroom at Yara Center in Jdeideh, Mount Lebanon, or arrange a private viewing.'},fr:{title:'Visiter LE FUSIL | Showroom de Jdeideh, Mont-Liban',description:'Visitez le showroom LE FUSIL à Yara Center, Jdeideh, Mont-Liban, ou organisez une visite privée.'},ar:{title:'زيارة LE FUSIL | صالة عرض الجديدة، جبل لبنان',description:'تفضل بزيارة صالة عرض LE FUSIL في يارا سنتر، الجديدة، جبل لبنان، أو اطلب معاينة خاصة.'}}[locale];
      document.title=seo.title;document.querySelectorAll('meta[name="description"],meta[property="og:description"],meta[name="twitter:description"]').forEach(meta=>meta.content=seo.description);document.querySelector('meta[property="og:title"]')?.setAttribute('content',seo.title);document.querySelector('meta[name="twitter:title"]')?.setAttribute('content',seo.title);
    }
    if(global.location.pathname.endsWith('appointment.html')){
      const seo={en:{title:'Arrange a Private Viewing | LE FUSIL',description:'Arrange a private viewing at the LE FUSIL showroom in Jdeideh, Mount Lebanon. Requested dates require personal confirmation.'},fr:{title:'Organiser une visite privée | LE FUSIL',description:'Organisez une visite privée au showroom LE FUSIL à Jdeideh, Mont-Liban. La date souhaitée doit être confirmée personnellement.'},ar:{title:'ترتيب معاينة خاصة | LE FUSIL',description:'رتّب معاينة خاصة في صالة عرض LE FUSIL في الجديدة، جبل لبنان. يتطلب التاريخ المطلوب تأكيدًا شخصيًا.'}}[locale];document.title=seo.title;document.querySelector('meta[name="description"]')?.setAttribute('content',seo.description);
    }
  }
  addEventListener('DOMContentLoaded',applyLocation);
})(window);
