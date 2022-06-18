import{isAbsolute as t,join as e,normalize as r,posix as s,sep as n}from'path'
const o=(t,e,r)=>{if(typeof r==='string'){return class extends e{code=t
message=r}}return class extends e{code=t
constructor(...t){super()
this.message=r(this,...t)}}}
const i=o('ERR_INVALID_ARG_TYPE',Error,((t,e,r,s)=>`The ${e} argument must be of type ${r}. Received ${typeof s}`))
const a=(t,e)=>{if(typeof t!=='string'){throw new i(e,'string',t)}}
class c{constructor(t,e){this._protocol=t
this._pathname=e}get href(){return`${this._protocol}//${this._pathname}`}get origin(){return String(null)}get protocol(){return this._protocol}get username(){return''}get password(){return''}get host(){return''}get hostname(){return''}get port(){return''}get pathname(){return this._pathname}get search(){return''}get searchParams(){return{}}get hash(){return''}toString(){return this.href}toJSON(){return this.href}}const h=n=>{a(n,'path')
let o=t(n)?n:e(process.cwd(),n)
o=r(o)
if(process.platform==='win32'){o=s.join(o)}return new c('file:',o)}
class u extends Error{constructor(t){super(`Invalid URL: ${t}`)
this.code='ERR_INVALID_URL'}}const l=t=>{const s=process.platform==='win32'
if(typeof t==='string'){if(t.startsWith('file:///')){if(s){return e(t.replace('file:///',''))}else{return t.replace('file://','')}}else if(s&&t.startsWith('file://')){return e(t.replace('file://',n))}}else if(t instanceof c){return r(t.pathname)}else{throw new i('url','string or URL',t)}throw new u(t)}
const p={pathToFileURL:h,fileURLToPath:l}
export{p as default,l as fileURLToPath,h as pathToFileURL}
