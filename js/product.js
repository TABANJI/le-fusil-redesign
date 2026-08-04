(function productPage(){
  const products=window.LEFUSIL_PRODUCTS||[];
  const params=new URLSearchParams(location.search);
  const requestedSlug=params.get('slug');
  const requestedId=params.get('id');
  const product=(requestedSlug||requestedId)
    ? products.find(item=>item.slug===requestedSlug||String(item.id)===requestedId)
    : products[0];
  const mount=document.querySelector('#productMount');
  if(!mount)return;

  const icon=(type)=>{
    const paths={
      expand:'<path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/>',
      heart:'<path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.4 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>',
      share:'<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5"/>',
      guidance:'<path d="M12 3v18M5 8h14M7 8l-3 5h6L7 8ZM17 8l-3 5h6l-3-5Z"/>',
      verified:'<path d="m7 12 3 3 7-7"/><circle cx="12" cy="12" r="9"/>',
      compliance:'<path d="M12 3 5 6v5c0 4.6 2.8 8.1 7 10 4.2-1.9 7-5.4 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-5"/>'
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[type]||paths.verified}</svg>`;
  };
  const escapeHtml=(value)=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const clean=(value)=>value!==undefined&&value!==null&&String(value).trim()!=='';
  const productionBase='https://tabanji.github.io/le-fusil-redesign/';
  const upsertMeta=(selector,attribute,value)=>{
    let element=document.head.querySelector(selector);
    if(!element){element=document.createElement('meta');const match=selector.match(/meta\[(name|property)="([^"]+)"\]/);if(match)element.setAttribute(match[1],match[2]);document.head.appendChild(element)}
    element.setAttribute(attribute,value);
  };
  const priceText=(item)=>item.priceOnRequest||!Number(item.price)?'Price on Request':new Intl.NumberFormat('en-US',{style:'currency',currency:item.currency||'USD',maximumFractionDigits:0}).format(item.price);
  const availability=(value)=>{
    const raw=String(value||'On Request').toLowerCase();
    if(raw.includes('unavailable'))return {label:'Currently Unavailable',className:'availability-unavailable'};
    if(raw.includes('limited'))return {label:'Limited Availability',className:'availability-limited'};
    if(raw==='available'||raw.includes('in stock'))return {label:'Available',className:'availability-available'};
    return {label:'On Request',className:'availability-request'};
  };

  if(!product){
    mount.innerHTML=`<section class="not-found"><div class="eyebrow">LE FUSIL Collection</div><h1>Product Not Found</h1><p>The requested item could not be found. Explore the current collection or speak with the boutique for personal assistance.</p><div class="not-found-actions"><a class="btn btn-dark" href="shop.html">Return to Collection</a><a class="btn btn-outline" href="contact.html">Contact the Boutique</a></div></section>`;
    document.querySelector('#mobileProductBar')?.remove();
    document.title='Product Not Found | LE FUSIL';
    upsertMeta('meta[name="robots"]','content','noindex, follow');
    return;
  }

  const images=[...(Array.isArray(product.images)?product.images:[]),...(Array.isArray(product.gallery)?product.gallery:[]),product.image].filter(clean).filter((value,index,array)=>array.indexOf(value)===index);
  const gallery=images.length?images:[null];
  const status=availability(product.availability);
  const reference=product.sku||`LF-${String(product.id).padStart(4,'0')}`;
  const productLabel=String(product.name).toLowerCase().startsWith(String(product.brand).toLowerCase())?product.name:`${product.brand} ${product.name}`;
  const calibre=product.specifications?.Gauge||product.specifications?.Caliber;
  const introMeta=[product.category,calibre,product.origin].filter(clean);
  const description=product.description||product.shortDescription||'Contact the boutique for a complete product presentation.';
  const specs={Manufacturer:product.brand,Model:product.name,Category:product.category,...(product.specifications||{}),Origin:product.origin,Condition:product.condition,Reference:reference};
  const specRows=Object.entries(specs).filter(([,value])=>clean(value));
  const preferredRelated=products.filter(item=>item.id!==product.id&&(item.category===product.category||item.brand===product.brand));
  const related=[...preferredRelated,...products.filter(item=>item.id!==product.id&&!preferredRelated.some(match=>match.id===item.id))].filter((item,index,array)=>array.findIndex(match=>match.id===item.id)===index).slice(0,3);

  mount.innerHTML=`
    <nav class="product-breadcrumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><a href="shop.html">Collection</a><span aria-hidden="true">/</span><span aria-current="page">${escapeHtml(productLabel)}</span></nav>
    <section class="product-layout" aria-labelledby="productTitle">
      <div class="product-gallery" aria-label="Product gallery">
        <div class="gallery-main"><span class="gallery-placeholder" aria-hidden="true"></span><picture><source id="mainProductSource" type="image/webp"><img id="mainProductImage" alt="${escapeHtml(product.brand)} ${escapeHtml(product.name)} — view 1" fetchpriority="high" decoding="async"></picture><button type="button" class="fullscreen-button" data-open-lightbox>${icon('expand')} View Fullscreen</button></div>
        <div class="gallery-thumbs" role="tablist" aria-label="Choose product image">${gallery.map((image,index)=>`<button type="button" class="gallery-thumb" role="tab" aria-selected="${index===0}" aria-label="View image ${index+1} of ${gallery.length}" data-gallery-index="${index}"><span class="gallery-placeholder" aria-hidden="true"></span>${image?lefusilImages.thumb(image):''}</button>`).join('')}</div>
      </div>
      <aside class="product-info">
        <div class="info-intro"><div class="product-brand">${escapeHtml(product.brand||'LE FUSIL')}</div><h1 class="product-title" id="productTitle">${escapeHtml(product.name)}</h1>${introMeta.length?`<p class="product-category">${introMeta.map(value=>escapeHtml(value)).join('<span aria-hidden="true"> · </span>')}</p>`:''}<div class="product-status-row"><span class="availability ${status.className}">${status.label}</span><span aria-hidden="true">·</span><span class="product-reference">Ref. ${escapeHtml(reference)}</span></div></div>
        <div class="product-purchase"><p class="product-price${product.priceOnRequest||!Number(product.price)?' price-on-request':''}">${priceText(product)}</p><p class="product-summary">${escapeHtml(product.shortDescription||description)}</p><div class="product-actions"><button type="button" class="product-action product-action-primary" data-open-inquiry>Request Availability</button><a class="product-action" href="contact.html?product=${encodeURIComponent(product.slug||product.id)}">Contact the Boutique</a><div class="product-utility-row"><button type="button" class="product-action product-icon" data-product-shortlist data-shortlist="${product.id}" aria-label="Add ${escapeHtml(product.name)} to shortlist">${icon('heart')} <span>Add to Shortlist</span></button><button type="button" class="product-action product-icon share-button" data-share>${icon('share')} Share</button></div></div><div class="product-service-note">${escapeHtml(product.legalNotice||'Availability and eligibility are confirmed directly by the boutique through applicable in-store procedures.')}</div></div>
      </aside>
    </section>
    ${specRows.length?`<section class="product-section specifications-section"><div class="section-heading"><div class="eyebrow">Product Details</div><h2>Technical Specifications</h2></div><dl class="spec-list">${specRows.map(([label,value])=>`<div class="spec-row"><dt class="spec-label">${escapeHtml(label)}</dt><dd class="spec-value">${escapeHtml(value)}</dd></div>`).join('')}</dl></section>`:''}
    <section class="product-section compliance-section"><div class="section-heading"><div class="eyebrow">Boutique Service</div><h2>Private, informed and responsible.</h2><p>LE FUSIL presents regulated products for consultation and inquiry, not automatic online sale.</p></div><div class="compliance-grid"><article class="compliance-item"><div class="feature-icon">${icon('guidance')}</div><h3>Private Consultation</h3><p>Receive personal product guidance directly from the boutique team.</p></article><article class="compliance-item"><div class="feature-icon">${icon('verified')}</div><h3>Verified Availability</h3><p>Final availability is confirmed by the store at the time of inquiry.</p></article><article class="compliance-item"><div class="feature-icon">${icon('compliance')}</div><h3>Regulatory Compliance</h3><p>Local requirements and eligibility verification apply to regulated products.</p></article></div></section>
    ${related.length?`<section class="product-section"><div class="section-heading"><div class="eyebrow">Selected Alternatives</div><h2>You May Also Consider</h2></div><div class="products-grid related-products">${related.map(productCard).join('')}</div></section>`:''}`;

  const mainImage=document.querySelector('#mainProductImage');
  const mainSource=document.querySelector('#mainProductSource');
  const thumbs=[...document.querySelectorAll('[data-gallery-index]')];
  const lightbox=document.querySelector('#lightbox');
  const lightboxImage=document.querySelector('#lightboxImage');
  const lightboxSource=document.querySelector('#lightboxSource');
  const lightboxCount=document.querySelector('#lightboxCount');
  const lightboxPrev=document.querySelector('[data-lightbox-prev]');
  const lightboxNext=document.querySelector('[data-lightbox-next]');
  const inquiry=document.querySelector('#inquiryModal');
  const form=document.querySelector('#inquiryForm');
  let currentIndex=0;
  let returnFocus=null;

  if(gallery.length<2){
    [lightboxPrev,lightboxNext].forEach(control=>{control.hidden=true;control.disabled=true});
  }

  function setImage(index){
    currentIndex=(index+gallery.length)%gallery.length;
    const source=gallery[currentIndex];
    if(source){mainSource.srcset=lefusilImages.optimized(source,1600);mainImage.src=source;mainImage.hidden=false}else{mainSource.removeAttribute('srcset');mainImage.removeAttribute('src');mainImage.hidden=true}
    mainImage.closest('.gallery-main')?.classList.toggle('has-image',Boolean(source));
    mainImage.alt=`${product.brand} ${product.name} — view ${currentIndex+1}`;
    thumbs.forEach((thumb,thumbIndex)=>thumb.setAttribute('aria-selected',String(thumbIndex===currentIndex)));
    if(lightbox.classList.contains('open'))updateLightbox();
  }
  function hideBrokenImage(event){const image=event.currentTarget,fallback=product.image,usingFallback=fallback&&image.src===new URL(fallback,location.href).href;if(fallback&&!usingFallback){(image===mainImage?mainSource:lightboxSource).removeAttribute('srcset');image.src=fallback;image.hidden=false;return}image.hidden=true;image.removeAttribute('src');image.closest('.gallery-main,.lightbox-stage')?.classList.remove('has-image')}
  function updateLightbox(){
    const source=gallery[currentIndex];
    if(source){lightboxSource.srcset=lefusilImages.optimized(source,1600);lightboxImage.src=source;lightboxImage.hidden=false}else{lightboxSource.removeAttribute('srcset');lightboxImage.removeAttribute('src');lightboxImage.hidden=true}
    lightboxImage.closest('.lightbox-stage')?.classList.toggle('has-image',Boolean(source));
    lightboxImage.alt=`${product.brand} ${product.name} — fullscreen view ${currentIndex+1}`;
    lightboxCount.textContent=`${currentIndex+1} / ${gallery.length}`;
  }
  function openLayer(layer,opener){
    returnFocus=opener||document.activeElement;layer.classList.add('open');layer.setAttribute('aria-hidden','false');document.body.classList.add('lock','modal-open');setTimeout(()=>layer.querySelector('button,input,select,textarea,[tabindex]')?.focus(),20);
  }
  function closeLayer(layer){
    layer.classList.remove('open');layer.setAttribute('aria-hidden','true');document.body.classList.remove('lock','modal-open');returnFocus?.focus();
  }
  function trapFocus(event,layer){
    if(event.key!=='Tab')return;
    const focusable=[...layer.querySelectorAll('button,input,select,textarea,a[href],[tabindex]:not([tabindex="-1"])')].filter(element=>!element.disabled&&!element.hidden);
    if(!focusable.length)return;
    const first=focusable[0],last=focusable[focusable.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
    if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  }
  function syncProductShortlist(){
    const saved=JSON.parse(localStorage.getItem('lefusil_shortlist')||'[]');
    const button=document.querySelector('[data-product-shortlist]');
    if(!button)return;
    const active=saved.includes(product.id);button.classList.toggle('active',active);button.querySelector('span').textContent=active?'Added to Shortlist':'Add to Shortlist';button.setAttribute('aria-label',`${active?'Remove':'Add'} ${product.name} ${active?'from':'to'} shortlist`);
  }
  thumbs.forEach((thumb,index)=>{
    thumb.addEventListener('click',()=>setImage(index));
    thumb.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();const next=(index+(event.key==='ArrowRight'?1:-1)+thumbs.length)%thumbs.length;thumbs[next].focus();setImage(next)}});
  });
  mainImage.addEventListener('error',hideBrokenImage);
  lightboxImage.addEventListener('error',hideBrokenImage);
  document.querySelector('[data-open-lightbox]').addEventListener('click',event=>{updateLightbox();openLayer(lightbox,event.currentTarget)});
  document.querySelector('[data-lightbox-close]').addEventListener('click',()=>closeLayer(lightbox));
  lightboxPrev.addEventListener('click',()=>setImage(currentIndex-1));
  lightboxNext.addEventListener('click',()=>setImage(currentIndex+1));
  document.querySelectorAll('[data-open-inquiry]').forEach(button=>button.addEventListener('click',event=>openLayer(inquiry,event.currentTarget)));
  document.querySelectorAll('[data-inquiry-close]').forEach(button=>button.addEventListener('click',()=>closeLayer(inquiry)));
  document.querySelector('[data-product-shortlist]').addEventListener('click',()=>setTimeout(syncProductShortlist));
  document.querySelector('[data-share]').addEventListener('click',async()=>{
    const shareData={title:`${product.brand} ${product.name} | LE FUSIL`,text:product.shortDescription||description,url:location.href};
    try{if(navigator.share)await navigator.share(shareData);else{await navigator.clipboard.writeText(location.href);lefusilToast('Product link copied.')}}catch(error){if(error.name!=='AbortError')lefusilToast('The product link is ready to copy from your address bar.')}
  });
  form.message.value=`I would like to request availability for ${product.brand} ${product.name}\nReference: ${reference}\n${location.href}`;
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const data=new FormData(form),items=(()=>{try{return JSON.parse(localStorage.getItem('lefusil_admin_inquiries')||'[]')}catch{return[]}})();
    items.unshift({id:`inquiry-${Date.now()}-${Math.random().toString(16).slice(2,8)}`,createdAt:new Date().toISOString(),name:String(data.get('fullName')||''),email:String(data.get('email')||''),phone:String(data.get('phone')||''),preferredContact:String(data.get('contactMethod')||''),productSlug:String(product.slug||''),productName:`${product.brand} ${product.name}`,message:String(data.get('message')||''),status:'New',demo:true});
    localStorage.setItem('lefusil_admin_inquiries',JSON.stringify(items));
    // Demo only: connect an approved backend or email service here before production use.
    document.querySelector('#inquiryFormView').hidden=true;
    const success=document.querySelector('#inquirySuccess');success.hidden=false;success.focus();
  });
  document.addEventListener('keydown',event=>{
    const openLayerElement=document.querySelector('.product-lightbox.open,.inquiry-modal.open');
    if(!openLayerElement)return;
    if(event.key==='Escape'){event.preventDefault();closeLayer(openLayerElement);return}
    if(openLayerElement===lightbox&&event.key==='ArrowLeft'){event.preventDefault();setImage(currentIndex-1)}
    if(openLayerElement===lightbox&&event.key==='ArrowRight'){event.preventDefault();setImage(currentIndex+1)}
    trapFocus(event,openLayerElement);
  });

  document.querySelector('#mobileProductBar').innerHTML=`<div class="mobile-product-bar"><div class="mobile-product-price">${priceText(product)}</div><button type="button" class="mobile-request" data-open-inquiry>Request</button></div>`;
  document.querySelector('#mobileProductBar [data-open-inquiry]').addEventListener('click',event=>openLayer(inquiry,event.currentTarget));
  const mobileBar=document.querySelector('.mobile-product-bar');
  const footer=document.querySelector('.footer');
  if(footer&&mobileBar)new IntersectionObserver(entries=>mobileBar.classList.toggle('footer-visible',entries[0].isIntersecting),{threshold:.01}).observe(footer);
  syncShortlist();syncProductShortlist();setImage(0);

  const title=`${productLabel} | LE FUSIL`;
  const suppliedDescription=[product.shortDescription,product.description].find(value=>clean(value)&&!/^to be confirmed$/i.test(String(value).trim()));
  const metaDescription=(suppliedDescription||`Explore the ${product.brand} ${product.name}${product.category?` from the ${product.category} collection`:''} and request personal guidance from LE FUSIL.`).slice(0,155);
  const productUrl=`${productionBase}product.html?slug=${encodeURIComponent(product.slug)}`;
  document.title=title;
  document.querySelector('meta[name="description"]')?.setAttribute('content',metaDescription);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href',productUrl);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content',title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content',metaDescription);
  upsertMeta('meta[property="og:url"]','content',productUrl);
  upsertMeta('meta[property="og:image:alt"]','content',productLabel);
  upsertMeta('meta[name="twitter:title"]','content',title);
  upsertMeta('meta[name="twitter:description"]','content',metaDescription);
  const absoluteImages=images.map(image=>new URL(image,productionBase).href);
  if(absoluteImages[0]){
    document.querySelector('meta[property="og:image"]')?.setAttribute('content',absoluteImages[0]);
    upsertMeta('meta[name="twitter:image"]','content',absoluteImages[0]);
    const socialImage=new Image();socialImage.addEventListener('load',()=>{upsertMeta('meta[property="og:image:width"]','content',String(socialImage.naturalWidth));upsertMeta('meta[property="og:image:height"]','content',String(socialImage.naturalHeight))},{once:true});socialImage.src=absoluteImages[0];
  }
  const schema={"@context":"https://schema.org","@type":"Product",name:product.name,description:metaDescription,category:product.category,sku:product.sku||undefined,brand:product.brand?{"@type":"Brand",name:product.brand}:undefined,image:absoluteImages.length?absoluteImages:undefined,url:productUrl};
  if(Number.isFinite(product.price)&&product.price>0&&!product.priceOnRequest)schema.offers={"@type":"Offer",price:product.price,priceCurrency:product.currency||'USD',url:productUrl};
  Object.keys(schema).forEach(key=>schema[key]===undefined&&delete schema[key]);
  const schemaScript=document.createElement('script');schemaScript.type='application/ld+json';schemaScript.textContent=JSON.stringify(schema);document.head.appendChild(schemaScript);
  const breadcrumbs={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:'Home',item:productionBase},{"@type":"ListItem",position:2,name:'Collection',item:`${productionBase}shop.html`},{"@type":"ListItem",position:3,name:productLabel,item:productUrl}]};
  const breadcrumbScript=document.createElement('script');breadcrumbScript.type='application/ld+json';breadcrumbScript.textContent=JSON.stringify(breadcrumbs);document.head.appendChild(breadcrumbScript);
})();
