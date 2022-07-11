import{getOptionValue as e,canBeImportedByUsers as n,canBeImportedWithoutScheme as t,getPackageScopeConfig as o,fastStat as i,STAT_IS_DIR as r,STAT_IS_FILE as s,getIntrinsicPackageConfig as l,getPackageConfig as f}from'internal'
import{extname as c,basename as u,relative as a,resolve as p}from'path'
import{pathToFileURL as d,URL as h,fileURLToPath as w}from'url'
import{codes as m}from'internal/errors'
const{ERR_INVALID_ARG_VALUE:g,ERR_INVALID_MODULE_SPECIFIER:_,ERR_INVALID_PACKAGE_CONFIG:j,ERR_INVALID_PACKAGE_TARGET:x,ERR_MODULE_NOT_FOUND:E,ERR_PACKAGE_IMPORT_NOT_DEFINED:R,ERR_PACKAGE_PATH_NOT_EXPORTED:y,ERR_UNSUPPORTED_DIR_IMPORT:O,ERR_NETWORK_IMPORT_DISALLOWED:$,ERR_UNSUPPORTED_ESM_URL_SCHEME:P,ERR_UNKNOWN_FILE_EXTENSION:N}=m,A=Object.freeze,v=Object.getOwnPropertyNames,I=JSON.stringify,b=Set,D=Map,T=Array.isArray,W=(...e)=>RegExp.prototype[Symbol.replace].call(...e),k=e('--preserve-symlinks'),L=e('--preserve-symlinks-main'),S='node'===e('--es-module-specifier-resolution'),U=A(['node','import',...e('--no-addons')?[]:['node-addons'],...e('--conditions')]),C=new b(U),G=new b
function M(e,n,t){const o=w(n),i=`${o}|${e}`
if(!G.has(i))G.add(i),F(`${o} - deprecated trailing slash pattern mapping in "exports" field`,'DEP0155')}function K(e,n,t,o){const i=Oe(e,{parentURL:''})
if('module'!==i)return
const r=w(new h('.',n))
F(`${r} - ${o?'"main" field missing file ext':'no "main" or "exports" field'}`,'DEP0151')}const F=(e,n)=>process.emitWarning(e,'DeprecationWarning',n)
function V(e){if(void 0!==e&&e!==U){if(!T(e))throw new g('conditions',e,'expected an array')
return new b(e)}return C}const H=e=>i(e)===s
function X(e,n,t){let o,{main:i}=n
if(void 0!==i){if(H(o=new h(`./${i}`,e)))return o
else if(H(o=new h(`./${i}.js`,e)));else if(H(o=new h(`./${i}.json`,e)));else if(H(o=new h(`./${i}.node`,e)));else if(H(o=new h(`./${i}/index.js`,e)));else if(H(o=new h(`./${i}/index.json`,e)));else if(H(o=new h(`./${i}/index.node`,e)));else o=void 0
if(o)return K(o,e,t,i),o}if(H(o=new h('./index.js',e)));else if(H(o=new h('./index.json',e)));else if(H(o=new h('./index.node',e)));else o=void 0
if(o)return K(o,e,t,i),o
throw new E(w(new h('.',e)),w(t))}function q(e){if(H(e))return e
return J(e)}const z=['.js','.json','.node','.mjs']
function J(e){for(let n=0;n<z.length;n++){const t=new h(`${e.pathname}${z[n]}`,e)
if(H(t))return t}}function B(e){const n=w(e),t=p(n,'package.json')
if(H(t)){const e=f(t)
if('string'===typeof e.main){const t=d(p(n,e.main))
return q(t)}}return J(new h('index',e))}const Q=/%2F|%5C/i
function Y(e,n,t){if(null!==Q.exec(e.pathname))throw new _(e.pathname,'must not include encoded "/" or "\\" characters',w(n))
let o=w(e)
if(S){let t=q(e)
if(void 0===t){if(t=o.endsWith('/')?B(e)||e:B(new h(`${e}/`)),t===e)return t
if(void 0===t)throw new E(e.pathname,w(n),'module')}return t}const l=i(o.endsWith('/')?o.slice(-1):o)
if(l===r){const t=new O(o,w(n))
throw t.url=String(e),t}else if(l!==s)throw new E(o||e.pathname,n&&w(n),'module')
return e}function Z(e,n,t){throw new R(e,n&&w(new h('.',n)),w(t))}function ee(e,n,t){throw new y(w(new h('.',n)),e,t&&w(t))}function ne(e,n,t,o){const i=`request is not a valid subpath for the "${t?'imports':'exports'}" resolution of ${w(n)}`
throw new _(e,i,o&&w(o))}function te(e,n,t,o,i){if('object'===typeof n&&null!==n)n=I(n,null,'')
else n=`${n}`
throw new x(w(new h('.',t)),e,n,o,i&&w(i))}const oe=/(^|\\|\/)((\.|%2e)(\.|%2e)?|(n|%6e|%4e)(o|%6f|%4f)(d|%64|%44)(e|%65|%45)(_|%5f)(m|%6d|%4d)(o|%6f|%4f)(d|%64|%44)(u|%75|%55)(l|%6c|%4c)(e|%65|%45)(s|%73|%53))(\\|\/|$)/i,ie=/^\.|%|\\/,re=/\*/g
function se(e,n,t,o,i,r,s,l){if(''!==n&&!r&&'/'!==e[e.length-1])te(t,e,o,s,i)
if(!e.startsWith('./')){if(s&&!e.startsWith('../')&&!e.startsWith('/')){let t=false
try{new h(e),t=true}catch{}if(!t){const t=r?W(re,e,(()=>n)):e+n
return we(t,o,l)}}te(t,e,o,s,i)}if(null!==oe.exec(e.slice(2)))te(t,e,o,s,i)
const f=new h(e,o),c=f.pathname,u=new h('.',o).pathname
if(!c.startsWith(u))te(t,e,o,s,i)
if(''===n)return f
if(null!==oe.exec(n)){const e=r?t.replace('*',(()=>n)):t+n
ne(e,o,s,i)}if(r)return new h(W(re,f.href,(()=>n)))
return new h(n,f)}function le(e){const n=+e
if(`${n}`!==e)return false
return n>=0&&n<4294967295}function fe(e,n,t,o,i,r,s,l){if('string'===typeof n)return se(n,t,o,e,i,r,s,l)
else if(T(n)){if(0===n.length)return null
let f
for(let c=0;c<n.length;c++){const u=n[c]
let a
try{a=fe(e,u,t,o,i,r,s,l)}catch(e){if(f=e,'ERR_INVALID_PACKAGE_TARGET'===e.code)continue
throw e}if(void 0===a)continue
if(null===a){f=null
continue}return a}if(void 0===f||null===f)return f
throw f}else if(null!==n&&'object'===typeof n){const f=v(n)
for(let n=0;n<f.length;n++){const t=f[n]
if(le(t))throw new j(w(e),i,'"exports" cannot contain numeric property keys.')}for(let c=0;c<f.length;c++){const u=f[c]
if('default'===u||l.has(u)){const f=n[u],c=fe(e,f,t,o,i,r,s,l)
if(void 0===c)continue
return c}}return}else if(null===n)return null
te(o,n,e,s,i)}function ce(e,n,t){if('string'===typeof e||T(e))return true
if('object'!==typeof e||null===e)return false
const o=v(e)
let i=false,r=0
for(let e=0;e<o.length;e++){const s=o[e],l=''===s||'.'!==s[0]
if(0===r++)i=l
else if(i!==l)throw new j(w(n),t,'"exports" cannot contain some keys starting with \'.\' and some not.'+' The exports object must either be an object of package subpath keys'+' or an object of main entry condition name keys only.')}return i}function ue(e,n,t,o,i){let r=t.exports
if(ce(r,e,o))r={'.':r}
if(r.hasOwnProperty(n)&&!n.includes('*')&&!n.endsWith('/')){const t=r[n],s=fe(e,t,'',n,o,false,false,i)
if(null==s)ee(n,e,o)
return s}let s='',l
const f=v(r)
for(let t=0;t<f.length;t++){const o=f[t],i=o.indexOf('*')
if(-1!==i&&n.startsWith(o.slice(0,i))){if(n.endsWith('/'))M(n,e)
const t=o.slice(i+1)
if(n.length>=o.length&&n.endsWith(t)&&1===ae(s,o)&&o.indexOf('*')===i)s=o,l=n.slice(i,n.length-t.length)}}if(s){const t=r[s],f=fe(e,t,l,s,o,true,false,i)
if(null==f)ee(n,e,o)
return f}ee(n,e,o)}function ae(e,n){const t=e.indexOf('*'),o=n.indexOf('*'),i=-1===t?e.length:t+1,r=-1===o?n.length:o+1
if(i>r)return-1
if(r>i)return 1
if(-1===t)return 1
if(-1===o)return-1
if(e.length>n.length)return-1
if(n.length>e.length)return 1
return 0}function pe(e,n,t){if('#'===e||e.startsWith('#/')||e.endsWith('/')){const t='is not a valid internal imports specifier name'
throw new _(e,t,w(n))}let i
const r=o(n)
if(r.exists){i=d(r.pjsonPath)
const o=r.imports
if(o)if(o.hasOwnProperty(e)&&!e.includes('*')){const r=fe(i,o[e],'',e,n,false,true,t)
if(null!=r)return r}else{let r='',s
const l=v(o)
for(let n=0;n<l.length;n++){const t=l[n],o=t.indexOf('*')
if(-1!==o&&e.startsWith(t.slice(0,o))){const n=t.slice(o+1)
if(e.length>=t.length&&e.endsWith(n)&&1===ae(r,t)&&t.lastIndexOf('*')===o)r=t,s=e.slice(o,e.length-n.length)}}if(r){const e=o[r],l=fe(i,e,s,r,n,true,true,t)
if(null!=l)return l}}}Z(e,i,n)}function de(e){const n=o(e)
return n.type}function he(e,n){let t=e.indexOf('/'),o=true,i=false
if('@'===e[0])if(i=true,-1===t||0===e.length)o=false
else t=e.indexOf('/',t+1)
const r=-1===t?e:e.slice(0,t)
if(null!==ie.exec(r))o=false
if(!o)throw new _(e,'is not a valid package name',w(n))
const s='.'+(-1===t?'':e.slice(t))
return{packageName:r,packageSubpath:s,isScoped:i}}function we(e,s,c){if(n(e)&&t(e))return new h(`node:${e}`)
const{packageName:u,packageSubpath:a,isScoped:p}=he(e,s)
let m=l(u,e,s)
if(m.exists){const e=d(m.pjsonPath)
if(void 0!==m.exports&&null!==m.exports)return ue(e,a,m,s,c)
if('.'===a)return X(e,m,s)
return new h(a,e)}if(m=o(s),m.exists){const e=d(m.pjsonPath)
if(m.name===u&&void 0!==m.exports&&null!==m.exports)return ue(e,a,m,s,c)}let g=new h('./node_modules/'+u+'/package.json',s),_=w(g),j
do{const n=i(_.slice(0,_.length-13))
if(n!==r){j=_,g=new h((p?'../../../../node_modules/':'../../../node_modules/')+u+'/package.json',g),_=w(g)
continue}const t=f(_,e,s)
if(void 0!==t.exports&&null!==t.exports)return ue(g,a,t,s,c)
if('.'===a)return X(g,t,s)
return new h(a,g)}while(_.length!==j.length)
throw new E(u,w(s))}function me(e){if('.'===e[0]){if(1===e.length||'/'===e[1])return true
if('.'===e[1])if(2===e.length||'/'===e[2])return true}return false}function ge(e){if(''===e)return false
if('/'===e[0])return true
return me(e)}const _e=({protocol:e})=>'http:'===e||'https:'===e
function je(e,n,t,o){const i=n&&_e(n)
let r
if(ge(e))r=new h(e,n)
else if(!i&&'#'===e[0])r=pe(e,n,t)
else try{r=new h(e)}catch{if(!i)r=we(e,n,t)}if('file:'!==r.protocol)return r
return Y(r,n)}function xe(e,o,i){if(i)if(_e(i)){if(ge(e)){if(o&&'https:'!==o.protocol&&'http:'!==o.protocol)throw new $(e,i,'remote imports cannot import from a local location.')
return{url:o.href}}if(n(e)&&t(e))throw new $(e,i,'remote imports cannot import from a local location.')
throw new $(e,i,'only relative and absolute specifiers are supported.')}}function Ee(e){if(!['file:','data:','node:'].includes(e.protocol))throw new P(e,['file','data','node'])}function Re(e){if(e&&'file:'!==e.protocol&&'data:'!==e.protocol)throw new P(e,['file','data'])}const ye=(e,n)=>{let{parentURL:t,conditions:o}=n
const i=void 0===t
if(i)t=d(`${process.cwd()}/`).href
let r,s
if(t)try{r=new h(t)}catch{}try{if(ge(e))s=new h(e,r)
else s=new h(e)
if('data:'===s.protocol)return{url:s.href}}catch{}const l=xe(e,s,r)
if(l)return l
if(s&&'node:'===s.protocol)return{url:e}
let f
Re(s),o=V(o)
try{f=je(e,t,o,i?L:k)}catch(e){throw e}return Ee(f),{url:f.href,format:Oe(f,n)}}
function Oe(e,n){const t=new h(e)
if(Ae.has(t.protocol))return Ae.get(t.protocol)(t,n,true)}function $e(e,n,t){const i=w(e),r=c(i)
if('.js'===r)return'module'===de(e)?'module':'commonjs'
const s=be[r]
if(s)return s
if(S){if(t)return
let n=''
if('module'===de(e)&&''===r){const t=o(e),r=u(i),s=a(t.pjsonPath,i).slice(1)
n='Loading extensionless files is not supported inside of '+'"type":"module" package.json contexts. The package.json file '+`${t.pjsonPath} caused this "type":"module" context. Try `+`changing ${i} to have a file extension. Note the "bin" `+'field of package.json can point to a file with an extension, for example '+`{"type":"module","bin":{"${r}":"${s}.js"}}`}throw new N(r,i,n)}return De[r]??null}function Pe(e){const n=Ie.exec(e.pathname)
return Ne((null==n?void 0:n[1])??'')}const Ne=e=>{if(null!==ve.exec(e))return'module'
if('application/json'===e)return'json'
return null},Ae=new D([['data:',Pe],['file:',$e],['node:',(e,n,t)=>'builtin']]),ve=/\s*(text|application)\/javascript\s*(;\s*charset=utf-?8\s*)?/i,Ie=/^([^/]+\/[^;,]+)(?:[^,]*?)(;base64)?,/,be={__proto__:null,'.cjs':'commonjs','.js':'module','.json':'json','.mjs':'module'},De={__proto__:null,'.cjs':'commonjs','.js':'commonjs','.json':'commonjs','.mjs':'module','.node':'commonjs'},Te=()=>e('--loader'),We=U
export{We as conditions,Te as getUserLoader,ye as resolveSync}
