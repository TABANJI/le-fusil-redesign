(function contactConfiguration(global){
  'use strict';
  const config=global.LEFUSIL_SITE_CONFIG;if(!config)return;
  document.querySelectorAll('[data-location-map]').forEach(link=>link.addEventListener('click',()=>global.lefusilAnalytics?.track('map_clicked',{locale:global.LEFUSIL_LOCALE?.current||'en',sourcePage:'contact'})));
  const finalCta=document.querySelector('.footer-lead');
  if(finalCta){finalCta.querySelector('h2').textContent='Visit the showroom by appointment.';const button=finalCta.querySelector('.btn');button.textContent='Request a Private Viewing';button.href='appointment.html?source=contact'}
  // Phone, email and social actions are intentionally omitted until configured with verified values.
})(window);
