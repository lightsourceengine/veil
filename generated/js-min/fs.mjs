import{promisify as t}from'util'
import{S_IFDIR as e,S_IFREG as r,S_IFBLK as i,S_IFCHR as n,S_IFLNK as s,S_IFIFO as o,S_IFSOCK as f,S_IFMT as a,O_RDONLY as u,O_SYNC as c,O_RDWR as l,O_TRUNC as h,O_CREAT as d,O_WRONLY as p,O_EXCL as g,O_APPEND as m}from'constants'
import{Readable as y,Writable as _}from'stream'
import{codes as b}from'internal/errors'
import{validateFunction as w}from'internal/validators'
import{resolve as k,toNamespacedPath as S,isAbsolute as v}from'path'
const{ERR_INVALID_ARG_TYPE:M,ERR_UNKNOWN_ENCODING:B,ERR_FS_INVALID_SYMLINK_TYPE:x}=b,N=import.meta.native,{UV_FS_SYMLINK_JUNCTION:C,UV_FS_SYMLINK_DIR:I,setStats:R}=N,F='win32'===process.platform,P=10n**6n,E=new Map([['r',u],['rs',u|c],['sr',u|c],['r+',l],['rs+',l|c],['sr+',l|c],['w',h|d|p],['wx',h|d|p|g],['xw',h|d|p|g],['w+',h|d|l],['wx+',h|d|l|g],['xw+',h|d|l|g],['a',m|d|p],['ax',m|d|p|g],['xa',m|d|p|g],['a+',m|d|l],['ax+',m|d|l|g],['xa+',m|d|l|g]]),D=(t,e)=>{if('string'!==typeof t&&!Buffer.isBuffer(t))throw new TypeError('Path should be a string or a buffer')
if(!t||!t.length)return process.nextTick((()=>null==e?void 0:e(false))),void 0
vt(e,'callback')
const r=t=>e(!!t)
N.stat(St(t,'path'),r)},T=t=>{if(!t||!t.length)return false
try{return N.stat(St(t,'path')),true}catch(t){return false}},L=(t,e,r)=>{const{bigint:i}=e??{}
r=Mt(r||e),N.stat(St(t,'path'),!!i,vt(r,'callback'))},W=(t,e)=>{const{bigint:r}=e??{}
return N.stat(St(t,'path'),!!r)},O=(t,e,r)=>{const{bigint:i}=e??{}
r=Mt(r||e),N.lstat(St(t,'path'),!!i,vt(r,'callback'))},j=(t,e)=>{const{bigint:r}=e??{}
return N.lstat(St(t,'path'),!!r)},Y=(t,e,r)=>{const{bigint:i}=e??{}
r=Mt(r||e),N.fstat(kt(t,'fd'),!!i,vt(r,'callback'))},A=(t,e)=>{const{bigint:r}=e??{}
return N.fstat(kt(t,'fd'),!!r)},K=(t,e)=>{N.close(kt(t,'fd'),vt(e,'callback'))},U=t=>{N.close(kt(t,'fd'))},V=(...t)=>{const[e,r,i]=t
N.open(St(e,'path'),mt(r??'r'),yt(i,438),vt(t[t.length-1]),'callback')},z=(t,e,r)=>N.open(St(t,'path'),mt(e??'r'),yt(r,438)),$=(t,e,r,i,n,s)=>{n=n??-1,s=vt(s,'callback')
var o=function(t,r){s(t,r||0,e)}
return N.read(kt(t,'fd'),wt(e,'buffer'),kt(r,'offset'),kt(i,'length'),kt(n,'position'),o)},G=(t,e,r,i,n)=>(n=n??-1,N.read(kt(t,'fd'),wt(e,'buffer'),kt(r,'offset'),kt(i,'length'),kt(n,'position'))),J=(t,e,r,i,n,s)=>{if('function'===typeof n)s=n,n=-1
else if(null===n||void 0===n)n=-1
s=vt(s,'callback')
var o=function(t,r){s(t,r,e)}
return N.write(kt(t,'fd'),wt(e,'buffer'),kt(r,'offset'),kt(i,'length'),kt(n,'position'),o)},q=(t,e,r,i,n)=>{if(null===n||void 0===n)n=-1
return N.write(kt(t,'fd'),wt(e,'buffer'),kt(r,'offset'),kt(i,'length'),kt(n,'position'))},H=(t,e,r)=>{let i,n
St(t),r=Mt(r||e),e=Bt(e,{flag:'r'}),V(t,e.flag,((t,e)=>{if(t)return r(t)
i=e,n=[],s()}))
const s=()=>{const t=new Buffer(8192)
$(i,t,0,8192,-1,o)},o=(t,e,o)=>{if(t)K(i,(t=>r(t)))
if(0===e)f()
else n.push(o.slice(0,e)),s()},f=()=>{K(i,(t=>{let i
if(n){const{encoding:t}=e,r=Buffer.concat(n)
i=!t?r:r.toString(t)}return r(t,i)}))}},Q=(t,e=void 0)=>{St(t),e=Bt(e,{flag:'r'})
const r=z(t,e.flag,438),i=[]
while(true)try{const t=new Buffer(8192),e=G(r,t,0,8192)
if(e)i.push(t.slice(0,e))
else break}catch(t){break}U(r)
const n=Buffer.concat(i),{encoding:s}=e
return!s?n:n.toString(s)},X=(t,e,r)=>{var i,n,s
St(t),vt(r)
var o=_t(e)
V(t,'w',(function(t,e){if(t)return r(t)
i=e,n=o.length,s=0,f()}))
var f=function(){var t=n-s>=1024?1023:n-s
J(i,o,s,t,s,a)},a=function(t,e){if(t)K(i,(function(t){return r(t)}))
if(e<=0||s+e===n)K(i,(function(t){r(t)}))
else s+=e,f()}},Z=(t,e)=>{St(t)
var r=_t(e),i=z(t,'w'),n=r.length,s=0
while(true)try{var o=n-s>=1024?1023:n-s,f=q(i,r,s,o,s)
if(s+=f,s===n)break}catch(t){break}return U(i),s},tt=(t,e,r)=>{if('function'===typeof e)r=e
St(t,'path'),vt(r,'callback'),N.mkdir(t,yt(e,511),r)},et=(t,e)=>N.mkdir(St(t,'path'),yt(e,511)),rt=(t,e)=>{St(t,'path'),vt(e,'callback'),N.rmdir(t,e)},it=t=>N.rmdir(St(t,'path')),nt=(t,e)=>{St(t),vt(e),N.unlink(t,e)},st=t=>N.unlink(St(t,'path')),ot=(t,e,r)=>{St(t),St(e),vt(r),N.rename(t,e,r)},ft=(t,e)=>{St(t),St(e),N.rename(t,e)},at=(t,e)=>{St(t),vt(e),N.readdir(t,e)},ut=t=>N.readdir(St(t,'path')),ct=t=>{K(t._fd,(e=>{if(e)throw e
t.emit('close')}))},lt=(t,e,r)=>{let i
if(St(t),St(e),r='string'===typeof r?r:null,F){if(null===r){const i=k(`${e}`,'..',`${t}`)
try{if(W(i).isDirectory())r='dir'}catch{}}i=dt(r)}N.symlink(F?ht(t,r,e):e,S(e),i??0)},ht=(t,e,r)=>{if(t=''+t,'junction'===e)return t=k(r,'..',t),S(t)
if(v(t))return S(t)
return t.replace(/\//g,'\\')},dt=t=>{if('string'===typeof t){if('dir'===t)return I
if('junction'===t)return C
if('file'!==t)throw new x(t)}return 0}
class ReadStream extends y{constructor(t,e={}){super({defaultEncoding:e.encoding||null}),this.bytesRead=0,this.path=t,this._autoClose=null===e.autoClose||void 0===e.autoClose||e.autoClose,this._fd=e.fd,this._buff=new Buffer(e.bufferSize||4096)
var r=this
if(null===this._fd||void 0===this._fd)V(this.path,e.flags||'r',e.mode||438,(function(t,e){if(t)throw t
r._fd=e,r.emit('open',r._fd),r.doRead()}))
if(this.once('open',(()=>this.emit('ready'))),this._autoClose)this.on('end',(()=>ct(r)))}doRead(){const t=this
$(this._fd,this._buff,0,this._buff.length,null,((e,r)=>{if(e){if(t._autoClose)ct(t)
throw e}if(t.bytesRead+=r,0===r)t.push(null)
else t.push(r===t._buff.length?t._buff:t._buff.slice(0,r)),t.doRead()}))}}class WriteStream extends _{constructor(t,e={}){super(),this._fd=e._fd,this._autoClose=null===e.autoClose||void 0===e.autoClose||e.autoClose,this.bytesWritten=0
var r=this
if(!this._fd)V(t,e.flags||'w',e.mode||438,(function(t,e){if(t)throw t
r._fd=e,r.emit('open',r._fd)}))
this.once('open',(()=>r.emit('ready'))),this._autoClose&&this.on('finish',(()=>ct(r))),this._readyToWrite()}_write(t,e,r){const i=this
J(this._fd,t,0,t.length,((t,n)=>{if(t)throw i._autoClose&&ct(i),t
this.bytesWritten+=n,null==e||e(),r()}))}}const pt=(t,e)=>new WriteStream(t,e),gt=(t,e)=>new ReadStream(t,e)
function mt(t){const e=E.get(t)
if(void 0===e)throw new TypeError('Bad argument: flags')
return e}function yt(t,e){if('number'===typeof t)return t
if('string'===typeof t)return parseInt(t,8)
if(e)return e}const _t=t=>Buffer.isBuffer(t)?t:new Buffer(t+''),bt=(t,e,r)=>{if(!r(t))throw TypeError(`Bad arguments: ${e}`)
return t},wt=(t,e)=>bt(t,e,Buffer.isBuffer),kt=(t,e)=>bt(t,e,(t=>'number'===typeof t)),St=(t,e)=>bt(t,e,(t=>'string'===typeof t)),vt=(t,e)=>bt(t,e,(t=>'function'===typeof t)),Mt=t=>(w(t,'cb'),t),Bt=(t,e)=>{if(null===t||void 0===t||'function'===typeof t)return e
if('string'===typeof t)t={...e,encoding:t}
else if('object'!==typeof t)throw new M('options',['string','Object'],t)
let{encoding:r}=t,i
if('string'===typeof r)switch(r.toLowerCase()){case'utf8':case'utf-8':t.encoding='utf8'
break
default:i=r}else if(r)i=r
if(i)throw new B(i)
return Object.assign({},e,t)},xt=t=>new Date(Number(t)+.5),Nt=t=>t===o||t===i||t===f
class Stats extends Array{constructor(){super(14)}get dev(){return this[0]}get ino(){return this[1]}get mode(){return this[2]}get nlink(){return this[3]}get uid(){return this[4]}get gid(){return this[5]}get rdev(){return this[6]}get size(){return this[7]}get blksize(){return this[8]}get blocks(){return this[9]}get atimeMs(){return this._toMs(this[10])}get mtimeMs(){return this._toMs(this[11])}get ctimeMs(){return this._toMs(this[12])}get birthtimeMs(){return this._toMs(this[13])}get atime(){return xt(this[10])}get mtime(){return xt(this[11])}get ctime(){return xt(this[12])}get birthtime(){return xt(this[13])}isDirectory(){return this._checkModeProperty(e)}isFile(){return this._checkModeProperty(r)}isBlockDevice(){return this._checkModeProperty(i)}isCharacterDevice(){return this._checkModeProperty(n)}isSymbolicLink(){return this._checkModeProperty(s)}isFIFO(){return this._checkModeProperty(o)}isSocket(){return this._checkModeProperty(f)}_checkModeProperty(t){if(F&&Nt(t))return false
return(this.mode&a)===t}_toMs(t){return t}}class BigIntStats extends Stats{get atimeNs(){return this[10]}get mtimeNs(){return this[11]}get ctimeNs(){return this[12]}get birthtimeNs(){return this[13]}_checkModeProperty(t){if(F&&Nt(t))return false
return(this.mode&BigInt(a))===BigInt(t)}_toMs(t){return t/P}}R(Stats,BigIntStats)
const Ct={close:t(K),exists:t(D),fstat:t(Y),lstat:t(O),mkdir:t(tt),open:t(V),readdir:t(at),readFile:t(H),read:t($),rename:t(ot),rmdir:t(rt),stat:t(L),unlink:t(nt),write:t(J),writeFile:t(X)},It={close:K,closeSync:U,createReadStream:gt,createWriteStream:pt,exists:D,existsSync:T,fstat:Y,fstatSync:A,mkdir:tt,mkdirSync:et,open:V,openSync:z,readdir:at,readdirSync:ut,readFile:H,readFileSync:Q,read:$,readSync:G,rename:ot,renameSync:ft,rmdir:rt,rmdirSync:it,stat:L,statSync:W,symlinkSync:lt,unlink:nt,unlinkSync:st,write:J,writeSync:q,writeFile:X,writeFileSync:Z,promises:Ct}
export{K as close,U as closeSync,gt as createReadStream,pt as createWriteStream,It as default,D as exists,T as existsSync,Y as fstat,A as fstatSync,O as lstat,j as lstatSync,tt as mkdir,et as mkdirSync,V as open,z as openSync,Ct as promises,$ as read,H as readFile,Q as readFileSync,G as readSync,at as readdir,ut as readdirSync,ot as rename,ft as renameSync,rt as rmdir,it as rmdirSync,L as stat,W as statSync,lt as symlinkSync,nt as unlink,st as unlinkSync,J as write,X as writeFile,Z as writeFileSync,q as writeSync}
