(function luxuryProductEnhancements(){
  const params=new URLSearchParams(location.search),product=(window.LEFUSIL_PRODUCTS||[]).find(item=>item.slug===params.get('slug'));
  if(!product||!document.querySelector('.product-layout'))return;
  const info=document.querySelector('.info-intro');
  const label=document.createElement('div');label.className='product-heritage-label';label.textContent='Fine Sporting Arms · Showroom Selection';info.prepend(label);
  const images=[...(product.images||[]),...(product.gallery||[]),product.image].filter(Boolean).filter((value,index,array)=>array.indexOf(value)===index);
  const main=document.querySelector('.gallery-main'),mainImage=document.querySelector('#mainProductImage');let startX=0;
  main.addEventListener('touchstart',event=>{startX=event.changedTouches[0].clientX},{passive:true});
  main.addEventListener('touchend',event=>{const delta=event.changedTouches[0].clientX-startX;if(Math.abs(delta)<45)return;const selected=document.querySelector('.gallery-thumb[aria-selected="true"]'),thumbs=[...document.querySelectorAll('.gallery-thumb')],index=thumbs.indexOf(selected),next=(index+(delta<0?1:-1)+thumbs.length)%thumbs.length;thumbs[next]?.click()},{passive:true});
  document.querySelectorAll('.gallery-thumb').forEach((thumb,index)=>thumb.addEventListener('click',()=>{main.classList.add('is-changing');setTimeout(()=>main.classList.remove('is-changing'),180);const next=images[(index+1)%images.length];if(next){const preload=new Image();preload.src=window.lefusilImages?.optimized(next,1600)||next}}));
  if(images.length>1){
    const story=document.createElement('section');story.className='product-section image-story';story.innerHTML=`<div class="section-heading"><div class="eyebrow">Image Story</div><h2>Details worth seeing up close.</h2><p>Original views from the current product presentation.</p></div><div class="image-story-grid">${images.slice(1,4).map((image,index)=>`<figure class="image-story-figure"><img src="${window.lefusilImages?.optimized(image,1600)||image}" alt="${product.brand} ${product.name} — detail ${index+2}" loading="lazy" decoding="async"></figure>`).join('')}</div>`;
    const compliance=document.querySelector('.compliance-section');compliance?.before(story);
  }
  const viewing=document.createElement('section');viewing.className='product-section private-viewing';viewing.innerHTML=`<div class="private-viewing-inner"><div><div class="eyebrow">Private Viewing</div><h2>Experience this piece in person.</h2><p>Arrange a private consultation to review the current presentation, confirm availability and discuss known product details with the LE FUSIL team.</p></div><div class="private-viewing-actions"><a class="product-action product-action-primary" href="appointment.html?product=${encodeURIComponent(product.slug)}">Book Private Viewing</a><a class="product-action" href="contact.html?product=${encodeURIComponent(product.slug)}">Contact LE FUSIL</a></div></div>`;
  document.querySelector('.related-products')?.closest('.product-section')?.before(viewing);
  const price=document.querySelector('.product-price')?.textContent.trim()||'',availability=document.querySelector('.product-status-row .availability')?.textContent.trim()||'';
  const sticky=document.createElement('aside');sticky.className='product-desktop-sticky';sticky.setAttribute('aria-label','Product quick actions');sticky.innerHTML=`<div class="sticky-summary"><strong>${product.brand} ${product.name}</strong><span>${price} · ${availability}</span></div><a class="product-action" href="appointment.html?product=${encodeURIComponent(product.slug)}">Book Viewing</a>`;document.body.append(sticky);
  const purchase=document.querySelector('.product-purchase');new IntersectionObserver(entries=>sticky.classList.toggle('visible',!entries[0].isIntersecting),{threshold:.05}).observe(purchase);
  mainImage?.addEventListener('load',()=>main.classList.remove('is-changing'));
})();
