(function aboutReveal(){
  'use strict';
  const targets=[
    '.about-hero .container',
    '.about-approach .content-grid',
    '.about-showroom-media',
    '.about-services .service',
    '.about-find-layout',
    '.about-visit .showroom'
  ];
  const elements=document.querySelectorAll(targets.join(','));
  if(!elements.length)return;
  document.documentElement.classList.add('about-reveal-ready');
  elements.forEach(element=>element.classList.add('about-reveal'));
  if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){
    elements.forEach(element=>element.classList.add('is-visible'));
    return;
  }
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  }),{rootMargin:'0px 0px -8% 0px',threshold:.08});
  elements.forEach(element=>observer.observe(element));
})();
