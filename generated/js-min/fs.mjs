import{promisify as t}from'util'
import{S_IFDIR as e,S_IFREG as r,S_IFBLK as i,S_IFCHR as n,S_IFLNK as s,S_IFIFO as o,S_IFSOCK as a,S_IFMT as f,O_RDONLY as u,O_SYNC as c,O_RDWR as l,O_TRUNC as h,O_CREAT as d,O_WRONLY as p,O_EXCL as g,O_APPEND as m}from'constants'
import{Readable as b,Writable as y}from'stream'
import{codes as _}from'internal/errors'
import{validateFunction as w}from'internal/validators'
const{ERR_INVALID_ARG_TYPE:k,ERR_UNKNOWN_ENCODING:S}=_,v=import.meta.native,{setStats:M}=v,B='win32'===process.platform,x=10n**6n,C=new Map([['r',u],['rs',u|c],['sr',u|c],['r+',l],['rs+',l|c],['sr+',l|c],['w',h|d|p],['wx',h|d|p|g],['xw',h|d|p|g],['w+',h|d|l],['wx+',h|d|l|g],['xw+',h|d|l|g],['a',m|d|p],['ax',m|d|p|g],['xa',m|d|p|g],['a+',m|d|l],['ax+',m|d|l|g],['xa+',m|d|l|g]]),R=(t,e)=>{if('string'!==typeof t&&!Buffer.isBuffer(t))throw new TypeError('Path should be a string or a buffer')
if(!t||!t.length)return process.nextTick((()=>null==e?void 0:e(false))),void 0
pt(e,'callback')
const r=t=>e(!!t)
v.stat(dt(t,'path'),r)},N=t=>{if(!t||!t.length)return false
try{return v.stat(dt(t,'path')),true}catch(t){return false}},P=(t,e,r)=>{const{bigint:i}=e??{}
r=gt(r||e),v.stat(dt(t,'path'),!!i,pt(r,'callback'))},F=(t,e)=>{const{bigint:r}=e??{}
return v.stat(dt(t,'path'),!!r)},I=(t,e,r)=>{const{bigint:i}=e??{}
r=gt(r||e),v.lstat(dt(t,'path'),!!i,pt(r,'callback'))},E=(t,e)=>{const{bigint:r}=e??{}
return v.lstat(dt(t,'path'),!!r)},W=(t,e,r)=>{const{bigint:i}=e??{}
r=gt(r||e),v.fstat(ht(t,'fd'),!!i,pt(r,'callback'))},D=(t,e)=>{const{bigint:r}=e??{}
return v.fstat(ht(t,'fd'),!!r)},T=(t,e)=>{v.close(ht(t,'fd'),pt(e,'callback'))},O=t=>{v.close(ht(t,'fd'))},j=(...t)=>{const[e,r,i]=t
v.open(dt(e,'path'),at(r??'r'),ft(i,438),pt(t[t.length-1]),'callback')},z=(t,e,r)=>v.open(dt(t,'path'),at(e??'r'),ft(r,438)),A=(t,e,r,i,n,s)=>{n=n??-1,s=pt(s,'callback')
var o=function(t,r){s(t,r||0,e)}
return v.read(ht(t,'fd'),lt(e,'buffer'),ht(r,'offset'),ht(i,'length'),ht(n,'position'),o)},L=(t,e,r,i,n)=>(n=n??-1,v.read(ht(t,'fd'),lt(e,'buffer'),ht(r,'offset'),ht(i,'length'),ht(n,'position'))),G=(t,e,r,i,n,s)=>{if('function'===typeof n)s=n,n=-1
else if(null===n||void 0===n)n=-1
s=pt(s,'callback')
var o=function(t,r){s(t,r,e)}
return v.write(ht(t,'fd'),lt(e,'buffer'),ht(r,'offset'),ht(i,'length'),ht(n,'position'),o)},K=(t,e,r,i,n)=>{if(null===n||void 0===n)n=-1
return v.write(ht(t,'fd'),lt(e,'buffer'),ht(r,'offset'),ht(i,'length'),ht(n,'position'))},U=(t,e,r)=>{let i,n
dt(t),r=gt(r||e),e=mt(e,{flag:'r'}),j(t,e.flag,((t,e)=>{if(t)return r(t)
i=e,n=[],s()}))
const s=()=>{const t=new Buffer(8192)
A(i,t,0,8192,-1,o)},o=(t,e,o)=>{if(t)T(i,(t=>r(t)))
if(0===e)a()
else n.push(o.slice(0,e)),s()},a=()=>{T(i,(t=>{let i
if(n){const{encoding:t}=e,r=Buffer.concat(n)
i=!t?r:r.toString(t)}return r(t,i)}))}},V=(t,e=void 0)=>{dt(t),e=mt(e,{flag:'r'})
const r=z(t,e.flag,438),i=[]
while(true)try{const t=new Buffer(8192),e=L(r,t,0,8192)
if(e)i.push(t.slice(0,e))
else break}catch(t){break}O(r)
const n=Buffer.concat(i),{encoding:s}=e
return!s?n:n.toString(s)},Y=(t,e,r)=>{var i,n,s
dt(t),pt(r)
var o=ut(e)
j(t,'w',(function(t,e){if(t)return r(t)
i=e,n=o.length,s=0,a()}))
var a=function(){var t=n-s>=1024?1023:n-s
G(i,o,s,t,s,f)},f=function(t,e){if(t)T(i,(function(t){return r(t)}))
if(e<=0||s+e===n)T(i,(function(t){r(t)}))
else s+=e,a()}},$=(t,e)=>{dt(t)
var r=ut(e),i=z(t,'w'),n=r.length,s=0
while(true)try{var o=n-s>=1024?1023:n-s,a=K(i,r,s,o,s)
if(s+=a,s===n)break}catch(t){break}return O(i),s},q=(t,e,r)=>{if('function'===typeof e)r=e
dt(t,'path'),pt(r,'callback'),v.mkdir(t,ft(e,511),r)},H=(t,e)=>v.mkdir(dt(t,'path'),ft(e,511)),J=(t,e)=>{dt(t,'path'),pt(e,'callback'),v.rmdir(t,e)},Q=t=>v.rmdir(dt(t,'path')),X=(t,e)=>{dt(t),pt(e),v.unlink(t,e)},Z=t=>v.unlink(dt(t,'path')),tt=(t,e,r)=>{dt(t),dt(e),pt(r),v.rename(t,e,r)},et=(t,e)=>{dt(t),dt(e),v.rename(t,e)},rt=(t,e)=>{dt(t),pt(e),v.readdir(t,e)},it=t=>v.readdir(dt(t,'path')),nt=t=>{T(t._fd,(e=>{if(e)throw e
t.emit('close')}))}
class ReadStream extends b{constructor(t,e={}){super({defaultEncoding:e.encoding||null}),this.bytesRead=0,this.path=t,this._autoClose=null===e.autoClose||void 0===e.autoClose||e.autoClose,this._fd=e.fd,this._buff=new Buffer(e.bufferSize||4096)
var r=this
if(null===this._fd||void 0===this._fd)j(this.path,e.flags||'r',e.mode||438,(function(t,e){if(t)throw t
r._fd=e,r.emit('open',r._fd),r.doRead()}))
if(this.once('open',(()=>this.emit('ready'))),this._autoClose)this.on('end',(()=>nt(r)))}doRead(){const t=this
A(this._fd,this._buff,0,this._buff.length,null,((e,r)=>{if(e){if(t._autoClose)nt(t)
throw e}if(t.bytesRead+=r,0===r)t.push(null)
else t.push(r===t._buff.length?t._buff:t._buff.slice(0,r)),t.doRead()}))}}class WriteStream extends y{constructor(t,e={}){super(),this._fd=e._fd,this._autoClose=null===e.autoClose||void 0===e.autoClose||e.autoClose,this.bytesWritten=0
var r=this
if(!this._fd)j(t,e.flags||'w',e.mode||438,(function(t,e){if(t)throw t
r._fd=e,r.emit('open',r._fd)}))
this.once('open',(()=>r.emit('ready'))),this._autoClose&&this.on('finish',(()=>nt(r))),this._readyToWrite()}_write(t,e,r){const i=this
G(this._fd,t,0,t.length,((t,n)=>{if(t)throw i._autoClose&&nt(i),t
this.bytesWritten+=n,null==e||e(),r()}))}}const st=(t,e)=>new WriteStream(t,e),ot=(t,e)=>new ReadStream(t,e)
function at(t){const e=C.get(t)
if(void 0===e)throw new TypeError('Bad argument: flags')
return e}function ft(t,e){if('number'===typeof t)return t
if('string'===typeof t)return parseInt(t,8)
if(e)return e}const ut=t=>Buffer.isBuffer(t)?t:new Buffer(t+''),ct=(t,e,r)=>{if(!r(t))throw TypeError(`Bad arguments: ${e}`)
return t},lt=(t,e)=>ct(t,e,Buffer.isBuffer),ht=(t,e)=>ct(t,e,(t=>'number'===typeof t)),dt=(t,e)=>ct(t,e,(t=>'string'===typeof t)),pt=(t,e)=>ct(t,e,(t=>'function'===typeof t)),gt=t=>(w(t,'cb'),t),mt=(t,e)=>{if(null===t||void 0===t||'function'===typeof t)return e
if('string'===typeof t)t={...e,encoding:t}
else if('object'!==typeof t)throw new k('options',['string','Object'],t)
let{encoding:r}=t,i
if('string'===typeof r)switch(r.toLowerCase()){case'utf8':case'utf-8':t.encoding='utf8'
break
default:i=r}else if(r)i=r
if(i)throw new S(i)
return Object.assign({},e,t)},bt=t=>new Date(Number(t)+.5),yt=t=>t===o||t===i||t===a
class Stats extends Array{constructor(){super(14)}get dev(){return this[0]}get ino(){return this[1]}get mode(){return this[2]}get nlink(){return this[3]}get uid(){return this[4]}get gid(){return this[5]}get rdev(){return this[6]}get size(){return this[7]}get blksize(){return this[8]}get blocks(){return this[9]}get atimeMs(){return this._toMs(this[10])}get mtimeMs(){return this._toMs(this[11])}get ctimeMs(){return this._toMs(this[12])}get birthtimeMs(){return this._toMs(this[13])}get atime(){return bt(this[10])}get mtime(){return bt(this[11])}get ctime(){return bt(this[12])}get birthtime(){return bt(this[13])}isDirectory(){return this._checkModeProperty(e)}isFile(){return this._checkModeProperty(r)}isBlockDevice(){return this._checkModeProperty(i)}isCharacterDevice(){return this._checkModeProperty(n)}isSymbolicLink(){return this._checkModeProperty(s)}isFIFO(){return this._checkModeProperty(o)}isSocket(){return this._checkModeProperty(a)}_checkModeProperty(t){if(B&&yt(t))return false
return(this.mode&f)===t}_toMs(t){return t}}class BigIntStats extends Stats{get atimeNs(){return this[10]}get mtimeNs(){return this[11]}get ctimeNs(){return this[12]}get birthtimeNs(){return this[13]}_checkModeProperty(t){if(B&&yt(t))return false
return(this.mode&BigInt(f))===BigInt(t)}_toMs(t){return t/x}}M(Stats,BigIntStats)
const _t={close:t(T),exists:t(R),fstat:t(W),lstat:t(I),mkdir:t(q),open:t(j),readdir:t(rt),readFile:t(U),read:t(A),rename:t(tt),rmdir:t(J),stat:t(P),unlink:t(X),write:t(G),writeFile:t(Y)},wt={close:T,closeSync:O,createReadStream:ot,createWriteStream:st,exists:R,existsSync:N,fstat:W,fstatSync:D,mkdir:q,mkdirSync:H,open:j,openSync:z,readdir:rt,readdirSync:it,readFile:U,readFileSync:V,read:A,readSync:L,rename:tt,renameSync:et,rmdir:J,rmdirSync:Q,stat:P,statSync:F,unlink:X,unlinkSync:Z,write:G,writeSync:K,writeFile:Y,writeFileSync:$,promises:_t}
export{T as close,O as closeSync,ot as createReadStream,st as createWriteStream,wt as default,R as exists,N as existsSync,W as fstat,D as fstatSync,I as lstat,E as lstatSync,q as mkdir,H as mkdirSync,j as open,z as openSync,_t as promises,A as read,U as readFile,V as readFileSync,L as readSync,rt as readdir,it as readdirSync,tt as rename,et as renameSync,J as rmdir,Q as rmdirSync,P as stat,F as statSync,X as unlink,Z as unlinkSync,G as write,Y as writeFile,$ as writeFileSync,K as writeSync}
