import{validateBoolean as e,validateFunction as t}from'internal/validators'
import{codes as n}from'internal/errors'
const{ERR_UNHANDLED_ERROR:r,ERR_OUT_OF_RANGE:s,ERR_INVALID_ARG_TYPE:i}=n,o=Symbol('kCapture'),l=Symbol('events.errorMonitor'),f=Symbol.for('nodejs.rejection'),u=Symbol.for('nodejs.event_target'),v=Symbol('events.maxEventTargetListeners'),a=Symbol('events.maxEventTargetListenersWarned'),c=Object.freeze({})
let h=10
const m=e=>{var t
return null==e?void 0:null==(t=e.constructor)?void 0:t[u]}
class EventEmitter{static defaultMaxListeners=h;[o]=false;[f]=null
_events={}
_eventsCount=0
_maxListeners
constructor(t=void 0){const n=null==t?void 0:t.captureRejections
if(n)e(n,'options.captureRejections'),this[o]=Boolean(n)}static setMaxListeners(e=h,...t){if('number'!==typeof e||e<0||Number.isNaN(e))throw new s('n','a non-negative number',e)
if(0===t.length)h=e
else for(let n=0;n<t.length;n++){const r=t[n]
if(m(r))r[v]=e,r[a]=false
else if('function'===typeof r.setMaxListeners)r.setMaxListeners(e)
else throw new i('eventTargets',['EventEmitter','EventTarget'],r)}}addListener(e,t){return d(this,e,t,false)}emit(e,...t){let n='error'===e
const s=this._events
if(void 0!==s){if(n&&void 0!==s[l])this.emit(l,...t)
n=n&&void 0===s.error}else if(!n)return false
if(n){let e
if(t.length>0)e=t[0]
if(e instanceof Error)throw e
const n=new r(e)
throw n.context=e,n}const i=s[e]
if(void 0===i)return false
if('function'===typeof i){const n=i.apply(this,t)
if(void 0!==n&&null!==n)y(this,n,e,t)}else{const n=i.length,r=[...i]
for(let s=0;s<n;++s){const n=r[s].apply(this,t)
if(void 0!==n&&null!==n)y(this,n,e,t)}}return true}eventNames(){return Reflect.ownKeys(this._events||c)}getMaxListeners(){const{_maxListeners:e}=this
return void 0===e?EventEmitter.defaultMaxListeners:e}listenerCount(e){var t
const n=null==(t=this._events)?void 0:t[e]
if('function'===typeof n)return 1
return(null==n?void 0:n.length)??0}listeners(e){return p(this,e,false)}off(e,t){return _(this,e,t)}on(e,t){return d(this,e,t,false)}once(e,t){return g(t),this.on(e,L(this,e,t))}prependListener(e,t){return d(this,e,t,true)}prependOnceListener(e,t){return g(t),this.prependListener(e,L(this,e,t))}removeAllListeners(e=void 0){const t=void 0===e,n=this._events
if(void 0===n)return this
if(!n.removeListener){if(t)this._events={},this._eventsCount=0
else if(n[e])if(0===--this._eventsCount)this._events={}
else delete n[e]
return this}if(t){for(const e of Reflect.ownKeys(n))if('removeListener'!==e)this.removeAllListeners(e)
return this.removeAllListeners('removeListener'),this._events={},this._eventsCount=0,this}const r=n[e]
if('function'===typeof r)this.removeListener(e,r)
else if(r)for(let t=r.length-1;t>=0;t--)this.removeListener(e,r[t])
return this}removeListener(e,t){return _(this,e,t)}setMaxListeners(e){if('number'!==typeof e||e<0||Number.isNaN(e))throw new s('n','a non-negative number',e)
return this._maxListeners=e,this}rawListeners(e){return p(this,e,false)}}const d=(e,t,n,r)=>{let s,i
if(g(n),s=e._events,!s)s=e._events={},e._eventsCount=0
else{if(s.newListener)e.emit('newListener',t,n.listener??n),s=e._events
i=s[t]}if(!i)s[t]=n,++e._eventsCount
else{if('function'===typeof i)i=s[t]=r?[n,i]:[i,n]
else if(r)i.unshift(n)
else i.push(n)
const o=e.getMaxListeners()
if(o>0&&i.length>o&&!i.warned)i.warned=true,process.emitWarning(`Possible EventEmitter memory leak detected. ${i.length} ${String(t)} listeners added to EventEmitter.`)}return e},p=(e,t,n)=>{var r
const s=null==(r=e._events)?void 0:r[t]
if(!s)return[]
if('function'===typeof s)return n?[s.listener||s]:[s]
return n?s.map((e=>e.listener||e)):[...s]},L=(e,t,n)=>{let r=false
const s=(...i)=>{if(!r)return e.removeListener(t,s),r=true,n.apply(e,i)}
return s},_=(e,t,n)=>{g(n)
const r=e._events
if(void 0===r)return e
const s=r[t]
if(void 0===s)return e
if(s===n||s.listener===n){if(0===--e._eventsCount)e._events={}
else if(delete r[t],r.removeListener)e.emit('removeListener',t,s.listener||n)}else if('function'!==typeof s){let i=-1
for(let e=s.length-1;e>=0;e--)if(s[e]===n||s[e].listener===n){i=e
break}if(i<0)return e
if(0===i)s.shift()
else b(s,i)
if(1===s.length)r[t]=s[0]
if(r.removeListener)e.emit('removeListener',t,n)}return e},y=(e,t,n,r)=>{if(!e[o])return
try{const{then:s}=t
if('function'===typeof s)s.call(t,void 0,(t=>process.nextTick(E,e,t,n,r)))}catch(t){e.emit('error',t)}},E=(e,t,n,r)=>{if('function'===typeof e[f])e[f](t,n,...r)
else{const n=e[o]
try{e[o]=false,e.emit('error',t)}finally{e[o]=n}}},g=e=>t(e,'listener'),b=(e,t)=>{for(;t+1<e.length;t++)e[t]=e[t+1]
e.pop()}
export{EventEmitter,f as captureRejectionSymbol,EventEmitter as default,l as errorMonitor}
