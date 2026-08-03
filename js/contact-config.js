(function contactConfiguration(global){
  'use strict';
  const config=global.LEFUSIL_SITE_CONFIG;if(!config)return;
  document.querySelectorAll('[data-location-map]').forEach(link=>link.addEventListener('click',()=>global.lefusilAnalytics?.track('map_clicked',{locale:global.LEFUSIL_LOCALE?.current||'en',sourcePage:'contact'})));
  // Phone, email and social actions are intentionally omitted until configured with verified values.
})(window);
