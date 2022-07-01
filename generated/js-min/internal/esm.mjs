import{getOptionValue as e,canBeImportedByUsers as n,canBeImportedWithoutScheme as t,fastStat as o,STAT_IS_DIR as r,STAT_IS_FILE as i,getPackageScopeConfig as s,getPackageConfig as l}from'internal'
import{extname as f}from'path'
import{pathToFileURL as c,URL as u,fileURLToPath as a}from'url'
import{codes as h}from'internal/errors'
const{ERR_INVALID_ARG_VALUE:p,ERR_INVALID_MODULE_SPECIFIER:d,ERR_INVALID_PACKAGE_CONFIG:w,ERR_INVALID_PACKAGE_TARGET:m,ERR_MODULE_NOT_FOUND:_,ERR_PACKAGE_IMPORT_NOT_DEFINED:g,ERR_PACKAGE_PATH_NOT_EXPORTED:E,ERR_UNSUPPORTED_DIR_IMPORT:R,ERR_NETWORK_IMPORT_DISALLOWED:j,ERR_UNSUPPORTED_ESM_URL_SCHEME:x,ERR_UNKNOWN_FILE_EXTENSION:y}=h,O=Object.freeze,A=Object.getOwnPropertyNames,N=JSON.stringify,P=Set,I=Map,D=Array.isArray,v=(...e)=>RegExp.prototype[Symbol.replace].call(...e),b=e('--preserve-symlinks'),T=e('--preserve-symlinks-main'),W=[],$=e('--no-addons'),S=$?[]:['node-addons'],k=O(['node','import',...S,...W]),L=new P(k),U=new P
function C(e,n,t){const o=a(n),r=`pjsonPath + '|' + match`
if(!U.has(r))U.add(r),M(`${o} - deprecated trailing slash pattern mapping in "exports" field`,'DEP0155')}function G(e,n,t,o){const r=ge(e,{parentURL:''})
if('module'!==r)return
const i=a(new u('.',n))
M(`${i} - ${o?'"main" field missing file ext':'no "main" or "exports" field'}`,'DEP0151')}const M=(e,n)=>process.emitWarning(e,'DeprecationWarning',n)
function K(e){if(void 0!==e&&e!==k){if(!D(e))throw new p('conditions',e,'expected an array')
return new P(e)}return L}const F=e=>o(e)===i
function V(e,n,t){let o,{main:r}=n
if(void 0!==r){if(F(o=new u(`./${r}`,e)))return o
else if(F(o=new u(`./${r}.js`,e)));else if(F(o=new u(`./${r}.json`,e)));else if(F(o=new u(`./${r}.node`,e)));else if(F(o=new u(`./${r}/index.js`,e)));else if(F(o=new u(`./${r}/index.json`,e)));else if(F(o=new u(`./${r}/index.node`,e)));else o=void 0
if(o)return G(o,e,t,r),o}if(F(o=new u('./index.js',e)));else if(F(o=new u('./index.json',e)));else if(F(o=new u('./index.node',e)));else o=void 0
if(o)return G(o,e,t,r),o
throw new _(a(new u('.',e)),a(t))}const H=/%2F|%5C/i
function X(e,n,t){if(null!==H.exec(e.pathname))throw new d(e.pathname,'must not include encoded "/" or "\\" characters',a(n))
let s=a(e)
const l=o(s.endsWith('/')?s.slice(-1):s)
if(l===r){const t=new R(s,a(n))
throw t.url=String(e),t}else if(l!==i)throw new _(s||e.pathname,n&&a(n),'module')
return e}function q(e,n,t){throw new g(e,n&&a(new u('.',n)),a(t))}function z(e,n,t){throw new E(a(new u('.',n)),e,t&&a(t))}function J(e,n,t,o){const r=`request is not a valid subpath for the "${t?'imports':'exports'}" resolution of ${a(n)}`
throw new d(e,r,o&&a(o))}function B(e,n,t,o,r){if('object'===typeof n&&null!==n)n=N(n,null,'')
else n=`${n}`
throw new m(a(new u('.',t)),e,n,o,r&&a(r))}const Q=/(^|\\|\/)((\.|%2e)(\.|%2e)?|(n|%6e|%4e)(o|%6f|%4f)(d|%64|%44)(e|%65|%45)(_|%5f)(m|%6d|%4d)(o|%6f|%4f)(d|%64|%44)(u|%75|%55)(l|%6c|%4c)(e|%65|%45)(s|%73|%53))(\\|\/|$)/i,Y=/^\.|%|\\/,Z=/\*/g
function ee(e,n,t,o,r,i,s,l){if(''!==n&&!i&&'/'!==e[e.length-1])B(t,e,o,s,r)
if(!e.startsWith('./')){if(s&&!e.startsWith('../')&&!e.startsWith('/')){let t=false
try{new u(e),t=true}catch{}if(!t){const t=i?v(Z,e,(()=>n)):e+n
return ce(t,o,l)}}B(t,e,o,s,r)}if(null!==Q.exec(e.slice(2)))B(t,e,o,s,r)
const f=new u(e,o),c=f.pathname,a=new u('.',o).pathname
if(!c.startsWith(a))B(t,e,o,s,r)
if(''===n)return f
if(null!==Q.exec(n)){const e=i?t.replace('*',(()=>n)):t+n
J(e,o,s,r)}if(i)return new u(v(Z,f.href,(()=>n)))
return new u(n,f)}function ne(e){const n=+e
if(`${n}`!==e)return false
return n>=0&&n<4294967295}function te(e,n,t,o,r,i,s,l){if('string'===typeof n)return ee(n,t,o,e,r,i,s,l)
else if(D(n)){if(0===n.length)return null
let f
for(let c=0;c<n.length;c++){const u=n[c]
let a
try{a=te(e,u,t,o,r,i,s,l)}catch(e){if(f=e,'ERR_INVALID_PACKAGE_TARGET'===e.code)continue
throw e}if(void 0===a)continue
if(null===a){f=null
continue}return a}if(void 0===f||null===f)return f
throw f}else if('object'===typeof n&&null!==n){const f=A(n)
for(let n=0;n<f.length;n++){const t=f[n]
if(ne(t))throw new w(a(e),r,'"exports" cannot contain numeric property keys.')}for(let c=0;c<f.length;c++){const u=f[c]
if('default'===u||l.has(u)){const f=n[u],c=te(e,f,t,o,r,i,s,l)
if(void 0===c)continue
return c}}return}else if(null===n)return null
B(o,n,e,s,r)}function oe(e,n,t){if('string'===typeof e||D(e))return true
if('object'!==typeof e||null===e)return false
const o=A(e)
let r=false,i=0
for(let e=0;e<o.length;e++){const s=o[e],l=''===s||'.'!==s[0]
if(0===i++)r=l
else if(r!==l)throw new w(a(n),t,'"exports" cannot contain some keys starting with \'.\' and some not.'+' The exports object must either be an object of package subpath keys'+' or an object of main entry condition name keys only.')}return r}function re(e,n,t,o,r){let i=t.exports
if(oe(i,e,o))i={'.':i}
if(i.hasOwnProperty(n)&&!n.includes('*')&&!n.includes('/')){const t=i[n],s=te(e,t,'',n,o,false,false,r)
if(null==s)z(n,e,o)
return s}let s='',l
const f=A(i)
for(let t=0;t<f.length;t++){const o=f[t],r=o.indexOf('*')
if(-1!==r&&n.startsWith(o.slice(0,r))){if(n.endsWith('/'))C(n,e)
const t=o.slice(r+1)
if(n.length>=o.length&&n.endsWith(t)&&1===ie(s,o)&&o.indexOf('*')===r)s=o,l=n.slice(r,n.length-t.length)}}if(s){const t=i[s],f=te(e,t,l,s,o,true,false,r)
if(null==f)z(n,e,o)
return f}z(n,e,o)}function ie(e,n){const t=e.indexOf('*'),o=n.indexOf('*'),r=-1===t?e.length:t+1,i=-1===o?n.length:o+1
if(r>i)return-1
if(i>r)return 1
if(-1===t)return 1
if(-1===o)return-1
if(e.length>n.length)return-1
if(n.length>e.length)return 1
return 0}function se(e,n,t){if('#'===e||e.startsWith('#/')||e.endsWith('/')){const t='is not a valid internal imports specifier name'
throw new d(e,t,a(n))}let o
const r=s(n)
if(r.exists){o=c(r.pjsonPath)
const i=r.imports
if(i)if(i.hasOwnProperty(e)&&!e.includes('*')){const r=te(o,i[e],'',e,n,false,true,t)
if(null!=r)return r}else{let r='',s
const l=A(i)
for(let n=0;n<l.length;n++){const t=l[n],o=t.indexOf('*')
if(-1!==o&&e.startsWith(t.slice(0,o))){const n=t.slice(o+1)
if(e.length>=t.length&&e.endsWith(n)&&1===ie(r,t)&&t.lastIndexOf('*')===o)r=t,s=e.slice(o,e.length-n.length)}}if(r){const e=i[r],l=te(o,e,s,r,n,true,true,t)
if(null!=l)return l}}}q(e,o,n)}function le(e){const n=s(e)
return n.type}function fe(e,n){let t=e.indexOf('/'),o=true,r=false
if('@'===e[0])if(r=true,-1===t||0===e.length)o=false
else t=e.indexOf('/',t+1)
const i=-1===t?e:e.slice(0,t)
if(null!==Y.exec(i))o=false
if(!o)throw new d(e,'is not a valid package name',a(n))
const s='.'+(-1===t?'':e.slice(t))
return{packageName:i,packageSubpath:s,isScoped:r}}function ce(e,r,f){if(n(e)&&t(e))return new u(`node:${e}`)
const{packageName:h,packageSubpath:p,isScoped:d}=fe(e,r),w=s(r)
if(w.exists){const e=c(w.pjsonPath)
if(w.name===h&&void 0!==w.exports&&null!==w.exports)return re(e,p,w,r,f)}let m=new u('./node_modules/'+h+'/package.json',r),g=a(m),E
do{const n=o(g.slice(0,g.length-13))
if(n===i){E=g,m=new u((d?'../../../../node_modules/':'../../../node_modules/')+h+'/package.json',m),g=a(m)
continue}const t=l(g,e,r)
if(void 0!==t.exports&&null!==t.exports)return re(m,p,t,r,f)
if('.'===p)return V(m,t,r)
return new u(p,m)}while(g.length!==E.length)
throw new _(h,a(r))}function ue(e){if('.'===e[0]){if(1===e.length||'/'===e[1])return true
if('.'===e[1])if(2===e.length||'/'===e[2])return true}return false}function ae(e){if(''===e)return false
if('/'===e[0])return true
return ue(e)}const he=({protocol:e})=>'http:'===e||'https:'===e
function pe(e,n,t,o){const r=n&&he(n)
let i
if(ae(e))i=new u(e,n)
else if(!r&&'#'===e[0])i=se(e,n,t)
else try{i=new u(e)}catch{if(!r)i=ce(e,n,t)}if('file:'!==i.protocol)return i
return X(i,n)}function de(e,o,r){if(r)if(he(r)){if(ae(e)){if(o&&'https:'!==o.protocol&&'http:'!==o.protocol)throw new j(e,r,'remote imports cannot import from a local location.')
return{url:o.href}}if(n(e)&&t(e))throw new j(e,r,'remote imports cannot import from a local location.')
throw new j(e,r,'only relative and absolute specifiers are supported.')}}function we(e){if(!['file:','data:','node:'].includes(e.protocol))throw new x(e,['file','data','node'])}function me(e){if(e&&'file:'!==e.protocol&&'data:'!==e.protocol)throw new x(e,['file','data'])}const _e=(e,n)=>{let{parentURL:t,conditions:o}=n
const r=void 0===t
if(r)t=c(`${process.cwd()}/`).href
let i,s
if(t)try{i=new u(t)}catch{}try{if(ae(e))s=new u(e,i)
else s=new u(e)
if('data:'===s.protocol)return{url:s.href}}catch{}const l=de(e,s,i)
if(l)return l
if(s&&'node:'===s.protocol)return{url:e}
let f
me(s),o=K(o)
try{f=pe(e,t,o,r?T:b)}catch(e){throw e}return we(f),{url:f.href,format:ge(f,n)}}
function ge(e,n){const t=new u(e)
if(xe.has(t.protocol))return xe.get(t.protocol)(t,n,true)}function Ee(e,n,t){const o=a(e),r=f(o)
if('.js'===r)return'module'===le(e)?'module':'commonjs'
const i=Ae[r]
if(i)return i
return Ne[r]??null}function Re(e){const n=Oe.exec(e.pathname)
return je((null==n?void 0:n[1])??'')}const je=e=>{if(null!==ye.exec(e))return'module'
if('application/json'===e)return'json'
return null},xe=new I([['data:',Re],['file:',Ee],['node:',(e,n,t)=>'builtin']]),ye=/\s*(text|application)\/javascript\s*(;\s*charset=utf-?8\s*)?/i,Oe=/^([^/]+\/[^;,]+)(?:[^,]*?)(;base64)?,/,Ae={__proto__:null,'.cjs':'commonjs','.js':'module','.json':'json','.mjs':'module'},Ne={__proto__:null,'.cjs':'commonjs','.js':'commonjs','.json':'commonjs','.mjs':'module','.node':'commonjs'}
export{_e as esmResolveSync}
