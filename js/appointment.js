(function appointmentExperience(global){
  'use strict';
  const form=document.querySelector('#appointmentForm');if(!form)return;
  const key='lefusil_appointments_v1',products=global.LEFUSIL_PRODUCTS||[],params=new URLSearchParams(location.search),requested=params.get('product'),source=params.get('source')||'appointment',locale=global.LEFUSIL_LOCALE?.current||'en';
  let selectedProduct=products.find(item=>item.slug===requested)||null;
  const price=item=>item&&Number(item.price)>0?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(item.price):'Price on Request';
  form.elements.product.innerHTML='<option value="">No specific product</option>'+products.map(item=>`<option value="${item.slug}">${item.brand} — ${item.name}</option>`).join('');
  form.elements.purpose.placeholder='Shotguns, ammunition, air rifles…';
  const fullNameField=form.elements.fullName,fullNameLabel=fullNameField.closest('label'),firstNameLabel=document.createElement('label'),lastNameLabel=document.createElement('label');
  firstNameLabel.innerHTML='First Name <span aria-hidden="true">*</span><input name="firstName" maxlength="50" autocomplete="given-name" required>';
  lastNameLabel.innerHTML='Last Name <span aria-hidden="true">*</span><input name="lastName" maxlength="50" autocomplete="family-name" required>';
  fullNameLabel.replaceWith(firstNameLabel,lastNameLabel);
  form.elements.country?.closest('label')?.remove();

  const summary=document.querySelector('#appointmentProduct');
  function updateProductUrl(slug=''){const next=new URL(location.href);slug?next.searchParams.set('product',slug):next.searchParams.delete('product');history.replaceState(history.state,'',`${next.pathname}${next.search}${next.hash}`)}
  function renderContext(item,{syncUrl=true}={}){
    selectedProduct=item||null;const image=summary.querySelector('img');
    if(!selectedProduct){summary.hidden=true;image.removeAttribute('src');image.alt='';summary.querySelector('[data-product-brand]').textContent='';summary.querySelector('[data-product-name]').textContent='';summary.querySelector('[data-product-price]').textContent='';form.elements.product.value='';if(syncUrl)updateProductUrl();return}
    summary.hidden=false;image.src=selectedProduct.image;image.alt=`${selectedProduct.brand} ${selectedProduct.name}`;summary.querySelector('[data-product-brand]').textContent=selectedProduct.brand;summary.querySelector('[data-product-name]').textContent=selectedProduct.name;summary.querySelector('[data-product-price]').textContent=price(selectedProduct);form.elements.product.value=selectedProduct.slug;if(syncUrl)updateProductUrl(selectedProduct.slug);
  }
  if(requested&&!selectedProduct)updateProductUrl();
  renderContext(selectedProduct,{syncUrl:false});
  form.elements.product.addEventListener('change',()=>renderContext(products.find(item=>item.slug===form.elements.product.value)||null));
  summary.querySelector('[data-remove-product]').addEventListener('click',()=>renderContext(null));
  addEventListener('pageshow',()=>{const slug=new URLSearchParams(location.search).get('product');renderContext(products.find(item=>item.slug===slug)||null,{syncUrl:false})});

  function updateContactRequirements(){const method=form.elements.preferredContact.value,emailRequired=method==='Email',phoneRequired=method==='Phone'||method==='WhatsApp';form.elements.email.required=emailRequired;form.elements.phone.required=phoneRequired;form.elements.email.setAttribute('aria-required',String(emailRequired));form.elements.phone.setAttribute('aria-required',String(phoneRequired))}
  form.elements.preferredContact.addEventListener('change',updateContactRequirements);updateContactRequirements();

  const today=new Date();today.setHours(0,0,0,0);form.elements.preferredDate.min=today.toISOString().slice(0,10);const max=new Date(today);max.setDate(max.getDate()+global.LEFUSIL_SITE_CONFIG.appointment.maxAdvanceDays);form.elements.preferredDate.max=max.toISOString().slice(0,10);
  form.addEventListener('submit',event=>{
    event.preventDefault();if(form.dataset.submitting==='true')return;
    const method=form.elements.preferredContact.value,rules={firstName:{required:true,max:50},lastName:{required:true,max:50},preferredContact:{required:true},email:{required:method==='Email',email:true,max:254},phone:{required:method==='Phone'||method==='WhatsApp',phone:true,max:40},preferredDate:{required:true,future:true,maxDays:global.LEFUSIL_SITE_CONFIG.appointment.maxAdvanceDays},timeWindow:{required:true},notes:{min:10,max:1500}};
    const errors=global.lefusilForms.errors(form,rules);if(method)global.lefusilForms.requireContact(form,errors);if(!form.elements.consent.checked)errors.consent=global.lefusilI18n?.t('Consent is required.')||'Consent is required.';
    if(!global.lefusilForms.show(form,errors)){global.lefusilAnalytics?.track('appointment_failed',{locale,sourcePage:'appointment'});return}
    form.dataset.submitting='true';const submit=form.querySelector('[type=submit]'),submitLabel=submit.textContent;submit.disabled=true;submit.textContent='Sending Request…';const data=new FormData(form),id=`APT-${Date.now().toString(36).toUpperCase()}`,selected=products.find(item=>item.slug===data.get('product'));
    const firstName=global.lefusilForms.clean(data.get('firstName'),50),lastName=global.lefusilForms.clean(data.get('lastName'),50),record={id,createdAt:new Date().toISOString(),firstName,lastName,name:`${firstName} ${lastName}`.trim(),email:global.lefusilForms.clean(data.get('email'),254).toLowerCase(),phone:global.lefusilForms.phone(data.get('phone')),preferredContact:global.lefusilForms.clean(data.get('preferredContact'),30),preferredDate:data.get('preferredDate'),timeWindow:data.get('timeWindow'),productSlug:selected?.slug||'',productName:selected?`${selected.brand} ${selected.name}`:'',category:global.lefusilForms.clean(data.get('purpose'),100),message:global.lefusilForms.clean(data.get('notes'),1500),status:'New',source,sourcePage:'appointment',inquiryType:'private_viewing',locale,demo:true};
    try{const appointments=JSON.parse(localStorage.getItem(key)||'[]'),inquiries=JSON.parse(localStorage.getItem('lefusil_admin_inquiries')||'[]');appointments.unshift(record);inquiries.unshift(record);localStorage.setItem(key,JSON.stringify(appointments));localStorage.setItem('lefusil_admin_inquiries',JSON.stringify(inquiries));document.querySelector('#appointmentView').hidden=true;const success=document.querySelector('#appointmentSuccess');success.hidden=false;success.querySelector('[data-reference]').textContent=id;success.focus();global.lefusilAnalytics?.track('appointment_submitted',{productSlug:record.productSlug,locale,sourcePage:'appointment'})}
    catch{form.dataset.submitting='false';submit.disabled=false;submit.textContent=submitLabel;document.querySelector('#appointmentStatus').textContent='Local demo storage is unavailable. Please try the contact form.'}
  });
  global.lefusilAnalytics?.track('appointment_started',{productSlug:selectedProduct?.slug||'',locale,sourcePage:'appointment'});
})(window);
