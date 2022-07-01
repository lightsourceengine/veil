import{toNamespacedPath as e}from'path'
import{URL as t,fileURLToPath as o}from'url'
import{codes as n}from'internal/errors'
const{ERR_INVALID_PACKAGE_CONFIG:s}=n,{fastReadPackageJson:i,getOptionValue:a,fastStat:r,builtins:p}=import.meta.native,m=new Map,f=0,d=1,c=e=>{if(e instanceof t)e=o(e)
return r(e)},l=(t,n,a)=>{const r=m.get(t)
if(void 0!==r)return r
let[p,f]=i(e(t)),d
if(!f||void 0===p){const e={pjsonPath:t,exists:false,main:void 0,name:void 0,type:'none',exports:void 0,imports:void 0}
return m.set(t,e),e}try{d=JSON.parse(p)}catch(e){throw new s(t,(a?`"${n}" from `:'')+o(a||n),e.message)}let{exports:c,imports:l,main:u,name:v,type:h}=d
if('object'!==typeof l||null===l)l=void 0
if('string'!==typeof u)u=void 0
if('string'!==typeof v)v=void 0
if('module'!==h&&'commonjs'!==h)h='none'
const g={pjsonPath:t,exists:true,main:u,name:v,type:h,exports:c,imports:l}
return m.set(t,g),g},u=e=>{let n=new t('./package.json',e)
while(true){const s=n.pathname
if(s.endsWith('node_modules/package.json'))break
const i=l(o(n),e)
if(i.exists)return i
const a=n
if(n=new t('../package.json',n),n.pathname===a.pathname)break}const s=o(n),i={pjsonPath:s,exists:false,main:void 0,name:void 0,type:'none',exports:void 0,imports:void 0}
return m.set(s,i),i},v=new Set(p),h=e=>v.has(e.replace('node:','')),g=e=>true
export{d as STAT_IS_DIR,f as STAT_IS_FILE,h as canBeImportedByUsers,g as canBeImportedWithoutScheme,c as fastStat,a as getOptionValue,l as getPackageConfig,u as getPackageScopeConfig}
