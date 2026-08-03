(function contactExperience(global){
  'use strict';
  const form=document.querySelector('#contactForm');if(!form)return;
  const products=global.LEFUSIL_PRODUCTS||[],params=new URLSearchParams(location.search),requested=params.get('product');
  let selectedProduct=products.find(item=>item.slug===requested)||null;
  const source=params.get('source')||(selectedProduct?'product':'contact');
  const price=item=>item&&Number(item.price)>0?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(item.price):'Price on Request';
  const context=document.querySelector('[data-product-context]');
  function updateProductUrl(slug=''){const next=new URL(location.href);slug?next.searchParams.set('product',slug):next.searchParams.delete('product');history.replaceState(history.state,'',`${next.pathname}${next.search}${next.hash}`)}
  function showContext(item,{syncUrl=true}={}){
    selectedProduct=item||null;
    if(!context)return;
    if(!selectedProduct){context.hidden=true;const image=context.querySelector('img');image.removeAttribute('src');image.alt='';context.querySelector('[data-product-brand]').textContent='';context.querySelector('[data-product-name]').textContent='';context.querySelector('[data-product-price]').textContent='';if(syncUrl)updateProductUrl();return}
    context.hidden=false;context.querySelector('img').src=selectedProduct.image;context.querySelector('img').alt=`${selectedProduct.brand} ${selectedProduct.name}`;context.querySelector('[data-product-brand]').textContent=selectedProduct.brand;context.querySelector('[data-product-name]').textContent=selectedProduct.name;context.querySelector('[data-product-price]').textContent=price(selectedProduct);form.elements.inquiryType.value='product_availability';form.elements.subject.value=`${selectedProduct.brand} ${selectedProduct.name}`;form.elements.message.value=`I would like to enquire about ${selectedProduct.brand} ${selectedProduct.name}.`;if(syncUrl)updateProductUrl(selectedProduct.slug);
  }
  if(requested&&!selectedProduct)updateProductUrl();
  showContext(selectedProduct,{syncUrl:false});
  context?.querySelector('[data-remove-product]')?.addEventListener('click',()=>{showContext(null);form.elements.inquiryType.value='';form.elements.subject.value='';form.elements.message.value=''});
  form.addEventListener('submit',event=>{
    event.preventDefault();if(form.dataset.submitting==='true')return;
    const rules={firstName:{required:true,max:50},lastName:{required:true,max:50},email:{required:true,email:true,max:254},phone:{phone:true,max:40},subject:{required:true,max:120},message:{required:true,min:10,max:1500}};
    const errors=global.lefusilForms.errors(form,rules);if(!form.elements.consent.checked)errors.consent=global.lefusilI18n?.t('Consent is required.')||'Consent is required.';
    if(!global.lefusilForms.show(form,errors)){global.lefusilAnalytics?.track('contact_failed',{locale:global.LEFUSIL_LOCALE?.current||'en',sourcePage:'contact'});return}
    form.dataset.submitting='true';const data=new FormData(form),id=`INQ-${Date.now().toString(36).toUpperCase()}`,locale=global.LEFUSIL_LOCALE?.current||'en',firstName=global.lefusilForms.clean(data.get('firstName'),50),lastName=global.lefusilForms.clean(data.get('lastName'),50);
    const record={id,createdAt:new Date().toISOString(),firstName,lastName,name:`${firstName} ${lastName}`.trim(),email:global.lefusilForms.clean(data.get('email'),254).toLowerCase(),phone:global.lefusilForms.phone(data.get('phone')),preferredContact:'Email',productSlug:selectedProduct?.slug||'',productName:selectedProduct?`${selectedProduct.brand} ${selectedProduct.name}`:'',message:global.lefusilForms.clean(data.get('message'),1500),subject:global.lefusilForms.clean(data.get('subject'),120),status:'New',source,sourcePage:'contact',inquiryType:global.lefusilForms.clean(data.get('inquiryType'),40),locale,demo:true};
    try{const items=JSON.parse(localStorage.getItem('lefusil_admin_inquiries')||'[]');items.unshift(record);localStorage.setItem('lefusil_admin_inquiries',JSON.stringify(items));form.reset();document.querySelector('#contactFormView').hidden=true;const success=document.querySelector('#contactSuccess');success.hidden=false;success.focus();global.lefusilAnalytics?.track('contact_submitted',{locale,sourcePage:'contact',inquiryType:record.inquiryType,productSlug:record.productSlug})}
    catch{form.dataset.submitting='false';const status=document.querySelector('#contactStatus');status.hidden=false;status.textContent='Local storage is unavailable. Please try again.';status.focus()}
  });
})(window);
