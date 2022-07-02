import{delimiter as e,toNamespacedPath as t,join as o}from'path'
import{URL as n,fileURLToPath as s}from'url'
import{codes as i}from'internal/errors'
const{ERR_INVALID_PACKAGE_CONFIG:r}=i,{fastReadPackageJson:a,getOptionValue:p,fastStat:m,builtins:f}=import.meta.native,c=new Map,d=0,l=1,u=e=>{if(e instanceof n)e=s(e)
return m(e)},v=(e,o,n)=>{const i=c.get(e)
if(void 0!==i)return i
let[p,m]=a(t(e)),f
if(!m||void 0===p){const t={pjsonPath:e,exists:false,main:void 0,name:void 0,type:'none',exports:void 0,imports:void 0}
return c.set(e,t),t}try{f=JSON.parse(p)}catch(t){throw new r(e,(n?`"${o}" from `:'')+s(n||o),t.message)}let{exports:d,imports:l,main:u,name:v,type:h}=f
if('object'!==typeof l||null===l)l=void 0
if('string'!==typeof u)u=void 0
if('string'!==typeof v)v=void 0
if('module'!==h&&'commonjs'!==h)h='none'
const x={pjsonPath:e,exists:true,main:u,name:v,type:h,exports:d,imports:l}
return c.set(e,x),x},h=e=>{let t=new n('./package.json',e)
while(true){const o=t.pathname
if(o.endsWith('node_modules/package.json'))break
const i=v(s(t),e)
if(i.exists)return i
const r=t
if(t=new n('../package.json',t),t.pathname===r.pathname)break}const o=s(t),i={pjsonPath:o,exists:false,main:void 0,name:void 0,type:'none',exports:void 0,imports:void 0}
return c.set(o,i),i},x=new Set(f),g=e=>x.has(e.replace('node:','')),j=e=>true,y=(process.env.VEIL_INTRINSIC_PATH??'').split(e).filter(Boolean),k={exists:false},w=(e,t,n)=>{for(const s of y){const i=v(o(s,e,'package.json'),t,n)
if(i.exists)return i}return k}
export{l as STAT_IS_DIR,d as STAT_IS_FILE,g as canBeImportedByUsers,j as canBeImportedWithoutScheme,u as fastStat,w as getIntrinsicPackageConfig,p as getOptionValue,v as getPackageConfig,h as getPackageScopeConfig}
