let e,t
const{fromSymbols:r,fromBuiltin:i,fromFile:o,link:n,evaluate:s,evaluateWith:a,getNamespace:l,readFileSync:u,cjs:f,getState:c,STATE_EVALUATED:m,FORMAT_BUILTIN:h,FORMAT_MODULE:p,FORMAT_COMMONJS:d,FORMAT_JSON:g,FORMAT_ADDON:w}=import.meta.native,E='node:',$=new Set(['napi','lexer']),v=new Set(import.meta.native.builtins.filter((e=>!$.has(e)))),y=['buffer','console','process','timers','internal/event_target'],S=new Map,A=new Map,O=(e,t)=>{const r=e.replace(E,'')
if(v.has(r))return r
else if(!t){if($.has(r))return r}else if(e.startsWith(E))throw Error(`import specifier '${e}' is not a known builtin package`)},T=(t,r)=>{const{isAbsolute:i,dirname:o,normalize:n,resolve:s,extname:a}=e
let l
if(i(t))l=n(t)
else if(t.startsWith('.'))if(r)l=s(o(r.filename),t)
else l=s(t)
if(l&&!a(l))throw Error('must specify a file extension')
return l},b=(e,r)=>{let n,s,a,l
if(n=O(e,r),n)a=i,l=`node:${n}`
else n=T(e,r),a=o,l=t.pathToFileURL(n)
if(!n)throw Error(`unsupported import specifier '${e}`)
if(s=S.get(n),!s){try{s=a(n)}catch(e){throw Error(`while parsing code for '${n}'; reason: ${e.message}`)}s.url=l,S.set(n,s)}return s},M=(e,t,r)=>{let i,o
const a=r(e,t)
if(c(a)===m)return a
try{i=n(a,r)}catch(e){o=e}if(!i)throw Error(`while linking ${a.id} ${o?o.toString():'link = false'}`)
try{s(a)}catch(e){throw Error(`while evaluating ${a.id} ${e.toString()}`)}return a},R=e=>F(M(e,null,b)),x=r=>{let i
if('string'===typeof r)if(r.startsWith('file:'))t.fileURLToPath(r)
else if(e.isAbsolute(r))i=r
else throw Error(`string must be a file url or absolute path. got '${r}'`)
else i=t.fileURLToPath(r)
const o=t=>{const r=T(t,{filename:i})
if(!r)throw Error(`CommonJS: specifier '${t} could not resolve to a filename`)
if(!e.extname(r))throw Error(`CommonJS: resolved file '${r}' does not have an extension`)
return r},n=t=>{const r=o(t),i=e.extname(r)
switch(i){case'.node':if(!A.has(r))A.set(r,U(r))
return A.get(r)
case'.json':if(!A.has(r))A.set(r,k(r))
return A.get(r)
default:throw Error(`CommonJS: unsupported extension '${i}'`)}}
return n.resolve=o,n},_=()=>{const e={builtinModules:Array.from(v.values()),createRequire:x},t={default:e,...e},i=r('module.mjs',Object.keys(t))
i.id='module',i.url='node:module',a(i,t),S.set(i.id,i)},F=e=>{if('string'===typeof e)e=S.get(e)
return l(e)},U=e=>{const t=R('napi').default
try{return t(e)}catch(t){throw`while loading addon '${e}' - ${t.message}`}},k=e=>JSON.parse(u(e,true)),J=()=>{let t=process.argv[1]
if(!t)return process._uncaughtException(Error('missing main script file argument')),void 0
const{isAbsolute:r,sep:i}=e
if(!r(t)&&!t.startsWith('.'))t=`.${i}${t}`
try{M(t,null,b)}catch(e){process._onUncaughtException(e)}},L=()=>{const{emitReady:r,on:i}=import.meta.native
_(),y.forEach(R),e=R('path').default,t=R('url').default,i('import',((e,t)=>F(M(e,S.get(t),b)))),i('destroy',(()=>{S.clear(),A.clear(),e=t=null})),r()}
L(),J()
