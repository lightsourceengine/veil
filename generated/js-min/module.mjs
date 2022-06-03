let e
let t
const{fromSymbols:r,fromBuiltin:o,fromFile:n,link:s,evaluate:i,evaluateWith:a,getNamespace:l,readFileSync:c,cjs:u,getState:f,STATE_EVALUATED:m,FORMAT_BUILTIN:h,FORMAT_MODULE:p,FORMAT_COMMONJS:d,FORMAT_JSON:g,FORMAT_ADDON:w}=import.meta.native
const $='node:'
const E=new Set(['napi','lexer'])
const y=new Set(import.meta.native.builtins.filter((e=>!E.has(e))))
const S=['buffer','console','process','timers']
const v=new Map
const O=new Map
const A=(e,t)=>{const r=e.replace($,'')
if(y.has(r)){return r}else if(!t){if(E.has(r)){return r}}else if(e.startsWith($)){throw Error(`import specifier '${e}' is not a known builtin package`)}}
const M=(t,r)=>{const{isAbsolute:o,dirname:n,normalize:s,resolve:i,extname:a}=e
let l
if(o(t)){l=s(t)}else if(t.startsWith('.')){if(r){l=i(n(r.filename),t)}else{l=i(t)}}else;if(l&&!a(l)){throw Error('must specify a file extension')}return l}
const T=(e,r)=>{let s
let i
let a
let l
s=A(e,r)
if(s){a=o
l=`node:${s}`}else{s=M(e,r)
a=n
l=t.pathToFileURL(s)}if(!s){throw Error(`unsupported import specifier '${e}`)}i=v.get(s)
if(!i){try{i=a(s)}catch(e){throw Error(`while parsing code for '${s}'; reason: ${e.message}`)}i.url=l
v.set(s,i)}return i}
const b=(e,t,r)=>{let o
let n
const a=r(e,t)
if(f(a)===m){return a}try{o=s(a,r)}catch(e){n=e}if(!o){throw Error(`while linking ${a.id} ${n?n.toString():'link = false'}`)}try{i(a)}catch(e){throw Error(`while evaluating ${a.id} ${e.toString()}`)}return a}
const x=e=>_(b(e,null,T))
const F=t=>{const r=r=>{const o=M(r,{filename:t})
if(!o){throw Error(`CommonJS: specifier '${r} could not resolve to a filename`)}if(!e.extname(o)){throw Error(`CommonJS: resolved file '${o}' does not have an extension`)}return o}
const o=t=>{const o=r(t)
const n=e.extname(o)
switch(n){case'.node':if(!O.has(o)){O.set(o,k(o))}return O.get(o)
case'.json':if(!v.has(o)){v.set(o,J(o))}return _(v.get(o))
default:throw Error(`CommonJS: unsupported extension '${n}'`)}}
o.resolve=r
return o}
const R=()=>{const e={builtinModules:Array.from(y.values()),createRequire:F}
const t={default:e,...e}
const o=r('module.mjs',Object.keys(t))
o.id='module'
o.url='node:module'
a(o,t)
v.set(o.id,o)}
const _=e=>{if(typeof e==='string'){e=v.get(e)}return l(e)}
const k=e=>{const t=x('napi').default
try{return t(e)}catch(t){throw`while loading addon '${e}' - ${t.message}`}}
const J=e=>{let o
try{o=c(e,true)}catch(t){throw Error(`while reading '${e}': ${t.message}`)}let n
try{n=JSON.parse(o)}catch(t){throw Error(`failed to parse '${e}: ${t.message}`)}const s=r(e,Object.keys(n||{}))
s.url=t.pathToFileURL(e)
s.format=g
a(s,n)
return s}
const N=()=>{let t=process.argv[1]
if(!t){process._uncaughtException(Error('missing main script file argument'))
return}const{isAbsolute:r,sep:o}=e
if(!r(t)&&!t.startsWith('.')){t=`.${o}${t}`}try{b(t,null,T)}catch(e){process._onUncaughtException(e)}}
const U=()=>{const{emitReady:r,on:o}=import.meta.native
R()
S.forEach(x)
e=x('path').default
t=x('url').default
o('import',((e,t)=>_(b(e,v.get(t),T))))
o('destroy',(()=>{v.clear()
O.clear()
e=t=null}))
r()}
U()
N()
