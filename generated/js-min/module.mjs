let e,r,t,o,i
const{native:n}=import.meta,{builtins:a,fromSymbols:s,fromBuiltin:l,fromSource:u,link:f,evaluate:c,evaluateWith:m,getNamespace:d,getRequests:h,getState:p,readFileSync:g,STATE_EVALUATED:w}=n,E=new Set(a.concat(a.map((e=>`node:${e}`)))),y=new Map,v=new Map,b=new Map,$=Object.freeze({format:'builtin',source:void 0}),S=e=>E.has(e),k=async(e,r,t=void 0)=>U(e,r),U=(e,r)=>{if(S(e))return{url:e.startsWith('node:')?e:`node:${e}`,format:'builtin'}
return t.resolveSync(e,r)},x=async(e,r,t=void 0)=>R(e,r),R=(e,t)=>{const{format:o}=t
if('builtin'===o)return $
if('module'!==o)throw Error(`Unsupported format: ${o}`)
return{format:o,source:g(r.fileURLToPath(e),false)}},L=async(e,n)=>{let a,s,l={conditions:t.conditions,parentURL:null==n?void 0:n.id},f,c,m
if(a=b.get(e),!a){if(i)a=await i(e,l,k)
if(!a)a=U(e,l)
if('module'!==a.format&&'builtin'!==a.format)throw Error(`resolveHook(): invalid format = '${a.format}'`)
if('string'!==typeof a.url)throw Error(`resolveHook(): expected url as string`)
b.set(e,a)}if(c=y.get(a.url),!c){if(f={format:a.format},o)s=await o(a.url,f,x)
if(!s)s=R(a.url,f)
switch(s.format){case'module':if('string'!==typeof s.source)throw Error(`loadHook(): expected source as string`)
const e=a.url
c=u(e,s.source),c.url=new r.URL(e),y.set(e,c)
break
case'builtin':if('string'===typeof s.source)throw Error(`loadHook(): unexpected source for builtin format`)
break
default:throw Error(`loadHook(): unexpected format '${s.format}'`)}}if(m=c?h(c).map((e=>L(e,c))):[],m&&m.length)await Promise.all(m)
return c},T=async(e,r)=>{if(S(e))return j(e)
return P(A(await L(e,r),W))},j=e=>P(A(H(e),H)),A=(e,t)=>{if(p(e)===w)return e
let o,i,{id:n}=e
if(!e.url&&r)e.url=new r.URL(n)
try{o=f(e,t)}catch(e){i=e}if(!o)throw Error(`while linking ${n} ${i?i.toString():'link = false'}`)
try{c(e)}catch(e){throw Error(`while evaluating ${n} ${e.toString()}`)}return e},H=(e,r)=>{if(!S(e))throw Error(`illegal import '${e}' from ${null==r?void 0:r.id}`)
if(!e.startsWith('node:'))e=`node:${e}`
let t=y.get(e)
if(!t)t=l(e),y.set(t.id,t)
return t},W=(e,r)=>{if(S(e))return H(e)
return y.get(b.get(e).url)},J=async(e,r)=>{const t=y.get(r)
if(!t)throw Error(`dynamic import unknown referrer: ${r}`)
return T(e,t)},M=t=>{let o
if('string'===typeof t)if(t.startsWith('file:'))o=r.fileURLToPath(t)
else if(e.isAbsolute(t))o=t
else throw Error(`string must be a file url or absolute path. got '${t}'`)
else o=r.fileURLToPath(t)
o=e.dirname(o)
const i=r=>{if('string'!==typeof r)throw Error(`Expected argument id to be a string.`)
const{isAbsolute:t,join:i}=e
let n
if(t(r))n=r
else if('.'===r[0])n=i(o,r)
if(!n)throw Error(`CommonJS: specifier '${r} could not resolve to a filename`)
if(!e.extname(n))throw Error(`CommonJS: resolved file '${n}' does not have an extension`)
return n},n=r=>{const t=i(r),o=e.extname(t)
switch(o){case'.node':if(!v.has(t))v.set(t,C(t))
return v.get(t)
case'.json':if(!v.has(t)){const e=JSON.parse(g(t,true))
v.set(t,e)}return v.get(t)
default:throw Error(`CommonJS: unsupported extension '${o}'`)}}
return n.resolve=i,n},O=()=>{const e=new Set(['napi','lexer','internal']),r=Object.freeze(a.filter((r=>!e.has(r)&&!r.startsWith('internal/')))),t={builtinModules:r,createRequire:M},o={default:t,...t},i=s('module.mjs',Object.keys(o)),n='node:module'
i.id=n,m(i,o),y.set(n,i)},P=e=>{if('string'===typeof e)e=y.get(e)
return d(e)},C=e=>{const r=j('napi').default
try{return r(e)}catch(r){throw`while loading addon '${e}' - ${r.message}`}},_=async()=>{const e=process.argv[1],n=t.getUserLoader()
if(n){const e=await T(n,null)
i=e.resolve,o=e.load}if(!e)throw Error('missing main script file argument')
return T(r.pathToFileURL(e).href,null)},q=()=>{const{emitReady:o,on:i}=import.meta.native,n=['buffer','console','process','timers','internal/event_target','url']
O(),n.forEach(j),e=j('path'),r=j('url'),t=j('internal/esm'),y.forEach((e=>e.url||(e.url=new r.URL(e.id)))),i('import',J),i('destroy',(()=>{y.clear(),v.clear(),b.clear(),e=r=t=null})),o()}
q(),_().catch((e=>{process._onUncaughtException(e)}))
