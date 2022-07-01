let e,t,r
const{native:o}=import.meta,{builtins:n,fromSymbols:i,fromBuiltin:s,fromFile:l,link:a,evaluate:u,evaluateWith:f,getNamespace:c,readFileSync:h,getState:m,STATE_EVALUATED:p}=o,d=new Set(n),g=new Map,w=new Map,E=e=>d.has(e.replace('node:','')),y=(e,o)=>{if(E(e))return v(e.replace('node:',''))
const n=r.esmResolveSync(e,{parentURL:null==o?void 0:o.url.href})
if('module'!==n.format)throw Error(`Unsupported import type [${n.format}] from '${e}'`)
return $(t.fileURLToPath(n.url),new URL(n.url),l)},$=(e,t,r)=>{let o=g.get(e)
if(!o){try{o=r(e)}catch(t){throw Error(`while parsing code for '${e}'; reason: ${t.message}`)}if(t)o.url=t
g.set(e,o)}return o},v=(e,r)=>{const o='node:',n=e.replace(o,'')
if(!d.has(n))throw Error(`import specifier '${e}' is not a builtin`)
let i
if(t)i=new URL(`node:${n}`)
return $(n,i,s)},S=(e,t,r)=>{let o,n
const i=r(e,t)
if(m(i)===p)return i
try{o=a(i,r)}catch(e){n=e}if(!o)throw Error(`while linking ${i.id} ${n?n.toString():'link = false'}`)
try{u(i)}catch(e){throw Error(`while evaluating ${i.id} ${e.toString()}`)}return i},b=e=>L(S(e,null,v)),R=r=>{let o
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
switch(o){case'.node':if(!w.has(r))w.set(r,x(r))
return w.get(r)
case'.json':if(!w.has(r)){const e=JSON.parse(h(r,true))
w.set(r,e)}return w.get(r)
default:throw Error(`CommonJS: unsupported extension '${o}'`)}}
return i.resolve=n,i},U=()=>{const e=new Set(['napi','lexer','internal']),t=Object.freeze(n.filter((t=>!e.has(t)&&!t.startsWith('internal/')))),r={builtinModules:t,createRequire:R},o={default:r,...r},s=i('module.mjs',Object.keys(o))
s.id='module',s.url='node:module',f(s,o),g.set(s.id,s)},L=e=>{if('string'===typeof e)e=g.get(e)
return c(e)},x=e=>{const t=b('napi').default
try{return t(e)}catch(t){throw`while loading addon '${e}' - ${t.message}`}},T=()=>{let e=process.argv[1]
if(!e)return process._uncaughtException(Error('missing main script file argument')),void 0
try{S(t.pathToFileURL(e).href,null,y)}catch(e){process._onUncaughtException(e)}},j=()=>{const{emitReady:o,on:n}=import.meta.native,i=['buffer','console','process','timers','internal/event_target','url']
U(),i.forEach(b),e=b('path'),t=b('url'),r=b('internal/esm')
const{URL:s}=t
g.forEach((e=>{if('string'===typeof e.url)e.url=new s(e.url)})),n('import',((e,t)=>S(e,g.get(t),y))),n('destroy',(()=>{g.clear(),w.clear(),e=t=null})),o()}
j(),T()
