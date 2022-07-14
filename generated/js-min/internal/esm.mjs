import{getOptionValue as e,canBeImportedByUsers as n,canBeImportedWithoutScheme as t,getPackageScopeConfig as o,fastStat as i,STAT_IS_DIR as r,STAT_IS_FILE as s,realpathCache as l,getIntrinsicPackageConfig as f,getPackageConfig as c}from'internal'
import{extname as u,basename as a,relative as h,sep as p,resolve as d}from'path'
import{pathToFileURL as m,URL as w,fileURLToPath as g}from'url'
import{realpathSync as _}from'fs'
import{codes as j}from'internal/errors'
const{ERR_INVALID_ARG_VALUE:x,ERR_INVALID_MODULE_SPECIFIER:E,ERR_INVALID_PACKAGE_CONFIG:R,ERR_INVALID_PACKAGE_TARGET:y,ERR_MODULE_NOT_FOUND:O,ERR_PACKAGE_IMPORT_NOT_DEFINED:$,ERR_PACKAGE_PATH_NOT_EXPORTED:P,ERR_UNSUPPORTED_DIR_IMPORT:N,ERR_NETWORK_IMPORT_DISALLOWED:A,ERR_UNSUPPORTED_ESM_URL_SCHEME:v,ERR_UNKNOWN_FILE_EXTENSION:I}=j,b=Object.freeze,W=Object.getOwnPropertyNames,D=JSON.stringify,T=Set,k=Map,S=Array.isArray,L=(...e)=>RegExp.prototype[Symbol.replace].call(...e),U=Symbol.for('realpathCacheKey'),C=e('--preserve-symlinks'),G=e('--preserve-symlinks-main'),K='node'===e('--es-module-specifier-resolution'),M=b(['node','import',...e('--no-addons')?[]:['node-addons'],...e('--conditions')]),F=new T(M),V=new T
function H(e,n,t){const o=g(n),i=`${o}|${e}`
if(!V.has(i))V.add(i),q(`${o} - deprecated trailing slash pattern mapping in "exports" field`,'DEP0155')}function X(e,n,t,o){const i=Ae(e,{parentURL:''})
if('module'!==i)return
const r=g(new w('.',n))
q(`${r} - ${o?'"main" field missing file ext':'no "main" or "exports" field'}`,'DEP0151')}const q=(e,n)=>process.emitWarning(e,'DeprecationWarning',n)
function z(e){if(void 0!==e&&e!==M){if(!S(e))throw new x('conditions',e,'expected an array')
return new T(e)}return F}const J=e=>i(e)===s
function B(e,n,t){let o,{main:i}=n
if(void 0!==i){if(J(o=new w(`./${i}`,e)))return o
else if(J(o=new w(`./${i}.js`,e)));else if(J(o=new w(`./${i}.json`,e)));else if(J(o=new w(`./${i}.node`,e)));else if(J(o=new w(`./${i}/index.js`,e)));else if(J(o=new w(`./${i}/index.json`,e)));else if(J(o=new w(`./${i}/index.node`,e)));else o=void 0
if(o)return X(o,e,t,i),o}if(J(o=new w('./index.js',e)));else if(J(o=new w('./index.json',e)));else if(J(o=new w('./index.node',e)));else o=void 0
if(o)return X(o,e,t,i),o
throw new O(g(new w('.',e)),g(t))}function Q(e){if(J(e))return e
return Z(e)}const Y=['.js','.json','.node','.mjs']
function Z(e){for(let n=0;n<Y.length;n++){const t=new w(`${e.pathname}${Y[n]}`,e)
if(J(t))return t}}function ee(e){const n=g(e),t=d(n,'package.json')
if(J(t)){const e=c(t)
if('string'===typeof e.main){const t=m(d(n,e.main))
return Q(t)}}return Z(new w('index',e))}const ne=/%2F|%5C/i
function te(e,n,t){if(null!==ne.exec(e.pathname))throw new E(e.pathname,'must not include encoded "/" or "\\" characters',g(n))
let o=g(e)
if(K){let t=Q(e)
if(void 0===t){if(t=o.endsWith('/')?ee(e)||e:ee(new w(`${e}/`)),t===e)return t
if(void 0===t)throw new O(e.pathname,g(n),'module')}return t}const f=i(o.endsWith('/')?o.slice(-1):o)
if(f===r){const t=new N(o,g(n))
throw t.url=String(e),t}else if(f!==s)throw new O(o||e.pathname,n&&g(n),'module')
if(!t){const n=_(o,{[U]:l}),{search:t,hash:i}=e
e=m(n+(o.endsWith(p)?'/':'')),e.search=t,e.hash=i}return e}function oe(e,n,t){throw new $(e,n&&g(new w('.',n)),g(t))}function ie(e,n,t){throw new P(g(new w('.',n)),e,t&&g(t))}function re(e,n,t,o){const i=`request is not a valid subpath for the "${t?'imports':'exports'}" resolution of ${g(n)}`
throw new E(e,i,o&&g(o))}function se(e,n,t,o,i){if('object'===typeof n&&null!==n)n=D(n,null,'')
else n=`${n}`
throw new y(g(new w('.',t)),e,n,o,i&&g(i))}const le=/(^|\\|\/)((\.|%2e)(\.|%2e)?|(n|%6e|%4e)(o|%6f|%4f)(d|%64|%44)(e|%65|%45)(_|%5f)(m|%6d|%4d)(o|%6f|%4f)(d|%64|%44)(u|%75|%55)(l|%6c|%4c)(e|%65|%45)(s|%73|%53))(\\|\/|$)/i,fe=/^\.|%|\\/,ce=/\*/g
function ue(e,n,t,o,i,r,s,l){if(''!==n&&!r&&'/'!==e[e.length-1])se(t,e,o,s,i)
if(!e.startsWith('./')){if(s&&!e.startsWith('../')&&!e.startsWith('/')){let t=false
try{new w(e),t=true}catch{}if(!t){const t=r?L(ce,e,(()=>n)):e+n
return je(t,o,l)}}se(t,e,o,s,i)}if(null!==le.exec(e.slice(2)))se(t,e,o,s,i)
const f=new w(e,o),c=f.pathname,u=new w('.',o).pathname
if(!c.startsWith(u))se(t,e,o,s,i)
if(''===n)return f
if(null!==le.exec(n)){const e=r?t.replace('*',(()=>n)):t+n
re(e,o,s,i)}if(r)return new w(L(ce,f.href,(()=>n)))
return new w(n,f)}function ae(e){const n=+e
if(`${n}`!==e)return false
return n>=0&&n<4294967295}function he(e,n,t,o,i,r,s,l){if('string'===typeof n)return ue(n,t,o,e,i,r,s,l)
else if(S(n)){if(0===n.length)return null
let f
for(let c=0;c<n.length;c++){const u=n[c]
let a
try{a=he(e,u,t,o,i,r,s,l)}catch(e){if(f=e,'ERR_INVALID_PACKAGE_TARGET'===e.code)continue
throw e}if(void 0===a)continue
if(null===a){f=null
continue}return a}if(void 0===f||null===f)return f
throw f}else if(null!==n&&'object'===typeof n){const f=W(n)
for(let n=0;n<f.length;n++){const t=f[n]
if(ae(t))throw new R(g(e),i,'"exports" cannot contain numeric property keys.')}for(let c=0;c<f.length;c++){const u=f[c]
if('default'===u||l.has(u)){const f=n[u],c=he(e,f,t,o,i,r,s,l)
if(void 0===c)continue
return c}}return}else if(null===n)return null
se(o,n,e,s,i)}function pe(e,n,t){if('string'===typeof e||S(e))return true
if('object'!==typeof e||null===e)return false
const o=W(e)
let i=false,r=0
for(let e=0;e<o.length;e++){const s=o[e],l=''===s||'.'!==s[0]
if(0===r++)i=l
else if(i!==l)throw new R(g(n),t,'"exports" cannot contain some keys starting with \'.\' and some not.'+' The exports object must either be an object of package subpath keys'+' or an object of main entry condition name keys only.')}return i}function de(e,n,t,o,i){let r=t.exports
if(pe(r,e,o))r={'.':r}
if(r.hasOwnProperty(n)&&!n.includes('*')&&!n.endsWith('/')){const t=r[n],s=he(e,t,'',n,o,false,false,i)
if(null==s)ie(n,e,o)
return s}let s='',l
const f=W(r)
for(let t=0;t<f.length;t++){const o=f[t],i=o.indexOf('*')
if(-1!==i&&n.startsWith(o.slice(0,i))){if(n.endsWith('/'))H(n,e)
const t=o.slice(i+1)
if(n.length>=o.length&&n.endsWith(t)&&1===me(s,o)&&o.indexOf('*')===i)s=o,l=n.slice(i,n.length-t.length)}}if(s){const t=r[s],f=he(e,t,l,s,o,true,false,i)
if(null==f)ie(n,e,o)
return f}ie(n,e,o)}function me(e,n){const t=e.indexOf('*'),o=n.indexOf('*'),i=-1===t?e.length:t+1,r=-1===o?n.length:o+1
if(i>r)return-1
if(r>i)return 1
if(-1===t)return 1
if(-1===o)return-1
if(e.length>n.length)return-1
if(n.length>e.length)return 1
return 0}function we(e,n,t){if('#'===e||e.startsWith('#/')||e.endsWith('/')){const t='is not a valid internal imports specifier name'
throw new E(e,t,g(n))}let i
const r=o(n)
if(r.exists){i=m(r.pjsonPath)
const o=r.imports
if(o)if(o.hasOwnProperty(e)&&!e.includes('*')){const r=he(i,o[e],'',e,n,false,true,t)
if(null!=r)return r}else{let r='',s
const l=W(o)
for(let n=0;n<l.length;n++){const t=l[n],o=t.indexOf('*')
if(-1!==o&&e.startsWith(t.slice(0,o))){const n=t.slice(o+1)
if(e.length>=t.length&&e.endsWith(n)&&1===me(r,t)&&t.lastIndexOf('*')===o)r=t,s=e.slice(o,e.length-n.length)}}if(r){const e=o[r],l=he(i,e,s,r,n,true,true,t)
if(null!=l)return l}}}oe(e,i,n)}function ge(e){const n=o(e)
return n.type}function _e(e,n){let t=e.indexOf('/'),o=true,i=false
if('@'===e[0])if(i=true,-1===t||0===e.length)o=false
else t=e.indexOf('/',t+1)
const r=-1===t?e:e.slice(0,t)
if(null!==fe.exec(r))o=false
if(!o)throw new E(e,'is not a valid package name',g(n))
const s='.'+(-1===t?'':e.slice(t))
return{packageName:r,packageSubpath:s,isScoped:i}}function je(e,s,l){if(n(e)&&t(e))return new w(`node:${e}`)
const{packageName:u,packageSubpath:a,isScoped:h}=_e(e,s)
let p=f(u,e,s)
if(p.exists){const e=m(p.pjsonPath)
if(void 0!==p.exports&&null!==p.exports)return de(e,a,p,s,l)
if('.'===a)return B(e,p,s)
return new w(a,e)}if(p=o(s),p.exists){const e=m(p.pjsonPath)
if(p.name===u&&void 0!==p.exports&&null!==p.exports)return de(e,a,p,s,l)}let d=new w('./node_modules/'+u+'/package.json',s),_=g(d),j
do{const n=i(_.slice(0,_.length-13))
if(n!==r){j=_,d=new w((h?'../../../../node_modules/':'../../../node_modules/')+u+'/package.json',d),_=g(d)
continue}const t=c(_,e,s)
if(void 0!==t.exports&&null!==t.exports)return de(d,a,t,s,l)
if('.'===a)return B(d,t,s)
return new w(a,d)}while(_.length!==j.length)
throw new O(u,g(s))}function xe(e){if('.'===e[0]){if(1===e.length||'/'===e[1])return true
if('.'===e[1])if(2===e.length||'/'===e[2])return true}return false}function Ee(e){if(''===e)return false
if('/'===e[0])return true
return xe(e)}const Re=({protocol:e})=>'http:'===e||'https:'===e
function ye(e,n,t,o){const i=n&&Re(n)
let r
if(Ee(e))r=new w(e,n)
else if(!i&&'#'===e[0])r=we(e,n,t)
else try{r=new w(e)}catch{if(!i)r=je(e,n,t)}if('file:'!==r.protocol)return r
return te(r,n,o)}function Oe(e,o,i){if(i)if(Re(i)){if(Ee(e)){if(o&&'https:'!==o.protocol&&'http:'!==o.protocol)throw new A(e,i,'remote imports cannot import from a local location.')
return{url:o.href}}if(n(e)&&t(e))throw new A(e,i,'remote imports cannot import from a local location.')
throw new A(e,i,'only relative and absolute specifiers are supported.')}}function $e(e){if(!['file:','data:','node:'].includes(e.protocol))throw new v(e,['file','data','node'])}function Pe(e){if(e&&'file:'!==e.protocol&&'data:'!==e.protocol)throw new v(e,['file','data'])}const Ne=(e,n)=>{let{parentURL:t,conditions:o}=n
const i=void 0===t
if(i)t=m(`${process.cwd()}/`).href
let r,s
if(t)try{r=new w(t)}catch{}try{if(Ee(e))s=new w(e,r)
else s=new w(e)
if('data:'===s.protocol)return{url:s.href}}catch{}const l=Oe(e,s,r)
if(l)return l
if(s&&'node:'===s.protocol)return{url:e}
let f
Pe(s),o=z(o)
try{f=ye(e,t,o,i?G:C)}catch(e){throw e}return $e(f),{url:f.href,format:Ae(f,n)}}
function Ae(e,n){const t=new w(e)
if(We.has(t.protocol))return We.get(t.protocol)(t,n,true)}function ve(e,n,t){const i=g(e),r=u(i)
if('.js'===r)return'module'===ge(e)?'module':'commonjs'
const s=ke[r]
if(s)return s
if(K){if(t)return
let n=''
if('module'===ge(e)&&''===r){const t=o(e),r=a(i),s=h(t.pjsonPath,i).slice(1)
n='Loading extensionless files is not supported inside of '+'"type":"module" package.json contexts. The package.json file '+`${t.pjsonPath} caused this "type":"module" context. Try `+`changing ${i} to have a file extension. Note the "bin" `+'field of package.json can point to a file with an extension, for example '+`{"type":"module","bin":{"${r}":"${s}.js"}}`}throw new I(r,i,n)}return Se[r]??null}function Ie(e){const n=Te.exec(e.pathname)
return be((null==n?void 0:n[1])??'')}const be=e=>{if(null!==De.exec(e))return'module'
if('application/json'===e)return'json'
return null},We=new k([['data:',Ie],['file:',ve],['node:',(e,n,t)=>'builtin']]),De=/\s*(text|application)\/javascript\s*(;\s*charset=utf-?8\s*)?/i,Te=/^([^/]+\/[^;,]+)(?:[^,]*?)(;base64)?,/,ke={__proto__:null,'.cjs':'commonjs','.js':'module','.json':'json','.mjs':'module'},Se={__proto__:null,'.cjs':'commonjs','.js':'commonjs','.json':'commonjs','.mjs':'module','.node':'commonjs'},Le=()=>e('--loader'),Ue=M
export{Ue as conditions,Le as getUserLoader,Ne as resolveSync}
