import{promisify as t}from'util'
import{S_IFDIR as e,S_IFREG as r,S_IFBLK as i,S_IFCHR as n,S_IFLNK as s,S_IFIFO as o,S_IFSOCK as a,S_IFMT as f,O_RDONLY as u,O_SYNC as c,O_RDWR as l,O_TRUNC as h,O_CREAT as d,O_WRONLY as p,O_EXCL as g,O_APPEND as m}from'constants'
import{Readable as y,Writable as b}from'stream'
import{codes as _}from'internal/errors'
import{validateFunction as w}from'internal/validators'
const{ERR_INVALID_ARG_TYPE:k,ERR_UNKNOWN_ENCODING:S}=_,v=import.meta.native,{setStats:M}=v,B='win32'===process.platform,x=10n**6n,C=new Map([['r',u],['rs',u|c],['sr',u|c],['r+',l],['rs+',l|c],['sr+',l|c],['w',h|d|p],['wx',h|d|p|g],['xw',h|d|p|g],['w+',h|d|l],['wx+',h|d|l|g],['xw+',h|d|l|g],['a',m|d|p],['ax',m|d|p|g],['xa',m|d|p|g],['a+',m|d|l],['ax+',m|d|l|g],['xa+',m|d|l|g]]),R=(t,e)=>{if('string'!==typeof t&&!Buffer.isBuffer(t))throw new TypeError('Path should be a string or a buffer')
if(!t||!t.length)return process.nextTick((()=>null==e?void 0:e(false))),void 0
ht(e,'callback')
const r=t=>e(!!t)
v.stat(lt(t,'path'),r)},N=t=>{if(!t||!t.length)return false
try{return v.stat(lt(t,'path')),true}catch(t){return false}},P=(t,e,r)=>{const{bigint:i}=e??{}
r=dt(r||e),v.stat(lt(t,'path'),!!i,ht(r,'callback'))},F=(t,e)=>{const{bigint:r}=e??{}
return v.stat(lt(t,'path'),!!r)},I=(t,e,r)=>{const{bigint:i}=e??{}
r=dt(r||e),v.fstat(ct(t,'fd'),!!i,ht(r,'callback'))},E=(t,e)=>{const{bigint:r}=e??{}
return v.fstat(ct(t,'fd'),!!r)},W=(t,e)=>{v.close(ct(t,'fd'),ht(e,'callback'))},D=t=>{v.close(ct(t,'fd'))},T=(...t)=>{const[e,r,i]=t
v.open(lt(e,'path'),st(r??'r'),ot(i,438),ht(t[t.length-1]),'callback')},O=(t,e,r)=>v.open(lt(t,'path'),st(e??'r'),ot(r,438)),j=(t,e,r,i,n,s)=>{n=n??-1,s=ht(s,'callback')
var o=function(t,r){s(t,r||0,e)}
return v.read(ct(t,'fd'),ut(e,'buffer'),ct(r,'offset'),ct(i,'length'),ct(n,'position'),o)},z=(t,e,r,i,n)=>(n=n??-1,v.read(ct(t,'fd'),ut(e,'buffer'),ct(r,'offset'),ct(i,'length'),ct(n,'position'))),A=(t,e,r,i,n,s)=>{if('function'===typeof n)s=n,n=-1
else if(null===n||void 0===n)n=-1
s=ht(s,'callback')
var o=function(t,r){s(t,r,e)}
return v.write(ct(t,'fd'),ut(e,'buffer'),ct(r,'offset'),ct(i,'length'),ct(n,'position'),o)},L=(t,e,r,i,n)=>{if(null===n||void 0===n)n=-1
return v.write(ct(t,'fd'),ut(e,'buffer'),ct(r,'offset'),ct(i,'length'),ct(n,'position'))},G=(t,e,r)=>{let i,n
lt(t),r=dt(r||e),e=pt(e,{flag:'r'}),T(t,e.flag,((t,e)=>{if(t)return r(t)
i=e,n=[],s()}))
const s=()=>{const t=new Buffer(8192)
j(i,t,0,8192,-1,o)},o=(t,e,o)=>{if(t)W(i,(t=>r(t)))
if(0===e)a()
else n.push(o.slice(0,e)),s()},a=()=>{W(i,(t=>{let i
if(n){const{encoding:t}=e,r=Buffer.concat(n)
i=!t?r:r.toString(t)}return r(t,i)}))}},K=(t,e=void 0)=>{lt(t),e=pt(e,{flag:'r'})
const r=O(t,e.flag,438),i=[]
while(true)try{const t=new Buffer(8192),e=z(r,t,0,8192)
if(e)i.push(t.slice(0,e))
else break}catch(t){break}D(r)
const n=Buffer.concat(i),{encoding:s}=e
return!s?n:n.toString(s)},U=(t,e,r)=>{var i,n,s
lt(t),ht(r)
var o=at(e)
T(t,'w',(function(t,e){if(t)return r(t)
i=e,n=o.length,s=0,a()}))
var a=function(){var t=n-s>=1024?1023:n-s
A(i,o,s,t,s,f)},f=function(t,e){if(t)W(i,(function(t){return r(t)}))
if(e<=0||s+e===n)W(i,(function(t){r(t)}))
else s+=e,a()}},V=(t,e)=>{lt(t)
var r=at(e),i=O(t,'w'),n=r.length,s=0
while(true)try{var o=n-s>=1024?1023:n-s,a=L(i,r,s,o,s)
if(s+=a,s===n)break}catch(t){break}return D(i),s},Y=(t,e,r)=>{if('function'===typeof e)r=e
lt(t,'path'),ht(r,'callback'),v.mkdir(t,ot(e,511),r)},$=(t,e)=>v.mkdir(lt(t,'path'),ot(e,511)),q=(t,e)=>{lt(t,'path'),ht(e,'callback'),v.rmdir(t,e)},H=t=>v.rmdir(lt(t,'path')),J=(t,e)=>{lt(t),ht(e),v.unlink(t,e)},Q=t=>v.unlink(lt(t,'path')),X=(t,e,r)=>{lt(t),lt(e),ht(r),v.rename(t,e,r)},Z=(t,e)=>{lt(t),lt(e),v.rename(t,e)},tt=(t,e)=>{lt(t),ht(e),v.readdir(t,e)},et=t=>v.readdir(lt(t,'path')),rt=t=>{W(t._fd,(e=>{if(e)throw e
t.emit('close')}))}
class ReadStream extends y{constructor(t,e={}){super({defaultEncoding:e.encoding||null}),this.bytesRead=0,this.path=t,this._autoClose=null===e.autoClose||void 0===e.autoClose||e.autoClose,this._fd=e.fd,this._buff=new Buffer(e.bufferSize||4096)
var r=this
if(null===this._fd||void 0===this._fd)T(this.path,e.flags||'r',e.mode||438,(function(t,e){if(t)throw t
r._fd=e,r.emit('open',r._fd),r.doRead()}))
if(this.once('open',(()=>this.emit('ready'))),this._autoClose)this.on('end',(()=>rt(r)))}doRead(){const t=this
j(this._fd,this._buff,0,this._buff.length,null,((e,r)=>{if(e){if(t._autoClose)rt(t)
throw e}if(t.bytesRead+=r,0===r)t.push(null)
else t.push(r===t._buff.length?t._buff:t._buff.slice(0,r)),t.doRead()}))}}class WriteStream extends b{constructor(t,e={}){super(),this._fd=e._fd,this._autoClose=null===e.autoClose||void 0===e.autoClose||e.autoClose,this.bytesWritten=0
var r=this
if(!this._fd)T(t,e.flags||'w',e.mode||438,(function(t,e){if(t)throw t
r._fd=e,r.emit('open',r._fd)}))
this.once('open',(()=>r.emit('ready'))),this._autoClose&&this.on('finish',(()=>rt(r))),this._readyToWrite()}_write(t,e,r){const i=this
A(this._fd,t,0,t.length,((t,n)=>{if(t)throw i._autoClose&&rt(i),t
this.bytesWritten+=n,null==e||e(),r()}))}}const it=(t,e)=>new WriteStream(t,e),nt=(t,e)=>new ReadStream(t,e)
function st(t){const e=C.get(t)
if(void 0===e)throw new TypeError('Bad argument: flags')
return e}function ot(t,e){if('number'===typeof t)return t
if('string'===typeof t)return parseInt(t,8)
if(e)return e}const at=t=>Buffer.isBuffer(t)?t:new Buffer(t+''),ft=(t,e,r)=>{if(!r(t))throw TypeError(`Bad arguments: ${e}`)
return t},ut=(t,e)=>ft(t,e,Buffer.isBuffer),ct=(t,e)=>ft(t,e,(t=>'number'===typeof t)),lt=(t,e)=>ft(t,e,(t=>'string'===typeof t)),ht=(t,e)=>ft(t,e,(t=>'function'===typeof t)),dt=t=>(w(t,'cb'),t),pt=(t,e)=>{if(null===t||void 0===t||'function'===typeof t)return e
if('string'===typeof t)t={...e,encoding:t}
else if('object'!==typeof t)throw new k('options',['string','Object'],t)
let{encoding:r}=t,i
if('string'===typeof r)switch(r.toLowerCase()){case'utf8':case'utf-8':t.encoding='utf8'
break
default:i=r}else if(r)i=r
if(i)throw new S(i)
return Object.assign({},e,t)},gt=t=>new Date(Number(t)+.5),mt=t=>t===o||t===i||t===a
class Stats extends Array{constructor(){super(14)}get dev(){return this[0]}get ino(){return this[1]}get mode(){return this[2]}get nlink(){return this[3]}get uid(){return this[4]}get gid(){return this[5]}get rdev(){return this[6]}get size(){return this[7]}get blksize(){return this[8]}get blocks(){return this[9]}get atimeMs(){return this._toMs(this[10])}get mtimeMs(){return this._toMs(this[11])}get ctimeMs(){return this._toMs(this[12])}get birthtimeMs(){return this._toMs(this[13])}get atime(){return gt(this[10])}get mtime(){return gt(this[11])}get ctime(){return gt(this[12])}get birthtime(){return gt(this[13])}isDirectory(){return this._checkModeProperty(e)}isFile(){return this._checkModeProperty(r)}isBlockDevice(){return this._checkModeProperty(i)}isCharacterDevice(){return this._checkModeProperty(n)}isSymbolicLink(){return this._checkModeProperty(s)}isFIFO(){return this._checkModeProperty(o)}isSocket(){return this._checkModeProperty(a)}_checkModeProperty(t){if(B&&mt(t))return false
return(this.mode&f)===t}_toMs(t){return t}}class BigIntStats extends Stats{get atimeNs(){return this[10]}get mtimeNs(){return this[11]}get ctimeNs(){return this[12]}get birthtimeNs(){return this[13]}_checkModeProperty(t){if(B&&mt(t))return false
return(this.mode&BigInt(f))===BigInt(t)}_toMs(t){return t/x}}M(Stats,BigIntStats)
const yt={close:t(W),exists:t(R),fstat:t(I),mkdir:t(Y),open:t(T),readdir:t(tt),readFile:t(G),read:t(j),rename:t(X),rmdir:t(q),stat:t(P),unlink:t(J),write:t(A),writeFile:t(U)},bt={close:W,closeSync:D,createReadStream:nt,createWriteStream:it,exists:R,existsSync:N,fstat:I,fstatSync:E,mkdir:Y,mkdirSync:$,open:T,openSync:O,readdir:tt,readdirSync:et,readFile:G,readFileSync:K,read:j,readSync:z,rename:X,renameSync:Z,rmdir:q,rmdirSync:H,stat:P,statSync:F,unlink:J,unlinkSync:Q,write:A,writeSync:L,writeFile:U,writeFileSync:V,promises:yt}
export{W as close,D as closeSync,nt as createReadStream,it as createWriteStream,bt as default,R as exists,N as existsSync,I as fstat,E as fstatSync,Y as mkdir,$ as mkdirSync,T as open,O as openSync,yt as promises,j as read,G as readFile,K as readFileSync,z as readSync,tt as readdir,et as readdirSync,X as rename,Z as renameSync,q as rmdir,H as rmdirSync,P as stat,F as statSync,J as unlink,Q as unlinkSync,A as write,U as writeFile,V as writeFileSync,L as writeSync}
