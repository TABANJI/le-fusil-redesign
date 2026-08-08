(function supabaseProviderFactory(global){
  'use strict';
  const runtime=global.LEFUSIL_RUNTIME,errors=global.LEFUSIL_SERVICE_ERRORS;if(!runtime?.configured)return;
  const base=runtime.config.supabaseUrl,key=runtime.config.supabasePublishableKey;
  async function request(path,options={}){const token=options.auth?global.LEFUSIL_AUTH?.getAccessToken():'';if(options.auth&&!token)throw new errors.ServiceError('AUTH_REQUIRED','An authenticated staff session is required.');const response=await fetch(`${base}${path}`,{...options,headers:{apikey:key,...(token?{Authorization:`Bearer ${token}`}:{ }),'Content-Type':'application/json',Accept:'application/json',...(options.headers||{})}});if(!response.ok){const payload=await response.json().catch(()=>({})),reference=response.headers.get('x-request-id')||`HTTP-${response.status}`;throw new errors.ServiceError(response.status===401||response.status===403?'ACCESS_DENIED':'SERVICE_UNAVAILABLE',payload.message||payload.hint||'The requested service is unavailable.',{reference})}if(response.status===204)return null;const text=await response.text();return text?JSON.parse(text):null}
  const adminOnly=method=>async()=>{throw new errors.ServiceError('NOT_IMPLEMENTED',`${method} is not connected in this stage.`)};
  const adminSelect='*,brand:brands(id,name,slug),category:categories(id,name,slug),product_images(id,storage_bucket,storage_path,alt_text,image_role,display_order,is_active),product_specifications(id,specification_key,specification_value,display_order)';
  const provider={
    async getPublishedProducts(){return request('/rest/v1/products?status=eq.published&archived_at=is.null&select=*')},
    async getProductBySlug(slug){const rows=await request(`/rest/v1/products?slug=eq.${encodeURIComponent(slug)}&status=eq.published&archived_at=is.null&select=*&limit=1`);return rows[0]||null},
    async getBrands(){return request('/rest/v1/brands?is_active=eq.true&select=*&order=name')},async getCategories(){return request('/rest/v1/categories?is_active=eq.true&select=*&order=name')},
    async submitInquiry(payload){return request('/functions/v1/submit-inquiry',{method:'POST',body:JSON.stringify(payload)})},
    async getAdminProducts(){return request(`/rest/v1/products?select=${encodeURIComponent(adminSelect)}&order=updated_at.desc`,{auth:true})},
    async createProduct(payload){const rows=await request('/rest/v1/products',{auth:true,method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(payload)});return rows?.[0]||null},
    async updateProduct(id,payload){const rows=await request(`/rest/v1/products?id=eq.${encodeURIComponent(id)}`,{auth:true,method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(payload)});return rows?.[0]||null},
    async archiveProduct(id){return this.updateProduct(id,{status:'archived',archived_at:new Date().toISOString()})},
    async restoreProduct(id){return this.updateProduct(id,{status:'published',archived_at:null})},
    async replaceProductSpecifications(id,specifications){await request(`/rest/v1/product_specifications?product_id=eq.${encodeURIComponent(id)}`,{auth:true,method:'DELETE'});const rows=Object.entries(specifications||{}).map(([key,value],index)=>({product_id:id,specification_key:key,specification_value:value,display_order:index}));if(rows.length)await request('/rest/v1/product_specifications',{auth:true,method:'POST',body:JSON.stringify(rows)})},
    getMedia:adminOnly('getMedia'),createMediaRecord:adminOnly('createMediaRecord'),updateMediaRecord:adminOnly('updateMediaRecord'),getInquiries:adminOnly('getInquiries'),updateInquiry:adminOnly('updateInquiry'),getCustomers:adminOnly('getCustomers'),getCustomer:adminOnly('getCustomer'),updateCustomer:adminOnly('updateCustomer'),addCustomerNote:adminOnly('addCustomerNote'),addCustomerTag:adminOnly('addCustomerTag')
  };
  global.LEFUSIL_SUPABASE_DATA_PROVIDER=global.LEFUSIL_DATA_PROVIDER.assertProvider(provider);
})(window);
