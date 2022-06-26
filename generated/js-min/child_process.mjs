import{URL as e,fileURLToPath as t}from'url'
import{EventEmitter as i}from'events'
import s from'constants'
const n=(e,t,i)=>{if('string'===typeof i)return class extends t{code=e
message=i}
return class extends t{code=e
constructor(...e){super(),this.message=i(this,...e)}}},o=n('ERR_IPC_ONE_PIPE',Error,'Child process can have only one IPC pipe'),r=n('ERR_IPC_SYNC_FORK',Error,'IPC cannot be used with synchronous forks'),l=n('ERR_INVALID_ARG_TYPE',Error,((e,t,i,s)=>`The ${t} argument must be of type ${i}. Received ${typeof s}`)),a=n('ERR_INVALID_ARG_VALUE',TypeError,((e,t,i,s='is invalid')=>`The ${t.includes('.')?'property':'argument'} '${t}' ${s}. Received ${typeof i}`)),d=n('ERR_MISSING_ARGS',TypeError,((e,...t)=>{const{length:i}=t
if(!i)return'assert: At least one arg needs to be specified'
let s='The '
const n=i,o=e=>`"${e}"`
switch(t=t.map((e=>Array.isArray(e)?e.map(o).join(' or '):o(e))),n){case 1:s+=`${t[0]} argument`
break
case 2:s+=`${t[0]} and ${t[1]} arguments`
break
default:s+=t.slice(0,n-1).join(', '),s+=`, and ${t[n-1]} arguments`
break}return`${s} must be specified`})),f=n('ERR_OUT_OF_RANGE',RangeError,((e,t,i,s,n=false)=>{if(!i)throw new d('range')
let o=n?t:`The value of "${t}" is out of range.`,r
if(Number.isInteger(s)&&Math.abs(s)>2**32)r=w(String(s))
else if('bigint'===typeof s){if(r=String(s),s>2n**32n||s<-(2n**32n))r=w(r)
r+='n'}else r=s
return o+=` It must be ${i}. Received ${r}`,o})),p=n('ERR_INVALID_SYNC_FORK_INPUT',TypeError,((e,t)=>`Asynchronous forks do not support Buffer, TypedArray, DataView or string input: ${t}`)),c=n('ERR_UNKNOWN_SIGNAL',TypeError,((e,t)=>`Unknown signal: ${t}`)),h=(e,t,i)=>{const s=new Error(`${t} (${e}): ${i}`)
return s.errno=e,s.code=e.toString(),s.syscall=t,s}
class u extends Error{constructor(e='The operation was aborted'){super(e),this.code='ABORT_ERR',this.name='AbortError'}}const w=e=>{let t='',i=e.length
const s='-'===e[0]?1:0
for(;i>=s+4;i-=3)t=`_${e.slice(i-3,i)}${t}`
return`${e.slice(0,i)}${t}`},g=(e,t,i=void 0)=>{if(!(null!=i&&i.nullable)&&null===e||!(null!=i&&i.allowArray)&&Array.isArray(e)||'object'!==typeof e&&(!(null!=i&&i.allowFunction)||'function'!==typeof e))throw new l(t,'Object',e)},_=(e,t)=>{if('string'!==typeof e)throw new l(t,'string',e)},y=(e,t)=>{if('boolean'!==typeof e)throw new l(t,'boolean',e)},m=(e,t,i)=>{if(!i.includes(e)){const s=i.map((e=>'string'===typeof e?`'${e}'`:String(e))).join(', ')
throw new a(t,e,`'must be one of: ${s}`)}},E=(e,t,i=0)=>{if(!Array.isArray(e))throw new l(t,'Array',e)
if(e.length<i)throw new a(t,e,`must be longer than ${i}`)},v=(e,t)=>{if(void 0!==e&&(null===e||'object'!==typeof e||!('aborted'in e)))throw new l(t,'AbortSignal',e)},{Process:b,Pipe:A}=import.meta.native,{signals:R}=s.os,{UV_EACCES:N,UV_EAGAIN:$,UV_EINVAL:k,UV_EMFILE:C,UV_ENFILE:I,UV_ENOENT:S,UV_ENOSYS:V,UV_ESRCH:O}=s.uv.errno,T=Symbol('kIsUsedAsStdio')
class x extends i{_closesNeeded=1
_closesGot=0
connected=false
signalCode=null
exitCode=null
killed=false
spawnfile=null
_handle=null
stdin=null
constructor(){super(),this._handle=new b,this._handle.onexit=(e,t)=>{if(t)this.signalCode=t
else this.exitCode=e
const{stdin:i,_handle:s,spawnfile:n,spawnargs:o}=this
if(null==i?void 0:i.destroy(),s.close(),this._handle=null,e<0){const t=n?`spawn ${n}`:'spawn',i=h(e,t)
if(n)i.path=n
i.spawnargs=o.slice(1),this.emit('error',i)}else this.emit('exit',this.exitCode,this.signalCode)
process.nextTick(P,this),U(this)}}spawn(e){let t=0
g(e,'options')
let i=e.stdio||'pipe'
i=L(i,false)
const s=i.ipc,n=i.ipcFd
i=e.stdio=i.stdio,m(e.serialization,'options.serialization',[void 0,'json','advanced'])
const o=e.serialization||'json'
if(void 0!==s){if(void 0===e.envPairs)e.envPairs=[]
else E(e.envPairs,'options.envPairs')
e.envPairs.push(`NODE_CHANNEL_FD=${n}`),e.envPairs.push(`NODE_CHANNEL_SERIALIZATION_MODE=${o}`)}if(_(e.file,'options.file'),this.spawnfile=e.file,void 0===e.args)this.spawnargs=[]
else E(e.args,'options.args'),this.spawnargs=e.args
const r=this._handle.spawn(e)
if(r===N||r===$||r===C||r===I||r===S){if(process.nextTick(j,this,r),r===C||r===I)return r}else if(r){for(t=0;t<i.length;t++){const e=i[t]
if('pipe'===e.type)e.handle.close()}throw this._handle.close(),this._handle=null,h(r,'spawn')}else process.nextTick(D,this)
for(this.pid=this._handle.pid,t=0;t<i.length;t++){const e=i[t]
if('ignore'===e.type)continue
if(e.ipc){this._closesNeeded++
continue}if('wrap'===e.type){e.handle.reading=false,e.handle.readStop(),e._stdio.pause(),e._stdio.readableFlowing=false,e._stdio._readableState.reading=false,e._stdio[T]=true
continue}if(e.handle)if(e.socket=F(0!==this.pid?e.handle:null),t>0&&0!==this.pid)this._closesNeeded++,e.socket.on('close',(()=>{U(this)}))}for(this.stdin=i.length>=1&&void 0!==i[0].socket?i[0].socket:null,this.stdout=i.length>=2&&void 0!==i[1].socket?i[1].socket:null,this.stderr=i.length>=3&&void 0!==i[2].socket?i[2].socket:null,this.stdio=[],t=0;t<i.length;t++)this.stdio.push(void 0===i[t].socket?null:i[t].socket)
if(void 0!==s)throw Error('ipc not supported')
return r}kill(e){const t=0===e?e:K(void 0===e?'SIGTERM':e)
if(this._handle){const e=this._handle.kill(t)
if(0===e)return this.killed=true,true
if(e===O);else if(e===k||e===V)throw h(e,'kill')
else this.emit('error',h(e,'kill'))}return false}ref(){var e
null==(e=this._handle)?void 0:e.ref()}unref(){var e
null==(e=this._handle)?void 0:e.unref()}}const P=e=>{const{stdio:t}=e
if(null==t)return
for(let e=0;e<t.length;e++){const i=t[e]
if(!i||!i.readable||i[T])continue
i.resume()}},U=e=>{if(e._closesGot++,e._closesGot===e._closesNeeded)e.emit('close',e.exitCode,e.signalCode)},G=(e,t)=>{const i=[]
switch(e){case'ignore':case'overlapped':case'pipe':i.push(e,e,e)
break
case'inherit':i.push(0,1,2)
break
default:throw new a('stdio',e)}if(t)i.push(t)
return i},L=(e,t)=>{let i,s
if('string'===typeof e)e=G(e)
else if(!Array.isArray(e))throw new a('stdio',e)
while(e.length<3)e.push(void 0)
return e=e.reduce(((e,n,l)=>{const d=()=>{for(let t=0;t<e.length;t++){const{type:i,handle:s}=e[t];('pipe'===i||'ipc'===i)&&(null==s?void 0:s.close())}}
if(null==n)n=l<3?'pipe':'ignore'
if('ignore'===n)e.push({type:'ignore'})
else if('pipe'===n||'overlapped'===n||'number'===typeof n&&n<0){const i={type:'overlapped'===n?'overlapped':'pipe',readable:0===l,writable:0!==l}
if(!t)i.handle=new A(A.SOCKET)
e.push(i)}else if('ipc'===n){if(t||void 0!==i)if(d(),!t)throw new o
else throw new r
i=new A(A.IPC),s=l,e.push({type:'pipe',handle:i,ipc:true})}else if('inherit'===n)e.push({type:'inherit',fd:l})
else if('number'===typeof n||'number'===typeof n.fd)e.push({type:'fd',fd:'number'===typeof n?n:n.fd})
else if(H(n)||H(n.handle)||H(n._handle)){const t=H(n)?n:H(n.handle)?n.handle:n._handle
e.push({type:'wrap',wrapType:H(t),handle:t,_stdio:n})}else if(ArrayBuffer.isView(n)||'string'===typeof n){if(!t)throw d(),new p(n.toString())}else throw d(),new a('stdio',n)
return e}),[]),{stdio:e,ipc:i,ipcFd:s}},j=(e,t)=>e._handle.onexit(t),D=e=>e.emit('spawn'),F=(e,t)=>{throw Error('createSocket not implemented')},H=e=>{if(e instanceof A)return'pipe'
return false}
let M
const z=()=>{if(void 0!==M)return M
M={}
for(const e in R)M[R[e]]=e
return M},K=e=>{if('number'===typeof e&&z()[e])return e
if('string'===typeof e){const t=R[e.toUpperCase()]
if(t)return t}throw new c(e)},Y=Object.freeze({}),B=/^(?:.*\\)?cmd(?:\.exe)?$/i,W=e=>e===(0|e),Z=(e,t,i)=>{if(_(e,'file'),0===e.length)throw new a('file',e,'cannot be empty')
if(Array.isArray(t))t=t.slice()
else if(null==t)t=[]
else if('object'!==typeof t)throw new l('args','object',t)
else i=t,t=[]
if(void 0===i)i=Y
else g(i,'options')
let s=i.cwd
if(null!=s)s=q(s,'options.cwd')
if(null!=i.detached)y(i.detached,'options.detached')
if(null!=i.uid&&!W(i.uid))throw new l('options.uid','int32',i.uid)
if(null!=i.gid&&!W(i.gid))throw new l('options.gid','int32',i.gid)
if(null!=i.shell&&'boolean'!==typeof i.shell&&'string'!==typeof i.shell)throw new l('options.shell',['boolean','string'],i.shell)
if(null!=i.argv0)_(i.argv0,'options.argv0')
if(null!=i.windowsHide)y(i.windowsHide,'options.windowsHide')
let{windowsVerbatimArguments:n}=i
if(null!=n)y(n,'options.windowsVerbatimArguments')
if(i.shell){const s=[e,...t].join(' ')
if('win32'===process.platform){if('string'===typeof i.shell)e=i.shell
else e=process.env.comspec||'cmd.exe'
if(B.test(e))t=['/d','/s','/c',`"${s}"`],n=true
else t=['-c',s]}else{if('string'===typeof i.shell)e=i.shell
else if('android'===process.platform)e='/system/bin/sh'
else e='/bin/sh'
t=['-c',s]}}if('string'===typeof i.argv0)t.unshift(i.argv0)
else t.unshift(e)
const o=i.env||process.env,r=[]
if(process.env.NODE_V8_COVERAGE&&!(i.env||{}).hasOwnProperty('NODE_V8_COVERAGE'))o.NODE_V8_COVERAGE=process.env.NODE_V8_COVERAGE
let d=[]
for(const e in o)d.push(e)
if('win32'===process.platform){const e=new Set
d=d.sort().filter((t=>{const i=t.toUpperCase()
if(e.has(i))return false
return e.add(i),true}))}for(const e of d){const t=o[e]
if(void 0!==t)r.push(`${e}=${t}`)}return{...i,args:t,cwd:s,detached:!!i.detached,envPairs:r,file:e,windowsHide:!!i.windowsHide,windowsVerbatimArguments:!!n}},q=(i,s='path')=>{const n=i instanceof e?t(i):i
if('string'!==typeof n)throw new l(s,['string','URL'],n)
return n},J=(e,t)=>{if(!e)return
try{if(e.kill(t))e.emit('error',new u)}catch(t){e.emit('error',t)}},Q=e=>{if(null!=e&&!(Number.isInteger(e)&&e>=0))throw new f('timeout','an unsigned integer',e)},X=e=>{if('string'===typeof e||'number'===typeof e)return K(e)
else if(null!=e)throw new l('options.killSignal',['string','number'],e)},ee=(e,t,i)=>{i=Z(e,t,i),Q(i.timeout),v(i.signal,'options.signal')
const s=X(i.killSignal),n=new x
if(n.spawn(i),i.timeout>0){let e=setTimeout((()=>{if(e){try{n.kill(s)}catch(e){n.emit('error',e)}e=null}}),i.timeout)
n.once('exit',(()=>{if(e)clearTimeout(e),e=null}))}if(i.signal){const{signal:e}=i,t=()=>J(n,s)
if(e.aborted)process.nextTick(t)
else e.addEventListener('abort',t,{once:true}),n.once('exit',(()=>e.removeEventListener('abort',t)))}return n}
export{x as ChildProcess,ee as spawn}
