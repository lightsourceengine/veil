import{promisify as t}from'util'
import{O_APPEND as e,O_CREAT as r,O_RDWR as i,O_EXCL as n,O_WRONLY as s,O_TRUNC as o,O_SYNC as a,O_RDONLY as f,S_IFDIR as c,S_IFREG as u,S_IFBLK as h,S_IFCHR as l,S_IFLNK as d,S_IFIFO as p,S_IFSOCK as g,S_IFMT as m}from'constants'
import{Readable as _,Writable as y}from'stream'
import{codes as b}from'internal/errors'
import{validateFunction as w}from'internal/validators'
const{ERR_INVALID_ARG_TYPE:k,ERR_UNKNOWN_ENCODING:S}=b,v=import.meta.native,{setStats:B}=v,M='win32'===process.platform,x=10n**6n,C=(t,e)=>{if('string'!==typeof t&&!Buffer.isBuffer(t))throw new TypeError('Path should be a string or a buffer')
if(!t||!t.length)return process.nextTick((()=>null==e?void 0:e(false))),void 0
ht(e,'callback')
const r=t=>e(!!t)
v.stat(ut(t,'path'),r)},R=t=>{if(!t||!t.length)return false
try{return v.stat(ut(t,'path')),true}catch(t){return false}},N=(t,e,r)=>{const{bigint:i}=e??{}
r=lt(r||e),v.stat(ut(t,'path'),!!i,ht(r,'callback'))},D=(t,e)=>{const{bigint:r}=e??{}
return v.stat(ut(t,'path'),!!r)},P=(t,e,r)=>{const{bigint:i}=e??{}
r=lt(r||e),v.fstat(ct(t,'fd'),!!i,ht(r,'callback'))},F=(t,e)=>{const{bigint:r}=e??{}
return v.fstat(ct(t,'fd'),!!r)},I=(t,e)=>{v.close(ct(t,'fd'),ht(e,'callback'))},E=t=>{v.close(ct(t,'fd'))},W=(...t)=>{const[e,r,i]=t
v.open(ut(e,'path'),nt(r??'r'),st(i,438),ht(t[t.length-1]),'callback')},T=(t,e,r)=>v.open(ut(t,'path'),nt(e??'r'),st(r,438)),O=(t,e,r,i,n,s)=>{n=n??-1,s=ht(s,'callback')
var o=function(t,r){s(t,r||0,e)}
return v.read(ct(t,'fd'),ft(e,'buffer'),ct(r,'offset'),ct(i,'length'),ct(n,'position'),o)},j=(t,e,r,i,n)=>(n=n??-1,v.read(ct(t,'fd'),ft(e,'buffer'),ct(r,'offset'),ct(i,'length'),ct(n,'position'))),z=(t,e,r,i,n,s)=>{if('function'===typeof n)s=n,n=-1
else if(null===n||void 0===n)n=-1
s=ht(s,'callback')
var o=function(t,r){s(t,r,e)}
return v.write(ct(t,'fd'),ft(e,'buffer'),ct(r,'offset'),ct(i,'length'),ct(n,'position'),o)},A=(t,e,r,i,n)=>{if(null===n||void 0===n)n=-1
return v.write(ct(t,'fd'),ft(e,'buffer'),ct(r,'offset'),ct(i,'length'),ct(n,'position'))},L=(t,e,r)=>{let i,n
ut(t),r=lt(r||e),e=dt(e,{flag:'r'}),W(t,e.flag,((t,e)=>{if(t)return r(t)
i=e,n=[],s()}))
const s=()=>{const t=new Buffer(8192)
O(i,t,0,8192,-1,o)},o=(t,e,o)=>{if(t)I(i,(t=>r(t)))
if(0===e)a()
else n.push(o.slice(0,e)),s()},a=()=>{I(i,(t=>{let i
if(n){const{encoding:t}=e,r=Buffer.concat(n)
i=!t?r:r.toString(t)}return r(t,i)}))}},G=(t,e=void 0)=>{ut(t),e=dt(e,{flag:'r'})
const r=T(t,e.flag,438),i=[]
while(true)try{const t=new Buffer(8192),e=j(r,t,0,8192)
if(e)i.push(t.slice(0,e))
else break}catch(t){break}E(r)
const n=Buffer.concat(i),{encoding:s}=e
return!s?n:n.toString(s)},K=(t,e,r)=>{var i,n,s
ut(t),ht(r)
var o=ot(e)
W(t,'w',(function(t,e){if(t)return r(t)
i=e,n=o.length,s=0,a()}))
var a=function(){var t=n-s>=1024?1023:n-s
z(i,o,s,t,s,f)},f=function(t,e){if(t)I(i,(function(t){return r(t)}))
if(e<=0||s+e===n)I(i,(function(t){r(t)}))
else s+=e,a()}},U=(t,e)=>{ut(t)
var r=ot(e),i=T(t,'w'),n=r.length,s=0
while(true)try{var o=n-s>=1024?1023:n-s,a=A(i,r,s,o,s)
if(s+=a,s===n)break}catch(t){break}return E(i),s},V=(t,e,r)=>{if('function'===typeof e)r=e
ut(t,'path'),ht(r,'callback'),v.mkdir(t,st(e,511),r)},Y=(t,e)=>v.mkdir(ut(t,'path'),st(e,511)),$=(t,e)=>{ut(t,'path'),ht(e,'callback'),v.rmdir(t,e)},q=t=>v.rmdir(ut(t,'path')),H=(t,e)=>{ut(t),ht(e),v.unlink(t,e)},J=t=>v.unlink(ut(t,'path')),Q=(t,e,r)=>{ut(t),ut(e),ht(r),v.rename(t,e,r)},X=(t,e)=>{ut(t),ut(e),v.rename(t,e)},Z=(t,e)=>{ut(t),ht(e),v.readdir(t,e)},tt=t=>v.readdir(ut(t,'path')),et=t=>{I(t._fd,(e=>{if(e)throw e
t.emit('close')}))}
class ReadStream extends _{constructor(t,e={}){super({defaultEncoding:e.encoding||null}),this.bytesRead=0,this.path=t,this._autoClose=null===e.autoClose||void 0===e.autoClose||e.autoClose,this._fd=e.fd,this._buff=new Buffer(e.bufferSize||4096)
var r=this
if(null===this._fd||void 0===this._fd)W(this.path,e.flags||'r',e.mode||438,(function(t,e){if(t)throw t
r._fd=e,r.emit('open',r._fd),r.doRead()}))
if(this.once('open',(()=>this.emit('ready'))),this._autoClose)this.on('end',(()=>et(r)))}doRead(){const t=this
O(this._fd,this._buff,0,this._buff.length,null,((e,r)=>{if(e){if(t._autoClose)et(t)
throw e}if(t.bytesRead+=r,0===r)t.push(null)
else t.push(r===t._buff.length?t._buff:t._buff.slice(0,r)),t.doRead()}))}}class WriteStream extends y{constructor(t,e={}){super(),this._fd=e._fd,this._autoClose=null===e.autoClose||void 0===e.autoClose||e.autoClose,this.bytesWritten=0
var r=this
if(!this._fd)W(t,e.flags||'w',e.mode||438,(function(t,e){if(t)throw t
r._fd=e,r.emit('open',r._fd)}))
this.once('open',(()=>r.emit('ready'))),this._autoClose&&this.on('finish',(()=>et(r))),this._readyToWrite()}_write(t,e,r){const i=this
z(this._fd,t,0,t.length,((t,n)=>{if(t)throw i._autoClose&&et(i),t
this.bytesWritten+=n,null==e||e(),r()}))}}const rt=(t,e)=>new WriteStream(t,e),it=(t,e)=>new ReadStream(t,e)
function nt(t){if('string'===typeof t)switch(t){case'r':return f
case'rs':case'sr':return f|a
case'r+':return i
case'rs+':case'sr+':return i|a
case'w':return o|r|s
case'wx':case'xw':return o|r|s|n
case'w+':return o|r|i
case'wx+':case'xw+':return o|r|i|n
case'a':return e|r|s
case'ax':case'xa':return e|r|s|n
case'a+':return e|r|i
case'ax+':case'xa+':return e|r|i|n}throw new TypeError('Bad argument: flags')}function st(t,e){if('number'===typeof t)return t
else if('string'===typeof t)return parseInt(t,8)
else if(e)return st(e)}const ot=t=>Buffer.isBuffer(t)?t:new Buffer(t+''),at=(t,e,r)=>{if(!r(t))throw new TypeError(`Bad arguments: ${e}`)
return t},ft=(t,e)=>at(t,e,Buffer.isBuffer),ct=(t,e)=>at(t,e,(t=>'number'===typeof t)),ut=(t,e)=>at(t,e,(t=>'string'===typeof t)),ht=(t,e)=>at(t,e,(t=>'function'===typeof t)),lt=t=>(w(t,'cb'),t),dt=(t,e)=>{if(null===t||void 0===t||'function'===typeof t)return e
if('string'===typeof t)t={...e,encoding:t}
else if('object'!==typeof t)throw new k('options',['string','Object'],t)
let{encoding:r}=t,i
if('string'===typeof r)switch(r.toLowerCase()){case'utf8':case'utf-8':t.encoding='utf8'
break
default:i=r}else if(r)i=r
if(i)throw new S(i)
return Object.assign({},e,t)}
class Stats extends Array{constructor(){super(14)}get dev(){return this[0]}get ino(){return this[1]}get mode(){return this[2]}get nlink(){return this[3]}get uid(){return this[4]}get gid(){return this[5]}get rdev(){return this[6]}get size(){return this[7]}get blksize(){return this[8]}get blocks(){return this[9]}get atimeMs(){return this._toMs(this[10])}get mtimeMs(){return this._toMs(this[11])}get ctimeMs(){return this._toMs(this[12])}get birthtimeMs(){return this._toMs(this[13])}get atime(){return this._toDate(this[10])}get mtime(){return this._toDate(this[11])}get ctime(){return this._toDate(this[12])}get birthtime(){return this._toDate(this[13])}isDirectory(){return this._checkModeProperty(c)}isFile(){return this._checkModeProperty(u)}isBlockDevice(){return this._checkModeProperty(h)}isCharacterDevice(){return this._checkModeProperty(l)}isSymbolicLink(){return this._checkModeProperty(d)}isFIFO(){return this._checkModeProperty(p)}isSocket(){return this._checkModeProperty(g)}_checkModeProperty(t){if(M&&(t===p||t===h||t===g))return false
return(this.mode&m)===t}_toDate(t){return new Date(Number(t)+.5)}_toMs(t){return t}}class BigIntStats extends Stats{get atimeNs(){return this[10]}get mtimeNs(){return this[11]}get ctimeNs(){return this[12]}get birthtimeNs(){return this[13]}_checkModeProperty(t){if(M&&(t===p||t===h||t===g))return false
return(this.mode&BigInt(m))===BigInt(t)}_toMs(t){return t/x}_toNs(t){return t}}B(Stats,BigIntStats)
const pt={close:t(I),exists:t(C),fstat:t(P),mkdir:t(V),open:t(W),readdir:t(Z),readFile:t(L),read:t(O),rename:t(Q),rmdir:t($),stat:t(N),unlink:t(H),write:t(z),writeFile:t(K)},gt={close:I,closeSync:E,createReadStream:it,createWriteStream:rt,exists:C,existsSync:R,fstat:P,fstatSync:F,mkdir:V,mkdirSync:Y,open:W,openSync:T,readdir:Z,readdirSync:tt,readFile:L,readFileSync:G,read:O,readSync:j,rename:Q,renameSync:X,rmdir:$,rmdirSync:q,stat:N,statSync:D,unlink:H,unlinkSync:J,write:z,writeSync:A,writeFile:K,writeFileSync:U,promises:pt}
export{I as close,E as closeSync,it as createReadStream,rt as createWriteStream,gt as default,C as exists,R as existsSync,P as fstat,F as fstatSync,V as mkdir,Y as mkdirSync,W as open,T as openSync,pt as promises,O as read,L as readFile,G as readFileSync,j as readSync,Z as readdir,tt as readdirSync,Q as rename,X as renameSync,$ as rmdir,q as rmdirSync,N as stat,D as statSync,H as unlink,J as unlinkSync,z as write,K as writeFile,U as writeFileSync,A as writeSync}
