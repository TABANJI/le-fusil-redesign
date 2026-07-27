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
    const status=document.querySelector('#contactStatus');
    status.hidden=false;
    status.textContent='Thank you. Your demonstration inquiry has been prepared locally; no information has been sent.';
    lefusilToast('Inquiry prepared successfully.');
    form.reset();
    status.focus?.();
  });
})();
