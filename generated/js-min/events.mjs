const e=(e,t,n)=>{if('string'===typeof n)return class extends t{code=e
message=n}
return class extends t{code=e
constructor(...e){super(),this.message=n(this,...e)}}},t=e('ERR_INVALID_ARG_TYPE',Error,((e,t,n,r)=>`The ${t} argument must be of type ${n}. Received ${typeof r}`)),n=e('ERR_MISSING_ARGS',TypeError,((e,...t)=>{const{length:n}=t
if(!n)return'assert: At least one arg needs to be specified'
let r='The '
const s=n,i=e=>`"${e}"`
switch(t=t.map((e=>Array.isArray(e)?e.map(i).join(' or '):i(e))),s){case 1:r+=`${t[0]} argument`
break
case 2:r+=`${t[0]} and ${t[1]} arguments`
break
default:r+=t.slice(0,s-1).join(', '),r+=`, and ${t[s-1]} arguments`
break}return`${r} must be specified`})),r=e('ERR_UNHANDLED_ERROR',Error,((e,t=void 0)=>{const n='Unhandled error.'
return void 0===t?n:`${n} (${t})`})),s=e('ERR_OUT_OF_RANGE',RangeError,((e,t,r,s,o=false)=>{if(!r)throw new n('range')
let f=o?t:`The value of "${t}" is out of range.`,l
if(Number.isInteger(s)&&Math.abs(s)>2**32)l=i(String(s))
else if('bigint'===typeof s){if(l=String(s),s>2n**32n||s<-(2n**32n))l=i(l)
l+='n'}else l=s
return f+=` It must be ${r}. Received ${l}`,f})),i=e=>{let t='',n=e.length
const r='-'===e[0]?1:0
for(;n>=r+4;n-=3)t=`_${e.slice(n-3,n)}${t}`
return`${e.slice(0,n)}${t}`},o=(e,n)=>{if('function'!==typeof e)throw new t(n,'Function',e)},f=(e,n)=>{if('boolean'!==typeof e)throw new t(n,'boolean',e)},l=Symbol('kCapture'),u=Symbol('events.errorMonitor'),a=Symbol.for('nodejs.rejection'),c=Object.freeze({})
let h=10
class v{static defaultMaxListeners=h;[l]=false;[a]=null
_events={}
_eventsCount=0
_maxListeners
constructor(e=void 0){const t=null==e?void 0:e.captureRejections
if(t)f(t,'options.captureRejections'),this[l]=Boolean(t)}addListener(e,t){return d(this,e,t,false)}emit(e,...t){let n='error'===e
const s=this._events
if(void 0!==s){if(n&&void 0!==s[u])this.emit(u,...t)
n=n&&void 0===s.error}else if(!n)return false
if(n){let e
if(t.length>0)e=t[0]
if(e instanceof Error)throw e
const n=new r(e)
throw n.context=e,n}const i=s[e]
if(void 0===i)return false
if('function'===typeof i){const n=i.apply(this,t)
if(void 0!==n&&null!==n)g(this,n,e,t)}else{const n=i.length,r=[...i]
for(let s=0;s<n;++s){const n=r[s].apply(this,t)
if(void 0!==n&&null!==n)g(this,n,e,t)}}return true}eventNames(){return Reflect.ownKeys(this._events||c)}getMaxListeners(){const{_maxListeners:e}=this
return void 0===e?v.defaultMaxListeners:e}listenerCount(e){var t
const n=null==(t=this._events)?void 0:t[e]
if('function'===typeof n)return 1
return(null==n?void 0:n.length)??0}listeners(e){return m(this,e,false)}off(e,t){return _(this,e,t)}on(e,t){return d(this,e,t,false)}once(e,t){return L(t),this.on(e,p(this,e,t))}prependListener(e,t){return d(this,e,t,true)}prependOnceListener(e,t){return L(t),this.prependListener(e,p(this,e,t))}removeAllListeners(e=void 0){const t=void 0===e,n=this._events
if(void 0===n)return this
if(!n.removeListener){if(t)this._events={},this._eventsCount=0
else if(n[e])if(0===--this._eventsCount)this._events={}
else delete n[e]
return this}if(t){for(const e of Reflect.ownKeys(n))if('removeListener'!==e)this.removeAllListeners(e)
return this.removeAllListeners('removeListener'),this._events={},this._eventsCount=0,this}const r=n[e]
if('function'===typeof r)this.removeListener(e,r)
else if(r)for(let t=r.length-1;t>=0;t--)this.removeListener(e,r[t])
return this}removeListener(e,t){return _(this,e,t)}setMaxListeners(e){if('number'!==typeof e||e<0||Number.isNaN(e))throw new s('n','a non-negative number',e)
return this._maxListeners=e,this}rawListeners(e){return m(this,e,false)}}const d=(e,t,n,r)=>{let s,i
if(L(n),s=e._events,!s)s=e._events={},e._eventsCount=0
else{if(s.newListener)e.emit('newListener',t,n.listener??n),s=e._events
i=s[t]}if(!i)s[t]=n,++e._eventsCount
else{if('function'===typeof i)i=s[t]=r?[n,i]:[i,n]
else if(r)i.unshift(n)
else i.push(n)
const o=e.getMaxListeners()
if(o>0&&i.length>o&&!i.warned)i.warned=true,process.emitWarning(`Possible EventEmitter memory leak detected. ${i.length} ${String(t)} listeners added to EventEmitter.`)}return e},m=(e,t,n)=>{var r
const s=null==(r=e._events)?void 0:r[t]
if(!s)return[]
if('function'===typeof s)return n?[s.listener||s]:[s]
return n?s.map((e=>e.listener||e)):[...s]},p=(e,t,n)=>{let r=false
const s=(...i)=>{if(!r)return e.removeListener(t,s),r=true,n.apply(e,i)}
return s},_=(e,t,n)=>{L(n)
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
if(r.removeListener)e.emit('removeListener',t,n)}return e},g=(e,t,n,r)=>{if(!e[l])return
try{const{then:s}=t
if('function'===typeof s)s.call(t,void 0,(t=>process.nextTick(y,e,t,n,r)))}catch(t){e.emit('error',t)}},y=(e,t,n,r)=>{if('function'===typeof e[a])e[a](t,n,...r)
else{const n=e[l]
try{e[l]=false,e.emit('error',t)}finally{e[l]=n}}},L=e=>o(e,'listener'),b=(e,t)=>{for(;t+1<e.length;t++)e[t]=e[t+1]
e.pop()}
export{v as EventEmitter,a as captureRejectionSymbol,v as default,u as errorMonitor}
