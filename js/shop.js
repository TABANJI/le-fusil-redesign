(function collectionPage(){
  const rawProducts=window.LEFUSIL_PRODUCTS||[];
  const clean=value=>value===undefined||value===null?'':String(value).trim();
  const slugify=value=>clean(value).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const availabilityOf=value=>{const text=clean(value).toLowerCase();if(text.includes('unavailable'))return 'unavailable';if(text.includes('limited'))return 'limited';if(text==='available'||text.includes('in stock'))return 'available';return 'request'};
  const products=rawProducts.map((item,index)=>{const rawCalibre=clean(item.specifications?.Gauge||item.specifications?.Caliber),calibre=/to be confirmed/i.test(rawCalibre)?'':rawCalibre;return {...item,_index:index,id:item.id??`product-${index}`,slug:clean(item.slug)||`product-${index}`,name:clean(item.name)||'Product details on request',brand:clean(item.brand)||'LE FUSIL',category:clean(item.category)||'Uncategorised',calibre,price:Number(item.price)>0?Number(item.price):null,priceOnRequest:Boolean(item.priceOnRequest)||!(Number(item.price)>0),availabilityKey:availabilityOf(item.availability),searchable:[item.name,item.brand,item.category,calibre,item.sku,item.shortDescription,...(Array.isArray(item.tags)?item.tags:[])].map(clean).join(' ').toLowerCase()}});
  const grid=document.querySelector('#productGrid');
  const continuationGrid=document.querySelector('#productGridContinuation');
  const collectionEditorial=document.querySelector('#collectionEditorial');
  const form=document.querySelector('#filterForm');
  if(!grid||!form)return;

  const icons={chevron:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>'};
  const availabilityLabels={available:'Available',limited:'Limited Availability',request:'On Request',unavailable:'Currently Unavailable'};
  const priceLabels={under1000:'Under $1,000',mid:'$1,000–$2,500',upper:'$2,500–$5,000',above5000:'Above $5,000',request:'Price on Request'};
  const urlKeys=['category','brand','calibre','availability','price','condition'];
  const params=new URLSearchParams(location.search);
  const fromParam=key=>params.get(key)?.split(',').map(clean).filter(Boolean)||[];
  let state={category:fromParam('category'),brand:fromParam('brand'),calibre:fromParam('calibre'),availability:fromParam('availability'),price:fromParam('price'),condition:fromParam('condition'),origin:fromParam('origin'),featured:params.get('featured')==='true',q:clean(params.get('q')),sort:params.get('sort')||'featured'};
  const copyState=source=>({...source,...Object.fromEntries([...urlKeys,'origin'].map(key=>[key,[...(source[key]||[])]]))});
  let draft=copyState(state);
  let view=localStorage.getItem('lefusil_catalog_view')==='two'?'two':'three';
  const isDesktopFourColumnView=()=>window.innerWidth>800&&view==='three';
  const pageSizeForCurrentView=()=>isDesktopFourColumnView()?8:matchMedia('(max-width:768px)').matches?8:12;
  const initialVisibleCountForCurrentView=()=>isDesktopFourColumnView()?16:pageSizeForCurrentView();
  let visibleCount=initialVisibleCountForCurrentView();
  let filterTimer;
  let drawerReturnFocus;
  let drawerHistoryActive=false;

  const uniqueCounts=key=>products.reduce((map,item)=>{const value=clean(item[key]);if(value)map.set(value,(map.get(value)||0)+1);return map},new Map());
  const categoryCounts=uniqueCounts('category');
  const brandCounts=uniqueCounts('brand');
  const calibreCounts=uniqueCounts('calibre');
  const conditionCounts=uniqueCounts('condition');
  const originCounts=uniqueCounts('origin');
  const optionMarkup=(name,value,label,count)=>`<label class="filter-option"><input type="checkbox" name="${name}" value="${value}"><span class="custom-check" aria-hidden="true"></span><span>${label}</span>${count!==undefined?`<span class="filter-count">${count}</span>`:''}</label>`;
  const groupMarkup=(id,title,content)=>`<section class="filter-group" data-filter-group="${id}"><button type="button" class="filter-heading" data-accordion-trigger aria-expanded="false" aria-controls="filter-${id}"><span class="filter-heading-label">${title}<span class="filter-section-count" aria-label="0 selected" hidden></span></span>${icons.chevron}</button><div class="filter-options" id="filter-${id}">${content}</div></section>`;
  const availabilityCounts=products.reduce((map,item)=>(map[item.availabilityKey]=(map[item.availabilityKey]||0)+1,map),{});
  let groups='';
  if(categoryCounts.size)groups+=groupMarkup('category','Category',[...categoryCounts].map(([value,count])=>optionMarkup('category',value,value,count)).join(''));
  if(brandCounts.size)groups+=groupMarkup('brand','Brand',[...brandCounts].map(([value,count])=>optionMarkup('brand',value,value,count)).join(''));
  if(calibreCounts.size)groups+=groupMarkup('calibre','Calibre',[...calibreCounts].map(([value,count])=>optionMarkup('calibre',value,value,count)).join(''));
  groups+=groupMarkup('availability','Availability',Object.entries(availabilityLabels).filter(([value])=>availabilityCounts[value]).map(([value,label])=>optionMarkup('availability',value,label,availabilityCounts[value])).join(''));
  groups+=groupMarkup('price','Price',Object.entries(priceLabels).map(([value,label])=>optionMarkup('price',value,label)).join(''));
  if(conditionCounts.size)groups+=groupMarkup('condition','Condition',[...conditionCounts].map(([value,count])=>optionMarkup('condition',value,value,count)).join(''));
  if(originCounts.size)groups+=groupMarkup('origin','Origin',[...originCounts].map(([value,count])=>optionMarkup('origin',value,value,count)).join(''));
  if(products.some(item=>item.featured))groups+=groupMarkup('signature','Signature Selection',optionMarkup('featured','true','Featured pieces',products.filter(item=>item.featured).length));
  const filterGroups=document.querySelector('#filterGroups');filterGroups.innerHTML=groups;filterGroups.dataset.accordionGroup='filters';document.querySelectorAll('.filter-heading').forEach((button,index)=>window.LEFUSIL_ACCORDION?.prepare(button,index===0));

  const selected=(key,value)=>state[key]?.some(item=>item.toLowerCase()===value.toLowerCase());
  function syncForm(source=state){
    form.querySelectorAll('input[type=checkbox]').forEach(input=>{input.checked=input.name==='featured'?source.featured:source[input.name]?.some(value=>value.toLowerCase()===input.value.toLowerCase())});
  }
  function readForm(){
    const next={...state};
    [...urlKeys,'origin'].forEach(key=>next[key]=[...form.querySelectorAll(`input[name="${key}"]:checked`)].map(input=>input.value));
    next.featured=Boolean(form.querySelector('input[name=featured]:checked'));
    return next;
  }
  function priceMatches(item,buckets){
    if(!buckets.length)return true;
    return buckets.some(bucket=>bucket==='request'?item.priceOnRequest:bucket==='under1000'?item.price!==null&&item.price<1000:bucket==='mid'?item.price>=1000&&item.price<=2500:bucket==='upper'?item.price>2500&&item.price<=5000:bucket==='above5000'?item.price>5000:false);
  }
  function filtered(source=state){
    return products.filter(item=>(!source.q||item.searchable.includes(source.q.toLowerCase()))&&(!source.category.length||source.category.some(value=>value.toLowerCase()===item.category.toLowerCase()))&&(!source.brand.length||source.brand.some(value=>value.toLowerCase()===item.brand.toLowerCase()))&&(!source.calibre.length||source.calibre.some(value=>value.toLowerCase()===item.calibre.toLowerCase()))&&(!source.availability.length||source.availability.includes(item.availabilityKey))&&priceMatches(item,source.price)&&(!source.condition.length||source.condition.some(value=>value.toLowerCase()===clean(item.condition).toLowerCase()))&&(!(source.origin||[]).length||source.origin.some(value=>value.toLowerCase()===clean(item.origin).toLowerCase()))&&(!source.featured||item.featured));
  }
  function sorted(list){
    const result=[...list];
    const text=(a,b)=>a.name.localeCompare(b.name,undefined,{sensitivity:'base'});
    if(state.sort==='name-asc')result.sort(text);
    else if(state.sort==='name-desc')result.sort((a,b)=>text(b,a));
    else if(state.sort==='price-asc')result.sort((a,b)=>a.price===null?1:b.price===null?-1:a.price-b.price);
    else if(state.sort==='price-desc')result.sort((a,b)=>a.price===null?1:b.price===null?-1:b.price-a.price);
    else if(state.sort==='maker-asc')result.sort((a,b)=>a.brand.localeCompare(b.brand,undefined,{sensitivity:'base'})||text(a,b));
    else result.sort((a,b)=>Number(Boolean(b.featured))-Number(Boolean(a.featured))||a._index-b._index);
    return result;
  }
  function updateUrl(mode='push'){
    const next=new URLSearchParams();
    urlKeys.forEach(key=>state[key]?.length&&next.set(key,state[key].join(',')));
    if((state.origin||[]).length)next.set('origin',state.origin.join(','));
    if(state.featured)next.set('featured','true');
    if(state.q)next.set('q',state.q);
    if(state.sort!=='featured')next.set('sort',state.sort);
    history[mode==='replace'?'replaceState':'pushState']({},'',`${location.pathname}${next.toString()?`?${next}`:''}`);
  }
  function activeCount(source=state){return urlKeys.reduce((count,key)=>count+(source[key]?.length||0),0)+(source.origin?.length||0)+(source.featured?1:0)}
  function updateDraftUi(){
    const resultCount=filtered(draft).length,selectedCount=activeCount(draft);
    const apply=document.querySelector('#applyFilters');
    apply.textContent=`Show ${resultCount} ${resultCount===1?'Piece':'Pieces'}`;
    document.querySelector('#drawerSelectedCount').textContent=selectedCount?`${selectedCount} selected`:'No filters selected';
    document.querySelectorAll('[data-filter-group]').forEach(group=>{const key=group.dataset.filterGroup,count=key==='signature'?(draft.featured?1:0):(draft[key]?.length||0),badge=group.querySelector('.filter-section-count');badge.hidden=!count;badge.textContent=count||'';badge.setAttribute('aria-label',`${count} selected`)});
  }
  function renderChips(){
    const chips=[];
    [...urlKeys,'origin'].forEach(key=>(state[key]||[]).forEach(value=>chips.push({key,value,label:key==='availability'?availabilityLabels[value]:key==='price'?priceLabels[value]:value})));
    if(state.featured)chips.push({key:'featured',value:'true',label:'Featured'});
    if(state.q)chips.push({key:'q',value:state.q,label:`Search: ${state.q}`});
    const wrap=document.querySelector('#activeFilters');
    wrap.hidden=!chips.length;
    wrap.innerHTML=chips.map(chip=>`<button type="button" class="filter-chip" data-remove-filter="${chip.key}" data-filter-value="${encodeURIComponent(chip.value)}" aria-label="Remove ${chip.label} filter">${chip.label} ×</button>`).join('')+(chips.length?'<button type="button" class="clear-all" data-clear-all>Clear All</button>':'');
  }
  function render(){
    const list=sorted(filtered());
    const visibleItems=list.slice(0,visibleCount);
    const fourColumn=isDesktopFourColumnView(),fragment=document.createDocumentFragment(),continuationFragment=document.createDocumentFragment();
    visibleItems.forEach((item,index)=>{const template=document.createElement('template');template.innerHTML=productCard(item).trim();const card=template.content.firstElementChild;if(fourColumn&&index>=8)continuationFragment.appendChild(card);else{fragment.appendChild(card);if(!fourColumn&&index===5&&!state.q&&!activeCount()){const editorial=document.createElement('aside');editorial.className='collection-editorial-break';editorial.innerHTML=collectionEditorial.innerHTML;fragment.appendChild(editorial)}}});
    grid.replaceChildren(fragment);
    continuationGrid.replaceChildren(continuationFragment);
    grid.setAttribute('aria-busy','false');
    document.querySelectorAll('#productGrid .card-secondary,#productGridContinuation .card-secondary').forEach(link=>{const url=new URL(link.href,location.href);url.searchParams.set('source','collection');url.searchParams.set('lang',window.LEFUSIL_LOCALE?.current||'en');link.href=`${url.pathname.split('/').pop()}?${url.searchParams}`});
    grid.classList.toggle('view-two',view==='two');
    continuationGrid.classList.toggle('view-two',view==='two');
    const showStandaloneEditorial=fourColumn&&!state.q&&!activeCount()&&visibleItems.length>=8;
    collectionEditorial.hidden=!showStandaloneEditorial;
    continuationGrid.hidden=continuationGrid.childElementCount===0;
    document.querySelectorAll('[data-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.view===view)));
    document.querySelector('#resultCount').textContent=`${list.length} ${list.length===1?'Piece':'Pieces'}`;
    document.querySelector('#collectionLabel').textContent=state.category.length===1?state.category[0]:'All Collection';
    const count=activeCount(),mobileCount=document.querySelector('#mobileFilterCount');mobileCount.textContent=count||'';mobileCount.hidden=!count;
    document.querySelector('#toolbarClear').hidden=count===0&&!state.q;
    const empty=document.querySelector('#emptyState');empty.hidden=list.length>0;grid.hidden=list.length===0;if(list.length===0){collectionEditorial.hidden=true;continuationGrid.hidden=true}
    const more=document.querySelector('#loadMore');more.hidden=list.length<=visibleItems.length;more.dataset.remaining=String(list.length-visibleItems.length);
    renderChips();syncShortlist();
  }
  function clearAll(push=true){state={category:[],brand:[],calibre:[],availability:[],price:[],condition:[],origin:[],featured:false,q:'',sort:'featured'};draft=copyState(state);visibleCount=initialVisibleCountForCurrentView();document.querySelector('#shopSearch').value='';document.querySelector('#sort').value='featured';document.querySelector('#searchClear').hidden=true;syncForm();if(push)updateUrl();render()}
  const desktopFilterLayout=matchMedia('(min-width:801px)'),filterToggle=document.querySelector('#openFilters'),filterToggleLabel=filterToggle.querySelector('.filter-toggle-label'),filterToggleIcon=filterToggle.querySelector('.filter-toggle-icon');
  function syncFilterToggle(open){filterToggle.setAttribute('aria-expanded',String(open));filterToggleLabel.textContent=open?'Close':desktopFilterLayout.matches?'Filter':'Filters';filterToggleIcon.textContent=open?'−':'+'}
  function hideDrawer(apply=false){const panel=document.querySelector('#filters'),overlay=document.querySelector('#filterOverlay');if(!apply){draft=copyState(state);syncForm(state);updateDraftUi()}panel.classList.remove('open');panel.setAttribute('aria-hidden','true');panel.removeAttribute('role');panel.removeAttribute('aria-modal');overlay.classList.remove('open');overlay.hidden=true;syncFilterToggle(false);document.body.classList.remove('lock');drawerReturnFocus?.focus()}
  function closeDrawer(apply=false){if(drawerHistoryActive&&!apply){history.back();return}hideDrawer(apply)}
  function openDrawer(){draft=copyState(state);syncForm(draft);updateDraftUi();const panel=document.querySelector('#filters'),overlay=document.querySelector('#filterOverlay');drawerReturnFocus=document.activeElement;panel.classList.add('open');panel.setAttribute('aria-hidden','false');syncFilterToggle(true);if(desktopFilterLayout.matches){setTimeout(()=>document.querySelector('.filter-heading')?.focus(),30);return}panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');overlay.hidden=false;requestAnimationFrame(()=>overlay.classList.add('open'));document.body.classList.add('lock');history.pushState({...history.state,filterDrawer:true},'',location.href);drawerHistoryActive=true;setTimeout(()=>document.querySelector('#closeFilters').focus(),30)}
  function trapDrawer(event){const panel=document.querySelector('#filters.open');if(!panel||event.key!=='Tab')return;const focusable=[...panel.querySelectorAll('button,input,select,[tabindex]:not([tabindex="-1"])')].filter(element=>!element.disabled&&!element.hidden&&element.offsetParent!==null);const first=focusable[0],last=focusable[focusable.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}
  form.addEventListener('change',()=>{if(matchMedia('(max-width:800px)').matches){draft=readForm();updateDraftUi()}else{state=readForm();visibleCount=initialVisibleCountForCurrentView();updateUrl();render()}});
  const search=document.querySelector('#shopSearch');search.value=state.q;document.querySelector('#searchClear').hidden=!state.q;
  search.addEventListener('input',()=>{document.querySelector('#searchClear').hidden=!search.value;clearTimeout(filterTimer);filterTimer=setTimeout(()=>{state.q=clean(search.value);visibleCount=initialVisibleCountForCurrentView();updateUrl('replace');render()},200)});
  search.addEventListener('keydown',event=>{if(event.key==='Escape'&&search.value){search.value='';search.dispatchEvent(new Event('input'))}});
  document.querySelector('#searchClear').addEventListener('click',()=>{search.value='';search.focus();search.dispatchEvent(new Event('input'))});
  const sort=document.querySelector('#sort');sort.value=state.sort;sort.addEventListener('change',()=>{state.sort=sort.value;updateUrl();render()});
  document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{view=button.dataset.view;if(isDesktopFourColumnView())visibleCount=Math.max(16,Math.ceil(visibleCount/4)*4);localStorage.setItem('lefusil_catalog_view',view);render()}));
  document.querySelector('#activeFilters').addEventListener('click',event=>{const remove=event.target.closest('[data-remove-filter]');if(event.target.closest('[data-clear-all]')){clearAll();return}if(!remove)return;const key=remove.dataset.removeFilter,value=decodeURIComponent(remove.dataset.filterValue);if(key==='featured')state.featured=false;else if(key==='q'){state.q='';search.value='';document.querySelector('#searchClear').hidden=true}else state[key]=state[key].filter(item=>item!==value);syncForm();updateUrl();render()});
  document.querySelector('#emptyClear').addEventListener('click',()=>clearAll());
  document.querySelector('#toolbarClear').addEventListener('click',()=>clearAll());
  filterToggle.addEventListener('click',()=>document.querySelector('#filters').classList.contains('open')?closeDrawer():openDrawer());
  document.querySelector('#closeFilters').addEventListener('click',()=>closeDrawer());
  document.querySelector('#filterOverlay').addEventListener('click',()=>closeDrawer());
  document.querySelector('#drawerClear').addEventListener('click',()=>{draft={category:[],brand:[],calibre:[],availability:[],price:[],condition:[],origin:[],featured:false,q:state.q,sort:state.sort};syncForm(draft);updateDraftUi()});
  document.querySelector('#applyFilters').addEventListener('click',()=>{state=copyState({...draft,q:state.q,sort:state.sort});visibleCount=initialVisibleCountForCurrentView();updateUrl('replace');drawerHistoryActive=false;render();hideDrawer(true);requestAnimationFrame(()=>document.querySelector('.catalog-results').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'}))});
  document.querySelector('#loadMore').addEventListener('click',()=>{const before=Math.min(visibleCount,filtered().length);visibleCount+=pageSizeForCurrentView();render();const added=Math.min(visibleCount,filtered().length)-before;document.querySelector('#loadAnnouncement').textContent=`${added} additional pieces displayed.`});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&document.querySelector('#filters.open')){event.preventDefault();closeDrawer()}trapDrawer(event)});
  addEventListener('popstate',()=>{if(drawerHistoryActive||document.querySelector('#filters.open')){drawerHistoryActive=false;hideDrawer(false);return}const current=new URLSearchParams(location.search);state={category:current.get('category')?.split(',').map(clean).filter(Boolean)||[],brand:current.get('brand')?.split(',').map(clean).filter(Boolean)||[],calibre:current.get('calibre')?.split(',').map(clean).filter(Boolean)||[],availability:current.get('availability')?.split(',').map(clean).filter(Boolean)||[],price:current.get('price')?.split(',').map(clean).filter(Boolean)||[],condition:current.get('condition')?.split(',').map(clean).filter(Boolean)||[],origin:current.get('origin')?.split(',').map(clean).filter(Boolean)||[],featured:current.get('featured')==='true',q:clean(current.get('q')),sort:current.get('sort')||'featured'};search.value=state.q;document.querySelector('#searchClear').hidden=!state.q;sort.value=state.sort;syncForm();render()});

  document.querySelector('#filters').setAttribute('aria-hidden','true');
  if(desktopFilterLayout.matches)syncFilterToggle(false);
  desktopFilterLayout.addEventListener?.('change',()=>{const panel=document.querySelector('#filters');panel.classList.remove('open');panel.setAttribute('aria-hidden','true');syncFilterToggle(false)});
  syncForm();render();
  const productionBase='https://tabanji.github.io/le-fusil-redesign/';
  const itemList={"@context":"https://schema.org","@type":"CollectionPage",name:"Explore the Collection | LE FUSIL",url:`${productionBase}shop.html`,description:"Curated sporting arms, equipment and field essentials selected for personal showroom presentation.",mainEntity:{"@type":"ItemList",itemListElement:products.map((item,index)=>({"@type":"ListItem",position:index+1,url:`${productionBase}product.html?slug=${encodeURIComponent(item.slug)}`,name:item.name}))}};
  const schema=document.createElement('script');schema.type='application/ld+json';schema.textContent=JSON.stringify(itemList);document.head.appendChild(schema);
})();
