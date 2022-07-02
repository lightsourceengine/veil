import{getOptionValue as e,canBeImportedByUsers as n,canBeImportedWithoutScheme as t,fastStat as o,STAT_IS_DIR as r,STAT_IS_FILE as i,getPackageScopeConfig as s,getIntrinsicPackageConfig as l,getPackageConfig as f}from'internal'
import{extname as c}from'path'
import{pathToFileURL as u,URL as a,fileURLToPath as h}from'url'
import{codes as p}from'internal/errors'
const{ERR_INVALID_ARG_VALUE:d,ERR_INVALID_MODULE_SPECIFIER:w,ERR_INVALID_PACKAGE_CONFIG:m,ERR_INVALID_PACKAGE_TARGET:_,ERR_MODULE_NOT_FOUND:g,ERR_PACKAGE_IMPORT_NOT_DEFINED:x,ERR_PACKAGE_PATH_NOT_EXPORTED:E,ERR_UNSUPPORTED_DIR_IMPORT:R,ERR_NETWORK_IMPORT_DISALLOWED:j,ERR_UNSUPPORTED_ESM_URL_SCHEME:y,ERR_UNKNOWN_FILE_EXTENSION:O}=p,P=Object.freeze,A=Object.getOwnPropertyNames,N=JSON.stringify,I=Set,v=Map,D=Array.isArray,W=(...e)=>RegExp.prototype[Symbol.replace].call(...e),b=e('--preserve-symlinks'),T=e('--preserve-symlinks-main'),$=[],S=e('--no-addons'),k=S?[]:['node-addons'],L=P(['node','import',...k,...$]),U=new I(L),C=new I
function G(e,n,t){const o=h(n),r=`pjsonPath + '|' + match`
if(!C.has(r))C.add(r),K(`${o} - deprecated trailing slash pattern mapping in "exports" field`,'DEP0155')}function M(e,n,t,o){const r=xe(e,{parentURL:''})
if('module'!==r)return
const i=h(new a('.',n))
K(`${i} - ${o?'"main" field missing file ext':'no "main" or "exports" field'}`,'DEP0151')}const K=(e,n)=>process.emitWarning(e,'DeprecationWarning',n)
function F(e){if(void 0!==e&&e!==L){if(!D(e))throw new d('conditions',e,'expected an array')
return new I(e)}return U}const V=e=>o(e)===i
function H(e,n,t){let o,{main:r}=n
if(void 0!==r){if(V(o=new a(`./${r}`,e)))return o
else if(V(o=new a(`./${r}.js`,e)));else if(V(o=new a(`./${r}.json`,e)));else if(V(o=new a(`./${r}.node`,e)));else if(V(o=new a(`./${r}/index.js`,e)));else if(V(o=new a(`./${r}/index.json`,e)));else if(V(o=new a(`./${r}/index.node`,e)));else o=void 0
if(o)return M(o,e,t,r),o}if(V(o=new a('./index.js',e)));else if(V(o=new a('./index.json',e)));else if(V(o=new a('./index.node',e)));else o=void 0
if(o)return M(o,e,t,r),o
throw new g(h(new a('.',e)),h(t))}const X=/%2F|%5C/i
function q(e,n,t){if(null!==X.exec(e.pathname))throw new w(e.pathname,'must not include encoded "/" or "\\" characters',h(n))
let s=h(e)
const l=o(s.endsWith('/')?s.slice(-1):s)
if(l===r){const t=new R(s,h(n))
throw t.url=String(e),t}else if(l!==i)throw new g(s||e.pathname,n&&h(n),'module')
return e}function z(e,n,t){throw new x(e,n&&h(new a('.',n)),h(t))}function J(e,n,t){throw new E(h(new a('.',n)),e,t&&h(t))}function B(e,n,t,o){const r=`request is not a valid subpath for the "${t?'imports':'exports'}" resolution of ${h(n)}`
throw new w(e,r,o&&h(o))}function Q(e,n,t,o,r){if('object'===typeof n&&null!==n)n=N(n,null,'')
else n=`${n}`
throw new _(h(new a('.',t)),e,n,o,r&&h(r))}const Y=/(^|\\|\/)((\.|%2e)(\.|%2e)?|(n|%6e|%4e)(o|%6f|%4f)(d|%64|%44)(e|%65|%45)(_|%5f)(m|%6d|%4d)(o|%6f|%4f)(d|%64|%44)(u|%75|%55)(l|%6c|%4c)(e|%65|%45)(s|%73|%53))(\\|\/|$)/i,Z=/^\.|%|\\/,ee=/\*/g
function ne(e,n,t,o,r,i,s,l){if(''!==n&&!i&&'/'!==e[e.length-1])Q(t,e,o,s,r)
if(!e.startsWith('./')){if(s&&!e.startsWith('../')&&!e.startsWith('/')){let t=false
try{new a(e),t=true}catch{}if(!t){const t=i?W(ee,e,(()=>n)):e+n
return ue(t,o,l)}}Q(t,e,o,s,r)}if(null!==Y.exec(e.slice(2)))Q(t,e,o,s,r)
const f=new a(e,o),c=f.pathname,u=new a('.',o).pathname
if(!c.startsWith(u))Q(t,e,o,s,r)
if(''===n)return f
if(null!==Y.exec(n)){const e=i?t.replace('*',(()=>n)):t+n
B(e,o,s,r)}if(i)return new a(W(ee,f.href,(()=>n)))
return new a(n,f)}function te(e){const n=+e
if(`${n}`!==e)return false
return n>=0&&n<4294967295}function oe(e,n,t,o,r,i,s,l){if('string'===typeof n)return ne(n,t,o,e,r,i,s,l)
else if(D(n)){if(0===n.length)return null
let f
for(let c=0;c<n.length;c++){const u=n[c]
let a
try{a=oe(e,u,t,o,r,i,s,l)}catch(e){if(f=e,'ERR_INVALID_PACKAGE_TARGET'===e.code)continue
throw e}if(void 0===a)continue
if(null===a){f=null
continue}return a}if(void 0===f||null===f)return f
throw f}else if(null!==n&&'object'===typeof n){const f=A(n)
for(let n=0;n<f.length;n++){const t=f[n]
if(te(t))throw new m(h(e),r,'"exports" cannot contain numeric property keys.')}for(let c=0;c<f.length;c++){const u=f[c]
if('default'===u||l.has(u)){const f=n[u],c=oe(e,f,t,o,r,i,s,l)
if(void 0===c)continue
return c}}return}else if(null===n)return null
Q(o,n,e,s,r)}function re(e,n,t){if('string'===typeof e||D(e))return true
if('object'!==typeof e||null===e)return false
const o=A(e)
let r=false,i=0
for(let e=0;e<o.length;e++){const s=o[e],l=''===s||'.'!==s[0]
if(0===i++)r=l
else if(r!==l)throw new m(h(n),t,'"exports" cannot contain some keys starting with \'.\' and some not.'+' The exports object must either be an object of package subpath keys'+' or an object of main entry condition name keys only.')}return r}function ie(e,n,t,o,r){let i=t.exports
if(re(i,e,o))i={'.':i}
if(i.hasOwnProperty(n)&&!n.includes('*')&&!n.endsWith('/')){const t=i[n],s=oe(e,t,'',n,o,false,false,r)
if(null==s)J(n,e,o)
return s}let s='',l
const f=A(i)
for(let t=0;t<f.length;t++){const o=f[t],r=o.indexOf('*')
if(-1!==r&&n.startsWith(o.slice(0,r))){if(n.endsWith('/'))G(n,e)
const t=o.slice(r+1)
if(n.length>=o.length&&n.endsWith(t)&&1===se(s,o)&&o.indexOf('*')===r)s=o,l=n.slice(r,n.length-t.length)}}if(s){const t=i[s],f=oe(e,t,l,s,o,true,false,r)
if(null==f)J(n,e,o)
return f}J(n,e,o)}function se(e,n){const t=e.indexOf('*'),o=n.indexOf('*'),r=-1===t?e.length:t+1,i=-1===o?n.length:o+1
if(r>i)return-1
if(i>r)return 1
if(-1===t)return 1
if(-1===o)return-1
if(e.length>n.length)return-1
if(n.length>e.length)return 1
return 0}function le(e,n,t){if('#'===e||e.startsWith('#/')||e.endsWith('/')){const t='is not a valid internal imports specifier name'
throw new w(e,t,h(n))}let o
const r=s(n)
if(r.exists){o=u(r.pjsonPath)
const i=r.imports
if(i)if(i.hasOwnProperty(e)&&!e.includes('*')){const r=oe(o,i[e],'',e,n,false,true,t)
if(null!=r)return r}else{let r='',s
const l=A(i)
for(let n=0;n<l.length;n++){const t=l[n],o=t.indexOf('*')
if(-1!==o&&e.startsWith(t.slice(0,o))){const n=t.slice(o+1)
if(e.length>=t.length&&e.endsWith(n)&&1===se(r,t)&&t.lastIndexOf('*')===o)r=t,s=e.slice(o,e.length-n.length)}}if(r){const e=i[r],l=oe(o,e,s,r,n,true,true,t)
if(null!=l)return l}}}z(e,o,n)}function fe(e){const n=s(e)
return n.type}function ce(e,n){let t=e.indexOf('/'),o=true,r=false
if('@'===e[0])if(r=true,-1===t||0===e.length)o=false
else t=e.indexOf('/',t+1)
const i=-1===t?e:e.slice(0,t)
if(null!==Z.exec(i))o=false
if(!o)throw new w(e,'is not a valid package name',h(n))
const s='.'+(-1===t?'':e.slice(t))
return{packageName:i,packageSubpath:s,isScoped:r}}function ue(e,i,c){if(n(e)&&t(e))return new a(`node:${e}`)
const{packageName:p,packageSubpath:d,isScoped:w}=ce(e,i)
let m=l(p,e,i)
if(m.exists){const e=u(m.pjsonPath)
if(void 0!==m.exports&&null!==m.exports)return ie(e,d,m,i,c)
if('.'===d)return H(e,m,i)
return new a(d,e)}if(m=s(i),m.exists){const e=u(m.pjsonPath)
if(m.name===p&&void 0!==m.exports&&null!==m.exports)return ie(e,d,m,i,c)}let _=new a('./node_modules/'+p+'/package.json',i),x=h(_),E
do{const n=o(x.slice(0,x.length-13))
if(n!==r){E=x,_=new a((w?'../../../../node_modules/':'../../../node_modules/')+p+'/package.json',_),x=h(_)
continue}const t=f(x,e,i)
if(void 0!==t.exports&&null!==t.exports)return ie(_,d,t,i,c)
if('.'===d)return H(_,t,i)
return new a(d,_)}while(x.length!==E.length)
throw new g(p,h(i))}function ae(e){if('.'===e[0]){if(1===e.length||'/'===e[1])return true
if('.'===e[1])if(2===e.length||'/'===e[2])return true}return false}function he(e){if(''===e)return false
if('/'===e[0])return true
return ae(e)}const pe=({protocol:e})=>'http:'===e||'https:'===e
function de(e,n,t,o){const r=n&&pe(n)
let i
if(he(e))i=new a(e,n)
else if(!r&&'#'===e[0])i=le(e,n,t)
else try{i=new a(e)}catch{if(!r)i=ue(e,n,t)}if('file:'!==i.protocol)return i
return q(i,n)}function we(e,o,r){if(r)if(pe(r)){if(he(e)){if(o&&'https:'!==o.protocol&&'http:'!==o.protocol)throw new j(e,r,'remote imports cannot import from a local location.')
return{url:o.href}}if(n(e)&&t(e))throw new j(e,r,'remote imports cannot import from a local location.')
throw new j(e,r,'only relative and absolute specifiers are supported.')}}function me(e){if(!['file:','data:','node:'].includes(e.protocol))throw new y(e,['file','data','node'])}function _e(e){if(e&&'file:'!==e.protocol&&'data:'!==e.protocol)throw new y(e,['file','data'])}const ge=(e,n)=>{let{parentURL:t,conditions:o}=n
const r=void 0===t
if(r)t=u(`${process.cwd()}/`).href
let i,s
if(t)try{i=new a(t)}catch{}try{if(he(e))s=new a(e,i)
else s=new a(e)
if('data:'===s.protocol)return{url:s.href}}catch{}const l=we(e,s,i)
if(l)return l
if(s&&'node:'===s.protocol)return{url:e}
let f
_e(s),o=F(o)
try{f=de(e,t,o,r?T:b)}catch(e){throw e}return me(f),{url:f.href,format:xe(f,n)}}
function xe(e,n){const t=new a(e)
if(ye.has(t.protocol))return ye.get(t.protocol)(t,n,true)}function Ee(e,n,t){const o=h(e),r=c(o)
if('.js'===r)return'module'===fe(e)?'module':'commonjs'
const i=Ae[r]
if(i)return i
return Ne[r]??null}function Re(e){const n=Pe.exec(e.pathname)
return je((null==n?void 0:n[1])??'')}const je=e=>{if(null!==Oe.exec(e))return'module'
if('application/json'===e)return'json'
return null},ye=new v([['data:',Re],['file:',Ee],['node:',(e,n,t)=>'builtin']]),Oe=/\s*(text|application)\/javascript\s*(;\s*charset=utf-?8\s*)?/i,Pe=/^([^/]+\/[^;,]+)(?:[^,]*?)(;base64)?,/,Ae={__proto__:null,'.cjs':'commonjs','.js':'module','.json':'json','.mjs':'module'},Ne={__proto__:null,'.cjs':'commonjs','.js':'commonjs','.json':'commonjs','.mjs':'module','.node':'commonjs'}
export{ge as esmResolveSync}
