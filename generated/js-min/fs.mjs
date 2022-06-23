import e,{promisify as t}from'util'
import r from'constants'
import n from'stream'
const i=import.meta.native,f=(t,r)=>{if(!e.isString(t)&&!e.isBuffer(t))throw new TypeError('Path should be a string or a buffer')
if(!t||!t.length)return process.nextTick((function(){if(r)r(false)})),void 0
var n=function(e){if(r)r(e?false:true)}
i.stat(G(t,'path'),H(n,'callback'))},a=e=>{if(!e||!e.length)return false
try{return i.stat(G(e,'path')),true}catch(e){return false}},s=(e,t)=>{i.stat(G(e,'path'),H(t,'callback'))},o=e=>i.stat(G(e,'path')),u=(e,t)=>{i.fstat(q(e,'fd'),H(t,'callback'))},c=e=>i.fstat(q(e,'fd')),l=(e,t)=>{i.close(q(e,'fd'),H(t,'callback'))},d=e=>{i.close(q(e,'fd'))},h=(...e)=>{const[t,r,n]=e
i.open(G(t,'path'),z(r),I(n,438),H(e[e.length-1]),'callback')},p=(e,t,r)=>i.open(G(e,'path'),z(t),I(r,438)),w=(t,r,n,f,a,s)=>{if(e.isNullOrUndefined(a))a=-1
s=H(s,'callback')
var o=function(e,t){s(e,t||0,r)}
return i.read(q(t,'fd'),j(r,'buffer'),q(n,'offset'),q(f,'length'),q(a,'position'),o)},m=(t,r,n,f,a)=>{if(e.isNullOrUndefined(a))a=-1
return i.read(q(t,'fd'),j(r,'buffer'),q(n,'offset'),q(f,'length'),q(a,'position'))},b=(t,r,n,f,a,s)=>{if(e.isFunction(a))s=a,a=-1
else if(e.isNullOrUndefined(a))a=-1
s=H(s,'callback')
var o=function(e,t){s(e,t,r)}
return i.write(q(t,'fd'),j(r,'buffer'),q(n,'offset'),q(f,'length'),q(a,'position'),o)},_=(t,r,n,f,a)=>{if(e.isNullOrUndefined(a))a=-1
return i.write(q(t,'fd'),j(r,'buffer'),q(n,'offset'),q(f,'length'),q(a,'position'))},y=(e,t)=>{var r,n
G(e),H(t),h(e,'r',(function(e,f){if(e)return t(e)
r=f,n=[],i()}))
var i=function(){var e=new Buffer(1023)
w(r,e,0,1023,-1,f)},f=function(e,f,s){if(e)l(r,(function(e){return t(e)}))
if(0===f)a()
else n.push(s.slice(0,f)),i()},a=function(){l(r,(function(e){return t(e,Buffer.concat(n))}))}},g=e=>{G(e)
var t=p(e,'r',438),r=[]
while(true)try{var n=new Buffer(1023),i=m(t,n,0,1023)
if(i)r.push(n.slice(0,i))
else break}catch(e){break}return d(t),Buffer.concat(r)},k=(e,t,r)=>{var n,i,f
G(e),H(r)
var a=X(t)
h(e,'w',(function(e,t){if(e)return r(e)
n=t,i=a.length,f=0,s()}))
var s=function(){var e=i-f>=1024?1023:i-f
b(n,a,f,e,f,o)},o=function(e,t){if(e)l(n,(function(e){return r(e)}))
if(t<=0||f+t===i)l(n,(function(e){r(e)}))
else f+=t,s()}},v=(e,t)=>{G(e)
var r=X(t),n=p(e,'w'),i=r.length,f=0
while(true)try{var a=i-f>=1024?1023:i-f,s=_(n,r,f,a,f)
if(f+=s,f===i)break}catch(e){break}return d(n),f},S=(t,r,n)=>{if(e.isFunction(r))n=r
G(t,'path'),H(n,'callback'),i.mkdir(t,I(r,511),n)},O=(e,t)=>i.mkdir(G(e,'path'),I(t,511)),C=(e,t)=>{G(e,'path'),H(t,'callback'),i.rmdir(e,t)},N=e=>i.rmdir(G(e,'path')),x=(e,t)=>{G(e),H(t),i.unlink(e,t)},R=e=>i.unlink(G(e,'path')),B=(e,t,r)=>{G(e),G(t),H(r),i.rename(e,t,r)},F=(e,t)=>{G(e),G(t),i.rename(e,t)},U=(e,t)=>{G(e),H(t),i.readdir(e,t)},E=e=>i.readdir(G(e,'path'))
var T=n.Readable,W=n.Writable,D=function(e){l(e._fd,(function(t){if(t)throw t
e.emit('close')}))},L=function(t,r){if(!(this instanceof L))return new L(t,r)
r=r||{},T.call(this,{defaultEncoding:r.encoding||null}),this.bytesRead=0,this.path=t,this._autoClose=e.isNullOrUndefined(r.autoClose)||r.autoClose,this._fd=r.fd,this._buff=new Buffer(r.bufferSize||4096)
var n=this
if(e.isNullOrUndefined(this._fd))h(this.path,r.flags||'r',r.mode||438,(function(e,t){if(e)throw e
n._fd=t,n.emit('open',n._fd),n.doRead()}))
if(this.once('open',(function(){this.emit('ready')})),this._autoClose)this.on('end',(function(){D(n)}))}
e.inherits(L,T),L.prototype.doRead=function(){var e=this
w(this._fd,this._buff,0,this._buff.length,null,(function(t,r){if(t){if(e._autoClose)D(e)
throw t}if(e.bytesRead+=r,0===r)e.push(null)
else e.push(r===e._buff.length?e._buff:e._buff.slice(0,r)),e.doRead()}))}
var P=function(t,r){if(!(this instanceof P))return new P(t,r)
r=r||{},W.call(this),this._fd=r._fd,this._autoClose=e.isNullOrUndefined(r.autoClose)||r.autoClose,this.bytesWritten=0
var n=this
if(!this._fd)h(t,r.flags||'w',r.mode||438,(function(e,t){if(e)throw e
n._fd=t,n.emit('open',n._fd)}))
if(this.once('open',(function(){n.emit('ready')})),this._autoClose)this.on('finish',(function(){D(n)}))
this._readyToWrite()}
e.inherits(P,W),P.prototype._write=function(e,t,r){var n=this
b(this._fd,e,0,e.length,(function(e,i){if(e){if(n._autoClose)D(n)
throw e}if(this.bytesWritten+=i,t)t()
r()}))}
const Y=(e,t)=>new P(e,t),A=(e,t)=>new L(e,t)
function z(e){const{O_APPEND:t,O_CREAT:n,O_EXCL:i,O_RDONLY:f,O_RDWR:a,O_SYNC:s,O_TRUNC:o,O_WRONLY:u}=r
if('string'===typeof e)switch(e){case'r':return f
case'rs':case'sr':return f|s
case'r+':return a
case'rs+':case'sr+':return a|s
case'w':return o|n|u
case'wx':case'xw':return o|n|u|i
case'w+':return o|n|a
case'wx+':case'xw+':return o|n|a|i
case'a':return t|n|u
case'ax':case'xa':return t|n|u|i
case'a+':return t|n|a
case'ax+':case'xa+':return t|n|a|i}throw new TypeError('Bad argument: flags')}function I(t,r){if(e.isNumber(t))return t
else if(e.isString(t))return parseInt(t,8)
else if(r)return I(r)}const X=t=>e.isBuffer(t)?t:new Buffer(t+''),$=(e,t,r)=>{if(!r(e))throw new TypeError(`Bad arguments: ${t}`)
return e},j=(t,r)=>$(t,r,e.isBuffer),q=(t,r)=>$(t,r,e.isNumber),G=(t,r)=>$(t,r,e.isString),H=(t,r)=>$(t,r,e.isFunction),J={close:t(l),exists:t(f),fstat:t(u),mkdir:t(S),open:t(h),readdir:t(U),readFile:t(y),read:t(w),rename:t(B),rmdir:t(C),stat:t(s),unlink:t(x),write:t(b),writeFile:t(k)},K={close:l,closeSync:d,createReadStream:A,createWriteStream:Y,exists:f,existsSync:a,fstat:u,fstatSync:c,mkdir:S,mkdirSync:O,open:h,openSync:p,readdir:U,readdirSync:E,readFile:y,readFileSync:g,read:w,readSync:m,rename:B,renameSync:F,rmdir:C,rmdirSync:N,stat:s,statSync:o,unlink:x,unlinkSync:R,write:b,writeSync:_,writeFile:k,writeFileSync:v,promises:J}
export{l as close,d as closeSync,A as createReadStream,Y as createWriteStream,K as default,f as exists,a as existsSync,u as fstat,c as fstatSync,S as mkdir,O as mkdirSync,h as open,p as openSync,J as promises,w as read,y as readFile,g as readFileSync,m as readSync,U as readdir,E as readdirSync,B as rename,F as renameSync,C as rmdir,N as rmdirSync,s as stat,o as statSync,x as unlink,R as unlinkSync,b as write,k as writeFile,v as writeFileSync,_ as writeSync}
