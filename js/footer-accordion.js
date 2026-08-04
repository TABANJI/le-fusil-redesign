(function footerAccordion(){
  'use strict';
  const mobile=matchMedia('(max-width: 768px)');
  const sync=grid=>grid.querySelectorAll('.product-footer-group').forEach(group=>{
    group.open=!mobile.matches;
    group.querySelector('summary')?.setAttribute('aria-expanded',String(group.open));
  });
  const init=()=>{
    const grid=document.querySelector('.footer-grid');if(!grid)return;
    [...grid.children].filter(group=>!group.classList.contains('footer-brand')).forEach((group,index)=>{
      if(group.matches('details'))return;
      const heading=group.querySelector('h4');if(!heading)return;
      const details=document.createElement('details');details.className='product-footer-group';
      const summary=document.createElement('summary');summary.textContent=heading.textContent;summary.setAttribute('role','button');
      const content=document.createElement('div');content.className='product-footer-links';content.id=`footer-panel-${index+1}`;
      summary.setAttribute('aria-controls',content.id);summary.setAttribute('aria-expanded','false');
      [...group.children].filter(child=>child!==heading).forEach(child=>content.appendChild(child));
      details.addEventListener('toggle',()=>{
        summary.setAttribute('aria-expanded',String(details.open));
        if(details.open&&mobile.matches){
          grid.querySelectorAll('.product-footer-group[open]').forEach(openGroup=>{if(openGroup!==details)openGroup.open=false});
        }
      });
      details.append(summary,content);group.replaceWith(details);
    });
    sync(grid);
    mobile.addEventListener?.('change',()=>sync(grid));
    addEventListener('pageshow',()=>sync(grid));
  };
  if(document.readyState==='complete')init();
  else addEventListener('DOMContentLoaded',init,{once:true});
})();
