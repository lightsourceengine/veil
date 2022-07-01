import{promisify as e}from'util'
import t from'constants'
import{Readable as r,Writable as n}from'stream'
const i=import.meta.native,a=(e,t)=>{if('string'!==typeof e&&!Buffer.isBuffer(e))throw new TypeError('Path should be a string or a buffer')
if(!e||!e.length)return process.nextTick((()=>null==t?void 0:t(false))),void 0
$(t,'callback')
const r=e=>t(!!e)
i.stat(X(e,'path'),r)},s=e=>{if(!e||!e.length)return false
try{return i.stat(X(e,'path')),true}catch(e){return false}},f=(e,t)=>{i.stat(X(e,'path'),$(t,'callback'))},o=e=>i.stat(X(e,'path')),u=(e,t)=>{i.fstat(U(e,'fd'),$(t,'callback'))},c=e=>i.fstat(U(e,'fd')),l=(e,t)=>{i.close(U(e,'fd'),$(t,'callback'))},d=e=>{i.close(U(e,'fd'))},h=(...e)=>{const[t,r,n]=e
i.open(X(t,'path'),P(r),Y(n,438),$(e[e.length-1]),'callback')},p=(e,t,r)=>i.open(X(e,'path'),P(t),Y(r,438)),m=(e,t,r,n,a,s)=>{a=a??-1,s=$(s,'callback')
var f=function(e,r){s(e,r||0,t)}
return i.read(U(e,'fd'),I(t,'buffer'),U(r,'offset'),U(n,'length'),U(a,'position'),f)},w=(e,t,r,n,a)=>(a=a??-1,i.read(U(e,'fd'),I(t,'buffer'),U(r,'offset'),U(n,'length'),U(a,'position'))),y=(e,t,r,n,a,s)=>{if('function'===typeof a)s=a,a=-1
else if(null===a||void 0===a)a=-1
s=$(s,'callback')
var f=function(e,r){s(e,r,t)}
return i.write(U(e,'fd'),I(t,'buffer'),U(r,'offset'),U(n,'length'),U(a,'position'),f)},_=(e,t,r,n,a)=>{if(null===a||void 0===a)a=-1
return i.write(U(e,'fd'),I(t,'buffer'),U(r,'offset'),U(n,'length'),U(a,'position'))},b=(e,t)=>{var r,n
X(e),$(t),h(e,'r',(function(e,a){if(e)return t(e)
r=a,n=[],i()}))
var i=function(){var e=new Buffer(1023)
m(r,e,0,1023,-1,a)},a=function(e,a,f){if(e)l(r,(function(e){return t(e)}))
if(0===a)s()
else n.push(f.slice(0,a)),i()},s=function(){l(r,(function(e){return t(e,Buffer.concat(n))}))}},g=e=>{X(e)
var t=p(e,'r',438),r=[]
while(true)try{var n=new Buffer(1023),i=w(t,n,0,1023)
if(i)r.push(n.slice(0,i))
else break}catch(e){break}return d(t),Buffer.concat(r)},k=(e,t,r)=>{var n,i,a
X(e),$(r)
var s=A(t)
h(e,'w',(function(e,t){if(e)return r(e)
n=t,i=s.length,a=0,f()}))
var f=function(){var e=i-a>=1024?1023:i-a
y(n,s,a,e,a,o)},o=function(e,t){if(e)l(n,(function(e){return r(e)}))
if(t<=0||a+t===i)l(n,(function(e){r(e)}))
else a+=t,f()}},v=(e,t)=>{X(e)
var r=A(t),n=p(e,'w'),i=r.length,a=0
while(true)try{var s=i-a>=1024?1023:i-a,f=_(n,r,a,s,a)
if(a+=f,a===i)break}catch(e){break}return d(n),a},S=(e,t,r)=>{if('function'===typeof t)r=t
X(e,'path'),$(r,'callback'),i.mkdir(e,Y(t,511),r)},C=(e,t)=>i.mkdir(X(e,'path'),Y(t,511)),x=(e,t)=>{X(e,'path'),$(t,'callback'),i.rmdir(e,t)},B=e=>i.rmdir(X(e,'path')),R=(e,t)=>{X(e),$(t),i.unlink(e,t)},O=e=>i.unlink(X(e,'path')),W=(e,t,r)=>{X(e),X(t),$(r),i.rename(e,t,r)},E=(e,t)=>{X(e),X(t),i.rename(e,t)},T=(e,t)=>{X(e),$(t),i.readdir(e,t)},F=e=>i.readdir(X(e,'path')),N=e=>{l(e._fd,(t=>{if(t)throw t
e.emit('close')}))}
class ReadStream extends r{constructor(e,t={}){super({defaultEncoding:t.encoding||null}),this.bytesRead=0,this.path=e,this._autoClose=null===t.autoClose||void 0===t.autoClose||t.autoClose,this._fd=t.fd,this._buff=new Buffer(t.bufferSize||4096)
var r=this
if(null===this._fd||void 0===this._fd)h(this.path,t.flags||'r',t.mode||438,(function(e,t){if(e)throw e
r._fd=t,r.emit('open',r._fd),r.doRead()}))
if(this.once('open',(()=>this.emit('ready'))),this._autoClose)this.on('end',(()=>N(r)))}doRead(){const e=this
m(this._fd,this._buff,0,this._buff.length,null,((t,r)=>{if(t){if(e._autoClose)N(e)
throw t}if(e.bytesRead+=r,0===r)e.push(null)
else e.push(r===e._buff.length?e._buff:e._buff.slice(0,r)),e.doRead()}))}}class WriteStream extends n{constructor(e,t={}){super(),this._fd=t._fd,this._autoClose=null===t.autoClose||void 0===t.autoClose||t.autoClose,this.bytesWritten=0
var r=this
if(!this._fd)h(e,t.flags||'w',t.mode||438,(function(e,t){if(e)throw e
r._fd=t,r.emit('open',r._fd)}))
this.once('open',(()=>r.emit('ready'))),this._autoClose&&this.on('finish',(()=>N(r))),this._readyToWrite()}_write(e,t,r){const n=this
y(this._fd,e,0,e.length,((e,i)=>{if(e)throw n._autoClose&&N(n),e
this.bytesWritten+=i,null==t||t(),r()}))}}const D=(e,t)=>new WriteStream(e,t),L=(e,t)=>new ReadStream(e,t)
function P(e){const{O_APPEND:r,O_CREAT:n,O_EXCL:i,O_RDONLY:a,O_RDWR:s,O_SYNC:f,O_TRUNC:o,O_WRONLY:u}=t
if('string'===typeof e)switch(e){case'r':return a
case'rs':case'sr':return a|f
case'r+':return s
case'rs+':case'sr+':return s|f
case'w':return o|n|u
case'wx':case'xw':return o|n|u|i
case'w+':return o|n|s
case'wx+':case'xw+':return o|n|s|i
case'a':return r|n|u
case'ax':case'xa':return r|n|u|i
case'a+':return r|n|s
case'ax+':case'xa+':return r|n|s|i}throw new TypeError('Bad argument: flags')}function Y(e,t){if('number'===typeof e)return e
else if('string'===typeof e)return parseInt(e,8)
else if(t)return Y(t)}const A=e=>Buffer.isBuffer(e)?e:new Buffer(e+''),z=(e,t,r)=>{if(!r(e))throw new TypeError(`Bad arguments: ${t}`)
return e},I=(e,t)=>z(e,t,Buffer.isBuffer),U=(e,t)=>z(e,t,(e=>'number'===typeof e)),X=(e,t)=>z(e,t,(e=>'string'===typeof e)),$=(e,t)=>z(e,t,(e=>'function'===typeof e)),j={close:e(l),exists:e(a),fstat:e(u),mkdir:e(S),open:e(h),readdir:e(T),readFile:e(b),read:e(m),rename:e(W),rmdir:e(x),stat:e(f),unlink:e(R),write:e(y),writeFile:e(k)},q={close:l,closeSync:d,createReadStream:L,createWriteStream:D,exists:a,existsSync:s,fstat:u,fstatSync:c,mkdir:S,mkdirSync:C,open:h,openSync:p,readdir:T,readdirSync:F,readFile:b,readFileSync:g,read:m,readSync:w,rename:W,renameSync:E,rmdir:x,rmdirSync:B,stat:f,statSync:o,unlink:R,unlinkSync:O,write:y,writeSync:_,writeFile:k,writeFileSync:v,promises:j}
export{l as close,d as closeSync,L as createReadStream,D as createWriteStream,q as default,a as exists,s as existsSync,u as fstat,c as fstatSync,S as mkdir,C as mkdirSync,h as open,p as openSync,j as promises,m as read,b as readFile,g as readFileSync,w as readSync,T as readdir,F as readdirSync,W as rename,E as renameSync,x as rmdir,B as rmdirSync,f as stat,o as statSync,R as unlink,O as unlinkSync,y as write,k as writeFile,v as writeFileSync,_ as writeSync}
