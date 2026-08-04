(function footerAccordion(){
  'use strict';
  const mobile=matchMedia('(max-width: 768px)'),reducedMotion=matchMedia('(prefers-reduced-motion: reduce)'),animations=new WeakMap(),tokens=new WeakMap();
  const finish=(group,expanded)=>{
    const summary=group.querySelector('summary'),content=group.querySelector('.product-footer-links');
    group.open=expanded;summary?.setAttribute('aria-expanded',String(expanded));
    if(content){content.inert=!expanded;content.setAttribute('aria-hidden',String(!expanded));content.style.removeProperty('height');content.style.removeProperty('overflow');content.style.removeProperty('opacity');content.style.removeProperty('transform')}
  };
  const setExpanded=(group,expanded,animate=true)=>{
    const summary=group.querySelector('summary'),content=group.querySelector('.product-footer-links');if(!summary||!content)return;
    const token=(tokens.get(group)||0)+1,previous=animations.get(group);tokens.set(group,token);
    if(previous){clearTimeout(previous.timer);previous.animation.commitStyles?.();previous.animation.cancel()}
    summary.setAttribute('aria-expanded',String(expanded));content.inert=!expanded;content.setAttribute('aria-hidden',String(!expanded));
    if(!mobile.matches||!animate||reducedMotion.matches||!content.animate){finish(group,expanded);return}
    const startHeight=group.open?content.getBoundingClientRect().height:0;
    if(expanded){group.open=true;content.inert=false;content.setAttribute('aria-hidden','false')}
    const computed=getComputedStyle(content),startOpacity=previous?computed.opacity:(expanded?0:1),startTransform=previous?computed.transform:(expanded?'translateY(-4px)':'translateY(0)'),endHeight=expanded?content.scrollHeight:0;
    content.style.overflow='hidden';
    const animation=content.animate([
      {height:`${startHeight}px`,opacity:startOpacity,transform:startTransform},
      {height:`${endHeight}px`,opacity:expanded?1:0,transform:expanded?'translateY(0)':'translateY(-4px)'}
    ],{duration:230,easing:'cubic-bezier(.4, 0, .2, 1)'});
    const complete=()=>{if(tokens.get(group)===token){const active=animations.get(group);if(active)clearTimeout(active.timer);animations.delete(group);finish(group,expanded)}};
    const timer=setTimeout(complete,250);animations.set(group,{animation,timer});animation.onfinish=complete;
  };
  const sync=grid=>grid.querySelectorAll('.product-footer-group').forEach(group=>setExpanded(group,!mobile.matches,false));
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
      summary.addEventListener('click',event=>{
        event.preventDefault();if(!mobile.matches)return;
        const expand=summary.getAttribute('aria-expanded')!=='true';
        if(expand)grid.querySelectorAll('.product-footer-group').forEach(openGroup=>{if(openGroup!==details&&openGroup.querySelector('summary')?.getAttribute('aria-expanded')==='true')setExpanded(openGroup,false)});
        setExpanded(details,expand);
      });
      details.append(summary,content);group.replaceWith(details);
    });
    sync(grid);grid.classList.add('footer-accordion-ready');
    mobile.addEventListener?.('change',()=>sync(grid));
    addEventListener('pageshow',()=>sync(grid));
  };
  if(document.readyState==='complete')init();
  else addEventListener('DOMContentLoaded',init,{once:true});
})();
