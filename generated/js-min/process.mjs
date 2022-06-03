import{EventEmitter as t}from'events'
const{native:e}=import.meta
class i extends t{env=e.env
argv=[...e.argv]
exitCode=0
_exiting=false
_nextTickQueue=[]
_microtaskQueue=[]
get debug(){return e.debug}get pid(){return e.pid}get platform(){return e.platform}get arch(){return e.arch}get version(){return e.version}get versions(){return[...e.versions]}get execPath(){return e.execPath}get argv0(){return e.argv0}nextTick(...t){r(t[0])&&this._nextTickQueue.push(t)}emitExit(t){t=t||this.exitCode
if(typeof t!=='number'){t=0}if(!this._exiting){this._exiting=true
if(t||t===0){this.exitCode=t}this.emit('exit',this.exitCode)}this.removeAllListeners()}exit(t){if(!this._exiting){try{this.emitExit(t)}catch(t){this.exitCode=1
this._onUncaughtException(t)}finally{e.doExit(this.exitCode)}}}cwd(){return e.cwd()}chdir(t){e.chdir(t)}hrtime(){return e.hrtime()}_onNextTick(){const t=this._nextTickQueue.slice(0)
this._nextTickQueue.length=0
let e
for(const i of t){try{if(i.length===1){i[0]()}else{e=i.shift()
e(...i)}}catch(t){this._onUncaughtException(t)}}const i=this._microtaskQueue.slice(0)
this._microtaskQueue.length=0
for(const t of i){try{t()}catch(t){this._onUncaughtException(t)}}return this._nextTickQueue.length>0||this._microtaskQueue.length>0}_queueMicrotask(t){r(t)&&this._microtaskQueue.push(t)}_onUncaughtException(t){const e='uncaughtException'
const i=this._events[e]
if((i?i.length:0)>0){try{this.emit(e,t)}catch(t){console.error('Uncaught:')
console.error(t)
this.exit(1)}}else{console.error(t)
this.exit(1)}}}const r=t=>{if(typeof t!=='function'){throw TypeError('bad argument: callback')}return true}
const s=new i
const n=t=>process._queueMicrotask(t)
global.process=s
global.queueMicrotask=n
export{s as default,s as process,n as queueMicrotask}
