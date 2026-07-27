(function supabaseProviderFactory(global){
  'use strict';
  const runtime=global.LEFUSIL_RUNTIME,errors=global.LEFUSIL_SERVICE_ERRORS;if(!runtime?.configured)return;
  const base=runtime.config.supabaseUrl,key=runtime.config.supabasePublishableKey;
  async function request(path,options={}){const response=await fetch(`${base}${path}`,{...options,headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',Accept:'application/json',...(options.headers||{})}});if(!response.ok){const reference=response.headers.get('x-request-id')||`HTTP-${response.status}`;throw new errors.ServiceError('SERVICE_UNAVAILABLE','The requested service is unavailable.',{reference})}return response.status===204?null:response.json()}
  const adminOnly=method=>async()=>{throw new errors.ServiceError('AUTH_REQUIRED',`${method} requires an authenticated production admin session.`)};
  const provider={
    async getPublishedProducts(){return request('/rest/v1/products?status=eq.published&archived_at=is.null&select=*')},
    async getProductBySlug(slug){const rows=await request(`/rest/v1/products?slug=eq.${encodeURIComponent(slug)}&status=eq.published&archived_at=is.null&select=*&limit=1`);return rows[0]||null},
    async getBrands(){return request('/rest/v1/brands?is_active=eq.true&select=*&order=name')},async getCategories(){return request('/rest/v1/categories?is_active=eq.true&select=*&order=name')},
    async submitInquiry(payload){return request('/functions/v1/submit-inquiry',{method:'POST',body:JSON.stringify(payload)})},
    getAdminProducts:adminOnly('getAdminProducts'),createProduct:adminOnly('createProduct'),updateProduct:adminOnly('updateProduct'),archiveProduct:adminOnly('archiveProduct'),restoreProduct:adminOnly('restoreProduct'),getMedia:adminOnly('getMedia'),createMediaRecord:adminOnly('createMediaRecord'),updateMediaRecord:adminOnly('updateMediaRecord'),getInquiries:adminOnly('getInquiries'),updateInquiry:adminOnly('updateInquiry'),getCustomers:adminOnly('getCustomers'),getCustomer:adminOnly('getCustomer'),updateCustomer:adminOnly('updateCustomer'),addCustomerNote:adminOnly('addCustomerNote'),addCustomerTag:adminOnly('addCustomerTag')
  };
  global.LEFUSIL_SUPABASE_DATA_PROVIDER=global.LEFUSIL_DATA_PROVIDER.assertProvider(provider);
})(window);
