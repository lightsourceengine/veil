let e,t,r
const{native:o}=import.meta,{fromSymbols:n,fromBuiltin:i,fromFile:l,link:s,evaluate:a,evaluateWith:u,getNamespace:f,readFileSync:c,cjs:m,getState:h,STATE_EVALUATED:p,FORMAT_BUILTIN:d,FORMAT_MODULE:g,FORMAT_COMMONJS:w,FORMAT_JSON:E,FORMAT_ADDON:y}=o,v=new Set(['napi','lexer','internal']),R=new Set(o.builtins.filter((e=>!v.has(e)))),S=['buffer','console','process','timers','internal/event_target','url'],$=new Set(o.builtins),T=new Map,U=new Map,b=e=>$.has(e.replace('node:','')),A=(e,o)=>{if(b(e))return L(e.replace('node:',''))
const n=r.esmResolveSync(e,{parentURL:null==o?void 0:o.url.href})
if('module'!==n.format)throw Error(`Unsupported import type [${n.format}] from '${e}'`)
return O(t.fileURLToPath(n.url),new URL(n.url),l)},O=(e,t,r)=>{let o=T.get(e)
if(!o){try{o=r(e)}catch(t){throw Error(`while parsing code for '${e}'; reason: ${t.message}`)}if(t)o.url=t
T.set(e,o)}return o},L=(e,r)=>{const o='node:',n=e.replace(o,'')
if(!$.has(n))throw Error(`import specifier '${e}' is not a builtin`)
let l
if(t)l=new URL(`node:${n}`)
return O(n,l,i)},M=(e,t,r)=>{let o,n
const i=r(e,t)
if(h(i)===p)return i
try{o=s(i,r)}catch(e){n=e}if(!o)throw Error(`while linking ${i.id} ${n?n.toString():'link = false'}`)
try{a(i)}catch(e){throw Error(`while evaluating ${i.id} ${e.toString()}`)}return i},_=e=>J(M(e,null,L)),x=r=>{let o
if('string'===typeof r)if(r.startsWith('file:'))o=t.fileURLToPath(r)
else if(e.isAbsolute(r))o=r
else throw Error(`string must be a file url or absolute path. got '${r}'`)
else o=t.fileURLToPath(r)
o=e.dirname(o)
const n=t=>{if('string'!==typeof t)throw Error(`Expected argument id to be a string.`)
const{isAbsolute:r,join:n}=e
let i
if(r(t))i=t
else if('.'===t[0])i=n(o,t)
if(!i)throw Error(`CommonJS: specifier '${t} could not resolve to a filename`)
if(!e.extname(i))throw Error(`CommonJS: resolved file '${i}' does not have an extension`)
return i},i=t=>{const r=n(t),o=e.extname(r)
switch(o){case'.node':if(!U.has(r))U.set(r,N(r))
return U.get(r)
case'.json':if(!U.has(r)){const e=JSON.parse(c(r,true))
U.set(r,e)}return U.get(r)
default:throw Error(`CommonJS: unsupported extension '${o}'`)}}
return i.resolve=n,i},F=()=>{const e={builtinModules:Array.from(R.values()),createRequire:x},t={default:e,...e},r=n('module.mjs',Object.keys(t))
r.id='module',r.url='node:module',u(r,t),T.set(r.id,r)},J=e=>{if('string'===typeof e)e=T.get(e)
return f(e)},N=e=>{const t=_('napi').default
try{return t(e)}catch(t){throw`while loading addon '${e}' - ${t.message}`}},j=()=>{let e=process.argv[1]
if(!e)return process._uncaughtException(Error('missing main script file argument')),void 0
try{M(t.pathToFileURL(e).href,null,A)}catch(e){process._onUncaughtException(e)}},k=()=>{const{emitReady:o,on:n}=import.meta.native
F(),S.forEach(_),e=_('path').default,t=_('url').default,r=_('internal/esm')
const{URL:i}=t
for(const e of T.values())if('string'===typeof e.url)e.url=new i(e.url)
n('import',((e,t)=>M(e,T.get(t),A))),n('destroy',(()=>{T.clear(),U.clear(),e=t=null})),o()}
k(),j()
