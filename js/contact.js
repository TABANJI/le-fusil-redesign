(function contactExperience(global){
  'use strict';
  const form=document.querySelector('#contactForm');if(!form)return;
  const products=global.LEFUSIL_PRODUCTS||[],params=new URLSearchParams(location.search),requested=params.get('product'),product=products.find(item=>item.slug===requested),source=params.get('source')||(product?'product':'contact');
  const price=item=>item&&Number(item.price)>0?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(item.price):'';
  const context=document.querySelector('[data-product-context]');
  function showContext(item){if(!context||!item)return;context.hidden=false;context.querySelector('img').src=item.image;context.querySelector('img').alt=`${item.brand} ${item.name}`;context.querySelector('[data-product-brand]').textContent=item.brand;context.querySelector('[data-product-name]').textContent=item.name;context.querySelector('[data-product-price]').textContent=price(item);form.elements.inquiryType.value='product_availability';form.elements.subject.value=`${item.brand} ${item.name}`;form.elements.message.value=`I would like to enquire about ${item.brand} ${item.name}.`;}
  if(product)showContext(product);
  context?.querySelector('[data-remove-product]')?.addEventListener('click',()=>{context.hidden=true;form.elements.inquiryType.value='';form.elements.subject.value='';form.elements.message.value='';});
  form.addEventListener('submit',event=>{
    event.preventDefault();if(form.dataset.submitting==='true')return;
    const rules={name:{required:true,max:100},inquiryType:{required:true},preferredContact:{required:true},email:{email:true,max:254},phone:{phone:true,max:40},subject:{required:true,max:120},message:{required:true,min:10,max:1500}};
    const errors=global.lefusilForms.requireContact(form,global.lefusilForms.errors(form,rules));if(!form.elements.consent.checked)errors.consent=global.lefusilI18n?.t('Consent is required.')||'Consent is required.';
    if(!global.lefusilForms.show(form,errors)){global.lefusilAnalytics?.track('contact_failed',{locale:global.LEFUSIL_LOCALE?.current||'en',sourcePage:'contact'});return;}
    form.dataset.submitting='true';const data=new FormData(form),id=`INQ-${Date.now().toString(36).toUpperCase()}`,locale=global.LEFUSIL_LOCALE?.current||'en';
    const record={id,createdAt:new Date().toISOString(),name:global.lefusilForms.clean(data.get('name'),100),email:global.lefusilForms.clean(data.get('email'),254).toLowerCase(),phone:global.lefusilForms.phone(data.get('phone')),preferredContact:global.lefusilForms.clean(data.get('preferredContact'),20),productSlug:!context?.hidden&&product?product.slug:'',productName:!context?.hidden&&product?`${product.brand} ${product.name}`:'',message:global.lefusilForms.clean(data.get('message'),1500),subject:global.lefusilForms.clean(data.get('subject'),120),status:'New',source,sourcePage:'contact',inquiryType:global.lefusilForms.clean(data.get('inquiryType'),40),locale,demo:true};
    try{const items=JSON.parse(localStorage.getItem('lefusil_admin_inquiries')||'[]');items.unshift(record);localStorage.setItem('lefusil_admin_inquiries',JSON.stringify(items));document.querySelector('#contactFormView').hidden=true;const success=document.querySelector('#contactSuccess');success.hidden=false;success.focus();global.lefusilAnalytics?.track('contact_submitted',{locale,sourcePage:'contact',inquiryType:record.inquiryType,productSlug:record.productSlug});}
    catch{form.dataset.submitting='false';const status=document.querySelector('#contactStatus');status.hidden=false;status.textContent='Local demo storage is unavailable. Please try again.';status.focus();}
  });
})(window);
