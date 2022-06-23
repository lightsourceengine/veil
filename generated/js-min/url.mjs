import t from'path'
import{toUSVString as e}from'util'
const n=(t,e,n)=>{if('string'===typeof n)return class extends e{code=t
message=n}
return class extends e{code=t
constructor(...t){super(),this.message=n(this,...t)}}},s=n('ERR_INVALID_URI',URIError,'URI malformed'),r=n('ERR_INVALID_ARG_TYPE',Error,((t,e,n,s)=>`The ${e} argument must be of type ${n}. Received ${typeof s}`)),i=n('ERR_ARG_NOT_ITERABLE',TypeError,((t,e)=>`${e} must be iterable`)),o=n('ERR_INVALID_ARG_VALUE',TypeError,((t,e,n,s='is invalid')=>`The ${e.includes('.')?'property':'argument'} '${e}' ${s}. Received ${typeof n}`)),l=n('ERR_INVALID_FILE_URL_HOST',TypeError,((t,e)=>`File URL host must be "localhost" or empty on ${e}`)),h=n('ERR_INVALID_FILE_URL_PATH',TypeError,((t,e)=>`File URL path ${e}`)),a=n('ERR_INVALID_THIS',TypeError,((t,e)=>`Value of "this" must be of type ${e}`)),f=n('ERR_INVALID_TUPLE',TypeError,((t,...e)=>`${e[0]} must be an iterable ${e[1]} tuple`)),c=n('ERR_INVALID_URL',TypeError,((t,e)=>(t.input=e,'Invalid URL'))),u=n('ERR_INVALID_URL_SCHEME',TypeError,((t,e)=>{if('string'===typeof e)e=[e]
if(e.length>2)return'assert: expected.length <= 2'
const n=2===e.length?`one of scheme ${e[0]} or ${e[1]}`:`of scheme ${e[0]}`
return`The URL must be ${n}`})),p=n('',TypeError,((t,...e)=>{const{length:n}=e
if(!n)return'assert: At least one arg needs to be specified'
let s='The '
const r=n,i=t=>`"${t}"`
switch(e=e.map((t=>Array.isArray(t)?t.map(i).join(' or '):i(t))),r){case 1:s+=`${e[0]} argument`
break
case 2:s+=`${e[0]} and ${e[1]} arguments`
break
default:s+=e.slice(0,r-1).join(', '),s+=`, and ${e[r-1]} arguments`
break}return`${s} must be specified`})),g=new Array(256).map(((t,e)=>`%${e<16?'0':''}${e.toString(16)}`)),m=new Int8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
function d(t,e,n){const{length:r}=t
if(0===r)return''
let i='',o=0,l=0
t:for(;l<r;l++){let h=t.charCodeAt(l)
while(h<128){if(1!==e[h]){if(o<l)i+=t.slice(o,l)
o=l+1,i+=n[h]}if(++l===r)break t
h=t.charCodeAt(l)}if(o<l)i+=t.slice(o,l)
if(h<2048){o=l+1,i+=n[192|h>>6]+n[128|63&h]
continue}if(h<55296||h>=57344){o=l+1,i+=n[224|h>>12]+n[128|h>>6&63]+n[128|63&h]
continue}if(++l,l>=r)throw new s
const a=1023&t.charCodeAt(l)
o=l+1,h=65536+((1023&h)<<10|a),i+=n[240|h>>18]+n[128|h>>12&63]+n[128|h>>6&63]+n[128|63&h]}if(0===o)return t
if(o<r)return i+t.slice(o)
return i}const w=new Int8Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,+0,+1,+2,+3,+4,+5,+6,+7,+8,+9,-1,-1,-1,-1,-1,-1,-1,10,11,12,13,14,15,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,11,12,13,14,15,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1])
function y(t,e){const{length:n}=t,s=Buffer.allocUnsafe(n)
let r=0,i=0,o,l,h,a
const f=t.length-2
let c=false
while(r<n){if(o=t[r],43===o&&e){s[i++]=32,r++
continue}if(37===o&&r<f)if(o=t.charCodeAt(++r),h=w[o],!(h>=0)){s[i++]=37
continue}else if(l=t.charCodeAt(++r),a=w[l],!(a>=0))s[i++]=37,r--
else c=true,o=16*h+a
s[i++]=o,r++}return c?s.slice(0,i):s}function b(t,e=false){try{return decodeURIComponent(t)}catch{return y(t,e).toString()}}const _=97,R=122,S=47,A=92,$=38,L=61,U=37,E=43,v=(t,e)=>{if('object'!==typeof t||t.constructor!==Object)throw new r(e,'Object',t)},I=(t,e)=>{if('function'!==typeof t)throw new r(e,'Function',t)},T=Object.freeze({enumerable:true}),{platform:P}=process,O='win32'===P,{domainTo:j,encodeAuth:k,parse:C,URL_FLAGS_CANNOT_BE_BASE:N,URL_FLAGS_HAS_FRAGMENT:F,URL_FLAGS_HAS_HOST:H,URL_FLAGS_HAS_PASSWORD:q,URL_FLAGS_HAS_PATH:D,URL_FLAGS_HAS_QUERY:G,URL_FLAGS_HAS_USERNAME:V,URL_FLAGS_IS_DEFAULT_SCHEME_PORT:x,URL_FLAGS_SPECIAL:M,kFragment:B,kHost:Q,kHostname:W,kPathStart:J,kPort:Y,kQuery:z,kSchemeStart:K}=import.meta.native,X=Symbol('context'),Z=Symbol('cannot-be-base'),tt=Symbol('cannot-have-username-password-port'),et=Symbol('special'),nt=Symbol('query'),st=Symbol('format'),rt=Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())),it='null'
function ot(t,e,n){return`${t}//${e}${null===n?'':`:${n}`}`}class lt{flags=0
scheme=':'
username=''
password=''
host=null
port=null
path=[]
query=null
fragment=null}const ht=t=>{if(!(t instanceof at))throw new a('URLSearchParams')}
class at{constructor(t=void 0){if(null===t||void 0===t)this[nt]=[]
else if('object'===typeof t||'function'===typeof t){const n=t[Symbol.iterator]
if(n===this[Symbol.iterator]){const e=t[nt]
this[nt]=e.slice()}else if(null!==n&&void 0!==n){if('function'!==typeof n)throw new i('Query pairs')
const s=[]
for(const n of t){if('object'!==typeof n&&'function'!==typeof n||null===n||'function'!==typeof n[Symbol.iterator])throw new f('Each query pair','[name, value]')
const t=[]
for(const s of n)t.push(e(s))
s.push(t)}this[nt]=[]
for(const t of s){if(2!==t.length)throw new f('Each query pair','[name, value]')
this[nt].push(t[0],t[1])}}else{const n={}
this[nt]=[]
const s=Reflect.ownKeys(t)
for(let r=0;r<s.length;r++){const i=s[r]
if('string'!==typeof i)continue
const o=Reflect.getOwnPropertyDescriptor(t,i)
if(null!=o&&o.enumerable){const s=e(i),r=e(t[i])
if(void 0!==n[s])this[nt][n[s]]=r
else n[s]=this[nt].push(s,r)-1}}}}else{if(t=e(t),'?'===t[0])t=t.slice(1)
St(this,t)}this[X]=null}append(t,n){if(ht(this),arguments.length<2)throw new p('name','value')
t=e(t),n=e(n),this[nt].push(t,n),Rt(this[X],this)}delete(t){if(ht(this),arguments.length<1)throw new p('name')
const n=this[nt]
t=e(t)
for(let e=0;e<n.length;){const s=n[e]
if(s===t)n.splice(e,2)
else e+=2}Rt(this[X],this)}get(t){if(ht(this),arguments.length<1)throw new p('name')
const n=this[nt]
t=e(t)
for(let e=0;e<n.length;e+=2)if(n[e]===t)return n[e+1]
return null}getAll(t){if(ht(this),arguments.length<1)throw new p('name')
const n=this[nt],s=[]
t=e(t)
for(let e=0;e<n.length;e+=2)if(n[e]===t)s.push(n[e+1])
return s}has(t){if(ht(this),arguments.length<1)throw new p('name')
const n=this[nt]
t=e(t)
for(let e=0;e<n.length;e+=2)if(n[e]===t)return true
return false}set(t,n){if(ht(this),arguments.length<2)throw new p('name','value')
const s=this[nt]
t=e(t),n=e(n)
let r=false
for(let e=0;e<s.length;){const i=s[e]
if(i===t)if(!r)s[e+1]=n,r=true,e+=2
else s.splice(e,2)
else e+=2}if(!r)s.push(t,n)
Rt(this[X],this)}sort(){const t=this[nt],e=t.length
if(e<=2);else if(e<100)for(let n=2;n<e;n+=2){const e=t[n],s=t[n+1]
let r
for(r=n-2;r>=0;r-=2)if(t[r]>e)t[r+2]=t[r],t[r+3]=t[r+1]
else break
t[r+2]=e,t[r+3]=s}else{const n=new Array(e),s=new Array(e)
for(let r=2;r<e;r*=2)for(let i=0;i<e-2;i+=2*r){const o=i+r
let l=o+r
if(l=l<e?l:e,o>l)continue
vt(t,i,o,l,n,s)}}Rt(this[X],this)}entries(){return ht(this),It(this,'key+value')}forEach(t,e=void 0){ht(this),I(t,'callback')
let n=this[nt],s=0
while(s<n.length){const r=n[s],i=n[s+1]
t.call(e,i,r,this),n=this[nt],s+=2}}keys(){return ht(this),It(this,'key')}values(){return ht(this),It(this,'value')}toString(){return ht(this),Ut(this[nt])}}function ft(t,e,n,s,r,i,o,l,h){const a=this[X]
a.flags=t,a.scheme=e,a.username=n||'',a.password=s||'',a.port=i,a.path=o||[],a.query=l,a.fragment=h,a.host=r
let f=this[nt]
if(!f)f=this[nt]=new at,f[X]=this
St(f,l)}function ct(t,e){throw new c(t)}function ut(t,e,n,s,r,i,o,l,h){const a=this[X]
if(0!==(t&M))a.flags|=M
else a.flags&=~M
a.scheme=e,a.port=i}function pt(t,e,n,s,r,i,o,l,h){const a=this[X]
if(0!==(t&H))a.host=r,a.flags|=H
else a.host=null,a.flags&=~H}function gt(t,e,n,s,r,i,o,l,h){this[X].port=i}function mt(t,e,n,s,r,i,o,l,h){if(Reflect.apply(pt,this,arguments),null!==i||0!==(t&x))Reflect.apply(gt,this,arguments)}function dt(t,e,n,s,r,i,o,l,h){const a=this[X]
if(0!==(t&D))a.path=o,a.flags|=D
else a.path=[],a.flags&=~D
if(0!==(t&H))a.host=r,a.flags|=H}function wt(t,e,n,s,r,i,o,l,h){this[X].query=l}function yt(t,e,n,s,r,i,o,l,h){this[X].fragment=h}Object.defineProperties(at.prototype,{append:T,delete:T,get:T,getAll:T,has:T,set:T,sort:T,entries:T,forEach:T,keys:T,values:T,toString:T,[Symbol.toStringTag]:{__proto__:null,configurable:true,value:'URLSearchParams'},[Symbol.iterator]:{__proto__:null,configurable:true,writable:true,value:at.prototype.entries}})
const bt=t=>{if(!(t instanceof _t))throw new a('URL')}
class _t{constructor(t,e=void 0){let n
if(t=`${t}`,void 0!==e)n=new _t(e)[X]
this[X]=new lt,C(t,-1,n,void 0,ft.bind(this),ct.bind(this,t))}get[et](){return 0!==(this[X].flags&M)}get[Z](){return 0!==(this[X].flags&N)}get[tt](){const{host:t,scheme:e}=this[X]
return null==t||''===t||this[Z]||'file:'===e}[st](t){if(t)v(t,'options')
t={fragment:true,unicode:false,search:true,auth:true,...t}
const e=this[X]
let n=e.scheme
if(null!==e.host){n+='//'
const s=''!==e.username,r=''!==e.password
if(t.auth&&(s||r)){if(s)n+=e.username
if(r)n+=`:${e.password}`
n+='@'}if(n+=t.unicode?Ot(e.host):e.host,null!==e.port)n+=`:${e.port}`}if(this[Z])n+=e.path[0]
else{if(null===e.host&&e.path.length>1&&''===e.path[0])n+='/.'
if(e.path.length)n+='/'+e.path.join('/')}if(t.search&&null!==e.query)n+=`?${e.query}`
if(t.fragment&&null!==e.fragment)n+=`#${e.fragment}`
return n}toString(){return this.href}get href(){return bt(this),this[st]({})}set href(t){bt(this),t=`${t}`,C(t,-1,void 0,void 0,ft.bind(this),ct.bind(this,t))}get origin(){bt(this)
const t=this[X]
switch(t.scheme){case'blob:':if(t.path.length>0)try{return new _t(t.path[0]).origin}catch{}return it
case'ftp:':case'http:':case'https:':case'ws:':case'wss:':return ot(t.scheme,t.host,t.port)}return it}get protocol(){return bt(this),this[X].scheme}set protocol(t){if(bt(this),t=`${t}`,!t.length)return
const e=this[X]
C(t,K,null,e,ut.bind(this))}get username(){return bt(this),this[X].username}set username(t){if(bt(this),t=`${t}`,this[tt])return
const e=this[X]
if(''===t)return e.username='',e.flags&=~V,void 0
e.username=k(t),e.flags|=V}get password(){return bt(this),this[X].password}set password(t){if(bt(this),t=`${t}`,this[tt])return
const e=this[X]
if(''===t)return e.password='',e.flags&=~q,void 0
e.password=k(t),e.flags|=q}get host(){bt(this)
const t=this[X]
let e=t.host||''
if(null!==t.port)e+=`:${t.port}`
return e}set host(t){bt(this)
const e=this[X]
if(t=`${t}`,this[Z])return
C(t,Q,null,e,mt.bind(this))}get hostname(){return bt(this),this[X].host||''}set hostname(t){bt(this)
const e=this[X]
if(t=`${t}`,this[Z])return
C(t,W,null,e,pt.bind(this))}get port(){bt(this)
const t=this[X].port
return null===t?'':String(t)}set port(t){if(bt(this),t=`${t}`,this[tt])return
const e=this[X]
if(''===t)return e.port=null,void 0
C(t,Y,null,e,gt.bind(this))}get pathname(){bt(this)
const t=this[X]
if(this[Z])return t.path[0]
if(!t.path.length)return''
return`/${t.path.join('/')}`}set pathname(t){if(bt(this),!this[Z])C(`${t}`,J,null,this[X],dt.bind(this))}get search(){bt(this)
const{query:t}=this[X]
return t?`?${t}`:''}set search(t){bt(this)
const n=this[X]
if(t=e(t),''===t)n.query=null,n.flags&=~G
else{if('?'===t[0])t=t.slice(1)
if(n.query='',n.flags|=G,t)C(t,z,null,n,wt.bind(this))}St(this[nt],t)}get searchParams(){return bt(this),this[nt]}get hash(){bt(this)
const{fragment:t}=this[X]
return t?`#${t}`:''}set hash(t){bt(this)
const e=this[X]
if(t=`${t}`,!t)return e.fragment=null,e.flags&=~F,void 0
if('#'===t[0])t=t.slice(1)
e.fragment='',e.flags|=F,C(t,B,null,e,yt.bind(this))}toJSON(){return bt(this),this[st]({})}}function Rt(t,e){if(!t)return
const n=t[X],s=e.toString()
if(s)n.query=s,n.flags|=G
else n.query=null,n.flags&=~G}function St(t,e){if(!e)return t[nt]=[],void 0
t[nt]=At(e)}function At(t){const e=[]
let n=0,s=0,r=false,i='',o=false,l=0,h
for(h=0;h<t.length;++h){const a=t.charCodeAt(h)
if(a===$){if(n===h){s=n=h+1
continue}if(s<h)i+=t.slice(s,h)
if(o)i=b(i)
if(e.push(i),!r)e.push('')
r=false,i='',o=false,l=0,s=n=h+1
continue}if(!r&&a===L){if(s<h)i+=t.slice(s,h)
if(o)i=b(i)
e.push(i),r=true,i='',o=false,l=0,s=h+1
continue}if(a===E){if(s<h)i+=t.slice(s,h)
i+=' ',s=h+1}else if(!o)if(a===U)l=1
else if(l>0)if(1===m[a]){if(3===++l)o=true}else l=0}if(n===h)return e
if(s<h)i+=t.slice(s,h)
if(o)i=b(i)
if(e.push(i),!r)e.push('')
return e}Object.defineProperties(_t.prototype,{[st]:{__proto__:null,configurable:false,writable:false},[Symbol.toStringTag]:{__proto__:null,configurable:true,value:'URL'},toString:T,href:T,origin:T,protocol:T,username:T,password:T,host:T,hostname:T,port:T,pathname:T,search:T,searchParams:T,hash:T,toJSON:T})
const $t=new Int8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0]),Lt=g.slice()
function Ut(t){const{length:e}=t
if(!e)return''
const n=d(t[0],$t,Lt),s=d(t[1],$t,Lt)
let r=`${n}=${s}`
for(let n=2;n<e;n+=2){const e=d(t[n],$t,Lt),s=d(t[n+1],$t,Lt)
r+=`&${e}=${s}`}return r}function Et(t,e,n){Object.defineProperty(t,Symbol.toStringTag,{__proto__:null,writable:false,enumerable:false,configurable:true,value:e})
for(const e of Object.keys(n))Object.defineProperty(t,e,{__proto__:null,writable:true,enumerable:true,configurable:true,value:n[e]})
for(const e of Object.getOwnPropertySymbols(n))Object.defineProperty(t,e,{__proto__:null,writable:true,enumerable:false,configurable:true,value:n[e]})}function vt(t,e,n,s,r,i){const o=n-e,l=s-n
let h,a,f
for(h=0;h<o;h++)r[h]=t[e+h]
for(a=0;a<l;a++)i[a]=t[n+a]
h=0,a=0,f=e
while(h<o&&a<l)if(r[h]<=i[a])t[f++]=r[h++],t[f++]=r[h++]
else t[f++]=i[a++],t[f++]=i[a++]
while(h<o)t[f++]=r[h++]
while(a<l)t[f++]=i[a++]}function It(t,e){const n=Object.create(Tt)
return n[X]={target:t,kind:e,index:0},n}Lt[32]='+'
const Tt=Object.create(rt)
Et(Tt,'URLSearchParams Iterator',{next(){if(!this||Object.getPrototypeOf(this)!==Tt)throw new a('URLSearchParamsIterator')
const{target:t,kind:e,index:n}=this[X],s=t[nt]
if(n>=s.length)return{value:void 0,done:true}
const r=s[n],i=s[n+1]
let o
if(this[X].index=n+2,'key'===e)o=r
else if('value'===e)o=i
else o=[r,i]
return{value:o,done:false}}})
const Pt=t=>{if(arguments.length<1)throw new p('domain')
return j(t,false)},Ot=t=>{if(arguments.length<1)throw new p('domain')
return j(t,true)}
function jt(t){const e={protocol:t.protocol,hostname:'string'===typeof t.hostname&&t.hostname.startsWith('[')?t.hostname.slice(1,-1):t.hostname,hash:t.hash,search:t.search,pathname:t.pathname,path:`${t.pathname||''}${t.search||''}`,href:t.href}
if(''!==t.port)e.port=Number(t.port)
if(t.username||t.password)e.auth=`${decodeURIComponent(t.username)}:${decodeURIComponent(t.password)}`
return e}const kt=/\//g
function Ct(t){let{hostname:e,pathname:n}=t
const{length:s}=n
for(let t=0;t<s;t++)if('%'===n[t]){const e=32|n.codePointAt(t+2)
if('2'===n[t+1]&&102===e||'5'===n[t+1]&&99===e)throw new h('must not include encoded \\ or / characters')}if(n=n.replace(kt,'\\'),n=decodeURIComponent(n),''!==e)return`\\\\${Ot(e)}${n}`
const r=32|n.codePointAt(1),i=n[2]
if(r<_||r>R||':'!==i)throw new h('must be absolute')
return n.slice(1)}function Nt(t){if(''!==t.hostname)throw new l(P)
const{pathname:e}=t,{length:n}=e
for(let t=0;t<n;t++)if('%'===e[t]){const n=32|e.codePointAt(t+2)
if('2'===e[t+1]&&102===n)throw new h('must not include encoded / characters')}return decodeURIComponent(e)}function Ft(t){if('string'===typeof t)t=new _t(t)
else if(!(t instanceof _t))throw new r('path',['string','URL'],t)
if('file:'!==t.protocol)throw new u('file')
return O?Ct(t):Nt(t)}const Ht=/%/g,qt=/\\/g,Dt=/\n/g,Gt=/\r/g,Vt=/\t/g
function xt(t){if(t.includes('%'))t=t.replace(Ht,'%25')
if(!O&&t.includes('\\'))t=t.replace(qt,'%5C')
if(t.includes('\n'))t=t.replace(Dt,'%0A')
if(t.includes('\r'))t=t.replace(Gt,'%0D')
if(t.includes('\t'))t=t.replace(Vt,'%09')
return t}function Mt(e){const n=new _t('file://')
if(O&&e.startsWith('\\\\')){const t=e.split('\\')
if(t.length<=3)throw new o('filepath',e,'Missing UNC resource path')
const s=t[2]
if(!s.length)throw new o('filepath',e,'Empty UNC servername')
n.hostname=Pt(s),n.pathname=xt(t.slice(3).join('/'))}else{let s=t.resolve(e)
const r=e.charCodeAt(e.length-1)
if((r===S||O&&r===A)&&s[s.length-1]!==t.sep)s+='/'
n.pathname=xt(s)}return n}const Bt={URL:_t,URLSearchParams:at,domainToASCII:Pt,domainToUnicode:Ot,pathToFileURL:Mt,fileURLToPath:Ft,urlToHttpOptions:jt}
Object.assign(global,{URL:_t,URLSearchParams:at})
export{_t as URL,at as URLSearchParams,Bt as default,Pt as domainToASCII,Ot as domainToUnicode,Ft as fileURLToPath,Mt as pathToFileURL,jt as urlToHttpOptions}
