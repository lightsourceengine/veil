import{EventEmitter as e}from'events'
const{native:t}=import.meta
class i extends e{env=t.env
argv=[...t.argv]
exitCode=0
_exiting=false
_nextTickQueue=[]
_microtaskQueue=[]
get debug(){return t.debug}get pid(){return t.pid}get platform(){return t.platform}get arch(){return t.arch}get version(){return t.version}get versions(){return[...t.versions]}get execPath(){return t.execPath}get argv0(){return t.argv0}nextTick(...e){r(e[0])&&this._nextTickQueue.push(e)}emitExit(e){if(e=e||this.exitCode,'number'!==typeof e)e=0
if(!this._exiting){if(this._exiting=true,e||0===e)this.exitCode=e
this.emit('exit',this.exitCode)}this.removeAllListeners()}emitWarning(e){if(console.warn(e),!this._exiting)this.emit('warn',e)}exit(e){if(!this._exiting)try{this.emitExit(e)}catch(e){this.exitCode=1,this._onUncaughtException(e)}finally{t.doExit(this.exitCode)}}cwd(){return t.cwd()}chdir(e){t.chdir(e)}hrtime(){return t.hrtime()}_onNextTick(){const e=this._nextTickQueue.slice(0)
let t
this._nextTickQueue.length=0
for(const i of e)try{if(1===i.length)i[0]()
else t=i.shift(),t(...i)}catch(e){this._onUncaughtException(e)}const i=this._microtaskQueue.slice(0)
this._microtaskQueue.length=0
for(const e of i)try{e()}catch(e){this._onUncaughtException(e)}return this._nextTickQueue.length>0||this._microtaskQueue.length>0}_queueMicrotask(e){r(e)&&this._microtaskQueue.push(e)}_onUncaughtException(e){const t='uncaughtException',i=this._events[t]
if((i?i.length:0)>0)try{this.emit(t,e)}catch(e){console.error('Uncaught:'),console.error(e),this.exit(1)}else console.error(e),this.exit(1)}}const r=e=>{if('function'!==typeof e)throw TypeError('bad argument: callback')
return true},n=new i,s=e=>process._queueMicrotask(e)
global.process=n,global.queueMicrotask=s
export{n as default,n as process,s as queueMicrotask}
