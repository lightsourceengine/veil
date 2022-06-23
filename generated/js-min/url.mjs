import t from'path'
import{toUSVString as e}from'util'
const n=(t,e,n)=>{if(typeof n==='string'){return class extends e{code=t
message=n}}return class extends e{code=t
constructor(...t){super()
this.message=n(this,...t)}}}
const s=n('ERR_INVALID_URI',URIError,'URI malformed')
const r=n('ERR_INVALID_ARG_TYPE',Error,((t,e,n,s)=>`The ${e} argument must be of type ${n}. Received ${typeof s}`))
const o=n('ERR_ARG_NOT_ITERABLE',TypeError,((t,e)=>`${e} must be iterable`))
const i=n('ERR_INVALID_ARG_VALUE',TypeError,((t,e,n,s='is invalid')=>`The ${e.includes('.')?'property':'argument'} '${e}' ${s}. Received ${typeof n}`))
const l=n('ERR_INVALID_FILE_URL_HOST',TypeError,((t,e)=>`File URL host must be "localhost" or empty on ${e}`))
const c=n('ERR_INVALID_FILE_URL_PATH',TypeError,((t,e)=>`File URL path ${e}`))
const h=n('ERR_INVALID_THIS',TypeError,((t,e)=>`Value of "this" must be of type ${e}`))
const a=n('ERR_INVALID_TUPLE',TypeError,((t,...e)=>`${e[0]} must be an iterable ${e[1]} tuple`))
const f=n('ERR_INVALID_URL',TypeError,((t,e)=>{t.input=e
return'Invalid URL'}))
const u=n('ERR_INVALID_URL_SCHEME',TypeError,((t,e)=>{if(typeof e==='string'){e=[e]}if(e.length>2){return'assert: expected.length <= 2'}const n=e.length===2?`one of scheme ${e[0]} or ${e[1]}`:`of scheme ${e[0]}`
return`The URL must be ${n}`}))
const p=n('',TypeError,((t,...e)=>{const{length:n}=e
if(!n){return'assert: At least one arg needs to be specified'}let s='The '
const r=n
const o=t=>`"${t}"`
e=e.map((t=>Array.isArray(t)?t.map(o).join(' or '):o(t)))
switch(r){case 1:s+=`${e[0]} argument`
break
case 2:s+=`${e[0]} and ${e[1]} arguments`
break
default:s+=e.slice(0,r-1).join(', ')
s+=`, and ${e[r-1]} arguments`
break}return`${s} must be specified`}))
const g=new Array(256).map(((t,e)=>`%${e<16?'0':''}${e.toString(16)}`))
const m=new Int8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
function d(t,e,n){const{length:r}=t
if(r===0)return''
let o=''
let i=0
let l=0
t:for(;l<r;l++){let c=t.charCodeAt(l)
while(c<128){if(e[c]!==1){if(i<l)o+=t.slice(i,l)
i=l+1
o+=n[c]}if(++l===r)break t
c=t.charCodeAt(l)}if(i<l)o+=t.slice(i,l)
if(c<2048){i=l+1
o+=n[192|c>>6]+n[128|c&63]
continue}if(c<55296||c>=57344){i=l+1
o+=n[224|c>>12]+n[128|c>>6&63]+n[128|c&63]
continue}++l
if(l>=r)throw new s
const h=t.charCodeAt(l)&1023
i=l+1
c=65536+((c&1023)<<10|h)
o+=n[240|c>>18]+n[128|c>>12&63]+n[128|c>>6&63]+n[128|c&63]}if(i===0)return t
if(i<r)return o+t.slice(i)
return o}const w=new Int8Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,+0,+1,+2,+3,+4,+5,+6,+7,+8,+9,-1,-1,-1,-1,-1,-1,-1,10,11,12,13,14,15,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,11,12,13,14,15,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1])
function y(t,e){const{length:n}=t
const s=Buffer.allocUnsafe(n)
let r=0
let o=0
let i
let l
let c
let h
const a=t.length-2
let f=false
while(r<n){i=t[r]
if(i===43&&e){s[o++]=32
r++
continue}if(i===37&&r<a){i=t.charCodeAt(++r)
c=w[i]
if(!(c>=0)){s[o++]=37
continue}else{l=t.charCodeAt(++r)
h=w[l]
if(!(h>=0)){s[o++]=37
r--}else{f=true
i=c*16+h}}}s[o++]=i
r++}return f?s.slice(0,o):s}function b(t,e=false){try{return decodeURIComponent(t)}catch{return y(t,e).toString()}}const _=97
const R=122
const S=47
const A=92
const $=38
const L=61
const U=37
const E=43
const I=(t,e)=>{if(typeof t!=='object'||t.constructor!==Object){throw new r(e,'Object',t)}}
const T=(t,e)=>{if(typeof t!=='function'){throw new r(e,'Function',t)}}
const P=Object.freeze({enumerable:true})
const{platform:O}=process
const v=O==='win32'
const{domainTo:j,encodeAuth:k,parse:C,URL_FLAGS_CANNOT_BE_BASE:N,URL_FLAGS_HAS_FRAGMENT:F,URL_FLAGS_HAS_HOST:H,URL_FLAGS_HAS_PASSWORD:q,URL_FLAGS_HAS_PATH:D,URL_FLAGS_HAS_QUERY:G,URL_FLAGS_HAS_USERNAME:V,URL_FLAGS_IS_DEFAULT_SCHEME_PORT:x,URL_FLAGS_SPECIAL:M,kFragment:B,kHost:Q,kHostname:W,kPathStart:J,kPort:Y,kQuery:z,kSchemeStart:K}=import.meta.native
const X=Symbol('context')
const Z=Symbol('cannot-be-base')
const tt=Symbol('cannot-have-username-password-port')
const et=Symbol('special')
const nt=Symbol('query')
const st=Symbol('format')
const rt=Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()))
const ot='null'
function it(t,e,n){return`${t}//${e}${n===null?'':`:${n}`}`}class lt{flags=0
scheme=':'
username=''
password=''
host=null
port=null
path=[]
query=null
fragment=null}const ct=t=>{if(!(t instanceof ht))throw new h('URLSearchParams')}
class ht{constructor(t=undefined){if(t===null||t===undefined){this[nt]=[]}else if(typeof t==='object'||typeof t==='function'){const n=t[Symbol.iterator]
if(n===this[Symbol.iterator]){const e=t[nt]
this[nt]=e.slice()}else if(n!==null&&n!==undefined){if(typeof n!=='function'){throw new o('Query pairs')}const s=[]
for(const n of t){if(typeof n!=='object'&&typeof n!=='function'||n===null||typeof n[Symbol.iterator]!=='function'){throw new a('Each query pair','[name, value]')}const t=[]
for(const s of n)t.push(e(s))
s.push(t)}this[nt]=[]
for(const t of s){if(t.length!==2){throw new a('Each query pair','[name, value]')}this[nt].push(t[0],t[1])}}else{const n={}
this[nt]=[]
const s=Reflect.ownKeys(t)
for(let r=0;r<s.length;r++){const o=s[r]
if(typeof o!=='string'){continue}const i=Reflect.getOwnPropertyDescriptor(t,o)
if(i!=null&&i.enumerable){const s=e(o)
const r=e(t[o])
if(n[s]!==undefined){this[nt][n[s]]=r}else{n[s]=this[nt].push(s,r)-1}}}}}else{t=e(t)
if(t[0]==='?')t=t.slice(1)
St(this,t)}this[X]=null}append(t,n){ct(this)
if(arguments.length<2){throw new p('name','value')}t=e(t)
n=e(n)
this[nt].push(t,n)
Rt(this[X],this)}delete(t){ct(this)
if(arguments.length<1){throw new p('name')}const n=this[nt]
t=e(t)
for(let e=0;e<n.length;){const s=n[e]
if(s===t){n.splice(e,2)}else{e+=2}}Rt(this[X],this)}get(t){ct(this)
if(arguments.length<1){throw new p('name')}const n=this[nt]
t=e(t)
for(let e=0;e<n.length;e+=2){if(n[e]===t){return n[e+1]}}return null}getAll(t){ct(this)
if(arguments.length<1){throw new p('name')}const n=this[nt]
const s=[]
t=e(t)
for(let e=0;e<n.length;e+=2){if(n[e]===t){s.push(n[e+1])}}return s}has(t){ct(this)
if(arguments.length<1){throw new p('name')}const n=this[nt]
t=e(t)
for(let e=0;e<n.length;e+=2){if(n[e]===t){return true}}return false}set(t,n){ct(this)
if(arguments.length<2){throw new p('name','value')}const s=this[nt]
t=e(t)
n=e(n)
let r=false
for(let e=0;e<s.length;){const o=s[e]
if(o===t){if(!r){s[e+1]=n
r=true
e+=2}else{s.splice(e,2)}}else{e+=2}}if(!r){s.push(t,n)}Rt(this[X],this)}sort(){const t=this[nt]
const e=t.length
if(e<=2);else if(e<100){for(let n=2;n<e;n+=2){const e=t[n]
const s=t[n+1]
let r
for(r=n-2;r>=0;r-=2){if(t[r]>e){t[r+2]=t[r]
t[r+3]=t[r+1]}else{break}}t[r+2]=e
t[r+3]=s}}else{const n=new Array(e)
const s=new Array(e)
for(let r=2;r<e;r*=2){for(let o=0;o<e-2;o+=2*r){const i=o+r
let l=i+r
l=l<e?l:e
if(i>l)continue
It(t,o,i,l,n,s)}}}Rt(this[X],this)}entries(){ct(this)
return Tt(this,'key+value')}forEach(t,e=undefined){ct(this)
T(t,'callback')
let n=this[nt]
let s=0
while(s<n.length){const r=n[s]
const o=n[s+1]
t.call(e,o,r,this)
n=this[nt]
s+=2}}keys(){ct(this)
return Tt(this,'key')}values(){ct(this)
return Tt(this,'value')}toString(){ct(this)
return Ut(this[nt])}}Object.defineProperties(ht.prototype,{append:P,delete:P,get:P,getAll:P,has:P,set:P,sort:P,entries:P,forEach:P,keys:P,values:P,toString:P,[Symbol.toStringTag]:{__proto__:null,configurable:true,value:'URLSearchParams'},[Symbol.iterator]:{__proto__:null,configurable:true,writable:true,value:ht.prototype.entries}})
function at(t,e,n,s,r,o,i,l,c){const h=this[X]
h.flags=t
h.scheme=e
h.username=(t&V)!==0?n:''
h.password=(t&q)!==0?s:''
h.port=o
h.path=(t&D)!==0?i:[]
h.query=l
h.fragment=c
h.host=r
if(!this[nt]){this[nt]=new ht
this[nt][X]=this}St(this[nt],l)}function ft(t,e){throw new f(t)}function ut(t,e,n,s,r,o,i,l,c){const h=this[X]
if((t&M)!==0){h.flags|=M}else{h.flags&=~M}h.scheme=e
h.port=o}function pt(t,e,n,s,r,o,i,l,c){const h=this[X]
if((t&H)!==0){h.host=r
h.flags|=H}else{h.host=null
h.flags&=~H}}function gt(t,e,n,s,r,o,i,l,c){this[X].port=o}function mt(t,e,n,s,r,o,i,l,c){Reflect.apply(pt,this,arguments)
if(o!==null||(t&x)!==0)Reflect.apply(gt,this,arguments)}function dt(t,e,n,s,r,o,i,l,c){const h=this[X]
if((t&D)!==0){h.path=i
h.flags|=D}else{h.path=[]
h.flags&=~D}if((t&H)!==0){h.host=r
h.flags|=H}}function wt(t,e,n,s,r,o,i,l,c){this[X].query=l}function yt(t,e,n,s,r,o,i,l,c){this[X].fragment=c}const bt=t=>{if(!(t instanceof _t))throw new h('URL')}
class _t{constructor(t,e=undefined){t=`${t}`
let n
if(e!==undefined){n=new _t(e)[X]}this[X]=new lt
C(t,-1,n,undefined,at.bind(this),ft.bind(this,t))}get[et](){return(this[X].flags&M)!==0}get[Z](){return(this[X].flags&N)!==0}get[tt](){const{host:t,scheme:e}=this[X]
return t==null||t===''||this[Z]||e==='file:'}[st](t){if(t)I(t,'options')
t={fragment:true,unicode:false,search:true,auth:true,...t}
const e=this[X]
let n=e.scheme
if(e.host!==null){n+='//'
const s=e.username!==''
const r=e.password!==''
if(t.auth&&(s||r)){if(s)n+=e.username
if(r)n+=`:${e.password}`
n+='@'}n+=t.unicode?vt(e.host):e.host
if(e.port!==null)n+=`:${e.port}`}if(this[Z]){n+=e.path[0]}else{if(e.host===null&&e.path.length>1&&e.path[0]===''){n+='/.'}if(e.path.length){n+='/'+e.path.join('/')}}if(t.search&&e.query!==null)n+=`?${e.query}`
if(t.fragment&&e.fragment!==null)n+=`#${e.fragment}`
return n}toString(){return this.href}get href(){bt(this)
return this[st]({})}set href(t){bt(this)
t=`${t}`
C(t,-1,undefined,undefined,at.bind(this),ft.bind(this,t))}get origin(){bt(this)
const t=this[X]
switch(t.scheme){case'blob:':if(t.path.length>0){try{return new _t(t.path[0]).origin}catch{}}return ot
case'ftp:':case'http:':case'https:':case'ws:':case'wss:':return it(t.scheme,t.host,t.port)}return ot}get protocol(){bt(this)
return this[X].scheme}set protocol(t){bt(this)
t=`${t}`
if(t.length===0)return
const e=this[X]
C(t,K,null,e,ut.bind(this))}get username(){bt(this)
return this[X].username}set username(t){bt(this)
t=`${t}`
if(this[tt])return
const e=this[X]
if(t===''){e.username=''
e.flags&=~V
return}e.username=k(t)
e.flags|=V}get password(){bt(this)
return this[X].password}set password(t){bt(this)
t=`${t}`
if(this[tt])return
const e=this[X]
if(t===''){e.password=''
e.flags&=~q
return}e.password=k(t)
e.flags|=q}get host(){bt(this)
const t=this[X]
let e=t.host||''
if(t.port!==null)e+=`:${t.port}`
return e}set host(t){bt(this)
const e=this[X]
t=`${t}`
if(this[Z]){return}C(t,Q,null,e,mt.bind(this))}get hostname(){bt(this)
return this[X].host||''}set hostname(t){bt(this)
const e=this[X]
t=`${t}`
if(this[Z]){return}C(t,W,null,e,pt.bind(this))}get port(){bt(this)
const t=this[X].port
return t===null?'':String(t)}set port(t){bt(this)
t=`${t}`
if(this[tt])return
const e=this[X]
if(t===''){e.port=null
return}C(t,Y,null,e,gt.bind(this))}get pathname(){bt(this)
const t=this[X]
if(this[Z])return t.path[0]
if(t.path.length===0)return''
return`/${t.path.join('/')}`}set pathname(t){bt(this)
t=`${t}`
if(this[Z])return
C(t,J,null,this[X],dt.bind(this))}get search(){bt(this)
const{query:t}=this[X]
if(t===null||t==='')return''
return`?${t}`}set search(t){bt(this)
const n=this[X]
t=e(t)
if(t===''){n.query=null
n.flags&=~G}else{if(t[0]==='?')t=t.slice(1)
n.query=''
n.flags|=G
if(t){C(t,z,null,n,wt.bind(this))}}St(this[nt],t)}get searchParams(){bt(this)
return this[nt]}get hash(){bt(this)
const{fragment:t}=this[X]
if(t===null||t==='')return''
return`#${t}`}set hash(t){bt(this)
const e=this[X]
t=`${t}`
if(!t){e.fragment=null
e.flags&=~F
return}if(t[0]==='#')t=t.slice(1)
e.fragment=''
e.flags|=F
C(t,B,null,e,yt.bind(this))}toJSON(){bt(this)
return this[st]({})}}Object.defineProperties(_t.prototype,{[st]:{__proto__:null,configurable:false,writable:false},[Symbol.toStringTag]:{__proto__:null,configurable:true,value:'URL'},toString:P,href:P,origin:P,protocol:P,username:P,password:P,host:P,hostname:P,port:P,pathname:P,search:P,searchParams:P,hash:P,toJSON:P})
function Rt(t,e){if(!t)return
const n=t[X]
const s=e.toString()
if(s){n.query=s
n.flags|=G}else{n.query=null
n.flags&=~G}}function St(t,e){if(!e){t[nt]=[]
return}t[nt]=At(e)}function At(t){const e=[]
let n=0
let s=0
let r=false
let o=''
let i=false
let l=0
let c
for(c=0;c<t.length;++c){const h=t.charCodeAt(c)
if(h===$){if(n===c){s=n=c+1
continue}if(s<c)o+=t.slice(s,c)
if(i)o=b(o)
e.push(o)
if(!r)e.push('')
r=false
o=''
i=false
l=0
s=n=c+1
continue}if(!r&&h===L){if(s<c)o+=t.slice(s,c)
if(i)o=b(o)
e.push(o)
r=true
o=''
i=false
l=0
s=c+1
continue}if(h===E){if(s<c)o+=t.slice(s,c)
o+=' '
s=c+1}else if(!i){if(h===U){l=1}else if(l>0){if(m[h]===1){if(++l===3){i=true}}else{l=0}}}}if(n===c)return e
if(s<c)o+=t.slice(s,c)
if(i)o=b(o)
e.push(o)
if(!r)e.push('')
return e}const $t=new Int8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0])
const Lt=g.slice()
Lt[32]='+'
function Ut(t){const e=t.length
if(e===0)return''
const n=d(t[0],$t,Lt)
const s=d(t[1],$t,Lt)
let r=`${n}=${s}`
for(let n=2;n<e;n+=2){const e=d(t[n],$t,Lt)
const s=d(t[n+1],$t,Lt)
r+=`&${e}=${s}`}return r}function Et(t,e,n){Object.defineProperty(t,Symbol.toStringTag,{__proto__:null,writable:false,enumerable:false,configurable:true,value:e})
for(const e of Object.keys(n)){Object.defineProperty(t,e,{__proto__:null,writable:true,enumerable:true,configurable:true,value:n[e]})}for(const e of Object.getOwnPropertySymbols(n)){Object.defineProperty(t,e,{__proto__:null,writable:true,enumerable:false,configurable:true,value:n[e]})}}function It(t,e,n,s,r,o){const i=n-e
const l=s-n
let c,h,a
for(c=0;c<i;c++)r[c]=t[e+c]
for(h=0;h<l;h++)o[h]=t[n+h]
c=0
h=0
a=e
while(c<i&&h<l){if(r[c]<=o[h]){t[a++]=r[c++]
t[a++]=r[c++]}else{t[a++]=o[h++]
t[a++]=o[h++]}}while(c<i)t[a++]=r[c++]
while(h<l)t[a++]=o[h++]}function Tt(t,e){const n=Object.create(Pt)
n[X]={target:t,kind:e,index:0}
return n}const Pt=Object.create(rt)
Et(Pt,'URLSearchParams Iterator',{next(){if(!this||Object.getPrototypeOf(this)!==Pt){throw new h('URLSearchParamsIterator')}const{target:t,kind:e,index:n}=this[X]
const s=t[nt]
const r=s.length
if(n>=r){return{value:undefined,done:true}}const o=s[n]
const i=s[n+1]
this[X].index=n+2
let l
if(e==='key'){l=o}else if(e==='value'){l=i}else{l=[o,i]}return{value:l,done:false}}})
const Ot=t=>{if(arguments.length<1)throw new p('domain')
return j(t,false)}
const vt=t=>{if(arguments.length<1)throw new p('domain')
return j(t,true)}
function jt(t){const e={protocol:t.protocol,hostname:typeof t.hostname==='string'&&t.hostname.startsWith('[')?t.hostname.slice(1,-1):t.hostname,hash:t.hash,search:t.search,pathname:t.pathname,path:`${t.pathname||''}${t.search||''}`,href:t.href}
if(t.port!==''){e.port=Number(t.port)}if(t.username||t.password){e.auth=`${decodeURIComponent(t.username)}:${decodeURIComponent(t.password)}`}return e}const kt=/\//g
function Ct(t){const e=t.hostname
let n=t.pathname
for(let t=0;t<n.length;t++){if(n[t]==='%'){const e=n.codePointAt(t+2)|32
if(n[t+1]==='2'&&e===102||n[t+1]==='5'&&e===99){throw new c('must not include encoded \\ or / characters')}}}n=n.replace(kt,'\\')
n=decodeURIComponent(n)
if(e!==''){return`\\\\${vt(e)}${n}`}const s=n.codePointAt(1)|32
const r=n[2]
if(s<_||s>R||r!==':'){throw new c('must be absolute')}return n.slice(1)}function Nt(t){if(t.hostname!==''){throw new l(O)}const e=t.pathname
for(let t=0;t<e.length;t++){if(e[t]==='%'){const n=e.codePointAt(t+2)|32
if(e[t+1]==='2'&&n===102){throw new c('must not include encoded / characters')}}}return decodeURIComponent(e)}function Ft(t){if(typeof t==='string')t=new _t(t)
else if(!(t instanceof _t))throw new r('path',['string','URL'],t)
if(t.protocol!=='file:')throw new u('file')
return v?Ct(t):Nt(t)}const Ht=/%/g
const qt=/\\/g
const Dt=/\n/g
const Gt=/\r/g
const Vt=/\t/g
function xt(t){if(t.includes('%'))t=t.replace(Ht,'%25')
if(!v&&t.includes('\\'))t=t.replace(qt,'%5C')
if(t.includes('\n'))t=t.replace(Dt,'%0A')
if(t.includes('\r'))t=t.replace(Gt,'%0D')
if(t.includes('\t'))t=t.replace(Vt,'%09')
return t}function Mt(e){const n=new _t('file://')
if(v&&e.startsWith('\\\\')){const t=e.split('\\')
if(t.length<=3){throw new i('filepath',e,'Missing UNC resource path')}const s=t[2]
if(s.length===0){throw new i('filepath',e,'Empty UNC servername')}n.hostname=Ot(s)
n.pathname=xt(t.slice(3).join('/'))}else{let s=t.resolve(e)
const r=e.charCodeAt(e.length-1)
if((r===S||v&&r===A)&&s[s.length-1]!==t.sep)s+='/'
n.pathname=xt(s)}return n}const Bt={URL:_t,URLSearchParams:ht,domainToASCII:Ot,domainToUnicode:vt,pathToFileURL:Mt,fileURLToPath:Ft,urlToHttpOptions:jt}
Object.assign(global,{URL:_t,URLSearchParams:ht})
export{_t as URL,ht as URLSearchParams,Bt as default,Ot as domainToASCII,vt as domainToUnicode,Ft as fileURLToPath,Mt as pathToFileURL,jt as urlToHttpOptions}
