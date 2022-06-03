import t from'util'
import e from'constants'
import n from'stream'
const r=import.meta.native
const i=(e,n)=>{if(!t.isString(e)&&!t.isBuffer(e)){throw new TypeError('Path should be a string or a buffer')}if(!e||!e.length){process.nextTick((function(){if(n)n(false)}))
return}var i=function(t){if(n)n(t?false:true)}
r.stat(q(e,'path'),G(i,'callback'))}
const s=t=>{if(!t||!t.length){return false}try{r.stat(q(t,'path'))
return true}catch(t){return false}}
const a=(t,e)=>{r.stat(q(t,'path'),G(e,'callback'))}
const f=t=>r.stat(q(t,'path'))
const o=(t,e)=>{r.fstat(j(t,'fd'),G(e,'callback'))}
const c=t=>r.fstat(j(t,'fd'))
const u=(t,e)=>{r.close(j(t,'fd'),G(e,'callback'))}
const l=t=>{r.close(j(t,'fd'))}
const h=(...t)=>{const[e,n,i]=t
r.open(q(e,'path'),A(n),z(i,438),G(t[t.length-1]),'callback')}
const d=(t,e,n)=>r.open(q(t,'path'),A(e),z(n,438))
const p=(e,n,i,s,a,f)=>{if(t.isNullOrUndefined(a)){a=-1}f=G(f,'callback')
var o=function(t,e){f(t,e||0,n)}
return r.read(j(e,'fd'),$(n,'buffer'),j(i,'offset'),j(s,'length'),j(a,'position'),o)}
const w=(e,n,i,s,a)=>{if(t.isNullOrUndefined(a)){a=-1}return r.read(j(e,'fd'),$(n,'buffer'),j(i,'offset'),j(s,'length'),j(a,'position'))}
const v=(e,n,i,s,a,f)=>{if(t.isFunction(a)){f=a
a=-1}else if(t.isNullOrUndefined(a)){a=-1}f=G(f,'callback')
var o=function(t,e){f(t,e,n)}
return r.write(j(e,'fd'),$(n,'buffer'),j(i,'offset'),j(s,'length'),j(a,'position'),o)}
const b=(e,n,i,s,a)=>{if(t.isNullOrUndefined(a)){a=-1}return r.write(j(e,'fd'),$(n,'buffer'),j(i,'offset'),j(s,'length'),j(a,'position'))}
const m=(t,e)=>{q(t)
G(e)
var n
var r
h(t,'r',(function(t,s){if(t){return e(t)}n=s
r=[]
i()}))
var i=function(){var t=new Buffer(1023)
p(n,t,0,1023,-1,s)}
var s=function(t,s,f){if(t){u(n,(function(t){return e(t)}))}if(s===0){a()}else{r.push(f.slice(0,s))
i()}}
var a=function(){u(n,(function(t){return e(t,Buffer.concat(r))}))}}
const _=t=>{q(t)
var e=d(t,'r',438)
var n=[]
while(true){try{var r=new Buffer(1023)
var i=w(e,r,0,1023)
if(i){n.push(r.slice(0,i))}else{break}}catch(t){break}}l(e)
return Buffer.concat(n)}
const y=(t,e,n)=>{q(t)
G(n)
var r
var i
var s
var a=I(e)
h(t,'w',(function(t,e){if(t){return n(t)}r=e
i=a.length
s=0
f()}))
var f=function(){var t=i-s>=1024?1023:i-s
v(r,a,s,t,s,o)}
var o=function(t,e){if(t){u(r,(function(t){return n(t)}))}if(e<=0||s+e===i){u(r,(function(t){n(t)}))}else{s+=e
f()}}}
const g=(t,e)=>{q(t)
var n=I(e)
var r=d(t,'w')
var i=n.length
var s=0
while(true){try{var a=i-s>=1024?1023:i-s
var f=b(r,n,s,a,s)
s+=f
if(s===i){break}}catch(t){break}}l(r)
return s}
const k=(e,n,i)=>{if(t.isFunction(n))i=n
q(e,'path')
G(i,'callback')
r.mkdir(e,z(n,511),i)}
const S=(t,e)=>r.mkdir(q(t,'path'),z(e,511))
const O=(t,e)=>{q(t,'path')
G(e,'callback')
r.rmdir(t,e)}
const C=t=>r.rmdir(q(t,'path'))
const N=(t,e)=>{q(t)
G(e)
r.unlink(t,e)}
const R=t=>r.unlink(q(t,'path'))
const x=(t,e,n)=>{q(t)
q(e)
G(n)
r.rename(t,e,n)}
const B=(t,e)=>{q(t)
q(e)
r.rename(t,e)}
const U=(t,e)=>{q(t)
G(e)
r.readdir(t,e)}
const E=t=>r.readdir(q(t,'path'))
var F=n.Readable
var T=n.Writable
var W=function(t){u(t._fd,(function(e){if(e){throw e}t.emit('close')}))}
var D=function(e,n){if(!(this instanceof D)){return new D(e,n)}n=n||{}
F.call(this,{defaultEncoding:n.encoding||null})
this.bytesRead=0
this.path=e
this._autoClose=t.isNullOrUndefined(n.autoClose)||n.autoClose
this._fd=n.fd
this._buff=new Buffer(n.bufferSize||4096)
var r=this
if(t.isNullOrUndefined(this._fd)){h(this.path,n.flags||'r',n.mode||438,(function(t,e){if(t){throw t}r._fd=e
r.emit('open',r._fd)
r.doRead()}))}this.once('open',(function(){this.emit('ready')}))
if(this._autoClose){this.on('end',(function(){W(r)}))}}
t.inherits(D,F)
D.prototype.doRead=function(){var t=this
p(this._fd,this._buff,0,this._buff.length,null,(function(e,n){if(e){if(t._autoClose){W(t)}throw e}t.bytesRead+=n
if(n===0){t.push(null)}else{t.push(n===t._buff.length?t._buff:t._buff.slice(0,n))
t.doRead()}}))}
var L=function(e,n){if(!(this instanceof L)){return new L(e,n)}n=n||{}
T.call(this)
this._fd=n._fd
this._autoClose=t.isNullOrUndefined(n.autoClose)||n.autoClose
this.bytesWritten=0
var r=this
if(!this._fd){h(e,n.flags||'w',n.mode||438,(function(t,e){if(t){throw t}r._fd=e
r.emit('open',r._fd)}))}this.once('open',(function(){r.emit('ready')}))
if(this._autoClose){this.on('finish',(function(){W(r)}))}this._readyToWrite()}
t.inherits(L,T)
L.prototype._write=function(t,e,n){var r=this
v(this._fd,t,0,t.length,(function(t,i){if(t){if(r._autoClose){W(r)}throw t}this.bytesWritten+=i
if(e){e()}n()}))}
const P=(t,e)=>new L(t,e)
const Y=(t,e)=>new D(t,e)
function A(t){const{O_APPEND:n,O_CREAT:r,O_EXCL:i,O_RDONLY:s,O_RDWR:a,O_SYNC:f,O_TRUNC:o,O_WRONLY:c}=e
if(typeof t==='string'){switch(t){case'r':return s
case'rs':case'sr':return s|f
case'r+':return a
case'rs+':case'sr+':return a|f
case'w':return o|r|c
case'wx':case'xw':return o|r|c|i
case'w+':return o|r|a
case'wx+':case'xw+':return o|r|a|i
case'a':return n|r|c
case'ax':case'xa':return n|r|c|i
case'a+':return n|r|a
case'ax+':case'xa+':return n|r|a|i}}throw new TypeError('Bad argument: flags')}function z(e,n){if(t.isNumber(e)){return e}else if(t.isString(e)){return parseInt(e,8)}else if(n){return z(n)}}const I=e=>t.isBuffer(e)?e:new Buffer(e+'')
const X=(t,e,n)=>{if(!n(t)){throw new TypeError(`Bad arguments: ${e}`)}return t}
const $=(e,n)=>X(e,n,t.isBuffer)
const j=(e,n)=>X(e,n,t.isNumber)
const q=(e,n)=>X(e,n,t.isString)
const G=(e,n)=>X(e,n,t.isFunction)
const H={createWriteStream:P,createReadStream:Y,readdirSync:E,readdir:U,renameSync:B,rename:x,unlinkSync:R,unlink:N,rmdirSync:C,rmdir:O,mkdirSync:S,mkdir:k,writeFileSync:g,writeFile:y,readFileSync:_,readFile:m,writeSync:b,write:v,readSync:w,read:p,openSync:d,open:h,closeSync:l,close:u,fstatSync:c,fstat:o,statSync:f,stat:a,existsSync:s,exists:i}
export{u as close,l as closeSync,Y as createReadStream,P as createWriteStream,H as default,i as exists,s as existsSync,o as fstat,c as fstatSync,k as mkdir,S as mkdirSync,h as open,d as openSync,p as read,m as readFile,_ as readFileSync,w as readSync,U as readdir,E as readdirSync,x as rename,B as renameSync,O as rmdir,C as rmdirSync,a as stat,f as statSync,N as unlink,R as unlinkSync,v as write,y as writeFile,g as writeFileSync,b as writeSync}
