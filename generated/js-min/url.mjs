import t from'path'
import{toUSVString as e}from'util'
const n=(t,e,n)=>{if('string'===typeof n)return class extends e{code=t
message=n}
return class extends e{code=t
constructor(...t){super(),this.message=n(this,...t)}}},r=n('ERR_INVALID_URI',URIError,'URI malformed'),s=n('ERR_INVALID_ARG_TYPE',Error,((t,e,n,r)=>`The ${e} argument must be of type ${n}. Received ${typeof r}`)),i=n('ERR_ARG_NOT_ITERABLE',TypeError,((t,e)=>`${e} must be iterable`)),o=n('ERR_INVALID_ARG_VALUE',TypeError,((t,e,n,r='is invalid')=>`The ${e.includes('.')?'property':'argument'} '${e}' ${r}. Received ${typeof n}`)),l=n('ERR_INVALID_FILE_URL_HOST',TypeError,((t,e)=>`File URL host must be "localhost" or empty on ${e}`)),h=n('ERR_INVALID_FILE_URL_PATH',TypeError,((t,e)=>`File URL path ${e}`)),a=n('ERR_INVALID_THIS',TypeError,((t,e)=>`Value of "this" must be of type ${e}`)),f=n('ERR_INVALID_TUPLE',TypeError,((t,...e)=>`${e[0]} must be an iterable ${e[1]} tuple`)),c=n('ERR_INVALID_URL',TypeError,((t,e)=>(t.input=e,'Invalid URL'))),u=n('ERR_INVALID_URL_SCHEME',TypeError,((t,e)=>{if('string'===typeof e)e=[e]
if(e.length>2)return'assert: expected.length <= 2'
const n=2===e.length?`one of scheme ${e[0]} or ${e[1]}`:`of scheme ${e[0]}`
return`The URL must be ${n}`})),p=n('ERR_MISSING_ARGS',TypeError,((t,...e)=>{const{length:n}=e
if(!n)return'assert: At least one arg needs to be specified'
let r='The '
const s=n,i=t=>`"${t}"`
switch(e=e.map((t=>Array.isArray(t)?t.map(i).join(' or '):i(t))),s){case 1:r+=`${e[0]} argument`
break
case 2:r+=`${e[0]} and ${e[1]} arguments`
break
default:r+=e.slice(0,s-1).join(', '),r+=`, and ${e[s-1]} arguments`
break}return`${r} must be specified`})),g=new Array(256).map(((t,e)=>`%${e<16?'0':''}${e.toString(16)}`)),m=new Int8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
function d(t,e,n){const{length:s}=t
if(0===s)return''
let i='',o=0,l=0
t:for(;l<s;l++){let h=t.charCodeAt(l)
while(h<128){if(1!==e[h]){if(o<l)i+=t.slice(o,l)
o=l+1,i+=n[h]}if(++l===s)break t
h=t.charCodeAt(l)}if(o<l)i+=t.slice(o,l)
if(h<2048){o=l+1,i+=n[192|h>>6]+n[128|63&h]
continue}if(h<55296||h>=57344){o=l+1,i+=n[224|h>>12]+n[128|h>>6&63]+n[128|63&h]
continue}if(++l,l>=s)throw new r
const a=1023&t.charCodeAt(l)
o=l+1,h=65536+((1023&h)<<10|a),i+=n[240|h>>18]+n[128|h>>12&63]+n[128|h>>6&63]+n[128|63&h]}if(0===o)return t
if(o<s)return i+t.slice(o)
return i}const w=new Int8Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,+0,+1,+2,+3,+4,+5,+6,+7,+8,+9,-1,-1,-1,-1,-1,-1,-1,10,11,12,13,14,15,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,11,12,13,14,15,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1])
function y(t,e){const{length:n}=t,r=Buffer.allocUnsafe(n)
let s=0,i=0,o,l,h,a
const f=t.length-2
let c=false
while(s<n){if(o=t[s],43===o&&e){r[i++]=32,s++
continue}if(37===o&&s<f)if(o=t.charCodeAt(++s),h=w[o],!(h>=0)){r[i++]=37
continue}else if(l=t.charCodeAt(++s),a=w[l],!(a>=0))r[i++]=37,s--
else c=true,o=16*h+a
r[i++]=o,s++}return c?r.slice(0,i):r}function _(t,e=false){try{return decodeURIComponent(t)}catch{return y(t,e).toString()}}const b=97,R=122,S=47,A=92,$=38,L=61,U=37,E=43,v=(t,e,n=void 0)=>{if(!(null!=n&&n.nullable)&&null===t||!(null!=n&&n.allowArray)&&Array.isArray(t)||'object'!==typeof t&&(!(null!=n&&n.allowFunction)||'function'!==typeof t))throw new s(e,'Object',t)},I=(t,e)=>{if('function'!==typeof t)throw new s(e,'Function',t)},T=Object.freeze({enumerable:true}),{platform:P}=process,O='win32'===P,{domainTo:j,encodeAuth:k,parse:C,URL_FLAGS_CANNOT_BE_BASE:N,URL_FLAGS_HAS_FRAGMENT:F,URL_FLAGS_HAS_HOST:H,URL_FLAGS_HAS_PASSWORD:G,URL_FLAGS_HAS_PATH:q,URL_FLAGS_HAS_QUERY:D,URL_FLAGS_HAS_USERNAME:V,URL_FLAGS_IS_DEFAULT_SCHEME_PORT:x,URL_FLAGS_SPECIAL:M,kFragment:B,kHost:Q,kHostname:W,kPathStart:J,kPort:Y,kQuery:z,kSchemeStart:K}=import.meta.native,X=Symbol('context'),Z=Symbol('cannot-be-base'),tt=Symbol('cannot-have-username-password-port'),et=Symbol('special'),nt=Symbol('query'),rt=Symbol('format'),st=Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())),it='null'
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
const r=[]
for(const n of t){if('object'!==typeof n&&'function'!==typeof n||null===n||'function'!==typeof n[Symbol.iterator])throw new f('Each query pair','[name, value]')
const t=[]
for(const r of n)t.push(e(r))
r.push(t)}this[nt]=[]
for(const t of r){if(2!==t.length)throw new f('Each query pair','[name, value]')
this[nt].push(t[0],t[1])}}else{const n={}
this[nt]=[]
const r=Reflect.ownKeys(t)
for(let s=0;s<r.length;s++){const i=r[s]
if('string'!==typeof i)continue
const o=Reflect.getOwnPropertyDescriptor(t,i)
if(null!=o&&o.enumerable){const r=e(i),s=e(t[i])
if(void 0!==n[r])this[nt][n[r]]=s
else n[r]=this[nt].push(r,s)-1}}}}else{if(t=e(t),'?'===t[0])t=t.slice(1)
St(this,t)}this[X]=null}append(t,n){if(ht(this),arguments.length<2)throw new p('name','value')
t=e(t),n=e(n),this[nt].push(t,n),Rt(this[X],this)}delete(t){if(ht(this),arguments.length<1)throw new p('name')
const n=this[nt]
t=e(t)
for(let e=0;e<n.length;){const r=n[e]
if(r===t)n.splice(e,2)
else e+=2}Rt(this[X],this)}get(t){if(ht(this),arguments.length<1)throw new p('name')
const n=this[nt]
t=e(t)
for(let e=0;e<n.length;e+=2)if(n[e]===t)return n[e+1]
return null}getAll(t){if(ht(this),arguments.length<1)throw new p('name')
const n=this[nt],r=[]
t=e(t)
for(let e=0;e<n.length;e+=2)if(n[e]===t)r.push(n[e+1])
return r}has(t){if(ht(this),arguments.length<1)throw new p('name')
const n=this[nt]
t=e(t)
for(let e=0;e<n.length;e+=2)if(n[e]===t)return true
return false}set(t,n){if(ht(this),arguments.length<2)throw new p('name','value')
const r=this[nt]
t=e(t),n=e(n)
let s=false
for(let e=0;e<r.length;){const i=r[e]
if(i===t)if(!s)r[e+1]=n,s=true,e+=2
else r.splice(e,2)
else e+=2}if(!s)r.push(t,n)
Rt(this[X],this)}sort(){const t=this[nt],e=t.length
if(e<=2);else if(e<100)for(let n=2;n<e;n+=2){const e=t[n],r=t[n+1]
let s
for(s=n-2;s>=0;s-=2)if(t[s]>e)t[s+2]=t[s],t[s+3]=t[s+1]
else break
t[s+2]=e,t[s+3]=r}else{const n=new Array(e),r=new Array(e)
for(let s=2;s<e;s*=2)for(let i=0;i<e-2;i+=2*s){const o=i+s
let l=o+s
if(l=l<e?l:e,o>l)continue
vt(t,i,o,l,n,r)}}Rt(this[X],this)}entries(){return ht(this),It(this,'key+value')}forEach(t,e=void 0){ht(this),I(t,'callback')
let n=this[nt],r=0
while(r<n.length){const s=n[r],i=n[r+1]
t.call(e,i,s,this),n=this[nt],r+=2}}keys(){return ht(this),It(this,'key')}values(){return ht(this),It(this,'value')}toString(){return ht(this),Ut(this[nt])}}function ft(t,e,n,r,s,i,o,l,h){const a=this[X]
a.flags=t,a.scheme=e,a.username=n||'',a.password=r||'',a.port=i,a.path=o||[],a.query=l,a.fragment=h,a.host=s
let f=this[nt]
if(!f)f=this[nt]=new at,f[X]=this
St(f,l)}function ct(t,e){throw new c(t)}function ut(t,e,n,r,s,i,o,l,h){const a=this[X]
if(0!==(t&M))a.flags|=M
else a.flags&=~M
a.scheme=e,a.port=i}function pt(t,e,n,r,s,i,o,l,h){const a=this[X]
if(0!==(t&H))a.host=s,a.flags|=H
else a.host=null,a.flags&=~H}function gt(t,e,n,r,s,i,o,l,h){this[X].port=i}function mt(t,e,n,r,s,i,o,l,h){if(Reflect.apply(pt,this,arguments),null!==i||0!==(t&x))Reflect.apply(gt,this,arguments)}function dt(t,e,n,r,s,i,o,l,h){const a=this[X]
if(0!==(t&q))a.path=o,a.flags|=q
else a.path=[],a.flags&=~q
if(0!==(t&H))a.host=s,a.flags|=H}function wt(t,e,n,r,s,i,o,l,h){this[X].query=l}function yt(t,e,n,r,s,i,o,l,h){this[X].fragment=h}Object.defineProperties(at.prototype,{append:T,delete:T,get:T,getAll:T,has:T,set:T,sort:T,entries:T,forEach:T,keys:T,values:T,toString:T,[Symbol.toStringTag]:{__proto__:null,configurable:true,value:'URLSearchParams'},[Symbol.iterator]:{__proto__:null,configurable:true,writable:true,value:at.prototype.entries}})
const _t=t=>{if(!(t instanceof bt))throw new a('URL')}
class bt{constructor(t,e=void 0){let n
if(t=`${t}`,void 0!==e)n=new bt(e)[X]
this[X]=new lt,C(t,-1,n,void 0,ft.bind(this),ct.bind(this,t))}get[et](){return 0!==(this[X].flags&M)}get[Z](){return 0!==(this[X].flags&N)}get[tt](){const{host:t,scheme:e}=this[X]
return null==t||''===t||this[Z]||'file:'===e}[rt](t){if(t)v(t,'options')
t={fragment:true,unicode:false,search:true,auth:true,...t}
const e=this[X]
let n=e.scheme
if(null!==e.host){n+='//'
const r=''!==e.username,s=''!==e.password
if(t.auth&&(r||s)){if(r)n+=e.username
if(s)n+=`:${e.password}`
n+='@'}if(n+=t.unicode?Ot(e.host):e.host,null!==e.port)n+=`:${e.port}`}if(this[Z])n+=e.path[0]
else{if(null===e.host&&e.path.length>1&&''===e.path[0])n+='/.'
if(e.path.length)n+='/'+e.path.join('/')}if(t.search&&null!==e.query)n+=`?${e.query}`
if(t.fragment&&null!==e.fragment)n+=`#${e.fragment}`
return n}toString(){return this.href}get href(){return _t(this),this[rt]({})}set href(t){_t(this),t=`${t}`,C(t,-1,void 0,void 0,ft.bind(this),ct.bind(this,t))}get origin(){_t(this)
const t=this[X]
switch(t.scheme){case'blob:':if(t.path.length>0)try{return new bt(t.path[0]).origin}catch{}return it
case'ftp:':case'http:':case'https:':case'ws:':case'wss:':return ot(t.scheme,t.host,t.port)}return it}get protocol(){return _t(this),this[X].scheme}set protocol(t){if(_t(this),t=`${t}`,!t.length)return
const e=this[X]
C(t,K,null,e,ut.bind(this))}get username(){return _t(this),this[X].username}set username(t){if(_t(this),t=`${t}`,this[tt])return
const e=this[X]
if(''===t)return e.username='',e.flags&=~V,void 0
e.username=k(t),e.flags|=V}get password(){return _t(this),this[X].password}set password(t){if(_t(this),t=`${t}`,this[tt])return
const e=this[X]
if(''===t)return e.password='',e.flags&=~G,void 0
e.password=k(t),e.flags|=G}get host(){_t(this)
const t=this[X]
let e=t.host||''
if(null!==t.port)e+=`:${t.port}`
return e}set host(t){_t(this)
const e=this[X]
if(t=`${t}`,this[Z])return
C(t,Q,null,e,mt.bind(this))}get hostname(){return _t(this),this[X].host||''}set hostname(t){_t(this)
const e=this[X]
if(t=`${t}`,this[Z])return
C(t,W,null,e,pt.bind(this))}get port(){_t(this)
const t=this[X].port
return null===t?'':String(t)}set port(t){if(_t(this),t=`${t}`,this[tt])return
const e=this[X]
if(''===t)return e.port=null,void 0
C(t,Y,null,e,gt.bind(this))}get pathname(){_t(this)
const t=this[X]
if(this[Z])return t.path[0]
if(!t.path.length)return''
return`/${t.path.join('/')}`}set pathname(t){if(_t(this),!this[Z])C(`${t}`,J,null,this[X],dt.bind(this))}get search(){_t(this)
const{query:t}=this[X]
return t?`?${t}`:''}set search(t){_t(this)
const n=this[X]
if(t=e(t),''===t)n.query=null,n.flags&=~D
else{if('?'===t[0])t=t.slice(1)
if(n.query='',n.flags|=D,t)C(t,z,null,n,wt.bind(this))}St(this[nt],t)}get searchParams(){return _t(this),this[nt]}get hash(){_t(this)
const{fragment:t}=this[X]
return t?`#${t}`:''}set hash(t){_t(this)
const e=this[X]
if(t=`${t}`,!t)return e.fragment=null,e.flags&=~F,void 0
if('#'===t[0])t=t.slice(1)
e.fragment='',e.flags|=F,C(t,B,null,e,yt.bind(this))}toJSON(){return _t(this),this[rt]({})}}function Rt(t,e){if(!t)return
const n=t[X],r=e.toString()
if(r)n.query=r,n.flags|=D
else n.query=null,n.flags&=~D}function St(t,e){if(!e)return t[nt]=[],void 0
t[nt]=At(e)}function At(t){const e=[]
let n=0,r=0,s=false,i='',o=false,l=0,h
for(h=0;h<t.length;++h){const a=t.charCodeAt(h)
if(a===$){if(n===h){r=n=h+1
continue}if(r<h)i+=t.slice(r,h)
if(o)i=_(i)
if(e.push(i),!s)e.push('')
s=false,i='',o=false,l=0,r=n=h+1
continue}if(!s&&a===L){if(r<h)i+=t.slice(r,h)
if(o)i=_(i)
e.push(i),s=true,i='',o=false,l=0,r=h+1
continue}if(a===E){if(r<h)i+=t.slice(r,h)
i+=' ',r=h+1}else if(!o)if(a===U)l=1
else if(l>0)if(1===m[a]){if(3===++l)o=true}else l=0}if(n===h)return e
if(r<h)i+=t.slice(r,h)
if(o)i=_(i)
if(e.push(i),!s)e.push('')
return e}Object.defineProperties(bt.prototype,{[rt]:{__proto__:null,configurable:false,writable:false},[Symbol.toStringTag]:{__proto__:null,configurable:true,value:'URL'},toString:T,href:T,origin:T,protocol:T,username:T,password:T,host:T,hostname:T,port:T,pathname:T,search:T,searchParams:T,hash:T,toJSON:T})
const $t=new Int8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0]),Lt=g.slice()
function Ut(t){const{length:e}=t
if(!e)return''
const n=d(t[0],$t,Lt),r=d(t[1],$t,Lt)
let s=`${n}=${r}`
for(let n=2;n<e;n+=2){const e=d(t[n],$t,Lt),r=d(t[n+1],$t,Lt)
s+=`&${e}=${r}`}return s}function Et(t,e,n){Object.defineProperty(t,Symbol.toStringTag,{__proto__:null,writable:false,enumerable:false,configurable:true,value:e})
for(const e of Object.keys(n))Object.defineProperty(t,e,{__proto__:null,writable:true,enumerable:true,configurable:true,value:n[e]})
for(const e of Object.getOwnPropertySymbols(n))Object.defineProperty(t,e,{__proto__:null,writable:true,enumerable:false,configurable:true,value:n[e]})}function vt(t,e,n,r,s,i){const o=n-e,l=r-n
let h,a,f
for(h=0;h<o;h++)s[h]=t[e+h]
for(a=0;a<l;a++)i[a]=t[n+a]
h=0,a=0,f=e
while(h<o&&a<l)if(s[h]<=i[a])t[f++]=s[h++],t[f++]=s[h++]
else t[f++]=i[a++],t[f++]=i[a++]
while(h<o)t[f++]=s[h++]
while(a<l)t[f++]=i[a++]}function It(t,e){const n=Object.create(Tt)
return n[X]={target:t,kind:e,index:0},n}Lt[32]='+'
const Tt=Object.create(st)
Et(Tt,'URLSearchParams Iterator',{next(){if(!this||Object.getPrototypeOf(this)!==Tt)throw new a('URLSearchParamsIterator')
const{target:t,kind:e,index:n}=this[X],r=t[nt]
if(n>=r.length)return{value:void 0,done:true}
const s=r[n],i=r[n+1]
let o
if(this[X].index=n+2,'key'===e)o=s
else if('value'===e)o=i
else o=[s,i]
return{value:o,done:false}}})
const Pt=t=>{if(arguments.length<1)throw new p('domain')
return j(t,false)},Ot=t=>{if(arguments.length<1)throw new p('domain')
return j(t,true)}
function jt(t){const e={protocol:t.protocol,hostname:'string'===typeof t.hostname&&t.hostname.startsWith('[')?t.hostname.slice(1,-1):t.hostname,hash:t.hash,search:t.search,pathname:t.pathname,path:`${t.pathname||''}${t.search||''}`,href:t.href}
if(''!==t.port)e.port=Number(t.port)
if(t.username||t.password)e.auth=`${decodeURIComponent(t.username)}:${decodeURIComponent(t.password)}`
return e}const kt=/\//g
function Ct(t){let{hostname:e,pathname:n}=t
const{length:r}=n
for(let t=0;t<r;t++)if('%'===n[t]){const e=32|n.codePointAt(t+2)
if('2'===n[t+1]&&102===e||'5'===n[t+1]&&99===e)throw new h('must not include encoded \\ or / characters')}if(n=n.replace(kt,'\\'),n=decodeURIComponent(n),''!==e)return`\\\\${Ot(e)}${n}`
const s=32|n.codePointAt(1),i=n[2]
if(s<b||s>R||':'!==i)throw new h('must be absolute')
return n.slice(1)}function Nt(t){if(''!==t.hostname)throw new l(P)
const{pathname:e}=t,{length:n}=e
for(let t=0;t<n;t++)if('%'===e[t]){const n=32|e.codePointAt(t+2)
if('2'===e[t+1]&&102===n)throw new h('must not include encoded / characters')}return decodeURIComponent(e)}function Ft(t){if('string'===typeof t)t=new bt(t)
else if(!(t instanceof bt))throw new s('path',['string','URL'],t)
if('file:'!==t.protocol)throw new u('file')
return O?Ct(t):Nt(t)}const Ht=/%/g,Gt=/\\/g,qt=/\n/g,Dt=/\r/g,Vt=/\t/g
function xt(t){if(t.includes('%'))t=t.replace(Ht,'%25')
if(!O&&t.includes('\\'))t=t.replace(Gt,'%5C')
if(t.includes('\n'))t=t.replace(qt,'%0A')
if(t.includes('\r'))t=t.replace(Dt,'%0D')
if(t.includes('\t'))t=t.replace(Vt,'%09')
return t}function Mt(e){const n=new bt('file://')
if(O&&e.startsWith('\\\\')){const t=e.split('\\')
if(t.length<=3)throw new o('filepath',e,'Missing UNC resource path')
const r=t[2]
if(!r.length)throw new o('filepath',e,'Empty UNC servername')
n.hostname=Pt(r),n.pathname=xt(t.slice(3).join('/'))}else{let r=t.resolve(e)
const s=e.charCodeAt(e.length-1)
if((s===S||O&&s===A)&&r[r.length-1]!==t.sep)r+='/'
n.pathname=xt(r)}return n}const Bt={URL:bt,URLSearchParams:at,domainToASCII:Pt,domainToUnicode:Ot,pathToFileURL:Mt,fileURLToPath:Ft,urlToHttpOptions:jt}
Object.assign(global,{URL:bt,URLSearchParams:at})
export{bt as URL,at as URLSearchParams,Bt as default,Pt as domainToASCII,Ot as domainToUnicode,Ft as fileURLToPath,Mt as pathToFileURL,jt as urlToHttpOptions}
