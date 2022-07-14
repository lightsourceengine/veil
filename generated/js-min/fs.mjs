import{promisify as t}from'util'
import{S_IFMT as e,S_IFSOCK as r,S_IFLNK as i,S_IFIFO as n,S_IFDIR as s,S_IFREG as o,S_IFBLK as f,S_IFCHR as u,O_RDONLY as a,O_SYNC as l,O_RDWR as c,O_TRUNC as h,O_CREAT as d,O_WRONLY as g,O_EXCL as p,O_APPEND as m}from'constants'
import{Readable as b,Writable as y}from'stream'
import{codes as k}from'internal/errors'
import{validateFunction as w}from'internal/validators'
import{toNamespacedPath as _,resolve as S,isAbsolute as v}from'path'
const B=47,x=92,{ERR_INVALID_ARG_TYPE:C,ERR_UNKNOWN_ENCODING:I,ERR_FS_INVALID_SYMLINK_TYPE:N}=k,M=import.meta.native,{UV_FS_SYMLINK_JUNCTION:R,UV_FS_SYMLINK_DIR:F,setStats:T}=M,D='win32'===process.platform,E=10n**6n,$=Symbol.for('realpathCacheKey'),L=new Map([['r',a],['rs',a|l],['sr',a|l],['r+',c],['rs+',c|l],['sr+',c|l],['w',h|d|g],['wx',h|d|g|p],['xw',h|d|g|p],['w+',h|d|c],['wx+',h|d|c|p],['xw+',h|d|c|p],['a',m|d|g],['ax',m|d|g|p],['xa',m|d|g|p],['a+',m|d|c],['ax+',m|d|c|p],['xa+',m|d|c|p]]),O=(t,e)=>{if('string'!==typeof t&&!Buffer.isBuffer(t))throw new TypeError('Path should be a string or a buffer')
if(!t||!t.length)return process.nextTick((()=>null==e?void 0:e(false))),void 0
$t(e,'callback')
const r=t=>e(!!t)
M.stat(Et(t,'path'),r)},A=t=>{if(!t||!t.length)return false
try{return M.stat(Et(t,'path')),true}catch(t){return false}},W=(t,e,r)=>{const{bigint:i}=e??{}
r=Lt(r||e),M.stat(Et(t,'path'),!!i,$t(r,'callback'))},j=(t,e)=>{const{bigint:r}=e??{}
return M.stat(Et(t,'path'),!!r)},z=(t,e,r)=>{const{bigint:i}=e??{}
r=Lt(r||e),M.lstat(Et(t,'path'),!!i,$t(r,'callback'))},K=(t,e)=>{const{bigint:r}=e??{}
return M.lstat(Et(t,'path'),!!r)},Y=(t,e,r)=>{const{bigint:i}=e??{}
r=Lt(r||e),M.fstat(Dt(t,'fd'),!!i,$t(r,'callback'))},P=(t,e)=>{const{bigint:r}=e??{}
return M.fstat(Dt(t,'fd'),!!r)},U=(t,e)=>{M.close(Dt(t,'fd'),$t(e,'callback'))},V=t=>{M.close(Dt(t,'fd'))},G=(...t)=>{const[e,r,i]=t
M.open(Et(e,'path'),Nt(r??'r'),Mt(i,438),$t(t[t.length-1]),'callback')},J=(t,e,r)=>M.open(Et(t,'path'),Nt(e??'r'),Mt(r,438)),Z=(t,e,r,i,n,s)=>{n=n??-1,s=$t(s,'callback')
var o=function(t,r){s(t,r||0,e)}
return M.read(Dt(t,'fd'),Tt(e,'buffer'),Dt(r,'offset'),Dt(i,'length'),Dt(n,'position'),o)},q=(t,e,r,i,n)=>(n=n??-1,M.read(Dt(t,'fd'),Tt(e,'buffer'),Dt(r,'offset'),Dt(i,'length'),Dt(n,'position'))),H=(t,e,r,i,n,s)=>{if('function'===typeof n)s=n,n=-1
else if(null===n||void 0===n)n=-1
s=$t(s,'callback')
var o=function(t,r){s(t,r,e)}
return M.write(Dt(t,'fd'),Tt(e,'buffer'),Dt(r,'offset'),Dt(i,'length'),Dt(n,'position'),o)},Q=(t,e,r,i,n)=>{if(null===n||void 0===n)n=-1
return M.write(Dt(t,'fd'),Tt(e,'buffer'),Dt(r,'offset'),Dt(i,'length'),Dt(n,'position'))},X=(t,e,r)=>{let i,n
Et(t),r=Lt(r||e),e=Ot(e,{flag:'r'}),G(t,e.flag,((t,e)=>{if(t)return r(t)
i=e,n=[],s()}))
const s=()=>{const t=new Buffer(8192)
Z(i,t,0,8192,-1,o)},o=(t,e,o)=>{if(t)U(i,(t=>r(t)))
if(0===e)f()
else n.push(o.slice(0,e)),s()},f=()=>{U(i,(t=>{let i
if(n){const{encoding:t}=e,r=Buffer.concat(n)
i=!t?r:r.toString(t)}return r(t,i)}))}},tt=(t,e=void 0)=>{Et(t),e=Ot(e,{flag:'r'})
const r=J(t,e.flag,438),i=[]
while(true)try{const t=new Buffer(8192),e=q(r,t,0,8192)
if(e)i.push(t.slice(0,e))
else break}catch(t){break}V(r)
const n=Buffer.concat(i),{encoding:s}=e
return!s?n:n.toString(s)},et=(t,e,r)=>{var i,n,s
Et(t),$t(r)
var o=Rt(e)
G(t,'w',(function(t,e){if(t)return r(t)
i=e,n=o.length,s=0,f()}))
var f=function(){var t=n-s>=1024?1023:n-s
H(i,o,s,t,s,u)},u=function(t,e){if(t)U(i,(function(t){return r(t)}))
if(e<=0||s+e===n)U(i,(function(t){r(t)}))
else s+=e,f()}},rt=(t,e)=>{Et(t)
var r=Rt(e),i=J(t,'w'),n=r.length,s=0
while(true)try{var o=n-s>=1024?1023:n-s,f=Q(i,r,s,o,s)
if(s+=f,s===n)break}catch(t){break}return V(i),s},it=(t,e,r)=>{if('function'===typeof e)r=e
Et(t,'path'),$t(r,'callback'),M.mkdir(t,Mt(e,511),r)},nt=(t,e)=>M.mkdir(Et(t,'path'),Mt(e,511)),st=(t,e)=>{Et(t,'path'),$t(e,'callback'),M.rmdir(t,e)},ot=t=>M.rmdir(Et(t,'path')),ft=(t,e)=>{Et(t),$t(e),M.unlink(t,e)},ut=t=>M.unlink(Et(t,'path')),at=(t,e,r)=>{Et(t),Et(e),$t(r),M.rename(t,e,r)},lt=(t,e)=>{Et(t),Et(e),M.rename(t,e)},ct=(t,e)=>{Et(t),$t(e),M.readdir(t,e)},ht=t=>M.readdir(Et(t,'path')),dt=t=>{U(t._fd,(e=>{if(e)throw e
t.emit('close')}))},gt=(t,e,r)=>{t=Et(t,'path'),r=Lt(e||r)
const{encoding:i}=Ot(e,_t)
M.readlink(_(t),((t,e)=>{r(t,e&&'buffer'===i?Buffer.from(e,'utf8'):e)}))},pt=(t,e)=>{t=Et(t,'path')
const{encoding:r}=Ot(e,_t),i=M.readlink(_(t))
return'buffer'===r?Buffer.from(i,'utf8'):i},mt=(t,e,r,i)=>{let n
if(Et(t),Et(e),i=Lt(r||i),r='string'===typeof r?r:null,D){if(null===r){let r
try{r=S(`${e}`,'..',`${t}`)}catch{}if(void 0!==r)return W(r,((r,n)=>{const s=!r&&n.isDirectory()?'dir':'file',o=xt(s),f=Bt(t,s,e)
M.symlink(f,_(e),o,i)})),void 0}n=xt(r)}M.symlink(D?Bt(t,r,e):t,_(e),n??0,i)},bt=(t,e,r)=>{let i
if(Et(t),Et(e),r='string'===typeof r?r:null,D){if(null===r){let i
try{i=S(`${e}`,'..',`${t}`)}catch{}if(void 0!==i)try{if(j(i).isDirectory())r='dir'}catch{}}i=xt(r)}M.symlink(D?Bt(t,r,e):t,_(e),i??0)}
let yt
if(D){const t=/^(?:[a-zA-Z]:|[\\/]{2}[^\\/]+[\\/][^\\/]+)?[\\/]*/
yt=e=>t.exec(e)[0]}else yt=t=>{for(let e=0;e<t.length;++e)if(t.charCodeAt(e)!==B)return t.slice(0,e)
return t}
const kt=(t,e)=>'buffer'===(null==e?void 0:e.encoding)?Buffer.from(t,'utf8'):t
let wt
if(D)wt=(t,e)=>{for(;e<t.length;++e){const r=t.charCodeAt(e)
if(r===x||r===B)return e}return-1}
else wt=(t,e)=>t.indexOf('/',e)
const _t=Object.freeze({}),St=(t,e)=>{t=S(Et(t,'path'))
const s=(null==e?void 0:e[$])??new Map,o=s.get(t)
if(o)return o
const f={},u={},a=t
let l,c,h,d
if(c=h=yt(t),l=c.length,D)K(_(h),{bigint:true}),u[h]=true
while(l<t.length){const e=wt(t,l)
if(d=c,-1===e){const e=t.slice(l)
c+=e,h=d+e,l=t.length}else c+=t.slice(l,e+1),h=d+t.slice(l,e),l=e+1
if(u[h]||s.get(h)===h){const{mode:t}=j(h,{bigint:true})
if(At(t,n)||At(t,r))break
continue}let o
const a=s.get(h)
if(a)o=a
else{const t=_(h),e=K(t,{bigint:true})
if(!At(e.mode,i)){u[h]=true,s.set(h,h)
continue}let r=null,n
if(!D){const t=e.dev.toString(32),i=e.ino.toString(32)
if(n=`${t}:${i}`,f[n])r=f[n]}if(null===r)j(t),r=pt(t)
if(o=S(d,r),s.set(h,o),!D)f[n]=r}if(t=S(o,t.slice(l)),c=h=yt(t),l=c.length,D&&!u[h])K(_(h),{bigint:true}),u[h]=true}return s.set(a,t),kt(t,e)}
function vt(t,e,i){t=S(Et(t,'path')),e=Ot(e,_t),i=Lt(i)
const s={},o={}
let f,u,a,l
if(u=a=yt(t),f=u.length,D&&!o[a])z(a,((t,e)=>{if(t)return i(t)
o[a]=true,c()}))
else process.nextTick(c)
function c(){if(f>=t.length)return i(null,kt(t,e))
const s=wt(t,f)
if(l=u,-1===s){const e=t.slice(f)
u+=e,a=l+e,f=t.length}else u+=t.slice(f,s+1),a=l+t.slice(f,s),f=s+1
if(o[a]){const{mode:s}=j(a,{bigint:true})
if(At(s,n)||At(s,r))return i(null,kt(t,e))
return process.nextTick(c)}return z(a,{bigint:true},h)}function h(t,e){if(t)return i(t)
if(!e.isSymbolicLink())return o[a]=true,process.nextTick(c)
let r
if(!D){const t=e.dev.toString(32),i=e.ino.toString(32)
if(r=`${t}:${i}`,s[r])return d(null,s[r])}W(a,(t=>{if(t)return i(t)
gt(a,((t,e)=>{if(!D)s[r]=e
d(t,e)}))}))}function d(t,e){if(t)return i(t)
g(S(l,e))}function g(e){if(t=S(e,t.slice(f)),u=a=yt(t),f=u.length,D&&!o[a])z(a,(t=>{if(t)return i(t)
o[a]=true,c()}))
else process.nextTick(c)}}St.native=(t,e)=>{t=Et(t,'path')
const r=M.realpath(_(t))
return kt(r,e)},vt.native=(t,e,r)=>{t=Et(t,'path'),e=Ot(e,_t),r=Lt(e||r),M.realpath(_(t),((t,i)=>{r(t,kt(i,e))}))}
const Bt=(t,e,r)=>{if(t=''+t,'junction'===e)return t=S(r,'..',t),_(t)
if(v(t))return _(t)
return t.replace(/\//g,'\\')},xt=t=>{if('string'===typeof t){if('dir'===t)return F
if('junction'===t)return R
if('file'!==t)throw new N(t)}return 0}
class ReadStream extends b{constructor(t,e={}){super({defaultEncoding:e.encoding||null}),this.bytesRead=0,this.path=t,this._autoClose=null===e.autoClose||void 0===e.autoClose||e.autoClose,this._fd=e.fd,this._buff=new Buffer(e.bufferSize||4096)
var r=this
if(null===this._fd||void 0===this._fd)G(this.path,e.flags||'r',e.mode||438,(function(t,e){if(t)throw t
r._fd=e,r.emit('open',r._fd),r.doRead()}))
if(this.once('open',(()=>this.emit('ready'))),this._autoClose)this.on('end',(()=>dt(r)))}doRead(){const t=this
Z(this._fd,this._buff,0,this._buff.length,null,((e,r)=>{if(e){if(t._autoClose)dt(t)
throw e}if(t.bytesRead+=r,0===r)t.push(null)
else t.push(r===t._buff.length?t._buff:t._buff.slice(0,r)),t.doRead()}))}}class WriteStream extends y{constructor(t,e={}){super(),this._fd=e._fd,this._autoClose=null===e.autoClose||void 0===e.autoClose||e.autoClose,this.bytesWritten=0
var r=this
if(!this._fd)G(t,e.flags||'w',e.mode||438,(function(t,e){if(t)throw t
r._fd=e,r.emit('open',r._fd)}))
this.once('open',(()=>r.emit('ready'))),this._autoClose&&this.on('finish',(()=>dt(r))),this._readyToWrite()}_write(t,e,r){const i=this
H(this._fd,t,0,t.length,((t,n)=>{if(t)throw i._autoClose&&dt(i),t
this.bytesWritten+=n,null==e||e(),r()}))}}const Ct=(t,e)=>new WriteStream(t,e),It=(t,e)=>new ReadStream(t,e)
function Nt(t){const e=L.get(t)
if(void 0===e)throw new TypeError('Bad argument: flags')
return e}function Mt(t,e){if('number'===typeof t)return t
if('string'===typeof t)return parseInt(t,8)
if(e)return e}const Rt=t=>Buffer.isBuffer(t)?t:new Buffer(t+''),Ft=(t,e,r)=>{if(!r(t))throw TypeError(`Bad arguments: ${e}`)
return t},Tt=(t,e)=>Ft(t,e,Buffer.isBuffer),Dt=(t,e)=>Ft(t,e,(t=>'number'===typeof t)),Et=(t,e)=>Ft(t,e,(t=>'string'===typeof t)),$t=(t,e)=>Ft(t,e,(t=>'function'===typeof t)),Lt=t=>(w(t,'cb'),t),Ot=(t,e)=>{if(null===t||void 0===t||'function'===typeof t)return e
if('string'===typeof t)t={...e,encoding:t}
else if('object'!==typeof t)throw new C('options',['string','Object'],t)
let{encoding:r}=t,i
if('string'===typeof r)switch(r.toLowerCase()){case'utf8':case'utf-8':t.encoding='utf8'
break
default:i=r}else if(r)i=r
if(i)throw new I(i)
return Object.assign({},e,t)},At=(t,r)=>(t&BigInt(e))===BigInt(r),Wt=t=>new Date(Number(t)+.5),jt=t=>t===n||t===f||t===r,zt=Symbol('_checkModeProperty')
class Stats extends Array{constructor(){super(14)}get dev(){return this[0]}get ino(){return this[1]}get mode(){return this[2]}get nlink(){return this[3]}get uid(){return this[4]}get gid(){return this[5]}get rdev(){return this[6]}get size(){return this[7]}get blksize(){return this[8]}get blocks(){return this[9]}get atimeMs(){return this._toMs(this[10])}get mtimeMs(){return this._toMs(this[11])}get ctimeMs(){return this._toMs(this[12])}get birthtimeMs(){return this._toMs(this[13])}get atime(){return Wt(this[10])}get mtime(){return Wt(this[11])}get ctime(){return Wt(this[12])}get birthtime(){return Wt(this[13])}isDirectory(){return this[zt](s)}isFile(){return this[zt](o)}isBlockDevice(){return this[zt](f)}isCharacterDevice(){return this[zt](u)}isSymbolicLink(){return this[zt](i)}isFIFO(){return this[zt](n)}isSocket(){return this[zt](r)}[zt](t){if(D&&jt(t))return false
return(this.mode&e)===t}_toMs(t){return t}}class BigIntStats extends Stats{get atimeNs(){return this[10]}get mtimeNs(){return this[11]}get ctimeNs(){return this[12]}get birthtimeNs(){return this[13]}[zt](t){if(D&&jt(t))return false
return(this.mode&BigInt(e))===BigInt(t)}_toMs(t){return t/E}}T(Stats,BigIntStats)
const Kt={close:t(U),exists:t(O),fstat:t(Y),lstat:t(z),mkdir:t(it),open:t(G),readdir:t(ct),readlink:t(gt),realpath:t(vt),readFile:t(X),read:t(Z),rename:t(at),rmdir:t(st),stat:t(W),symlink:t(mt),unlink:t(ft),write:t(H),writeFile:t(et)},Yt={close:U,closeSync:V,createReadStream:It,createWriteStream:Ct,exists:O,existsSync:A,fstat:Y,fstatSync:P,mkdir:it,mkdirSync:nt,open:G,openSync:J,readdir:ct,readdirSync:ht,readlink:gt,readlinkSync:pt,realpath:vt,realpathSync:St,readFile:X,readFileSync:tt,read:Z,readSync:q,rename:at,renameSync:lt,rmdir:st,rmdirSync:ot,stat:W,statSync:j,symlink:mt,symlinkSync:bt,unlink:ft,unlinkSync:ut,write:H,writeSync:Q,writeFile:et,writeFileSync:rt,promises:Kt}
export{U as close,V as closeSync,It as createReadStream,Ct as createWriteStream,Yt as default,O as exists,A as existsSync,Y as fstat,P as fstatSync,z as lstat,K as lstatSync,it as mkdir,nt as mkdirSync,G as open,J as openSync,Kt as promises,Z as read,X as readFile,tt as readFileSync,q as readSync,ct as readdir,ht as readdirSync,gt as readlink,pt as readlinkSync,vt as realpath,St as realpathSync,at as rename,lt as renameSync,st as rmdir,ot as rmdirSync,W as stat,j as statSync,mt as symlink,bt as symlinkSync,ft as unlink,ut as unlinkSync,H as write,et as writeFile,rt as writeFileSync,Q as writeSync}
