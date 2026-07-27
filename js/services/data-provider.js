(function dataProviderContract(global){
  'use strict';
  const methods=['getPublishedProducts','getProductBySlug','getBrands','getCategories','submitInquiry','getAdminProducts','createProduct','updateProduct','archiveProduct','restoreProduct','getMedia','createMediaRecord','updateMediaRecord','getInquiries','updateInquiry','getCustomers','getCustomer','updateCustomer','addCustomerNote','addCustomerTag'];
  function assertProvider(provider){const missing=methods.filter(method=>typeof provider?.[method]!=='function');if(missing.length)throw new TypeError(`Data provider is missing: ${missing.join(', ')}`);return provider}
  global.LEFUSIL_DATA_PROVIDER={version:1,methods,assertProvider};
})(window);
