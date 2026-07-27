(function adminStoreFactory(){
  'use strict';
  const KEYS={products:'lefusil_admin_products',inquiries:'lefusil_admin_inquiries',settings:'lefusil_admin_settings',session:'lefusil_admin_session',audit:'lefusil_admin_audit',preview:'lefusil_admin_preview_enabled'};
  const VERSION=1;
  const clone=value=>JSON.parse(JSON.stringify(value));
  const read=(key,fallback)=>{try{const value=JSON.parse(localStorage.getItem(key));return value??clone(fallback)}catch{return clone(fallback)}};
  const write=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
  const defaults={showFeatured:true,featuredIds:[],defaultSort:'featured',perPage:12,showPrices:true,showRequestLabel:true,showArchived:true,density:'comfortable'};
  const rawState=()=>read(KEYS.products,{overrides:{},demoProducts:[]});
  const originals=()=>clone(window.LEFUSIL_PRODUCTS||[]);
  const normalize=(item,isDemo=false)=>{
    const gallery=Array.isArray(item.gallery)?item.gallery.filter(Boolean):item.image?[item.image]:[];
    return {...item,id:item.id,slug:String(item.slug||''),sku:String(item.sku||''),name:String(item.name||''),brand:String(item.brand||''),model:String(item.model||''),category:String(item.category||''),calibre:String(item.calibre||item.specifications?.Gauge||item.specifications?.Caliber||''),description:String(item.description||item.shortDescription||''),shortDescription:String(item.shortDescription||item.description||''),price:Number(item.price)>0?Number(item.price):null,priceOnRequest:Boolean(item.priceOnRequest)||!(Number(item.price)>0),availability:String(item.availability||'On Request'),status:item.status||'Published',featured:Boolean(item.featured),image:item.image||gallery[0]||'',gallery,specifications:{...(item.specifications||{})},createdByAdminDemo:Boolean(item.createdByAdminDemo||isDemo)};
  };
  function getProducts(){
    const state=rawState();
    const base=originals().map(item=>normalize({...item,...(state.overrides[String(item.id)]||{})}));
    return [...base,...state.demoProducts.map(item=>normalize(item,true))];
  }
  const getProduct=id=>getProducts().find(item=>String(item.id)===String(id));
  const stamp=()=>new Date().toISOString();
  function audit(type,detail=''){const timestamp=stamp(),items=read(KEYS.audit,[]);items.unshift({id:`audit-${Date.now()}-${Math.random().toString(16).slice(2)}`,type,action:type,detail:String(detail).slice(0,160),timestamp,createdAt:timestamp});write(KEYS.audit,items.slice(0,100))}
  function createProduct(data){const state=rawState(),now=stamp();const item=normalize({...data,id:`demo-${Date.now()}-${Math.random().toString(16).slice(2,8)}`,createdByAdminDemo:true,createdAt:now,updatedAt:now,status:data.status||'Draft'},true);state.demoProducts.push(item);write(KEYS.products,state);audit('create product',`${item.brand} ${item.name}`);return clone(item)}
  function updateProduct(id,updates){const state=rawState(),existing=getProduct(id);if(!existing)throw new Error('Product not found.');const next={...clone(updates),updatedAt:stamp()};if(existing.createdByAdminDemo){const index=state.demoProducts.findIndex(item=>String(item.id)===String(id));state.demoProducts[index]=normalize({...state.demoProducts[index],...next},true)}else state.overrides[String(id)]={...(state.overrides[String(id)]||{}),...next};write(KEYS.products,state);audit('update product',`${existing.brand} ${existing.name}`);return getProduct(id)}
  const archiveProduct=id=>{const item=getProduct(id);if(!item)throw new Error('Product not found.');const result=updateProduct(id,{status:'Archived'});audit('archive',`${item.brand} ${item.name}`);return result};
  const restoreProduct=id=>{const item=getProduct(id);if(!item)throw new Error('Product not found.');const result=updateProduct(id,{status:'Published'});audit('restore',`${item.brand} ${item.name}`);return result};
  function deleteDemoProduct(id){const state=rawState(),item=state.demoProducts.find(product=>String(product.id)===String(id));if(!item)throw new Error('Original products can only be archived.');state.demoProducts=state.demoProducts.filter(product=>String(product.id)!==String(id));write(KEYS.products,state);audit('delete demo product',`${item.brand} ${item.name}`)}
  function resetDemoData(){[KEYS.products,KEYS.inquiries,KEYS.settings,KEYS.preview,KEYS.audit].forEach(key=>localStorage.removeItem(key));audit('reset','Demo products, overrides, inquiries, settings and prior audit events cleared.')}
  const getInquiries=()=>read(KEYS.inquiries,[]);
  function saveInquiry(data){const items=getInquiries();const item={id:data.id||`inquiry-${Date.now()}-${Math.random().toString(16).slice(2,8)}`,createdAt:data.createdAt||stamp(),name:String(data.name||data.fullName||''),email:String(data.email||''),phone:String(data.phone||''),preferredContact:String(data.preferredContact||data.contactMethod||''),productSlug:String(data.productSlug||''),productName:String(data.productName||''),message:String(data.message||''),status:data.status||'New',demo:true};items.unshift(item);write(KEYS.inquiries,items);return item}
  function updateInquiry(id,updates){const items=getInquiries(),index=items.findIndex(item=>item.id===id);if(index<0)throw new Error('Inquiry not found.');items[index]={...items[index],...updates};write(KEYS.inquiries,items);audit('inquiry status change',`${id}: ${updates.status||'updated'}`);return items[index]}
  function deleteInquiry(id){write(KEYS.inquiries,getInquiries().filter(item=>item.id!==id));audit('delete inquiry',id)}
  const getSettings=()=>({...defaults,...read(KEYS.settings,{})});
  function saveSettings(settings){write(KEYS.settings,{...getSettings(),...settings});audit('update settings','Demo admin preview settings updated.')}
  function exportData(){const state=rawState();audit('export','Demo data exported.');return{schema:'lefusil-admin-demo',version:VERSION,exportedAt:stamp(),productOverrides:state.overrides,demoProducts:state.demoProducts,inquiries:getInquiries(),settings:getSettings(),auditLog:read(KEYS.audit,[])}}
  function validateImport(payload){if(!payload||payload.schema!=='lefusil-admin-demo'||payload.version!==VERSION)throw new Error('Unsupported admin demo file. Expected schema version 1.');if(typeof payload.productOverrides!=='object'||!Array.isArray(payload.demoProducts)||!Array.isArray(payload.inquiries)||typeof payload.settings!=='object')throw new Error('The import file is incomplete.');return true}
  function importData(payload){validateImport(payload);const backup=exportData();try{write(KEYS.products,{overrides:payload.productOverrides,demoProducts:payload.demoProducts});write(KEYS.inquiries,payload.inquiries);write(KEYS.settings,payload.settings);audit('import',`${payload.demoProducts.length} demo products, ${payload.inquiries.length} inquiries.`)}catch(error){write(KEYS.products,{overrides:backup.productOverrides,demoProducts:backup.demoProducts});write(KEYS.inquiries,backup.inquiries);write(KEYS.settings,backup.settings);throw error}}
  function duplicateProduct(id){const item=getProduct(id);if(!item)throw new Error('Product not found.');const products=getProducts(),baseSlug=`${item.slug}-copy`,baseSku=`${item.sku}-COPY`;let slug=baseSlug,sku=baseSku,index=2;while(products.some(product=>product.slug===slug))slug=`${baseSlug}-${index++}`;index=2;while(products.some(product=>product.sku===sku))sku=`${baseSku}-${index++}`;const copy=createProduct({...item,id:undefined,name:`${item.name} Copy`,slug,sku,status:'Draft',createdByAdminDemo:true});audit('duplicate product',`${item.brand} ${item.name}`);return copy}
  const updateInquiryStatus=(id,status)=>updateInquiry(id,{status});
  const archiveInquiry=id=>updateInquiry(id,{status:'Archived',archived:true});
  window.LEFUSIL_ADMIN_STORE={KEYS,VERSION,getProducts,getProduct,createProduct,updateProduct,archiveProduct,restoreProduct,deleteDemoProduct,duplicateProduct,resetDemoData,exportData,exportState:exportData,importData,importState:importData,validateImport,getInquiries,saveInquiry,updateInquiry,updateInquiryStatus,archiveInquiry,deleteInquiry,getSettings,saveSettings,updateSettings:saveSettings,getAudit:()=>read(KEYS.audit,[]),getAuditLog:()=>read(KEYS.audit,[]),audit,addAuditEvent:audit};
})();
