import{EventEmitter as e}from'events'
import{performance as t}from'perf_hooks'
const s=(e,t,s)=>{if('string'===typeof s)return class extends t{code=e
message=s}
return class extends t{code=e
constructor(...e){super(),this.message=s(this,...e)}}},i=s('ERR_EVENT_RECURSION',Error,((e,t)=>`The event "${t}" is already being dispatched`)),r=s('ERR_INVALID_ARG_TYPE',Error,((e,t,s,i)=>`The ${t} argument must be of type ${s}. Received ${typeof i}`)),n=s('ERR_INVALID_THIS',TypeError,((e,t)=>`Value of "this" must be of type ${t}`)),o=s('ERR_MISSING_ARGS',TypeError,((e,...t)=>{const{length:s}=t
if(!s)return'assert: At least one arg needs to be specified'
let i='The '
const r=s,n=e=>`"${e}"`
switch(t=t.map((e=>Array.isArray(e)?e.map(n).join(' or '):n(e))),r){case 1:i+=`${t[0]} argument`
break
case 2:i+=`${t[0]} and ${t[1]} arguments`
break
default:i+=t.slice(0,r-1).join(', '),i+=`, and ${t[r-1]} arguments`
break}return`${i} must be specified`})),a=(e,t,s=void 0)=>{if(!(null!=s&&s.nullable)&&null===e||!(null!=s&&s.allowArray)&&Array.isArray(e)||'object'!==typeof e&&(!(null!=s&&s.allowFunction)||'function'!==typeof e))throw new r(t,'Object',e)},{now:l}=t,u=Symbol.for('nodejs.event_target'),c=Symbol('kEvents'),h=Symbol('kIsBeingDispatched'),d=Symbol('kStop'),p=Symbol('kTarget'),f=Symbol('kWeak'),v=Symbol.for('nodejs.internal.kHybridDispatch'),b=Symbol('kCreateEvent'),m=Symbol('kNewListener'),g=Symbol('kRemoveListener'),y=Symbol('kIsNodeStyleListener'),E=Symbol('kTrustEvent'),w=Symbol('type'),S=Symbol('events.maxEventTargetListeners'),T=Symbol('events.maxEventTargetListenersWarned'),_=new WeakSet,k=Object.getOwnPropertyDescriptor({get isTrusted(){return _.has(this)}},'isTrusted').get,x=Object.freeze({enumerable:true}),L={allowArray:true,allowFunction:true,nullable:true},P=e=>{if('string'!==typeof(null==e?void 0:e[w]))throw new n('Event')}
class A{_cancelable=false
_bubbles=false
_composed=false
_defaultPrevented=false
_timestamp=l()
_propagationStopped=false
constructor(e,t=null){if(0===arguments.length)throw new o('type')
a(t,'options',L)
const{cancelable:s,bubbles:i,composed:r}={...t}
if(this._cancelable=!!s,this._bubbles=!!i,this._composed=!!r,this[w]=`${e}`,null!=t&&t[E])_.add(this)
Object.defineProperty(this,'isTrusted',{get:k,enumerable:true,configurable:false}),this[p]=null,this[h]=false}stopImmediatePropagation(){P(this),this[d]=true}preventDefault(){P(this),this._defaultPrevented=true}get target(){return P(this),this[p]}get currentTarget(){return P(this),this[p]}get srcElement(){return P(this),this[p]}get type(){return P(this),this[w]}get cancelable(){return P(this),this._cancelable}get defaultPrevented(){return P(this),this._cancelable&&this._defaultPrevented}get timeStamp(){return P(this),this._timestamp}composedPath(){return P(this),this[h]?[this[p]]:[]}get returnValue(){return P(this),!this.defaultPrevented}get bubbles(){return P(this),this._bubbles}get composed(){return P(this),this._composed}get eventPhase(){return P(this),this[h]?A.AT_TARGET:A.NONE}get cancelBubble(){return P(this),this._propagationStopped}set cancelBubble(e){if(P(this),e)this.stopPropagation()}stopPropagation(){P(this),this._propagationStopped=true}static NONE=0
static CAPTURING_PHASE=1
static AT_TARGET=2
static BUBBLING_PHASE=3}Object.defineProperties(A.prototype,{[Symbol.toStringTag]:{writable:false,enumerable:false,configurable:true,value:'Event'},stopImmediatePropagation:x,preventDefault:x,target:x,currentTarget:x,srcElement:x,type:x,cancelable:x,defaultPrevented:x,timeStamp:x,composedPath:x,returnValue:x,bubbles:x,composed:x,eventPhase:x,cancelBubble:x,stopPropagation:x})
class N extends A{constructor(e,t){super(e,t),this.detail=null==t?void 0:t.detail}}class R{constructor(e,t,s,i,r,n,o){if(o)throw Error('weak not supported')
if(this.next=void 0,void 0!==e)e.next=this
if(this.previous=e,this.listener=t,this.once=s,this.capture=i,this.passive=r,this.isNodeStyleListener=n,this.removed=false,'function'===typeof t)this.callback=t,this.listener=t
else this.callback=t.handleEvent.bind(t),this.listener=t}same(e,t){const s=this.listener
return s===e&&this.capture===t}remove(){if(void 0!==this.previous)this.previous.next=this.next
if(void 0!==this.next)this.next.previous=this.previous
this.removed=true}}const $=e=>{var t
if(!(null!=e&&null!=(t=e.constructor)&&t[u]))throw new n('EventTarget')}
class I{static[u]=true;[c]=new Map;[S]=e.defaultMaxListeners;[T]=false;[m](e,t,s,i,r,n,o){if(this[S]>0&&e>this[S]&&!this[T]){this[T]=true
const s=new Error('Possible EventTarget memory leak detected. '+`${e} ${t} listeners `+`added to ${this.toString()}. Use `+'events.setMaxListeners() to increase limit')
s.name='MaxListenersExceededWarning',s.target=this,s.type=t,s.count=e,process.emitWarning(s)}}[g](e,t,s,i){}addEventListener(e,t,s={}){if($(this),arguments.length<2)throw new o('type','listener')
const{once:i,capture:r,passive:n,signal:a,isNodeStyleListener:l,weak:u}=B(s)
if(!j(t)){const s=new Error(`addEventListener called with ${t}`+' which has no effect.')
return s.name='AddEventListenerArgumentTypeWarning',s.target=this,s.type=e,process.emitWarning(s),void 0}if(e=String(e),a){if(a.aborted)return
a.addEventListener('abort',(()=>{this.removeEventListener(e,t,s)}),{once:true,[f]:this})}let h=this[c].get(e)
if(void 0===h)return h={size:1,next:void 0},new R(h,t,i,r,n,l,u),this[m](h.size,e,t,i,r,n,u),this[c].set(e,h),void 0
let d=h.next,p=h
while(void 0!==d&&!d.same(t,r))p=d,d=d.next
if(void 0!==d)return
new R(p,t,i,r,n,l,u),h.size++,this[m](h.size,e,t,i,r,n,u)}removeEventListener(e,t,s={}){if($(this),!j(t))return
e=String(e)
const i=true===(null==s?void 0:s.capture),r=this[c].get(e)
if(void 0===r||void 0===r.next)return
let n=r.next
while(void 0!==n){if(n.same(t,i)){if(n.remove(),r.size--,0===r.size)this[c].delete(e)
this[g](r.size,e,t,i)
break}n=n.next}}dispatchEvent(e){if($(this),!(e instanceof A))throw new r('event','Event',e)
if(e[h])throw new i(e.type)
return this[v](e,e.type,e),true!==e.defaultPrevented}[v](e,t,s){const i=()=>{if(void 0===s)s=this[b](e,t),s[p]=this,s[h]=true
return s}
if(void 0!==s)s[p]=this,s[h]=true
const r=this[c].get(t)
if(void 0===r||void 0===r.next){if(void 0!==s)s[h]=false
return true}let n=r.next,o
while(void 0!==n&&(n.passive||true!==(null==(a=s)?void 0:a[d]))){var a
if(o=n.next,n.removed){n=o
continue}if(n.once){n.remove(),r.size--
const{listener:e,capture:s}=n
this[g](r.size,t,e,s)}try{let t
if(n.isNodeStyleListener)t=e
else t=i()
const s=n.weak?n.callback.deref():n.callback
let r
if(s)if(r=s.call(this,t),!n.isNodeStyleListener)t[h]=false
if(void 0!==r&&null!==r){const{then:e}=r
if('function'===typeof e)e.call(promise,void 0,O)}}catch(e){O(e)}n=o}if(void 0!==s)s[h]=false}[b](e,t){return new N(t,{detail:e})}}function j(e){if('function'===typeof e||'function'===typeof(null==e?void 0:e.handleEvent))return true
if(null==e)return false
throw new r('listener','EventListener',e)}function B(e){if('boolean'===typeof e)return{capture:e}
if(null===e)return{}
return a(e,'options',{allowArray:true,allowFunction:true}),{once:Boolean(e.once),capture:Boolean(e.capture),passive:Boolean(e.passive),signal:e.signal,weak:e[f],isNodeStyleListener:Boolean(e[y])}}Object.defineProperties(I.prototype,{addEventListener:x,removeEventListener:x,dispatchEvent:x,[Symbol.toStringTag]:{writable:false,enumerable:false,configurable:true,value:'EventTarget'}})
const O=e=>process.nextTick((()=>{throw e}))
Object.assign(global,{Event:A,EventTarget:I})
const z={Event:A,EventTarget:I}
export{z as default}
