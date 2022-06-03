import{_internal as t}from'util'
import{isAbsolute as r,join as e,normalize as n,posix as s,sep as o}from'path'
const{validateString:i,ERR_INVALID_ARG_TYPE:a}=t
class h{constructor(t,r){this._protocol=t
this._pathname=r}get href(){return`${this._protocol}//${this._pathname}`}get origin(){return String(null)}get protocol(){return this._protocol}get username(){return''}get password(){return''}get host(){return''}get hostname(){return''}get port(){return''}get pathname(){return this._pathname}get search(){return''}get searchParams(){return{}}get hash(){return''}toString(){return this.href}toJSON(){return this.href}}const l=t=>{i(t,'path')
let o=r(t)?t:e(process.cwd(),t)
o=n(o)
if(process.platform==='win32'){o=s.join(o)}return new h('file:',o)}
class p extends Error{constructor(t){super(`Invalid URL: ${t}`)
this.code='ERR_INVALID_URL'}}const u=t=>{const r=process.platform==='win32'
if(typeof t==='string'){if(t.startsWith('file:///')){if(r){return e(t.replace('file:///',''))}else{return t.replace('file://','')}}else if(r&&t.startsWith('file://')){return e(t.replace('file://',o))}}else if(t instanceof h){return n(t.pathname)}else{throw new a('url','string or URL',t)}throw new p(t)}
const c={pathToFileURL:l,fileURLToPath:u}
export{c as default,u as fileURLToPath,l as pathToFileURL}
