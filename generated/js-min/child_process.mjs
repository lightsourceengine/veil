import{URL as e,fileURLToPath as i}from'url'
import{errnoException as t,codes as s}from'internal/errors'
import{validateObject as n,validateOneOf as o,validateArray as r,validateString as l,validateAbortSignal as a,validateBoolean as d}from'internal/validators'
import{EventEmitter as p}from'events'
import f from'constants'
const{ERR_INVALID_ARG_VALUE:h,ERR_INVALID_SYNC_FORK_INPUT:c,ERR_IPC_SYNC_FORK:u,ERR_IPC_ONE_PIPE:w,ERR_UNKNOWN_SIGNAL:_}=s,{Process:g,Pipe:m}=import.meta.native,{signals:v}=f.os,{UV_EACCES:E,UV_EAGAIN:y,UV_EINVAL:N,UV_EMFILE:A,UV_ENFILE:b,UV_ENOENT:R,UV_ENOSYS:k,UV_ESRCH:C}=f.uv.errno,V=Symbol('kIsUsedAsStdio')
class ChildProcess extends p{_closesNeeded=1
_closesGot=0
connected=false
signalCode=null
exitCode=null
killed=false
spawnfile=null
_handle=null
stdin=null
constructor(){super(),this._handle=new g,this._handle.onexit=(e,i)=>{if(i)this.signalCode=i
else this.exitCode=e
const{stdin:s,_handle:n,spawnfile:o,spawnargs:r}=this
if(null==s?void 0:s.destroy(),n.close(),this._handle=null,e<0){const i=o?`spawn ${o}`:'spawn',s=t(e,i)
if(o)s.path=o
s.spawnargs=r.slice(1),this.emit('error',s)}else this.emit('exit',this.exitCode,this.signalCode)
process.nextTick(I,this),O(this)}}spawn(e){let i=0
n(e,'options')
let s=e.stdio||'pipe'
s=S(s,false)
const a=s.ipc,d=s.ipcFd
s=e.stdio=s.stdio,o(e.serialization,'options.serialization',[void 0,'json','advanced'])
const p=e.serialization||'json'
if(void 0!==a){if(void 0===e.envPairs)e.envPairs=[]
else r(e.envPairs,'options.envPairs')
e.envPairs.push(`NODE_CHANNEL_FD=${d}`),e.envPairs.push(`NODE_CHANNEL_SERIALIZATION_MODE=${p}`)}if(l(e.file,'options.file'),this.spawnfile=e.file,void 0===e.args)this.spawnargs=[]
else r(e.args,'options.args'),this.spawnargs=e.args
const f=this._handle.spawn(e)
if(f===E||f===y||f===A||f===b||f===R){if(process.nextTick(x,this,f),f===A||f===b)return f}else if(f){for(i=0;i<s.length;i++){const e=s[i]
if('pipe'===e.type)e.handle.close()}throw this._handle.close(),this._handle=null,t(f,'spawn')}else process.nextTick(U,this)
for(this.pid=this._handle.pid,i=0;i<s.length;i++){const e=s[i]
if('ignore'===e.type)continue
if(e.ipc){this._closesNeeded++
continue}if('wrap'===e.type){e.handle.reading=false,e.handle.readStop(),e._stdio.pause(),e._stdio.readableFlowing=false,e._stdio._readableState.reading=false,e._stdio[V]=true
continue}if(e.handle)if(e.socket=L(0!==this.pid?e.handle:null),i>0&&0!==this.pid)this._closesNeeded++,e.socket.on('close',(()=>{O(this)}))}for(this.stdin=s.length>=1&&void 0!==s[0].socket?s[0].socket:null,this.stdout=s.length>=2&&void 0!==s[1].socket?s[1].socket:null,this.stderr=s.length>=3&&void 0!==s[2].socket?s[2].socket:null,this.stdio=[],i=0;i<s.length;i++)this.stdio.push(void 0===s[i].socket?null:s[i].socket)
if(void 0!==a)throw Error('ipc not supported')
return f}kill(e){const i=0===e?e:F(void 0===e?'SIGTERM':e)
if(this._handle){const e=this._handle.kill(i)
if(0===e)return this.killed=true,true
if(e===C);else if(e===N||e===k)throw t(e,'kill')
else this.emit('error',t(e,'kill'))}return false}ref(){var e
null==(e=this._handle)?void 0:e.ref()}unref(){var e
null==(e=this._handle)?void 0:e.unref()}}const I=e=>{const{stdio:i}=e
if(null==i)return
for(let e=0;e<i.length;e++){const t=i[e]
if(!t||!t.readable||t[V])continue
t.resume()}},O=e=>{if(e._closesGot++,e._closesGot===e._closesNeeded)e.emit('close',e.exitCode,e.signalCode)},P=(e,i)=>{const t=[]
switch(e){case'ignore':case'overlapped':case'pipe':t.push(e,e,e)
break
case'inherit':t.push(0,1,2)
break
default:throw new h('stdio',e)}if(i)t.push(i)
return t},S=(e,i)=>{let t,s
if('string'===typeof e)e=P(e)
else if(!Array.isArray(e))throw new h('stdio',e)
while(e.length<3)e.push(void 0)
return e=e.reduce(((e,n,o)=>{const r=()=>{for(let i=0;i<e.length;i++){const{type:t,handle:s}=e[i];('pipe'===t||'ipc'===t)&&(null==s?void 0:s.close())}}
if(null==n)n=o<3?'pipe':'ignore'
if('ignore'===n)e.push({type:'ignore'})
else if('pipe'===n||'overlapped'===n||'number'===typeof n&&n<0){const t={type:'overlapped'===n?'overlapped':'pipe',readable:0===o,writable:0!==o}
if(!i)t.handle=new m(m.SOCKET)
e.push(t)}else if('ipc'===n){if(i||void 0!==t)if(r(),!i)throw new w
else throw new u
t=new m(m.IPC),s=o,e.push({type:'pipe',handle:t,ipc:true})}else if('inherit'===n)e.push({type:'inherit',fd:o})
else if('number'===typeof n||'number'===typeof n.fd)e.push({type:'fd',fd:'number'===typeof n?n:n.fd})
else if(G(n)||G(n.handle)||G(n._handle)){const i=G(n)?n:G(n.handle)?n.handle:n._handle
e.push({type:'wrap',wrapType:G(i),handle:i,_stdio:n})}else if(ArrayBuffer.isView(n)||'string'===typeof n){if(!i)throw r(),new c(n.toString())}else throw r(),new h('stdio',n)
return e}),[]),{stdio:e,ipc:t,ipcFd:s}},x=(e,i)=>e._handle.onexit(i),U=e=>e.emit('spawn'),L=(e,i)=>{throw Error('createSocket not implemented')},G=e=>{if(e instanceof m)return'pipe'
return false}
let T
const D=()=>{if(void 0!==T)return T
T={}
for(const e in v)T[v[e]]=e
return T},F=e=>{if('number'===typeof e&&D()[e])return e
if('string'===typeof e){const i=v[e.toUpperCase()]
if(i)return i}throw new _(e)},{AbortError:H,ERR_INVALID_ARG_VALUE:$,ERR_INVALID_ARG_TYPE:j,ERR_OUT_OF_RANGE:z}=s,K=Object.freeze({}),Y=/^(?:.*\\)?cmd(?:\.exe)?$/i,M=e=>e===(0|e),B=(e,i,t)=>{if(l(e,'file'),0===e.length)throw new $('file',e,'cannot be empty')
if(Array.isArray(i))i=i.slice()
else if(null==i)i=[]
else if('object'!==typeof i)throw new j('args','object',i)
else t=i,i=[]
if(void 0===t)t=K
else n(t,'options')
let s=t.cwd
if(null!=s)s=W(s,'options.cwd')
if(null!=t.detached)d(t.detached,'options.detached')
if(null!=t.uid&&!M(t.uid))throw new j('options.uid','int32',t.uid)
if(null!=t.gid&&!M(t.gid))throw new j('options.gid','int32',t.gid)
if(null!=t.shell&&'boolean'!==typeof t.shell&&'string'!==typeof t.shell)throw new j('options.shell',['boolean','string'],t.shell)
if(null!=t.argv0)l(t.argv0,'options.argv0')
if(null!=t.windowsHide)d(t.windowsHide,'options.windowsHide')
let{windowsVerbatimArguments:o}=t
if(null!=o)d(o,'options.windowsVerbatimArguments')
if(t.shell){const s=[e,...i].join(' ')
if('win32'===process.platform){if('string'===typeof t.shell)e=t.shell
else e=process.env.comspec||'cmd.exe'
if(Y.test(e))i=['/d','/s','/c',`"${s}"`],o=true
else i=['-c',s]}else{if('string'===typeof t.shell)e=t.shell
else if('android'===process.platform)e='/system/bin/sh'
else e='/bin/sh'
i=['-c',s]}}if('string'===typeof t.argv0)i.unshift(t.argv0)
else i.unshift(e)
const r=t.env||process.env,a=[]
if(process.env.NODE_V8_COVERAGE&&!(t.env||{}).hasOwnProperty('NODE_V8_COVERAGE'))r.NODE_V8_COVERAGE=process.env.NODE_V8_COVERAGE
let p=[]
for(const e in r)p.push(e)
if('win32'===process.platform){const e=new Set
p=p.sort().filter((i=>{const t=i.toUpperCase()
if(e.has(t))return false
return e.add(t),true}))}for(const e of p){const i=r[e]
if(void 0!==i)a.push(`${e}=${i}`)}return{...t,args:i,cwd:s,detached:!!t.detached,envPairs:a,file:e,windowsHide:!!t.windowsHide,windowsVerbatimArguments:!!o}},W=(t,s='path')=>{const n=t instanceof e?i(t):t
if('string'!==typeof n)throw new j(s,['string','URL'],n)
return n},Z=(e,i)=>{if(!e)return
try{if(e.kill(i))e.emit('error',new H)}catch(i){e.emit('error',i)}},q=e=>{if(null!=e&&!(Number.isInteger(e)&&e>=0))throw new z('timeout','an unsigned integer',e)},J=e=>{if('string'===typeof e||'number'===typeof e)return F(e)
else if(null!=e)throw new j('options.killSignal',['string','number'],e)},Q=(e,i,t)=>{t=B(e,i,t),q(t.timeout),a(t.signal,'options.signal')
const s=J(t.killSignal),n=new ChildProcess
if(n.spawn(t),t.timeout>0){let e=setTimeout((()=>{if(e){try{n.kill(s)}catch(e){n.emit('error',e)}e=null}}),t.timeout)
n.once('exit',(()=>{if(e)clearTimeout(e),e=null}))}if(t.signal){const{signal:e}=t,i=()=>Z(n,s)
if(e.aborted)process.nextTick(i)
else e.addEventListener('abort',i,{once:true}),n.once('exit',(()=>e.removeEventListener('abort',i)))}return n}
export{ChildProcess,Q as spawn}
