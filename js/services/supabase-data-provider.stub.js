(function supabaseProviderStub(global){
  'use strict';
  const fail=method=>async()=>{throw new global.LEFUSIL_SERVICE_ERRORS.NotImplementedError(method)};
  const methods=global.LEFUSIL_DATA_PROVIDER?.methods||['getPublishedProducts','getProductBySlug','getBrands','getCategories','submitInquiry','getAdminProducts','createProduct','updateProduct','archiveProduct','restoreProduct','getMedia','createMediaRecord','updateMediaRecord','getInquiries','updateInquiry','getCustomers','getCustomer','updateCustomer','addCustomerNote','addCustomerTag'];
  global.LEFUSIL_SUPABASE_DATA_PROVIDER_STUB=Object.fromEntries(methods.map(method=>[method,fail(method)]));
  // Future implementation: inject a configured client; map database rows to data-contracts;
  // keep service-role operations in trusted Edge Functions/server code; translate PostgREST errors.
})(window);
