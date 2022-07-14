import{promisify as t}from'util'
import{S_IFDIR as e,S_IFREG as r,S_IFBLK as i,S_IFCHR as n,S_IFLNK as s,S_IFIFO as o,S_IFSOCK as f,S_IFMT as a,O_RDONLY as u,O_SYNC as l,O_RDWR as c,O_TRUNC as h,O_CREAT as d,O_WRONLY as g,O_EXCL as m,O_APPEND as p}from'constants'
import{Readable as y,Writable as b}from'stream'
import{codes as _}from'internal/errors'
import{validateFunction as w}from'internal/validators'
import{toNamespacedPath as k,resolve as S,isAbsolute as v}from'path'
const{ERR_INVALID_ARG_TYPE:B,ERR_UNKNOWN_ENCODING:x,ERR_FS_INVALID_SYMLINK_TYPE:N}=_,C=import.meta.native,{UV_FS_SYMLINK_JUNCTION:I,UV_FS_SYMLINK_DIR:R,setStats:M}=C,F='win32'===process.platform,D=10n**6n,E=new Map([['r',u],['rs',u|l],['sr',u|l],['r+',c],['rs+',c|l],['sr+',c|l],['w',h|d|g],['wx',h|d|g|m],['xw',h|d|g|m],['w+',h|d|c],['wx+',h|d|c|m],['xw+',h|d|c|m],['a',p|d|g],['ax',p|d|g|m],['xa',p|d|g|m],['a+',p|d|c],['ax+',p|d|c|m],['xa+',p|d|c|m]]),T=(t,e)=>{if('string'!==typeof t&&!Buffer.isBuffer(t))throw new TypeError('Path should be a string or a buffer')
if(!t||!t.length)return process.nextTick((()=>null==e?void 0:e(false))),void 0
Nt(e,'callback')
const r=t=>e(!!t)
C.stat(xt(t,'path'),r)},L=t=>{if(!t||!t.length)return false
try{return C.stat(xt(t,'path')),true}catch(t){return false}},W=(t,e,r)=>{const{bigint:i}=e??{}
r=Ct(r||e),C.stat(xt(t,'path'),!!i,Nt(r,'callback'))},O=(t,e)=>{const{bigint:r}=e??{}
return C.stat(xt(t,'path'),!!r)},j=(t,e,r)=>{const{bigint:i}=e??{}
r=Ct(r||e),C.lstat(xt(t,'path'),!!i,Nt(r,'callback'))},Y=(t,e)=>{const{bigint:r}=e??{}
return C.lstat(xt(t,'path'),!!r)},$=(t,e,r)=>{const{bigint:i}=e??{}
r=Ct(r||e),C.fstat(Bt(t,'fd'),!!i,Nt(r,'callback'))},A=(t,e)=>{const{bigint:r}=e??{}
return C.fstat(Bt(t,'fd'),!!r)},K=(t,e)=>{C.close(Bt(t,'fd'),Nt(e,'callback'))},P=t=>{C.close(Bt(t,'fd'))},U=(...t)=>{const[e,r,i]=t
C.open(xt(e,'path'),_t(r??'r'),wt(i,438),Nt(t[t.length-1]),'callback')},V=(t,e,r)=>C.open(xt(t,'path'),_t(e??'r'),wt(r,438)),z=(t,e,r,i,n,s)=>{n=n??-1,s=Nt(s,'callback')
var o=function(t,r){s(t,r||0,e)}
return C.read(Bt(t,'fd'),vt(e,'buffer'),Bt(r,'offset'),Bt(i,'length'),Bt(n,'position'),o)},G=(t,e,r,i,n)=>(n=n??-1,C.read(Bt(t,'fd'),vt(e,'buffer'),Bt(r,'offset'),Bt(i,'length'),Bt(n,'position'))),J=(t,e,r,i,n,s)=>{if('function'===typeof n)s=n,n=-1
else if(null===n||void 0===n)n=-1
s=Nt(s,'callback')
var o=function(t,r){s(t,r,e)}
return C.write(Bt(t,'fd'),vt(e,'buffer'),Bt(r,'offset'),Bt(i,'length'),Bt(n,'position'),o)},q=(t,e,r,i,n)=>{if(null===n||void 0===n)n=-1
return C.write(Bt(t,'fd'),vt(e,'buffer'),Bt(r,'offset'),Bt(i,'length'),Bt(n,'position'))},H=(t,e,r)=>{let i,n
xt(t),r=Ct(r||e),e=It(e,{flag:'r'}),U(t,e.flag,((t,e)=>{if(t)return r(t)
i=e,n=[],s()}))
const s=()=>{const t=new Buffer(8192)
z(i,t,0,8192,-1,o)},o=(t,e,o)=>{if(t)K(i,(t=>r(t)))
if(0===e)f()
else n.push(o.slice(0,e)),s()},f=()=>{K(i,(t=>{let i
if(n){const{encoding:t}=e,r=Buffer.concat(n)
i=!t?r:r.toString(t)}return r(t,i)}))}},Q=(t,e=void 0)=>{xt(t),e=It(e,{flag:'r'})
const r=V(t,e.flag,438),i=[]
while(true)try{const t=new Buffer(8192),e=G(r,t,0,8192)
if(e)i.push(t.slice(0,e))
else break}catch(t){break}P(r)
const n=Buffer.concat(i),{encoding:s}=e
return!s?n:n.toString(s)},X=(t,e,r)=>{var i,n,s
xt(t),Nt(r)
var o=kt(e)
U(t,'w',(function(t,e){if(t)return r(t)
i=e,n=o.length,s=0,f()}))
var f=function(){var t=n-s>=1024?1023:n-s
J(i,o,s,t,s,a)},a=function(t,e){if(t)K(i,(function(t){return r(t)}))
if(e<=0||s+e===n)K(i,(function(t){r(t)}))
else s+=e,f()}},Z=(t,e)=>{xt(t)
var r=kt(e),i=V(t,'w'),n=r.length,s=0
while(true)try{var o=n-s>=1024?1023:n-s,f=q(i,r,s,o,s)
if(s+=f,s===n)break}catch(t){break}return P(i),s},tt=(t,e,r)=>{if('function'===typeof e)r=e
xt(t,'path'),Nt(r,'callback'),C.mkdir(t,wt(e,511),r)},et=(t,e)=>C.mkdir(xt(t,'path'),wt(e,511)),rt=(t,e)=>{xt(t,'path'),Nt(e,'callback'),C.rmdir(t,e)},it=t=>C.rmdir(xt(t,'path')),nt=(t,e)=>{xt(t),Nt(e),C.unlink(t,e)},st=t=>C.unlink(xt(t,'path')),ot=(t,e,r)=>{xt(t),xt(e),Nt(r),C.rename(t,e,r)},ft=(t,e)=>{xt(t),xt(e),C.rename(t,e)},at=(t,e)=>{xt(t),Nt(e),C.readdir(t,e)},ut=t=>C.readdir(xt(t,'path')),lt=t=>{K(t._fd,(e=>{if(e)throw e
t.emit('close')}))},ct=(t,e,r)=>{t=xt(t,'path'),r=Ct(e||r)
const{encoding:i}=It(e,{})
C.readlink(k(t),((t,e)=>{r(t,e&&'buffer'===i?Buffer.from(e,'utf8'):e)}))},ht=(t,e)=>{t=xt(t,'path')
const{encoding:r}=It(e,{}),i=C.readlink(k(t))
return'buffer'===r?Buffer.from(i,'utf8'):i},dt=(t,e,r,i)=>{let n
if(xt(t),xt(e),i=Ct(r||i),r='string'===typeof r?r:null,F){if(null===r){let r
try{r=S(`${e}`,'..',`${t}`)}catch{}if(void 0!==r)return W(r,((r,n)=>{const s=!r&&n.isDirectory()?'dir':'file',o=pt(s),f=mt(t,s,e)
C.symlink(f,k(e),o,i)})),void 0}n=pt(r)}C.symlink(F?mt(t,r,e):t,k(e),n??0,i)},gt=(t,e,r)=>{let i
if(xt(t),xt(e),r='string'===typeof r?r:null,F){if(null===r){let i
try{i=S(`${e}`,'..',`${t}`)}catch{}if(void 0!==i)try{if(O(i).isDirectory())r='dir'}catch{}}i=pt(r)}C.symlink(F?mt(t,r,e):t,k(e),i??0)},mt=(t,e,r)=>{if(t=''+t,'junction'===e)return t=S(r,'..',t),k(t)
if(v(t))return k(t)
return t.replace(/\//g,'\\')},pt=t=>{if('string'===typeof t){if('dir'===t)return R
if('junction'===t)return I
if('file'!==t)throw new N(t)}return 0}
class ReadStream extends y{constructor(t,e={}){super({defaultEncoding:e.encoding||null}),this.bytesRead=0,this.path=t,this._autoClose=null===e.autoClose||void 0===e.autoClose||e.autoClose,this._fd=e.fd,this._buff=new Buffer(e.bufferSize||4096)
var r=this
if(null===this._fd||void 0===this._fd)U(this.path,e.flags||'r',e.mode||438,(function(t,e){if(t)throw t
r._fd=e,r.emit('open',r._fd),r.doRead()}))
if(this.once('open',(()=>this.emit('ready'))),this._autoClose)this.on('end',(()=>lt(r)))}doRead(){const t=this
z(this._fd,this._buff,0,this._buff.length,null,((e,r)=>{if(e){if(t._autoClose)lt(t)
throw e}if(t.bytesRead+=r,0===r)t.push(null)
else t.push(r===t._buff.length?t._buff:t._buff.slice(0,r)),t.doRead()}))}}class WriteStream extends b{constructor(t,e={}){super(),this._fd=e._fd,this._autoClose=null===e.autoClose||void 0===e.autoClose||e.autoClose,this.bytesWritten=0
var r=this
if(!this._fd)U(t,e.flags||'w',e.mode||438,(function(t,e){if(t)throw t
r._fd=e,r.emit('open',r._fd)}))
this.once('open',(()=>r.emit('ready'))),this._autoClose&&this.on('finish',(()=>lt(r))),this._readyToWrite()}_write(t,e,r){const i=this
J(this._fd,t,0,t.length,((t,n)=>{if(t)throw i._autoClose&&lt(i),t
this.bytesWritten+=n,null==e||e(),r()}))}}const yt=(t,e)=>new WriteStream(t,e),bt=(t,e)=>new ReadStream(t,e)
function _t(t){const e=E.get(t)
if(void 0===e)throw new TypeError('Bad argument: flags')
return e}function wt(t,e){if('number'===typeof t)return t
if('string'===typeof t)return parseInt(t,8)
if(e)return e}const kt=t=>Buffer.isBuffer(t)?t:new Buffer(t+''),St=(t,e,r)=>{if(!r(t))throw TypeError(`Bad arguments: ${e}`)
return t},vt=(t,e)=>St(t,e,Buffer.isBuffer),Bt=(t,e)=>St(t,e,(t=>'number'===typeof t)),xt=(t,e)=>St(t,e,(t=>'string'===typeof t)),Nt=(t,e)=>St(t,e,(t=>'function'===typeof t)),Ct=t=>(w(t,'cb'),t),It=(t,e)=>{if(null===t||void 0===t||'function'===typeof t)return e
if('string'===typeof t)t={...e,encoding:t}
else if('object'!==typeof t)throw new B('options',['string','Object'],t)
let{encoding:r}=t,i
if('string'===typeof r)switch(r.toLowerCase()){case'utf8':case'utf-8':t.encoding='utf8'
break
default:i=r}else if(r)i=r
if(i)throw new x(i)
return Object.assign({},e,t)},Rt=t=>new Date(Number(t)+.5),Mt=t=>t===o||t===i||t===f,Ft=Symbol('_checkModeProperty')
class Stats extends Array{constructor(){super(14)}get dev(){return this[0]}get ino(){return this[1]}get mode(){return this[2]}get nlink(){return this[3]}get uid(){return this[4]}get gid(){return this[5]}get rdev(){return this[6]}get size(){return this[7]}get blksize(){return this[8]}get blocks(){return this[9]}get atimeMs(){return this._toMs(this[10])}get mtimeMs(){return this._toMs(this[11])}get ctimeMs(){return this._toMs(this[12])}get birthtimeMs(){return this._toMs(this[13])}get atime(){return Rt(this[10])}get mtime(){return Rt(this[11])}get ctime(){return Rt(this[12])}get birthtime(){return Rt(this[13])}isDirectory(){return this[Ft](e)}isFile(){return this[Ft](r)}isBlockDevice(){return this[Ft](i)}isCharacterDevice(){return this[Ft](n)}isSymbolicLink(){return this[Ft](s)}isFIFO(){return this[Ft](o)}isSocket(){return this[Ft](f)}[Ft](t){if(F&&Mt(t))return false
return(this.mode&a)===t}_toMs(t){return t}}class BigIntStats extends Stats{get atimeNs(){return this[10]}get mtimeNs(){return this[11]}get ctimeNs(){return this[12]}get birthtimeNs(){return this[13]}[Ft](t){if(F&&Mt(t))return false
return(this.mode&BigInt(a))===BigInt(t)}_toMs(t){return t/D}}M(Stats,BigIntStats)
const Dt={close:t(K),exists:t(T),fstat:t($),lstat:t(j),mkdir:t(tt),open:t(U),readdir:t(at),readlink:t(ct),readFile:t(H),read:t(z),rename:t(ot),rmdir:t(rt),stat:t(W),symlink:t(dt),unlink:t(nt),write:t(J),writeFile:t(X)},Et={close:K,closeSync:P,createReadStream:bt,createWriteStream:yt,exists:T,existsSync:L,fstat:$,fstatSync:A,mkdir:tt,mkdirSync:et,open:U,openSync:V,readdir:at,readdirSync:ut,readlink:ct,readlinkSync:ht,readFile:H,readFileSync:Q,read:z,readSync:G,rename:ot,renameSync:ft,rmdir:rt,rmdirSync:it,stat:W,statSync:O,symlink:dt,symlinkSync:gt,unlink:nt,unlinkSync:st,write:J,writeSync:q,writeFile:X,writeFileSync:Z,promises:Dt}
export{K as close,P as closeSync,bt as createReadStream,yt as createWriteStream,Et as default,T as exists,L as existsSync,$ as fstat,A as fstatSync,j as lstat,Y as lstatSync,tt as mkdir,et as mkdirSync,U as open,V as openSync,Dt as promises,z as read,H as readFile,Q as readFileSync,G as readSync,at as readdir,ut as readdirSync,ct as readlink,ht as readlinkSync,ot as rename,ft as renameSync,rt as rmdir,it as rmdirSync,W as stat,O as statSync,dt as symlink,gt as symlinkSync,nt as unlink,st as unlinkSync,J as write,X as writeFile,Z as writeFileSync,q as writeSync}
