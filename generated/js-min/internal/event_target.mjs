import{EventEmitter as e}from'events'
import{performance as t}from'perf_hooks'
import{validateObject as i}from'internal/validators'
import{codes as s}from'internal/errors'
const{ERR_INVALID_ARG_TYPE:n,ERR_EVENT_RECURSION:r,ERR_MISSING_ARGS:o,ERR_INVALID_THIS:a}=s,{now:l}=t,u=Symbol.for('nodejs.event_target'),h=Symbol('kEvents'),c=Symbol('kIsBeingDispatched'),d=Symbol('kStop'),v=Symbol('kTarget'),p=Symbol('kWeak'),f=Symbol.for('nodejs.internal.kHybridDispatch'),m=Symbol('kCreateEvent'),b=Symbol('kNewListener'),g=Symbol('kRemoveListener'),E=Symbol('kIsNodeStyleListener'),y=Symbol('kTrustEvent'),S=Symbol('type'),w=Symbol('events.maxEventTargetListeners'),_=Symbol('events.maxEventTargetListenersWarned'),T=new WeakSet,L=Object.getOwnPropertyDescriptor({get isTrusted(){return T.has(this)}},'isTrusted').get,k=Object.freeze({enumerable:true}),P={allowArray:true,allowFunction:true,nullable:true},x=e=>{if('string'!==typeof(null==e?void 0:e[S]))throw new a('Event')}
class Event{_cancelable=false
_bubbles=false
_composed=false
_defaultPrevented=false
_timestamp=l()
_propagationStopped=false
constructor(e,t=null){if(0===arguments.length)throw new o('type')
i(t,'options',P)
const{cancelable:s,bubbles:n,composed:r}={...t}
if(this._cancelable=!!s,this._bubbles=!!n,this._composed=!!r,this[S]=`${e}`,null!=t&&t[y])T.add(this)
Object.defineProperty(this,'isTrusted',{get:L,enumerable:true,configurable:false}),this[v]=null,this[c]=false}stopImmediatePropagation(){x(this),this[d]=true}preventDefault(){x(this),this._defaultPrevented=true}get target(){return x(this),this[v]}get currentTarget(){return x(this),this[v]}get srcElement(){return x(this),this[v]}get type(){return x(this),this[S]}get cancelable(){return x(this),this._cancelable}get defaultPrevented(){return x(this),this._cancelable&&this._defaultPrevented}get timeStamp(){return x(this),this._timestamp}composedPath(){return x(this),this[c]?[this[v]]:[]}get returnValue(){return x(this),!this.defaultPrevented}get bubbles(){return x(this),this._bubbles}get composed(){return x(this),this._composed}get eventPhase(){return x(this),this[c]?Event.AT_TARGET:Event.NONE}get cancelBubble(){return x(this),this._propagationStopped}set cancelBubble(e){if(x(this),e)this.stopPropagation()}stopPropagation(){x(this),this._propagationStopped=true}static NONE=0
static CAPTURING_PHASE=1
static AT_TARGET=2
static BUBBLING_PHASE=3}Object.defineProperties(Event.prototype,{[Symbol.toStringTag]:{writable:false,enumerable:false,configurable:true,value:'Event'},stopImmediatePropagation:k,preventDefault:k,target:k,currentTarget:k,srcElement:k,type:k,cancelable:k,defaultPrevented:k,timeStamp:k,composedPath:k,returnValue:k,bubbles:k,composed:k,eventPhase:k,cancelBubble:k,stopPropagation:k})
class NodeCustomEvent extends Event{constructor(e,t){super(e,t),this.detail=null==t?void 0:t.detail}}class Listener{constructor(e,t,i,s,n,r,o){if(o)throw Error('weak not supported')
if(this.next=void 0,void 0!==e)e.next=this
if(this.previous=e,this.listener=t,this.once=i,this.capture=s,this.passive=n,this.isNodeStyleListener=r,this.removed=false,'function'===typeof t)this.callback=t,this.listener=t
else this.callback=t.handleEvent.bind(t),this.listener=t}same(e,t){const i=this.listener
return i===e&&this.capture===t}remove(){if(void 0!==this.previous)this.previous.next=this.next
if(void 0!==this.next)this.next.previous=this.previous
this.removed=true}}const N=e=>{var t
if(!(null!=e&&null!=(t=e.constructor)&&t[u]))throw new a('EventTarget')}
class EventTarget{static[u]=true;[h]=new Map;[w]=e.defaultMaxListeners;[_]=false;[b](e,t,i,s,n,r,o){if(this[w]>0&&e>this[w]&&!this[_]){this[_]=true
const i=new Error('Possible EventTarget memory leak detected. '+`${e} ${t} listeners `+`added to ${this.toString()}. Use `+'events.setMaxListeners() to increase limit')
i.name='MaxListenersExceededWarning',i.target=this,i.type=t,i.count=e,process.emitWarning(i)}}[g](e,t,i,s){}addEventListener(e,t,i={}){if(N(this),arguments.length<2)throw new o('type','listener')
const{once:s,capture:n,passive:r,signal:a,isNodeStyleListener:l,weak:u}=A(i)
if(!R(t)){const i=new Error(`addEventListener called with ${t}`+' which has no effect.')
return i.name='AddEventListenerArgumentTypeWarning',i.target=this,i.type=e,process.emitWarning(i),void 0}if(e=String(e),a){if(a.aborted)return
a.addEventListener('abort',(()=>{this.removeEventListener(e,t,i)}),{once:true,[p]:this})}let c=this[h].get(e)
if(void 0===c)return c={size:1,next:void 0},new Listener(c,t,s,n,r,l,u),this[b](c.size,e,t,s,n,r,u),this[h].set(e,c),void 0
let d=c.next,v=c
while(void 0!==d&&!d.same(t,n))v=d,d=d.next
if(void 0!==d)return
new Listener(v,t,s,n,r,l,u),c.size++,this[b](c.size,e,t,s,n,r,u)}removeEventListener(e,t,i={}){if(N(this),!R(t))return
e=String(e)
const s=true===(null==i?void 0:i.capture),n=this[h].get(e)
if(void 0===n||void 0===n.next)return
let r=n.next
while(void 0!==r){if(r.same(t,s)){if(r.remove(),n.size--,0===n.size)this[h].delete(e)
this[g](n.size,e,t,s)
break}r=r.next}}dispatchEvent(e){if(N(this),!(e instanceof Event))throw new n('event','Event',e)
if(e[c])throw new r(e.type)
return this[f](e,e.type,e),true!==e.defaultPrevented}[f](e,t,i){const s=()=>{if(void 0===i)i=this[m](e,t),i[v]=this,i[c]=true
return i}
if(void 0!==i)i[v]=this,i[c]=true
const n=this[h].get(t)
if(void 0===n||void 0===n.next){if(void 0!==i)i[c]=false
return true}let r=n.next,o
while(void 0!==r&&(r.passive||true!==(null==(a=i)?void 0:a[d]))){var a
if(o=r.next,r.removed){r=o
continue}if(r.once){r.remove(),n.size--
const{listener:e,capture:i}=r
this[g](n.size,t,e,i)}try{let t
if(r.isNodeStyleListener)t=e
else t=s()
const i=r.weak?r.callback.deref():r.callback
let n
if(i)if(n=i.call(this,t),!r.isNodeStyleListener)t[c]=false
if(void 0!==n&&null!==n){const{then:e}=n
if('function'===typeof e)e.call(promise,void 0,I)}}catch(e){I(e)}r=o}if(void 0!==i)i[c]=false}[m](e,t){return new NodeCustomEvent(t,{detail:e})}}function R(e){if('function'===typeof e||'function'===typeof(null==e?void 0:e.handleEvent))return true
if(null==e)return false
throw new n('listener','EventListener',e)}function A(e){if('boolean'===typeof e)return{capture:e}
if(null===e)return{}
return i(e,'options',{allowArray:true,allowFunction:true}),{once:Boolean(e.once),capture:Boolean(e.capture),passive:Boolean(e.passive),signal:e.signal,weak:e[p],isNodeStyleListener:Boolean(e[E])}}Object.defineProperties(EventTarget.prototype,{addEventListener:k,removeEventListener:k,dispatchEvent:k,[Symbol.toStringTag]:{writable:false,enumerable:false,configurable:true,value:'EventTarget'}})
const I=e=>process.nextTick((()=>{throw e}))
Object.assign(global,{Event,EventTarget})
const B={Event,EventTarget}
export{B as default}
