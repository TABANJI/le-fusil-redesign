(function contactPage(){
  const form=document.querySelector('#contactForm');
  if(!form)return;
  const params=new URLSearchParams(location.search);
  const requestedProduct=params.get('product');
  if(requestedProduct){
    const product=(window.LEFUSIL_PRODUCTS||[]).find(item=>item.slug===requestedProduct||String(item.id)===requestedProduct);
    if(product){form.interest.value='Request Availability';form.message.value=`I would like to enquire about ${product.brand} ${product.name}.`;}
  }
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const data=new FormData(form),items=(()=>{try{return JSON.parse(localStorage.getItem('lefusil_admin_inquiries')||'[]')}catch{return[]}})();
    items.unshift({id:`inquiry-${Date.now()}-${Math.random().toString(16).slice(2,8)}`,createdAt:new Date().toISOString(),name:String(data.get('name')||''),email:String(data.get('email')||''),phone:String(data.get('phone')||''),preferredContact:String(data.get('interest')||''),productSlug:requestedProduct||'',productName:requestedProduct?((window.LEFUSIL_PRODUCTS||[]).find(item=>item.slug===requestedProduct)?.name||''):'',message:String(data.get('message')||''),status:'New',demo:true});
    localStorage.setItem('lefusil_admin_inquiries',JSON.stringify(items));
    const status=document.querySelector('#contactStatus');
    status.hidden=false;
    status.textContent='Thank you. Your demonstration inquiry has been prepared locally; no information has been sent.';
    lefusilToast('Inquiry prepared successfully.');
    form.reset();
    status.focus?.();
  });
})();
