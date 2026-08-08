(function footerAccordion(){
  'use strict';
  if(window.__LEFUSIL_FOOTER_ACCORDION__)return;window.__LEFUSIL_FOOTER_ACCORDION__=true;
  const mediaFor=grid=>matchMedia(grid.dataset.accordionMedia||'(max-width: 767px)');
  const sync=grid=>{const accordion=mediaFor(grid);grid.querySelectorAll('[data-accordion-trigger]').forEach(trigger=>window.LEFUSIL_ACCORDION?.set(trigger,!accordion.matches,false))};
  const init=()=>{
    const grid=document.querySelector('.footer-grid');if(!grid||!window.LEFUSIL_ACCORDION||document.body.classList.contains('home-page'))return;grid.dataset.accordionGroup='footer';grid.dataset.accordionMedia=document.body.classList.contains('shop-page')?'(min-width: 0px)':'(max-width: 767px)';
    [...grid.children].filter(group=>!group.classList.contains('footer-brand')).forEach((group,index)=>{
      if(group.matches('details'))return;
      const heading=group.querySelector('h4');if(!heading)return;
      const details=document.createElement('details');details.className='product-footer-group';
      const summary=document.createElement('summary');summary.textContent=heading.textContent;summary.setAttribute('role','button');summary.dataset.accordionTrigger='';
      const content=document.createElement('div');content.className='product-footer-links';content.id=`footer-panel-${index+1}`;
      summary.setAttribute('aria-controls',content.id);summary.setAttribute('aria-expanded','false');
      [...group.children].filter(child=>child!==heading).forEach(child=>content.appendChild(child));
      details.append(summary,content);group.replaceWith(details);
    });
    sync(grid);grid.classList.add('footer-accordion-ready');
    if(!grid.dataset.footerAccordionBound){grid.dataset.footerAccordionBound='true';mediaFor(grid).addEventListener?.('change',()=>sync(grid));addEventListener('pageshow',()=>sync(grid))}
  };
  addEventListener('lefusil:footer-updated',init);
  if(window.LEFUSIL_ACCORDION){if(document.readyState!=='loading')init();else addEventListener('DOMContentLoaded',init,{once:true})}else addEventListener('lefusil:accordion-ready',init,{once:true});
})();
