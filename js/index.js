(function homepageCollections(){
  const products=window.LEFUSIL_PRODUCTS||[];
  const featuredGrid=document.querySelector('#featuredProducts');
  if(featuredGrid){featuredGrid.innerHTML=products.filter(product=>product.featured).map(productCard).join('');syncShortlist()}

  const countBy=key=>products.reduce((map,product)=>{const value=String(product[key]||'').trim();if(value)map.set(value,(map.get(value)||0)+1);return map},new Map());
  const brandGrid=document.querySelector('#brandGrid');
  if(brandGrid){brandGrid.innerHTML=[...countBy('brand')].sort(([a],[b])=>a.localeCompare(b)).map(([brand,count])=>`<a class="house-link reveal" href="shop.html?brand=${encodeURIComponent(brand)}"><span>${brand}</span><small>${count} ${count===1?'piece':'pieces'}</small></a>`).join('')}

  const categoryDescriptions={
    'Double-Barrel':'Classic sporting configurations presented for considered in-store selection.',
    'Semi-Automatic':'Contemporary field and sporting pieces from established manufacturers.',
    'Air Rifle':'Precision air rifles selected for sporting consultation and comparison.',
    'Single Shot':'Purposeful single-shot formats with direct, uncomplicated handling.',
    'Ammunition':'Current ammunition selection, subject to lawful in-store verification.'
  };
  const categoryGrid=document.querySelector('#categoryGrid');
  if(categoryGrid){categoryGrid.innerHTML=[...countBy('category')].map(([category,count],index)=>`<article class="category-editorial reveal"><span class="category-number">0${index+1}</span><div><div class="category-count">${count} ${count===1?'piece':'pieces'}</div><h3>${category}</h3><p>${categoryDescriptions[category]||'Explore the current selection with personal guidance from the boutique.'}</p><a href="shop.html?category=${encodeURIComponent(category)}">Explore Collection <span aria-hidden="true">→</span></a></div></article>`).join('')}

  const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}}),{threshold:.08});
  document.querySelectorAll('#brandGrid .reveal,#categoryGrid .reveal').forEach(element=>revealObserver.observe(element));
})();
function money(p){return Number(p.price)>0?new Intl.NumberFormat('en-US',{style:'currency',currency:p.currency||'USD',maximumFractionDigits:0}).format(Number(p.price)):'Price on request'}
function productCard(p){const name=String(p.name||'Product details on request'),brand=String(p.brand||'LE FUSIL'),category=String(p.category||''),calibre=String(p.specifications?.Gauge||p.specifications?.Caliber||''),slug=encodeURIComponent(p.slug||p.id||''),price=money(p),priceClass=Number(p.price)>0?'':' price-request',image=p.image||'',rawAvailability=String(p.availability||'').toLowerCase(),availability=rawAvailability.includes('unavailable')?['Currently unavailable','availability-unavailable']:rawAvailability.includes('limited')?['Limited','availability-limited']:rawAvailability==='available'||rawAvailability.includes('in stock')?['Available','availability-available']:['On request','availability-request'];return `<article class="product-card"><div class="product-image"><span class="product-silhouette" aria-hidden="true"></span>${image?lefusilImages.card(image,`${brand} ${name}`):''}<button type="button" class="shortlist" data-shortlist="${p.id}" aria-label="Add ${brand} ${name} to shortlist"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.4 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg></button></div><div class="product-info"><div class="product-brand">${brand}</div>${category||calibre?`<div class="product-card-meta">${category?`<span>${category}</span>`:''}${calibre?`<span>${calibre}</span>`:''}</div>`:''}<h3><a href="product.html?slug=${slug}">${name}</a></h3>${p.shortDescription?`<p class="product-card-description">${p.shortDescription}</p>`:''}<div class="product-buyline"><div class="price${priceClass}">${price}</div><span class="availability ${availability[1]}">${availability[0]}</span></div><div class="card-actions"><a class="card-primary" href="product.html?slug=${slug}">View Details</a><button type="button" class="card-secondary" data-card-inquiry aria-label="Request availability for ${brand} ${name}">Request Availability</button></div></div></article>`}
document.addEventListener('click',event=>{const button=event.target.closest('[data-card-inquiry]');if(button)lefusilToast('Availability is confirmed personally by the store.')});
