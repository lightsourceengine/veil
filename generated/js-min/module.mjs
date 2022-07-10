let e,t,r,o,i
const{native:n}=import.meta,{builtins:a,fromSymbols:s,fromBuiltin:l,fromSource:u,link:f,evaluate:c,evaluateWith:m,getNamespace:d,getRequests:h,getState:g,readFileSync:p,STATE_EVALUATED:w}=n,v=new Set(a.concat(a.map((e=>`node:${e}`)))),y=new Map,E=new Map,b=new Map,$=Object.freeze({format:'builtin',source:void 0}),S=e=>v.has(e),U=async(e,t,r=void 0)=>R(e,t),R=(e,t)=>{if(S(e))return{url:e.startsWith('node:')?e:`node:${e}`,format:'builtin'}
return r.resolveSync(e,t)},L=async(e,t,r=void 0)=>k(e,t),k=(e,r)=>{const{format:o}=r
if('builtin'===o)return $
if('module'!==o)throw Error(`Unsupported format: ${o}`)
return{format:o,source:p(t.fileURLToPath(e),false)}},x=async(e,t)=>{let n,a,s={conditions:r.conditions,parentURL:null==t?void 0:t.id},l,f,c
if(n=b.get(e),!n){if(i)n=await i(e,s,U)
if(!n)n=R(e,s)
b.set(e,n)}if(f=y.get(n.url),!f){if(l={format:n.format},o)a=await o(n.url,l,L)
if(!a)a=k(n.url,l)
switch(a.format){case'module':const e=n.url
y.set(e,f=u(e,a.source))
break
case'builtin':break
default:throw Error(`invalid load() format: ${a.format}`)}}if(c=f?h(f).map((e=>x(e,f))):[],c&&c.length)await Promise.all(c)
return f},T=async(e,t)=>{if(S(e))return j(e)
return C(A(await x(e,t),J))},j=e=>C(A(W(e),W)),A=(e,r)=>{if(g(e)===w)return e
let o,i,{id:n}=e
if(t)e.url=new t.URL(n)
try{o=f(e,r)}catch(e){i=e}if(!o)throw Error(`while linking ${n} ${i?i.toString():'link = false'}`)
try{c(e)}catch(e){throw Error(`while evaluating ${n} ${e.toString()}`)}return e},W=(e,t)=>{if(!S(e))throw Error(`illegal import '${e}' from ${null==t?void 0:t.id}`)
if(!e.startsWith('node:'))e=`node:${e}`
let r=y.get(e)
if(!r)r=l(e),y.set(r.id,r)
return r},J=(e,t)=>{if(S(e))return W(e)
return y.get(b.get(e).url)},M=async(e,t)=>{const r=y.get(t)
if(!r)throw Error(`dynamic import unknown referrer: ${t}`)
return T(e,r)},O=r=>{let o
if('string'===typeof r)if(r.startsWith('file:'))o=t.fileURLToPath(r)
else if(e.isAbsolute(r))o=r
else throw Error(`string must be a file url or absolute path. got '${r}'`)
else o=t.fileURLToPath(r)
o=e.dirname(o)
const i=t=>{if('string'!==typeof t)throw Error(`Expected argument id to be a string.`)
const{isAbsolute:r,join:i}=e
let n
if(r(t))n=t
else if('.'===t[0])n=i(o,t)
if(!n)throw Error(`CommonJS: specifier '${t} could not resolve to a filename`)
if(!e.extname(n))throw Error(`CommonJS: resolved file '${n}' does not have an extension`)
return n},n=t=>{const r=i(t),o=e.extname(r)
switch(o){case'.node':if(!E.has(r))E.set(r,_(r))
return E.get(r)
case'.json':if(!E.has(r)){const e=JSON.parse(p(r,true))
E.set(r,e)}return E.get(r)
default:throw Error(`CommonJS: unsupported extension '${o}'`)}}
return n.resolve=i,n},P=()=>{const e=new Set(['napi','lexer','internal']),t=Object.freeze(a.filter((t=>!e.has(t)&&!t.startsWith('internal/')))),r={builtinModules:t,createRequire:O},o={default:r,...r},i=s('module.mjs',Object.keys(o)),n='node:module'
i.id=n,m(i,o),y.set(n,i)},C=e=>{if('string'===typeof e)e=y.get(e)
return d(e)},_=e=>{const t=j('napi').default
try{return t(e)}catch(t){throw`while loading addon '${e}' - ${t.message}`}},q=async()=>{const e=process.argv[1],n=r.getUserLoader()
if(n){const e=await T(n,null)
i=e.resolve,o=e.load}if(!e)throw Error('missing main script file argument')
return T(t.pathToFileURL(e).href,null)},z=()=>{const{emitReady:o,on:i}=import.meta.native,n=['buffer','console','process','timers','internal/event_target','url']
P(),n.forEach(j),e=j('path'),t=j('url'),r=j('internal/esm')
const{URL:a}=t
y.forEach((e=>{if(!e.url)e.url=new a(e.id)})),i('import',M),i('destroy',(()=>{y.clear(),E.clear(),b.clear(),e=t=r=null})),o()}
z(),q().catch((e=>{process._onUncaughtException(e)}))
