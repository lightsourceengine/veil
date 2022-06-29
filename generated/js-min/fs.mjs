import{promisify as e}from'util'
import t from'constants'
import{Readable as r,Writable as n}from'stream'
const i=import.meta.native,a=(e,t)=>{if('string'!==typeof e&&!Buffer.isBuffer(e))throw new TypeError('Path should be a string or a buffer')
if(!e||!e.length)return process.nextTick((()=>null==t?void 0:t(false))),void 0
q(t,'callback')
const r=e=>t(!!e)
i.stat(j(e,'path'),r)},s=e=>{if(!e||!e.length)return false
try{return i.stat(j(e,'path')),true}catch(e){return false}},f=(e,t)=>{i.stat(j(e,'path'),q(t,'callback'))},o=e=>i.stat(j(e,'path')),u=(e,t)=>{i.fstat($(e,'fd'),q(t,'callback'))},c=e=>i.fstat($(e,'fd')),l=(e,t)=>{i.close($(e,'fd'),q(t,'callback'))},d=e=>{i.close($(e,'fd'))},h=(...e)=>{const[t,r,n]=e
i.open(j(t,'path'),A(r),z(n,438),q(e[e.length-1]),'callback')},p=(e,t,r)=>i.open(j(e,'path'),A(t),z(r,438)),m=(e,t,r,n,a,s)=>{a=a??-1,s=q(s,'callback')
var f=function(e,r){s(e,r||0,t)}
return i.read($(e,'fd'),X(t,'buffer'),$(r,'offset'),$(n,'length'),$(a,'position'),f)},w=(e,t,r,n,a)=>(a=a??-1,i.read($(e,'fd'),X(t,'buffer'),$(r,'offset'),$(n,'length'),$(a,'position'))),y=(e,t,r,n,a,s)=>{if('function'===typeof a)s=a,a=-1
else if(null===a||void 0===a)a=-1
s=q(s,'callback')
var f=function(e,r){s(e,r,t)}
return i.write($(e,'fd'),X(t,'buffer'),$(r,'offset'),$(n,'length'),$(a,'position'),f)},_=(e,t,r,n,a)=>{if(null===a||void 0===a)a=-1
return i.write($(e,'fd'),X(t,'buffer'),$(r,'offset'),$(n,'length'),$(a,'position'))},b=(e,t)=>{var r,n
j(e),q(t),h(e,'r',(function(e,a){if(e)return t(e)
r=a,n=[],i()}))
var i=function(){var e=new Buffer(1023)
m(r,e,0,1023,-1,a)},a=function(e,a,f){if(e)l(r,(function(e){return t(e)}))
if(0===a)s()
else n.push(f.slice(0,a)),i()},s=function(){l(r,(function(e){return t(e,Buffer.concat(n))}))}},g=e=>{j(e)
var t=p(e,'r',438),r=[]
while(true)try{var n=new Buffer(1023),i=w(t,n,0,1023)
if(i)r.push(n.slice(0,i))
else break}catch(e){break}return d(t),Buffer.concat(r)},k=(e,t,r)=>{var n,i,a
j(e),q(r)
var s=I(t)
h(e,'w',(function(e,t){if(e)return r(e)
n=t,i=s.length,a=0,f()}))
var f=function(){var e=i-a>=1024?1023:i-a
y(n,s,a,e,a,o)},o=function(e,t){if(e)l(n,(function(e){return r(e)}))
if(t<=0||a+t===i)l(n,(function(e){r(e)}))
else a+=t,f()}},v=(e,t)=>{j(e)
var r=I(t),n=p(e,'w'),i=r.length,a=0
while(true)try{var s=i-a>=1024?1023:i-a,f=_(n,r,a,s,a)
if(a+=f,a===i)break}catch(e){break}return d(n),a},S=(e,t,r)=>{if('function'===typeof t)r=t
j(e,'path'),q(r,'callback'),i.mkdir(e,z(t,511),r)},C=(e,t)=>i.mkdir(j(e,'path'),z(t,511)),x=(e,t)=>{j(e,'path'),q(t,'callback'),i.rmdir(e,t)},B=e=>i.rmdir(j(e,'path')),R=(e,t)=>{j(e),q(t),i.unlink(e,t)},O=e=>i.unlink(j(e,'path')),E=(e,t,r)=>{j(e),j(t),q(r),i.rename(e,t,r)},T=(e,t)=>{j(e),j(t),i.rename(e,t)},F=(e,t)=>{j(e),q(t),i.readdir(e,t)},W=e=>i.readdir(j(e,'path')),N=e=>{l(e._fd,(t=>{if(t)throw t
e.emit('close')}))}
class D extends r{constructor(e,t={}){super({defaultEncoding:t.encoding||null}),this.bytesRead=0,this.path=e,this._autoClose=null===t.autoClose||void 0===t.autoClose||t.autoClose,this._fd=t.fd,this._buff=new Buffer(t.bufferSize||4096)
var r=this
if(null===this._fd||void 0===this._fd)h(this.path,t.flags||'r',t.mode||438,(function(e,t){if(e)throw e
r._fd=t,r.emit('open',r._fd),r.doRead()}))
if(this.once('open',(()=>this.emit('ready'))),this._autoClose)this.on('end',(()=>N(r)))}doRead(){const e=this
m(this._fd,this._buff,0,this._buff.length,null,((t,r)=>{if(t){if(e._autoClose)N(e)
throw t}if(e.bytesRead+=r,0===r)e.push(null)
else e.push(r===e._buff.length?e._buff:e._buff.slice(0,r)),e.doRead()}))}}class L extends n{constructor(e,t={}){super(),this._fd=t._fd,this._autoClose=null===t.autoClose||void 0===t.autoClose||t.autoClose,this.bytesWritten=0
var r=this
if(!this._fd)h(e,t.flags||'w',t.mode||438,(function(e,t){if(e)throw e
r._fd=t,r.emit('open',r._fd)}))
this.once('open',(()=>r.emit('ready'))),this._autoClose&&this.on('finish',(()=>N(r))),this._readyToWrite()}_write(e,t,r){const n=this
y(this._fd,e,0,e.length,((e,i)=>{if(e)throw n._autoClose&&N(n),e
this.bytesWritten+=i,null==t||t(),r()}))}}const P=(e,t)=>new L(e,t),Y=(e,t)=>new D(e,t)
function A(e){const{O_APPEND:r,O_CREAT:n,O_EXCL:i,O_RDONLY:a,O_RDWR:s,O_SYNC:f,O_TRUNC:o,O_WRONLY:u}=t
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
case'ax+':case'xa+':return r|n|s|i}throw new TypeError('Bad argument: flags')}function z(e,t){if('number'===typeof e)return e
else if('string'===typeof e)return parseInt(e,8)
else if(t)return z(t)}const I=e=>Buffer.isBuffer(e)?e:new Buffer(e+''),U=(e,t,r)=>{if(!r(e))throw new TypeError(`Bad arguments: ${t}`)
return e},X=(e,t)=>U(e,t,Buffer.isBuffer),$=(e,t)=>U(e,t,(e=>'number'===typeof e)),j=(e,t)=>U(e,t,(e=>'string'===typeof e)),q=(e,t)=>U(e,t,(e=>'function'===typeof e)),G={close:e(l),exists:e(a),fstat:e(u),mkdir:e(S),open:e(h),readdir:e(F),readFile:e(b),read:e(m),rename:e(E),rmdir:e(x),stat:e(f),unlink:e(R),write:e(y),writeFile:e(k)},H={close:l,closeSync:d,createReadStream:Y,createWriteStream:P,exists:a,existsSync:s,fstat:u,fstatSync:c,mkdir:S,mkdirSync:C,open:h,openSync:p,readdir:F,readdirSync:W,readFile:b,readFileSync:g,read:m,readSync:w,rename:E,renameSync:T,rmdir:x,rmdirSync:B,stat:f,statSync:o,unlink:R,unlinkSync:O,write:y,writeSync:_,writeFile:k,writeFileSync:v,promises:G}
export{l as close,d as closeSync,Y as createReadStream,P as createWriteStream,H as default,a as exists,s as existsSync,u as fstat,c as fstatSync,S as mkdir,C as mkdirSync,h as open,p as openSync,G as promises,m as read,b as readFile,g as readFileSync,w as readSync,F as readdir,W as readdirSync,E as rename,T as renameSync,x as rmdir,B as rmdirSync,f as stat,o as statSync,R as unlink,O as unlinkSync,y as write,k as writeFile,v as writeFileSync,_ as writeSync}
