(function formValidation(global){
  'use strict';
  const clean=(value,max=1000)=>String(value??'').trim().slice(0,max);
  const validEmail=value=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(value,254));
  const phone=value=>clean(value,40).replace(/[^+\d()\- .]/g,'');
  const validPhone=value=>{const safe=phone(value),digits=safe.replace(/\D/g,'');return !safe||digits.length>=7&&digits.length<=15};
  const message=(key)=>global.lefusilI18n?.t(key)||key;
  function errors(form,rules){
    const found={};
    Object.entries(rules).forEach(([name,rule])=>{
      const field=form.elements[name],value=clean(field?.value,rule.max||1000);
      if(rule.required&&!value)found[name]=message('This field is required.');
      else if(value&&rule.email&&!validEmail(value))found[name]=message('Enter a valid email address.');
      else if(value&&rule.phone&&!validPhone(value))found[name]=message('Enter a valid phone number.');
      else if(value&&rule.min&&value.length<rule.min)found[name]=message(`Enter at least ${rule.min} characters.`);
      else if(rule.future&&value){const chosen=new Date(`${value}T00:00:00`),today=new Date();today.setHours(0,0,0,0);const limit=new Date(today);limit.setDate(limit.getDate()+(rule.maxDays||180));if(chosen<today||chosen>limit)found[name]=message('Choose an available future date.');}
    });
    return found;
  }
  function show(form,found){
    form.querySelectorAll('[data-field-error]').forEach(node=>node.remove());
    form.querySelectorAll('[aria-invalid]').forEach(node=>{node.removeAttribute('aria-invalid');const described=node.getAttribute('aria-describedby')?.split(' ').filter(id=>!id.endsWith('-error')).join(' ');described?node.setAttribute('aria-describedby',described):node.removeAttribute('aria-describedby')});
    Object.entries(found).forEach(([name,text])=>{const field=form.elements[name];if(!field)return;const id=`${form.id}-${name}-error`;field.setAttribute('aria-invalid','true');field.setAttribute('aria-describedby',[field.getAttribute('aria-describedby'),id].filter(Boolean).join(' '));const error=document.createElement('span');error.id=id;error.dataset.fieldError=name;error.className='field-error';error.textContent=text;field.insertAdjacentElement('afterend',error)});
    const summary=form.querySelector('[data-error-summary]');
    if(summary){const count=Object.keys(found).length;summary.hidden=!count;summary.textContent=count?message('Please review the highlighted fields.'):'';if(count)summary.focus();}
    if(Object.keys(found).length)requestAnimationFrame(()=>form.querySelector('[aria-invalid=true]')?.focus());
    return !Object.keys(found).length;
  }
  function requireContact(form,found){
    const preference=clean(form.elements.preferredContact?.value,20),email=clean(form.elements.email?.value,254),phoneValue=clean(form.elements.phone?.value,40);
    if(!email&&!phoneValue)found[preference==='Phone'?'phone':'email']=message('Provide an email address or phone number.');
    if(preference==='Email'&&!email)found.email=message('Email is required for your preferred contact method.');
    if(preference==='Phone'&&!phoneValue)found.phone=message('Phone is required for your preferred contact method.');
    return found;
  }
  global.lefusilForms={clean,email:validEmail,phone,validPhone,errors,show,requireContact};
})(window);
