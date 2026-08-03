(function favoritesPage(global){
  'use strict';
  const mount=document.querySelector('#favoritesContent');if(!mount)return;
  const products=global.LEFUSIL_PRODUCTS||[];
  const escape=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const savedIds=()=>{try{const value=JSON.parse(localStorage.getItem('lefusil_shortlist')||'[]');return [...new Set((Array.isArray(value)?value:[]).map(Number).filter(Number.isFinite))]}catch{return[]}};
  function render(){
    const ids=savedIds(),saved=ids.map(id=>products.find(product=>Number(product.id)===id)).filter(Boolean);
    if(!saved.length){mount.innerHTML='<div class="favorites-empty"><div class="eyebrow">SAVED PIECES</div><h2>No saved pieces yet.</h2><p>Explore the collection and save pieces for later.</p><a class="btn" href="shop.html">Explore the Collection</a></div>';return}
    mount.innerHTML=`<div class="favorites-heading"><span>${saved.length} Saved ${saved.length===1?'Piece':'Pieces'}</span></div><div class="favorites-list">${saved.map(product=>{const url=`product.html?slug=${encodeURIComponent(product.slug)}`;return `<article class="favorite-item"><a class="favorite-media" href="${url}" aria-label="View ${escape(product.brand)} ${escape(product.name)}"><img src="${escape(product.image)}" alt="${escape(product.brand)} ${escape(product.name)}" loading="lazy" decoding="async"></a><div class="favorite-copy"><span>${escape(product.brand)}</span><h2><a href="${url}">${escape(product.name)}</a></h2><p>${escape(product.category)}</p></div><div class="favorite-actions"><a class="btn btn-dark" href="${url}">View Piece</a><button type="button" data-remove-favorite="${product.id}">Remove</button></div></article>`}).join('')}</div>`;
    mount.querySelectorAll('[data-remove-favorite]').forEach(button=>button.addEventListener('click',()=>global.toggleShortlist(Number(button.dataset.removeFavorite))));
  }
  addEventListener('lefusil:shortlist',render);addEventListener('storage',event=>{if(event.key==='lefusil_shortlist')render()});render();
})(window);
