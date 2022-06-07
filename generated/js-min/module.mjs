let e
let t
const{fromSymbols:r,fromBuiltin:o,fromFile:s,link:n,evaluate:i,evaluateWith:l,getNamespace:a,readFileSync:c,cjs:u,getState:f,STATE_EVALUATED:m,FORMAT_BUILTIN:h,FORMAT_MODULE:p,FORMAT_COMMONJS:d,FORMAT_JSON:g,FORMAT_ADDON:w}=import.meta.native
const E='node:'
const $=new Set(['napi','lexer'])
const y=new Set(import.meta.native.builtins.filter((e=>!$.has(e))))
const S=['buffer','console','process','timers']
const v=new Map
const A=new Map
const O=(e,t)=>{const r=e.replace(E,'')
if(y.has(r)){return r}else if(!t){if($.has(r)){return r}}else if(e.startsWith(E)){throw Error(`import specifier '${e}' is not a known builtin package`)}}
const T=(t,r)=>{const{isAbsolute:o,dirname:s,normalize:n,resolve:i,extname:l}=e
let a
if(o(t)){a=n(t)}else if(t.startsWith('.')){if(r){a=i(s(r.filename),t)}else{a=i(t)}}else;if(a&&!l(a)){throw Error('must specify a file extension')}return a}
const b=(e,r)=>{let n
let i
let l
let a
n=O(e,r)
if(n){l=o
a=`node:${n}`}else{n=T(e,r)
l=s
a=t.pathToFileURL(n)}if(!n){throw Error(`unsupported import specifier '${e}`)}i=v.get(n)
if(!i){try{i=l(n)}catch(e){throw Error(`while parsing code for '${n}'; reason: ${e.message}`)}i.url=a
v.set(n,i)}return i}
const M=(e,t,r)=>{let o
let s
const l=r(e,t)
if(f(l)===m){return l}try{o=n(l,r)}catch(e){s=e}if(!o){throw Error(`while linking ${l.id} ${s?s.toString():'link = false'}`)}try{i(l)}catch(e){throw Error(`while evaluating ${l.id} ${e.toString()}`)}return l}
const R=e=>_(M(e,null,b))
const x=r=>{let o
if(typeof r==='string'){if(r.startsWith('file:')){t.fileURLToPath(r)}else if(e.isAbsolute(r)){o=r}else{throw Error(`string must be a file url or absolute path. got '${r}'`)}}else{o=t.fileURLToPath(r)}const s=t=>{const r=T(t,{filename:o})
if(!r){throw Error(`CommonJS: specifier '${t} could not resolve to a filename`)}if(!e.extname(r)){throw Error(`CommonJS: resolved file '${r}' does not have an extension`)}return r}
const n=t=>{const r=s(t)
const o=e.extname(r)
switch(o){case'.node':if(!A.has(r)){A.set(r,U(r))}return A.get(r)
case'.json':if(!A.has(r)){A.set(r,k(r))}return A.get(r)
default:throw Error(`CommonJS: unsupported extension '${o}'`)}}
n.resolve=s
return n}
const F=()=>{const e={builtinModules:Array.from(y.values()),createRequire:x}
const t={default:e,...e}
const o=r('module.mjs',Object.keys(t))
o.id='module'
o.url='node:module'
l(o,t)
v.set(o.id,o)}
const _=e=>{if(typeof e==='string'){e=v.get(e)}return a(e)}
const U=e=>{const t=R('napi').default
try{return t(e)}catch(t){throw`while loading addon '${e}' - ${t.message}`}}
const k=e=>JSON.parse(c(e,true))
const J=()=>{let t=process.argv[1]
if(!t){process._uncaughtException(Error('missing main script file argument'))
return}const{isAbsolute:r,sep:o}=e
if(!r(t)&&!t.startsWith('.')){t=`.${o}${t}`}try{M(t,null,b)}catch(e){process._onUncaughtException(e)}}
const L=()=>{const{emitReady:r,on:o}=import.meta.native
F()
S.forEach(R)
e=R('path').default
t=R('url').default
o('import',((e,t)=>_(M(e,v.get(t),b))))
o('destroy',(()=>{v.clear()
A.clear()
e=t=null}))
r()}
L()
J()
