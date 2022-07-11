import{promisify as e}from'util'
import t from'constants'
import{Readable as r,Writable as n}from'stream'
import{codes as i}from'internal/errors'
import{validateFunction as s}from'internal/validators'
const{ERR_INVALID_ARG_TYPE:a,ERR_UNKNOWN_ENCODING:f}=i,o=import.meta.native,c=(e,t)=>{if('string'!==typeof e&&!Buffer.isBuffer(e))throw new TypeError('Path should be a string or a buffer')
if(!e||!e.length)return process.nextTick((()=>null==t?void 0:t(false))),void 0
$(t,'callback')
const r=e=>t(!!e)
o.stat(X(e,'path'),r)},u=e=>{if(!e||!e.length)return false
try{return o.stat(X(e,'path')),true}catch(e){return false}},l=(e,t)=>{o.stat(X(e,'path'),$(t,'callback'))},d=e=>o.stat(X(e,'path')),h=(e,t)=>{o.fstat(V(e,'fd'),$(t,'callback'))},p=e=>o.fstat(V(e,'fd')),m=(e,t)=>{o.close(V(e,'fd'),$(t,'callback'))},w=e=>{o.close(V(e,'fd'))},y=(...e)=>{const[t,r,n]=e
o.open(X(t,'path'),j(r),G(n,438),$(e[e.length-1]),'callback')},_=(e,t,r)=>o.open(X(e,'path'),j(t),G(r,438)),g=(e,t,r,n,i,s)=>{i=i??-1,s=$(s,'callback')
var a=function(e,r){s(e,r||0,t)}
return o.read(V(e,'fd'),K(t,'buffer'),V(r,'offset'),V(n,'length'),V(i,'position'),a)},b=(e,t,r,n,i)=>(i=i??-1,o.read(V(e,'fd'),K(t,'buffer'),V(r,'offset'),V(n,'length'),V(i,'position'))),k=(e,t,r,n,i,s)=>{if('function'===typeof i)s=i,i=-1
else if(null===i||void 0===i)i=-1
s=$(s,'callback')
var a=function(e,r){s(e,r,t)}
return o.write(V(e,'fd'),K(t,'buffer'),V(r,'offset'),V(n,'length'),V(i,'position'),a)},S=(e,t,r,n,i)=>{if(null===i||void 0===i)i=-1
return o.write(V(e,'fd'),K(t,'buffer'),V(r,'offset'),V(n,'length'),V(i,'position'))},v=(e,t,r)=>{let n,i
X(e),r=q(r||t),t=H(t,{flag:'r'}),y(e,t.flag,((e,t)=>{if(e)return r(e)
n=t,i=[],s()}))
const s=()=>{const e=new Buffer(8192)
g(n,e,0,8192,-1,a)},a=(e,t,a)=>{if(e)m(n,(e=>r(e)))
if(0===t)f()
else i.push(a.slice(0,t)),s()},f=()=>{m(n,(e=>{let n
if(i){const{encoding:e}=t,r=Buffer.concat(i)
n=!e?r:r.toString(e)}return r(e,n)}))}},R=(e,t=void 0)=>{X(e),t=H(t,{flag:'r'})
const r=_(e,t.flag,438),n=[]
while(true)try{const e=new Buffer(8192),t=b(r,e,0,8192)
if(t)n.push(e.slice(0,t))
else break}catch(e){break}w(r)
const i=Buffer.concat(n),{encoding:s}=t
return!s?i:i.toString(s)},C=(e,t,r)=>{var n,i,s
X(e),$(r)
var a=U(t)
y(e,'w',(function(e,t){if(e)return r(e)
n=t,i=a.length,s=0,f()}))
var f=function(){var e=i-s>=1024?1023:i-s
k(n,a,s,e,s,o)},o=function(e,t){if(e)m(n,(function(e){return r(e)}))
if(t<=0||s+t===i)m(n,(function(e){r(e)}))
else s+=t,f()}},x=(e,t)=>{X(e)
var r=U(t),n=_(e,'w'),i=r.length,s=0
while(true)try{var a=i-s>=1024?1023:i-s,f=S(n,r,s,a,s)
if(s+=f,s===i)break}catch(e){break}return w(n),s},B=(e,t,r)=>{if('function'===typeof t)r=t
X(e,'path'),$(r,'callback'),o.mkdir(e,G(t,511),r)},O=(e,t)=>o.mkdir(X(e,'path'),G(t,511)),E=(e,t)=>{X(e,'path'),$(t,'callback'),o.rmdir(e,t)},N=e=>o.rmdir(X(e,'path')),W=(e,t)=>{X(e),$(t),o.unlink(e,t)},T=e=>o.unlink(X(e,'path')),F=(e,t,r)=>{X(e),X(t),$(r),o.rename(e,t,r)},D=(e,t)=>{X(e),X(t),o.rename(e,t)},L=(e,t)=>{X(e),$(t),o.readdir(e,t)},A=e=>o.readdir(X(e,'path')),I=e=>{m(e._fd,(t=>{if(t)throw t
e.emit('close')}))}
class ReadStream extends r{constructor(e,t={}){super({defaultEncoding:t.encoding||null}),this.bytesRead=0,this.path=e,this._autoClose=null===t.autoClose||void 0===t.autoClose||t.autoClose,this._fd=t.fd,this._buff=new Buffer(t.bufferSize||4096)
var r=this
if(null===this._fd||void 0===this._fd)y(this.path,t.flags||'r',t.mode||438,(function(e,t){if(e)throw e
r._fd=t,r.emit('open',r._fd),r.doRead()}))
if(this.once('open',(()=>this.emit('ready'))),this._autoClose)this.on('end',(()=>I(r)))}doRead(){const e=this
g(this._fd,this._buff,0,this._buff.length,null,((t,r)=>{if(t){if(e._autoClose)I(e)
throw t}if(e.bytesRead+=r,0===r)e.push(null)
else e.push(r===e._buff.length?e._buff:e._buff.slice(0,r)),e.doRead()}))}}class WriteStream extends n{constructor(e,t={}){super(),this._fd=t._fd,this._autoClose=null===t.autoClose||void 0===t.autoClose||t.autoClose,this.bytesWritten=0
var r=this
if(!this._fd)y(e,t.flags||'w',t.mode||438,(function(e,t){if(e)throw e
r._fd=t,r.emit('open',r._fd)}))
this.once('open',(()=>r.emit('ready'))),this._autoClose&&this.on('finish',(()=>I(r))),this._readyToWrite()}_write(e,t,r){const n=this
k(this._fd,e,0,e.length,((e,i)=>{if(e)throw n._autoClose&&I(n),e
this.bytesWritten+=i,null==t||t(),r()}))}}const P=(e,t)=>new WriteStream(e,t),Y=(e,t)=>new ReadStream(e,t)
function j(e){const{O_APPEND:r,O_CREAT:n,O_EXCL:i,O_RDONLY:s,O_RDWR:a,O_SYNC:f,O_TRUNC:o,O_WRONLY:c}=t
if('string'===typeof e)switch(e){case'r':return s
case'rs':case'sr':return s|f
case'r+':return a
case'rs+':case'sr+':return a|f
case'w':return o|n|c
case'wx':case'xw':return o|n|c|i
case'w+':return o|n|a
case'wx+':case'xw+':return o|n|a|i
case'a':return r|n|c
case'ax':case'xa':return r|n|c|i
case'a+':return r|n|a
case'ax+':case'xa+':return r|n|a|i}throw new TypeError('Bad argument: flags')}function G(e,t){if('number'===typeof e)return e
else if('string'===typeof e)return parseInt(e,8)
else if(t)return G(t)}const U=e=>Buffer.isBuffer(e)?e:new Buffer(e+''),z=(e,t,r)=>{if(!r(e))throw new TypeError(`Bad arguments: ${t}`)
return e},K=(e,t)=>z(e,t,Buffer.isBuffer),V=(e,t)=>z(e,t,(e=>'number'===typeof e)),X=(e,t)=>z(e,t,(e=>'string'===typeof e)),$=(e,t)=>z(e,t,(e=>'function'===typeof e)),q=e=>(s(e,'cb'),e),H=(e,t)=>{if(null===e||void 0===e||'function'===typeof e)return t
if('string'===typeof e)e={...t,encoding:e}
else if('object'!==typeof e)throw new a('options',['string','Object'],e)
let{encoding:r}=e,n
if('string'===typeof r)switch(r.toLowerCase()){case'utf8':case'utf-8':e.encoding='utf8'
break
default:n=r}else if(r)n=r
if(n)throw new f(n)
return Object.assign({},t,e)},J={close:e(m),exists:e(c),fstat:e(h),mkdir:e(B),open:e(y),readdir:e(L),readFile:e(v),read:e(g),rename:e(F),rmdir:e(E),stat:e(l),unlink:e(W),write:e(k),writeFile:e(C)},M={close:m,closeSync:w,createReadStream:Y,createWriteStream:P,exists:c,existsSync:u,fstat:h,fstatSync:p,mkdir:B,mkdirSync:O,open:y,openSync:_,readdir:L,readdirSync:A,readFile:v,readFileSync:R,read:g,readSync:b,rename:F,renameSync:D,rmdir:E,rmdirSync:N,stat:l,statSync:d,unlink:W,unlinkSync:T,write:k,writeSync:S,writeFile:C,writeFileSync:x,promises:J}
export{m as close,w as closeSync,Y as createReadStream,P as createWriteStream,M as default,c as exists,u as existsSync,h as fstat,p as fstatSync,B as mkdir,O as mkdirSync,y as open,_ as openSync,J as promises,g as read,v as readFile,R as readFileSync,b as readSync,L as readdir,A as readdirSync,F as rename,D as renameSync,E as rmdir,N as rmdirSync,l as stat,d as statSync,W as unlink,T as unlinkSync,k as write,C as writeFile,x as writeFileSync,S as writeSync}
