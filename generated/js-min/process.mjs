import{EventEmitter as e}from'events'
import{validateString as t}from'internal/validators'
import{codes as i}from'internal/errors'
const{ERR_INVALID_ARG_TYPE:r}=i,{native:n}=import.meta
class Process extends e{env=n.env
argv=[...n.argv]
exitCode=0
_exiting=false
_nextTickQueue=[]
_microtaskQueue=[]
get debug(){return n.debug}get pid(){return n.pid}get platform(){return n.platform}get arch(){return n.arch}get version(){return n.version}get versions(){return[...n.versions]}get execPath(){return n.execPath}get argv0(){return n.argv0}nextTick(...e){o(e[0])&&this._nextTickQueue.push(e)}emitExit(e){if(e=e||this.exitCode,'number'!==typeof e)e=0
if(!this._exiting){if(this._exiting=true,e||0===e)this.exitCode=e
this.emit('exit',this.exitCode)}this.removeAllListeners()}emitWarning(e,i,n,o){let c
if(null!==i&&'object'===typeof i&&!Array.isArray(i)){if(o=i.ctor,n=i.code,'string'===typeof i.detail)c=i.detail
i=i.type||'Warning'}else if('function'===typeof i)o=i,n=void 0,i='Warning'
if(void 0!==i)t(i,'type')
if('function'===typeof n)o=n,n=void 0
else if(void 0!==n)t(n,'code')
if('string'===typeof e)e=s(e,i,n,o,c)
else if(!(e instanceof Error))throw new r('warning',['Error','string'],e)
this.nextTick((()=>this.emit('warning',e)))}exit(e){if(!this._exiting)try{this.emitExit(e)}catch(e){this.exitCode=1,this._onUncaughtException(e)}finally{n.doExit(this.exitCode)}}cwd(){return n.cwd()}chdir(e){n.chdir(e)}hrtime(){return n.hrtime()}_onNextTick(){const e=this._nextTickQueue.slice(0)
let t
this._nextTickQueue.length=0
for(const i of e)try{if(1===i.length)i[0]()
else t=i.shift(),t(...i)}catch(e){this._onUncaughtException(e)}const i=this._microtaskQueue.slice(0)
this._microtaskQueue.length=0
for(const e of i)try{e()}catch(e){this._onUncaughtException(e)}return this._nextTickQueue.length>0||this._microtaskQueue.length>0}_queueMicrotask(e){o(e)&&this._microtaskQueue.push(e)}_onUncaughtException(e){const t='uncaughtException',i=this._events[t]
if((i?i.length:0)>0)try{this.emit(t,e)}catch(e){console.error('Uncaught:'),console.error(e),this.exit(1)}else console.error(e),this.exit(1)}}const o=e=>{if('function'!==typeof e)throw TypeError('bad argument: callback')
return true},s=(e,t,i,r,n)=>{if(e=new Error(e),e.name=String(t||'Warning'),void 0!==i)e.code=i
if(void 0!==n)e.detail=n
return e.captureStackTrace(r||process.emitWarning),e},c=new Process,a=e=>process._queueMicrotask(e)
global.process=c,global.queueMicrotask=a
export{c as default,c as process,a as queueMicrotask}
