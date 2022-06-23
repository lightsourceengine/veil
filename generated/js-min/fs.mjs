import e from'util'
import t from'constants'
import r from'stream'
const n=import.meta.native,i=(t,r)=>{if(!e.isString(t)&&!e.isBuffer(t))throw new TypeError('Path should be a string or a buffer')
if(!t||!t.length)return process.nextTick((function(){if(r)r(false)})),void 0
var i=function(e){if(r)r(e?false:true)}
n.stat(q(t,'path'),G(i,'callback'))},f=e=>{if(!e||!e.length)return false
try{return n.stat(q(e,'path')),true}catch(e){return false}},a=(e,t)=>{n.stat(q(e,'path'),G(t,'callback'))},s=e=>n.stat(q(e,'path')),o=(e,t)=>{n.fstat(j(e,'fd'),G(t,'callback'))},u=e=>n.fstat(j(e,'fd')),c=(e,t)=>{n.close(j(e,'fd'),G(t,'callback'))},l=e=>{n.close(j(e,'fd'))},d=(...e)=>{const[t,r,i]=e
n.open(q(t,'path'),A(r),z(i,438),G(e[e.length-1]),'callback')},h=(e,t,r)=>n.open(q(e,'path'),A(t),z(r,438)),p=(t,r,i,f,a,s)=>{if(e.isNullOrUndefined(a))a=-1
s=G(s,'callback')
var o=function(e,t){s(e,t||0,r)}
return n.read(j(t,'fd'),$(r,'buffer'),j(i,'offset'),j(f,'length'),j(a,'position'),o)},w=(t,r,i,f,a)=>{if(e.isNullOrUndefined(a))a=-1
return n.read(j(t,'fd'),$(r,'buffer'),j(i,'offset'),j(f,'length'),j(a,'position'))},b=(t,r,i,f,a,s)=>{if(e.isFunction(a))s=a,a=-1
else if(e.isNullOrUndefined(a))a=-1
s=G(s,'callback')
var o=function(e,t){s(e,t,r)}
return n.write(j(t,'fd'),$(r,'buffer'),j(i,'offset'),j(f,'length'),j(a,'position'),o)},m=(t,r,i,f,a)=>{if(e.isNullOrUndefined(a))a=-1
return n.write(j(t,'fd'),$(r,'buffer'),j(i,'offset'),j(f,'length'),j(a,'position'))},_=(e,t)=>{var r,n
q(e),G(t),d(e,'r',(function(e,f){if(e)return t(e)
r=f,n=[],i()}))
var i=function(){var e=new Buffer(1023)
p(r,e,0,1023,-1,f)},f=function(e,f,s){if(e)c(r,(function(e){return t(e)}))
if(0===f)a()
else n.push(s.slice(0,f)),i()},a=function(){c(r,(function(e){return t(e,Buffer.concat(n))}))}},y=e=>{q(e)
var t=h(e,'r',438),r=[]
while(true)try{var n=new Buffer(1023),i=w(t,n,0,1023)
if(i)r.push(n.slice(0,i))
else break}catch(e){break}return l(t),Buffer.concat(r)},g=(e,t,r)=>{var n,i,f
q(e),G(r)
var a=I(t)
d(e,'w',(function(e,t){if(e)return r(e)
n=t,i=a.length,f=0,s()}))
var s=function(){var e=i-f>=1024?1023:i-f
b(n,a,f,e,f,o)},o=function(e,t){if(e)c(n,(function(e){return r(e)}))
if(t<=0||f+t===i)c(n,(function(e){r(e)}))
else f+=t,s()}},k=(e,t)=>{q(e)
var r=I(t),n=h(e,'w'),i=r.length,f=0
while(true)try{var a=i-f>=1024?1023:i-f,s=m(n,r,f,a,f)
if(f+=s,f===i)break}catch(e){break}return l(n),f},v=(t,r,i)=>{if(e.isFunction(r))i=r
q(t,'path'),G(i,'callback'),n.mkdir(t,z(r,511),i)},S=(e,t)=>n.mkdir(q(e,'path'),z(t,511)),O=(e,t)=>{q(e,'path'),G(t,'callback'),n.rmdir(e,t)},C=e=>n.rmdir(q(e,'path')),N=(e,t)=>{q(e),G(t),n.unlink(e,t)},R=e=>n.unlink(q(e,'path')),x=(e,t,r)=>{q(e),q(t),G(r),n.rename(e,t,r)},B=(e,t)=>{q(e),q(t),n.rename(e,t)},U=(e,t)=>{q(e),G(t),n.readdir(e,t)},E=e=>n.readdir(q(e,'path'))
var F=r.Readable,T=r.Writable,W=function(e){c(e._fd,(function(t){if(t)throw t
e.emit('close')}))},D=function(t,r){if(!(this instanceof D))return new D(t,r)
r=r||{},F.call(this,{defaultEncoding:r.encoding||null}),this.bytesRead=0,this.path=t,this._autoClose=e.isNullOrUndefined(r.autoClose)||r.autoClose,this._fd=r.fd,this._buff=new Buffer(r.bufferSize||4096)
var n=this
if(e.isNullOrUndefined(this._fd))d(this.path,r.flags||'r',r.mode||438,(function(e,t){if(e)throw e
n._fd=t,n.emit('open',n._fd),n.doRead()}))
if(this.once('open',(function(){this.emit('ready')})),this._autoClose)this.on('end',(function(){W(n)}))}
e.inherits(D,F),D.prototype.doRead=function(){var e=this
p(this._fd,this._buff,0,this._buff.length,null,(function(t,r){if(t){if(e._autoClose)W(e)
throw t}if(e.bytesRead+=r,0===r)e.push(null)
else e.push(r===e._buff.length?e._buff:e._buff.slice(0,r)),e.doRead()}))}
var L=function(t,r){if(!(this instanceof L))return new L(t,r)
r=r||{},T.call(this),this._fd=r._fd,this._autoClose=e.isNullOrUndefined(r.autoClose)||r.autoClose,this.bytesWritten=0
var n=this
if(!this._fd)d(t,r.flags||'w',r.mode||438,(function(e,t){if(e)throw e
n._fd=t,n.emit('open',n._fd)}))
if(this.once('open',(function(){n.emit('ready')})),this._autoClose)this.on('finish',(function(){W(n)}))
this._readyToWrite()}
e.inherits(L,T),L.prototype._write=function(e,t,r){var n=this
b(this._fd,e,0,e.length,(function(e,i){if(e){if(n._autoClose)W(n)
throw e}if(this.bytesWritten+=i,t)t()
r()}))}
const P=(e,t)=>new L(e,t),Y=(e,t)=>new D(e,t)
function A(e){const{O_APPEND:r,O_CREAT:n,O_EXCL:i,O_RDONLY:f,O_RDWR:a,O_SYNC:s,O_TRUNC:o,O_WRONLY:u}=t
if('string'===typeof e)switch(e){case'r':return f
case'rs':case'sr':return f|s
case'r+':return a
case'rs+':case'sr+':return a|s
case'w':return o|n|u
case'wx':case'xw':return o|n|u|i
case'w+':return o|n|a
case'wx+':case'xw+':return o|n|a|i
case'a':return r|n|u
case'ax':case'xa':return r|n|u|i
case'a+':return r|n|a
case'ax+':case'xa+':return r|n|a|i}throw new TypeError('Bad argument: flags')}function z(t,r){if(e.isNumber(t))return t
else if(e.isString(t))return parseInt(t,8)
else if(r)return z(r)}const I=t=>e.isBuffer(t)?t:new Buffer(t+''),X=(e,t,r)=>{if(!r(e))throw new TypeError(`Bad arguments: ${t}`)
return e},$=(t,r)=>X(t,r,e.isBuffer),j=(t,r)=>X(t,r,e.isNumber),q=(t,r)=>X(t,r,e.isString),G=(t,r)=>X(t,r,e.isFunction),H={createWriteStream:P,createReadStream:Y,readdirSync:E,readdir:U,renameSync:B,rename:x,unlinkSync:R,unlink:N,rmdirSync:C,rmdir:O,mkdirSync:S,mkdir:v,writeFileSync:k,writeFile:g,readFileSync:y,readFile:_,writeSync:m,write:b,readSync:w,read:p,openSync:h,open:d,closeSync:l,close:c,fstatSync:u,fstat:o,statSync:s,stat:a,existsSync:f,exists:i}
export{c as close,l as closeSync,Y as createReadStream,P as createWriteStream,H as default,i as exists,f as existsSync,o as fstat,u as fstatSync,v as mkdir,S as mkdirSync,d as open,h as openSync,p as read,_ as readFile,y as readFileSync,w as readSync,U as readdir,E as readdirSync,x as rename,B as renameSync,O as rmdir,C as rmdirSync,a as stat,s as statSync,N as unlink,R as unlinkSync,b as write,g as writeFile,k as writeFileSync,m as writeSync}
