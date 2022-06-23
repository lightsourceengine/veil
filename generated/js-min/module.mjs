let e,t
const{fromSymbols:r,fromBuiltin:i,fromFile:o,link:s,evaluate:n,evaluateWith:a,getNamespace:l,readFileSync:u,cjs:f,getState:c,STATE_EVALUATED:m,FORMAT_BUILTIN:h,FORMAT_MODULE:p,FORMAT_COMMONJS:d,FORMAT_JSON:g,FORMAT_ADDON:w}=import.meta.native,E='node:',$=new Set(['napi','lexer']),v=new Set(import.meta.native.builtins.filter((e=>!$.has(e)))),y=['buffer','console','process','timers'],S=new Map,A=new Map,O=(e,t)=>{const r=e.replace(E,'')
if(v.has(r))return r
else if(!t){if($.has(r))return r}else if(e.startsWith(E))throw Error(`import specifier '${e}' is not a known builtin package`)},T=(t,r)=>{const{isAbsolute:i,dirname:o,normalize:s,resolve:n,extname:a}=e
let l
if(i(t))l=s(t)
else if(t.startsWith('.'))if(r)l=n(o(r.filename),t)
else l=n(t)
if(l&&!a(l))throw Error('must specify a file extension')
return l},b=(e,r)=>{let s,n,a,l
if(s=O(e,r),s)a=i,l=`node:${s}`
else s=T(e,r),a=o,l=t.pathToFileURL(s)
if(!s)throw Error(`unsupported import specifier '${e}`)
if(n=S.get(s),!n){try{n=a(s)}catch(e){throw Error(`while parsing code for '${s}'; reason: ${e.message}`)}n.url=l,S.set(s,n)}return n},M=(e,t,r)=>{let i,o
const a=r(e,t)
if(c(a)===m)return a
try{i=s(a,r)}catch(e){o=e}if(!i)throw Error(`while linking ${a.id} ${o?o.toString():'link = false'}`)
try{n(a)}catch(e){throw Error(`while evaluating ${a.id} ${e.toString()}`)}return a},R=e=>_(M(e,null,b)),x=r=>{let i
if('string'===typeof r)if(r.startsWith('file:'))t.fileURLToPath(r)
else if(e.isAbsolute(r))i=r
else throw Error(`string must be a file url or absolute path. got '${r}'`)
else i=t.fileURLToPath(r)
const o=t=>{const r=T(t,{filename:i})
if(!r)throw Error(`CommonJS: specifier '${t} could not resolve to a filename`)
if(!e.extname(r))throw Error(`CommonJS: resolved file '${r}' does not have an extension`)
return r},s=t=>{const r=o(t),i=e.extname(r)
switch(i){case'.node':if(!A.has(r))A.set(r,U(r))
return A.get(r)
case'.json':if(!A.has(r))A.set(r,k(r))
return A.get(r)
default:throw Error(`CommonJS: unsupported extension '${i}'`)}}
return s.resolve=o,s},F=()=>{const e={builtinModules:Array.from(v.values()),createRequire:x},t={default:e,...e},i=r('module.mjs',Object.keys(t))
i.id='module',i.url='node:module',a(i,t),S.set(i.id,i)},_=e=>{if('string'===typeof e)e=S.get(e)
return l(e)},U=e=>{const t=R('napi').default
try{return t(e)}catch(t){throw`while loading addon '${e}' - ${t.message}`}},k=e=>JSON.parse(u(e,true)),J=()=>{let t=process.argv[1]
if(!t)return process._uncaughtException(Error('missing main script file argument')),void 0
const{isAbsolute:r,sep:i}=e
if(!r(t)&&!t.startsWith('.'))t=`.${i}${t}`
try{M(t,null,b)}catch(e){process._onUncaughtException(e)}},L=()=>{const{emitReady:r,on:i}=import.meta.native
F(),y.forEach(R),e=R('path').default,t=R('url').default,i('import',((e,t)=>_(M(e,S.get(t),b)))),i('destroy',(()=>{S.clear(),A.clear(),e=t=null})),r()}
L(),J()
