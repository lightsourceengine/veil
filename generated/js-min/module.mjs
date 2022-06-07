let e
let t
const{fromSymbols:r,fromBuiltin:o,fromFile:n,link:s,evaluate:i,evaluateWith:a,getNamespace:l,readFileSync:c,cjs:u,getState:f,STATE_EVALUATED:m,FORMAT_BUILTIN:h,FORMAT_MODULE:p,FORMAT_COMMONJS:d,FORMAT_JSON:g,FORMAT_ADDON:w}=import.meta.native
const E='node:'
const $=new Set(['napi','lexer'])
const S=new Set(import.meta.native.builtins.filter((e=>!$.has(e))))
const v=['buffer','console','process','timers']
const y=new Map
const A=new Map
const O=(e,t)=>{const r=e.replace(E,'')
if(S.has(r)){return r}else if(!t){if($.has(r)){return r}}else if(e.startsWith(E)){throw Error(`import specifier '${e}' is not a known builtin package`)}}
const M=(t,r)=>{const{isAbsolute:o,dirname:n,normalize:s,resolve:i,extname:a}=e
let l
if(o(t)){l=s(t)}else if(t.startsWith('.')){if(r){l=i(n(r.filename),t)}else{l=i(t)}}else;if(l&&!a(l)){throw Error('must specify a file extension')}return l}
const T=(e,r)=>{let s
let i
let a
let l
s=O(e,r)
if(s){a=o
l=`node:${s}`}else{s=M(e,r)
a=n
l=t.pathToFileURL(s)}if(!s){throw Error(`unsupported import specifier '${e}`)}i=y.get(s)
if(!i){try{i=a(s)}catch(e){throw Error(`while parsing code for '${s}'; reason: ${e.message}`)}i.url=l
y.set(s,i)}return i}
const x=(e,t,r)=>{let o
let n
const a=r(e,t)
if(f(a)===m){return a}try{o=s(a,r)}catch(e){n=e}if(!o){throw Error(`while linking ${a.id} ${n?n.toString():'link = false'}`)}try{i(a)}catch(e){throw Error(`while evaluating ${a.id} ${e.toString()}`)}return a}
const b=e=>_(x(e,null,T))
const F=t=>{const r=r=>{const o=M(r,{filename:t})
if(!o){throw Error(`CommonJS: specifier '${r} could not resolve to a filename`)}if(!e.extname(o)){throw Error(`CommonJS: resolved file '${o}' does not have an extension`)}return o}
const o=t=>{const o=r(t)
const n=e.extname(o)
switch(n){case'.node':if(!A.has(o)){A.set(o,k(o))}return A.get(o)
case'.json':if(!A.has(o)){A.set(o,J(o))}return A.get(o)
default:throw Error(`CommonJS: unsupported extension '${n}'`)}}
o.resolve=r
return o}
const R=()=>{const e={builtinModules:Array.from(S.values()),createRequire:F}
const t={default:e,...e}
const o=r('module.mjs',Object.keys(t))
o.id='module'
o.url='node:module'
a(o,t)
y.set(o.id,o)}
const _=e=>{if(typeof e==='string'){e=y.get(e)}return l(e)}
const k=e=>{const t=b('napi').default
try{return t(e)}catch(t){throw`while loading addon '${e}' - ${t.message}`}}
const J=e=>JSON.parse(c(e,true))
const N=()=>{let t=process.argv[1]
if(!t){process._uncaughtException(Error('missing main script file argument'))
return}const{isAbsolute:r,sep:o}=e
if(!r(t)&&!t.startsWith('.')){t=`.${o}${t}`}try{x(t,null,T)}catch(e){process._onUncaughtException(e)}}
const U=()=>{const{emitReady:r,on:o}=import.meta.native
R()
v.forEach(b)
e=b('path').default
t=b('url').default
o('import',((e,t)=>_(x(e,y.get(t),T))))
o('destroy',(()=>{y.clear()
A.clear()
e=t=null}))
r()}
U()
N()
