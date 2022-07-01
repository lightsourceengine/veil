import t from'path'
import{toUSVString as e}from'util'
import{validateFunction as n,validateObject as s}from'internal/validators'
import{codes as r}from'internal/errors'
const{ERR_INVALID_URI:i}=r,o=new Array(256).map(((t,e)=>`%${e<16?'0':''}${e.toString(16)}`)),l=new Int8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
function h(t,e,n){const{length:s}=t
if(0===s)return''
let r='',o=0,l=0
t:for(;l<s;l++){let h=t.charCodeAt(l)
while(h<128){if(1!==e[h]){if(o<l)r+=t.slice(o,l)
o=l+1,r+=n[h]}if(++l===s)break t
h=t.charCodeAt(l)}if(o<l)r+=t.slice(o,l)
if(h<2048){o=l+1,r+=n[192|h>>6]+n[128|63&h]
continue}if(h<55296||h>=57344){o=l+1,r+=n[224|h>>12]+n[128|h>>6&63]+n[128|63&h]
continue}if(++l,l>=s)throw new i
const a=1023&t.charCodeAt(l)
o=l+1,h=65536+((1023&h)<<10|a),r+=n[240|h>>18]+n[128|h>>12&63]+n[128|h>>6&63]+n[128|63&h]}if(0===o)return t
if(o<s)return r+t.slice(o)
return r}const a=new Int8Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,+0,+1,+2,+3,+4,+5,+6,+7,+8,+9,-1,-1,-1,-1,-1,-1,-1,10,11,12,13,14,15,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,11,12,13,14,15,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1])
function f(t,e){const{length:n}=t,s=Buffer.allocUnsafe(n)
let r=0,i=0,o,l,h,f
const c=t.length-2
let u=false
while(r<n){if(o=t[r],43===o&&e){s[i++]=32,r++
continue}if(37===o&&r<c)if(o=t.charCodeAt(++r),h=a[o],!(h>=0)){s[i++]=37
continue}else if(l=t.charCodeAt(++r),f=a[l],!(f>=0))s[i++]=37,r--
else u=true,o=16*h+f
s[i++]=o,r++}return u?s.slice(0,i):s}function c(t,e=false){try{return decodeURIComponent(t)}catch{return f(t,e).toString()}}const u=97,p=122,g=47,m=92,d=38,w=61,R=37,_=43,{ERR_ARG_NOT_ITERABLE:S,ERR_INVALID_ARG_TYPE:L,ERR_INVALID_ARG_VALUE:b,ERR_INVALID_FILE_URL_HOST:y,ERR_INVALID_FILE_URL_PATH:U,ERR_INVALID_THIS:A,ERR_INVALID_TUPLE:I,ERR_INVALID_URL:P,ERR_INVALID_URL_SCHEME:v,ERR_MISSING_ARGS:E}=r,$=Object.freeze({enumerable:true}),{platform:O}=process,C='win32'===O,{domainTo:T,encodeAuth:N,parse:j,URL_FLAGS_CANNOT_BE_BASE:k,URL_FLAGS_HAS_FRAGMENT:H,URL_FLAGS_HAS_HOST:F,URL_FLAGS_HAS_PASSWORD:G,URL_FLAGS_HAS_PATH:q,URL_FLAGS_HAS_QUERY:D,URL_FLAGS_HAS_USERNAME:V,URL_FLAGS_IS_DEFAULT_SCHEME_PORT:x,URL_FLAGS_SPECIAL:M,kFragment:B,kHost:Q,kHostname:W,kPathStart:J,kPort:Y,kQuery:z,kSchemeStart:K}=import.meta.native,X=Symbol('context'),Z=Symbol('cannot-be-base'),tt=Symbol('cannot-have-username-password-port'),et=Symbol('special'),nt=Symbol('query'),st=Symbol('format'),rt=Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())),it='null'
function ot(t,e,n){return`${t}//${e}${null===n?'':`:${n}`}`}class URLContext{flags=0
scheme=':'
username=''
password=''
host=null
port=null
path=[]
query=null
fragment=null}const lt=t=>{if(!(t instanceof URLSearchParams))throw new A('URLSearchParams')}
class URLSearchParams{constructor(t=void 0){if(null===t||void 0===t)this[nt]=[]
else if('object'===typeof t||'function'===typeof t){const n=t[Symbol.iterator]
if(n===this[Symbol.iterator]){const e=t[nt]
this[nt]=e.slice()}else if(null!==n&&void 0!==n){if('function'!==typeof n)throw new S('Query pairs')
const s=[]
for(const n of t){if('object'!==typeof n&&'function'!==typeof n||null===n||'function'!==typeof n[Symbol.iterator])throw new I('Each query pair','[name, value]')
const t=[]
for(const s of n)t.push(e(s))
s.push(t)}this[nt]=[]
for(const t of s){if(2!==t.length)throw new I('Each query pair','[name, value]')
this[nt].push(t[0],t[1])}}else{const n={}
this[nt]=[]
const s=Reflect.ownKeys(t)
for(let r=0;r<s.length;r++){const i=s[r]
if('string'!==typeof i)continue
const o=Reflect.getOwnPropertyDescriptor(t,i)
if(null!=o&&o.enumerable){const s=e(i),r=e(t[i])
if(void 0!==n[s])this[nt][n[s]]=r
else n[s]=this[nt].push(s,r)-1}}}}else{if(t=e(t),'?'===t[0])t=t.slice(1)
_t(this,t)}this[X]=null}append(t,n){if(lt(this),arguments.length<2)throw new E('name','value')
t=e(t),n=e(n),this[nt].push(t,n),Rt(this[X],this)}delete(t){if(lt(this),arguments.length<1)throw new E('name')
const n=this[nt]
t=e(t)
for(let e=0;e<n.length;){const s=n[e]
if(s===t)n.splice(e,2)
else e+=2}Rt(this[X],this)}get(t){if(lt(this),arguments.length<1)throw new E('name')
const n=this[nt]
t=e(t)
for(let e=0;e<n.length;e+=2)if(n[e]===t)return n[e+1]
return null}getAll(t){if(lt(this),arguments.length<1)throw new E('name')
const n=this[nt],s=[]
t=e(t)
for(let e=0;e<n.length;e+=2)if(n[e]===t)s.push(n[e+1])
return s}has(t){if(lt(this),arguments.length<1)throw new E('name')
const n=this[nt]
t=e(t)
for(let e=0;e<n.length;e+=2)if(n[e]===t)return true
return false}set(t,n){if(lt(this),arguments.length<2)throw new E('name','value')
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
At(t,i,o,l,n,s)}}Rt(this[X],this)}entries(){return lt(this),It(this,'key+value')}forEach(t,e=void 0){lt(this),n(t,'callback')
let s=this[nt],r=0
while(r<s.length){const n=s[r],i=s[r+1]
t.call(e,i,n,this),s=this[nt],r+=2}}keys(){return lt(this),It(this,'key')}values(){return lt(this),It(this,'value')}toString(){return lt(this),yt(this[nt])}}function ht(t,e,n,s,r,i,o,l,h){const a=this[X]
a.flags=t,a.scheme=e,a.username=n||'',a.password=s||'',a.port=i,a.path=o||[],a.query=l,a.fragment=h,a.host=r
let f=this[nt]
if(!f)f=this[nt]=new URLSearchParams,f[X]=this
_t(f,l)}function at(t,e){throw new P(t)}function ft(t,e,n,s,r,i,o,l,h){const a=this[X]
if(0!==(t&M))a.flags|=M
else a.flags&=~M
a.scheme=e,a.port=i}function ct(t,e,n,s,r,i,o,l,h){const a=this[X]
if(0!==(t&F))a.host=r,a.flags|=F
else a.host=null,a.flags&=~F}function ut(t,e,n,s,r,i,o,l,h){this[X].port=i}function pt(t,e,n,s,r,i,o,l,h){if(Reflect.apply(ct,this,arguments),null!==i||0!==(t&x))Reflect.apply(ut,this,arguments)}function gt(t,e,n,s,r,i,o,l,h){const a=this[X]
if(0!==(t&q))a.path=o,a.flags|=q
else a.path=[],a.flags&=~q
if(0!==(t&F))a.host=r,a.flags|=F}function mt(t,e,n,s,r,i,o,l,h){this[X].query=l}function dt(t,e,n,s,r,i,o,l,h){this[X].fragment=h}Object.defineProperties(URLSearchParams.prototype,{append:$,delete:$,get:$,getAll:$,has:$,set:$,sort:$,entries:$,forEach:$,keys:$,values:$,toString:$,[Symbol.toStringTag]:{__proto__:null,configurable:true,value:'URLSearchParams'},[Symbol.iterator]:{__proto__:null,configurable:true,writable:true,value:URLSearchParams.prototype.entries}})
const wt=t=>{if(!(t instanceof URL))throw new A('URL')}
class URL{constructor(t,e=void 0){let n
if(t=`${t}`,void 0!==e)n=new URL(e)[X]
this[X]=new URLContext,j(t,-1,n,void 0,ht.bind(this),at.bind(this,t))}get[et](){return 0!==(this[X].flags&M)}get[Z](){return 0!==(this[X].flags&k)}get[tt](){const{host:t,scheme:e}=this[X]
return null==t||''===t||this[Z]||'file:'===e}[st](t){if(t)s(t,'options')
t={fragment:true,unicode:false,search:true,auth:true,...t}
const e=this[X]
let n=e.scheme
if(null!==e.host){n+='//'
const s=''!==e.username,r=''!==e.password
if(t.auth&&(s||r)){if(s)n+=e.username
if(r)n+=`:${e.password}`
n+='@'}if(n+=t.unicode?Et(e.host):e.host,null!==e.port)n+=`:${e.port}`}if(this[Z])n+=e.path[0]
else{if(null===e.host&&e.path.length>1&&''===e.path[0])n+='/.'
if(e.path.length)n+='/'+e.path.join('/')}if(t.search&&null!==e.query)n+=`?${e.query}`
if(t.fragment&&null!==e.fragment)n+=`#${e.fragment}`
return n}toString(){return this.href}get href(){return wt(this),this[st]({})}set href(t){wt(this),t=`${t}`,j(t,-1,void 0,void 0,ht.bind(this),at.bind(this,t))}get origin(){wt(this)
const t=this[X]
switch(t.scheme){case'blob:':if(t.path.length>0)try{return new URL(t.path[0]).origin}catch{}return it
case'ftp:':case'http:':case'https:':case'ws:':case'wss:':return ot(t.scheme,t.host,t.port)}return it}get protocol(){return wt(this),this[X].scheme}set protocol(t){if(wt(this),t=`${t}`,!t.length)return
const e=this[X]
j(t,K,null,e,ft.bind(this))}get username(){return wt(this),this[X].username}set username(t){if(wt(this),t=`${t}`,this[tt])return
const e=this[X]
if(''===t)return e.username='',e.flags&=~V,void 0
e.username=N(t),e.flags|=V}get password(){return wt(this),this[X].password}set password(t){if(wt(this),t=`${t}`,this[tt])return
const e=this[X]
if(''===t)return e.password='',e.flags&=~G,void 0
e.password=N(t),e.flags|=G}get host(){wt(this)
const t=this[X]
let e=t.host||''
if(null!==t.port)e+=`:${t.port}`
return e}set host(t){wt(this)
const e=this[X]
if(t=`${t}`,this[Z])return
j(t,Q,null,e,pt.bind(this))}get hostname(){return wt(this),this[X].host||''}set hostname(t){wt(this)
const e=this[X]
if(t=`${t}`,this[Z])return
j(t,W,null,e,ct.bind(this))}get port(){wt(this)
const t=this[X].port
return null===t?'':String(t)}set port(t){if(wt(this),t=`${t}`,this[tt])return
const e=this[X]
if(''===t)return e.port=null,void 0
j(t,Y,null,e,ut.bind(this))}get pathname(){wt(this)
const t=this[X]
if(this[Z])return t.path[0]
if(!t.path.length)return''
return`/${t.path.join('/')}`}set pathname(t){if(wt(this),!this[Z])j(`${t}`,J,null,this[X],gt.bind(this))}get search(){wt(this)
const{query:t}=this[X]
return t?`?${t}`:''}set search(t){wt(this)
const n=this[X]
if(t=e(t),''===t)n.query=null,n.flags&=~D
else{if('?'===t[0])t=t.slice(1)
if(n.query='',n.flags|=D,t)j(t,z,null,n,mt.bind(this))}_t(this[nt],t)}get searchParams(){return wt(this),this[nt]}get hash(){wt(this)
const{fragment:t}=this[X]
return t?`#${t}`:''}set hash(t){wt(this)
const e=this[X]
if(t=`${t}`,!t)return e.fragment=null,e.flags&=~H,void 0
if('#'===t[0])t=t.slice(1)
e.fragment='',e.flags|=H,j(t,B,null,e,dt.bind(this))}toJSON(){return wt(this),this[st]({})}}function Rt(t,e){if(!t)return
const n=t[X],s=e.toString()
if(s)n.query=s,n.flags|=D
else n.query=null,n.flags&=~D}function _t(t,e){if(!e)return t[nt]=[],void 0
t[nt]=St(e)}function St(t){const e=[]
let n=0,s=0,r=false,i='',o=false,h=0,a
for(a=0;a<t.length;++a){const f=t.charCodeAt(a)
if(f===d){if(n===a){s=n=a+1
continue}if(s<a)i+=t.slice(s,a)
if(o)i=c(i)
if(e.push(i),!r)e.push('')
r=false,i='',o=false,h=0,s=n=a+1
continue}if(!r&&f===w){if(s<a)i+=t.slice(s,a)
if(o)i=c(i)
e.push(i),r=true,i='',o=false,h=0,s=a+1
continue}if(f===_){if(s<a)i+=t.slice(s,a)
i+=' ',s=a+1}else if(!o)if(f===R)h=1
else if(h>0)if(1===l[f]){if(3===++h)o=true}else h=0}if(n===a)return e
if(s<a)i+=t.slice(s,a)
if(o)i=c(i)
if(e.push(i),!r)e.push('')
return e}Object.defineProperties(URL.prototype,{[st]:{__proto__:null,configurable:false,writable:false},[Symbol.toStringTag]:{__proto__:null,configurable:true,value:'URL'},toString:$,href:$,origin:$,protocol:$,username:$,password:$,host:$,hostname:$,port:$,pathname:$,search:$,searchParams:$,hash:$,toJSON:$})
const Lt=new Int8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0]),bt=o.slice()
function yt(t){const{length:e}=t
if(!e)return''
const n=h(t[0],Lt,bt),s=h(t[1],Lt,bt)
let r=`${n}=${s}`
for(let n=2;n<e;n+=2){const e=h(t[n],Lt,bt),s=h(t[n+1],Lt,bt)
r+=`&${e}=${s}`}return r}function Ut(t,e,n){Object.defineProperty(t,Symbol.toStringTag,{__proto__:null,writable:false,enumerable:false,configurable:true,value:e})
for(const e of Object.keys(n))Object.defineProperty(t,e,{__proto__:null,writable:true,enumerable:true,configurable:true,value:n[e]})
for(const e of Object.getOwnPropertySymbols(n))Object.defineProperty(t,e,{__proto__:null,writable:true,enumerable:false,configurable:true,value:n[e]})}function At(t,e,n,s,r,i){const o=n-e,l=s-n
let h,a,f
for(h=0;h<o;h++)r[h]=t[e+h]
for(a=0;a<l;a++)i[a]=t[n+a]
h=0,a=0,f=e
while(h<o&&a<l)if(r[h]<=i[a])t[f++]=r[h++],t[f++]=r[h++]
else t[f++]=i[a++],t[f++]=i[a++]
while(h<o)t[f++]=r[h++]
while(a<l)t[f++]=i[a++]}function It(t,e){const n=Object.create(Pt)
return n[X]={target:t,kind:e,index:0},n}bt[32]='+'
const Pt=Object.create(rt)
Ut(Pt,'URLSearchParams Iterator',{next(){if(!this||Object.getPrototypeOf(this)!==Pt)throw new A('URLSearchParamsIterator')
const{target:t,kind:e,index:n}=this[X],s=t[nt]
if(n>=s.length)return{value:void 0,done:true}
const r=s[n],i=s[n+1]
let o
if(this[X].index=n+2,'key'===e)o=r
else if('value'===e)o=i
else o=[r,i]
return{value:o,done:false}}})
const vt=t=>{if(arguments.length<1)throw new E('domain')
return T(t,false)},Et=t=>{if(arguments.length<1)throw new E('domain')
return T(t,true)}
function $t(t){const e={protocol:t.protocol,hostname:'string'===typeof t.hostname&&t.hostname.startsWith('[')?t.hostname.slice(1,-1):t.hostname,hash:t.hash,search:t.search,pathname:t.pathname,path:`${t.pathname||''}${t.search||''}`,href:t.href}
if(''!==t.port)e.port=Number(t.port)
if(t.username||t.password)e.auth=`${decodeURIComponent(t.username)}:${decodeURIComponent(t.password)}`
return e}const Ot=/\//g
function Ct(t){let{hostname:e,pathname:n}=t
const{length:s}=n
for(let t=0;t<s;t++)if('%'===n[t]){const e=32|n.codePointAt(t+2)
if('2'===n[t+1]&&102===e||'5'===n[t+1]&&99===e)throw new U('must not include encoded \\ or / characters')}if(n=n.replace(Ot,'\\'),n=decodeURIComponent(n),''!==e)return`\\\\${Et(e)}${n}`
const r=32|n.codePointAt(1),i=n[2]
if(r<u||r>p||':'!==i)throw new U('must be absolute')
return n.slice(1)}function Tt(t){if(''!==t.hostname)throw new y(O)
const{pathname:e}=t,{length:n}=e
for(let t=0;t<n;t++)if('%'===e[t]){const n=32|e.codePointAt(t+2)
if('2'===e[t+1]&&102===n)throw new U('must not include encoded / characters')}return decodeURIComponent(e)}function Nt(t){if('string'===typeof t)t=new URL(t)
else if(!(t instanceof URL))throw new L('path',['string','URL'],t)
if('file:'!==t.protocol)throw new v('file')
return C?Ct(t):Tt(t)}const jt=/%/g,kt=/\\/g,Ht=/\n/g,Ft=/\r/g,Gt=/\t/g
function qt(t){if(t.includes('%'))t=t.replace(jt,'%25')
if(!C&&t.includes('\\'))t=t.replace(kt,'%5C')
if(t.includes('\n'))t=t.replace(Ht,'%0A')
if(t.includes('\r'))t=t.replace(Ft,'%0D')
if(t.includes('\t'))t=t.replace(Gt,'%09')
return t}function Dt(e){const n=new URL('file://')
if(C&&e.startsWith('\\\\')){const t=e.split('\\')
if(t.length<=3)throw new b('filepath',e,'Missing UNC resource path')
const s=t[2]
if(!s.length)throw new b('filepath',e,'Empty UNC servername')
n.hostname=vt(s),n.pathname=qt(t.slice(3).join('/'))}else{let s=t.resolve(e)
const r=e.charCodeAt(e.length-1)
if((r===g||C&&r===m)&&s[s.length-1]!==t.sep)s+='/'
n.pathname=qt(s)}return n}const Vt={URL,URLSearchParams,domainToASCII:vt,domainToUnicode:Et,pathToFileURL:Dt,fileURLToPath:Nt,urlToHttpOptions:$t}
Object.assign(global,{URL,URLSearchParams})
export{URL,URLSearchParams,Vt as default,vt as domainToASCII,Et as domainToUnicode,Nt as fileURLToPath,Dt as pathToFileURL,$t as urlToHttpOptions}
