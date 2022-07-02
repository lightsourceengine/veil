import{EventEmitter as e}from'events'
import{validateString as t}from'internal/validators'
import{errnoException as i,codes as r}from'internal/errors'
import n from'constants'
const{signals:o}=n.os,{Signal:s}=import.meta.native,c=new Map,a=e=>'string'===typeof e&&void 0!==o[e],u=(e,t)=>{if(a(e)&&!c.has(e)){const r=new s
r.unref(),r.onsignal=i=>{t.emit(e,i)}
const n=o[e],a=r.start(n)
if(a)throw r.close(),i(a,'uv_signal_start')
c.set(e,r)}},h=(e,t)=>{const i=c.get(e)
if(void 0!==i&&0===t.listenerCount(e))i.close(),c.delete(e)},{ERR_INVALID_ARG_TYPE:g}=r,{native:l}=import.meta
class Process extends e{env=l.env
argv=[...l.argv]
exitCode=0
_exiting=false
_nextTickQueue=[]
_microtaskQueue=[]
get debug(){return l.debug}get pid(){return l.pid}get platform(){return l.platform}get arch(){return l.arch}get version(){return l.version}get versions(){return[...l.versions]}get execPath(){return l.execPath}get argv0(){return l.argv0}nextTick(...e){f(e[0])&&this._nextTickQueue.push(e)}emitExit(e){if(e=e||this.exitCode,'number'!==typeof e)e=0
if(!this._exiting){if(this._exiting=true,e||0===e)this.exitCode=e
this.emit('exit',this.exitCode)}this.removeAllListeners()}emitWarning(e,i,r,n){let o
if(null!==i&&'object'===typeof i&&!Array.isArray(i)){if(n=i.ctor,r=i.code,'string'===typeof i.detail)o=i.detail
i=i.type||'Warning'}else if('function'===typeof i)n=i,r=void 0,i='Warning'
if(void 0!==i)t(i,'type')
if('function'===typeof r)n=r,r=void 0
else if(void 0!==r)t(r,'code')
if('string'===typeof e)e=p(e,i,r,n,o)
else if(!(e instanceof Error))throw new g('warning',['Error','string'],e)
this.nextTick((()=>this.emit('warning',e)))}exit(e){if(!this._exiting)try{this.emitExit(e)}catch(e){this.exitCode=1,this._onUncaughtException(e)}finally{l.doExit(this.exitCode)}}cwd(){return l.cwd()}chdir(e){l.chdir(e)}hrtime(){return l.hrtime()}_onNextTick(){const e=this._nextTickQueue.slice(0)
let t
this._nextTickQueue.length=0
for(const i of e)try{if(1===i.length)i[0]()
else t=i.shift(),t(...i)}catch(e){this._onUncaughtException(e)}const i=this._microtaskQueue.slice(0)
this._microtaskQueue.length=0
for(const e of i)try{e()}catch(e){this._onUncaughtException(e)}return this._nextTickQueue.length>0||this._microtaskQueue.length>0}_queueMicrotask(e){f(e)&&this._microtaskQueue.push(e)}_onUncaughtException(e){const t='uncaughtException',i=this._events[t]
if((i?i.length:0)>0)try{this.emit(t,e)}catch(e){console.error('Uncaught:'),console.error(e),this.exit(1)}else console.error(e),this.exit(1)}}const f=e=>{if('function'!==typeof e)throw TypeError('bad argument: callback')
return true},p=(e,t,i,r,n)=>{if(e=new Error(e),e.name=String(t||'Warning'),void 0!==i)e.code=i
if(void 0!==n)e.detail=n
return e.captureStackTrace(r||process.emitWarning),e},d=new Process,m=e=>process._queueMicrotask(e)
d.on('newListener',(e=>u(e,d))),d.on('removeListener',(e=>h(e,d))),global.process=d,global.queueMicrotask=m
export{d as default,d as process,m as queueMicrotask}
