import e from'events'
import{exceptionWithHostPort as t,errnoException as r}from'util'
import i from'udp'
import n from'dns'
var s=0,o=1,f=2
function h(e,t,r){return n.lookup(e,t,r)}function u(e,t){return h(e||'0.0.0.0',4,t)}function d(e){if('udp4'===e){var t=new i
return t.lookup=u,t}throw new Error('Bad socket type specified. Valid types are: udp4')}class Socket extends e{constructor(e,t){var r
let i
if(super(),null!==e&&'object'===typeof e)i=e,e=i.type
const n=d(e)
if(n.owner=this,this._handle=n,this._receiving=false,this._bindState=s,this.type=e,this.fd=null,this._reuseAddr=null==(r=i)?void 0:r.reuseAddr,'function'===typeof t)this.on('message',t)}bind(e,r,i){if(this._healthCheck(),this._bindState!==s)throw new Error('Socket is already bound')
if(this._bindState=o,'function'===typeof e)i=e,e=0,r=''
else if(null!==e&&'object'===typeof e)i=r,r=e.address||'',e=e.port
else if('function'===typeof r)i=r,r=''
if('function'===typeof i)this.once('listening',i)
if(!r&&this._handle.lookup===u)r='0.0.0.0'
return this._handle.lookup(r,((r,i)=>{if(r)return this._bindState=s,this.emit('error',r),void 0
if(!this._handle)return
if(this._handle._reuseAddr=this._reuseAddr,r=this._handle.bind(i,0|e),r){const n=t(r,'bind',i,e)
return this.emit('error',n),this._bindState=s,void 0}a(this)})),this}sendto(e,t,r,i,n,s){if('number'!==typeof t||'number'!==typeof r)throw new Error('send takes offset and length as args 2 and 3')
if('string'!==typeof n)throw new Error(this.type+' sockets must send to port, address')
this.send(e,t,r,i,n,s)}send(e,t,r,i,n,o){const h=this
let u
if(n||i&&'function'!==typeof i)e=l(e,t,r)
else o=i,i=t,n=r
if(!Array.isArray(e))if('string'===typeof e)u=[new Buffer(e)]
else if(!Buffer.isBuffer(e))throw new TypeError('First argument must be a buffer or a string')
else u=[e]
else if(!(u=p(e)))throw new TypeError('Buffer list arguments must be buffers or strings')
if(i|=0,0===i||i>65535)throw new RangeError('Port should be > 0 and < 65536')
if('function'!==typeof o)o=void 0
if(h._healthCheck(),h._bindState===s)h.bind(0,null)
if(0===u.length)u.push(new Buffer(0))
if(h._bindState!==f)return _(h,h.send.bind(h,u,i,n,o)),void 0
h._handle.lookup(n,((e,t)=>b(e,h,t,u,n,i,o)))}close(e){if('function'===typeof e)this.on('close',e)
if(this._queue)return this._queue.push(this.close.bind(this)),this
return this._healthCheck(),this._stopReceiving(),this._handle.close(),this._handle=null,process.nextTick((()=>this.emit('close'))),this}address(){this._healthCheck()
const e={},t=this._handle.getsockname(e)
if(t)throw r(t,'getsockname')
return e}setBroadcast(e){const t=this._handle.configure(w.BROADCAST,e?1:0)
if(t)throw r(t,'setBroadcast')}setTTL(e){if('number'!==typeof e)throw new TypeError('Argument must be a number')
const t=this._handle.configure(w.TTL,e)
if(t)throw r(t,'setTTL')
return e}setMulticastTTL=function(e){if('number'!==typeof e)throw new TypeError('Argument must be a number')
const t=this._handle.configure(w.MULTICASTTTL,e)
if(t)throw r(t,'setMulticastTTL')
return e}
setMulticastLoopback(e){const t=this._handle.configure(w.MULTICASTLOOPBACK,e?1:0)
if(t)throw r(t,'setMulticastLoopback')
return e}addMembership(e,t){if(this._healthCheck(),!e)throw new Error('multicast address must be specified')
const i=this._handle.addMembership(e,t)
if(i)throw r(i,'addMembership')}dropMembership(e,t){if(this._healthCheck(),!e)throw new Error('multicast address must be specified')
const i=this._handle.dropMembership(e,t)
if(i)throw r(i,'dropMembership')}_healthCheck(){if(!this._handle)throw new Error('Not running')}_stopReceiving(){if(!this._receiving)return
this._handle.recvStop(),this._receiving=false,this.fd=null}}const c=(e,t)=>new Socket(e,t)
function a(e){e._handle.onmessage=g,e._handle.recvStart(),e._receiving=true,e._bindState=f,e.fd=-42,e.emit('listening')}function l(e,t,r){if('string'===typeof e)e=new Buffer(e)
else if(!Buffer.isBuffer(e))throw new TypeError('First argument must be a buffer or string')
return t|=0,r|=0,e.slice(t,t+r)}function p(e){const{length:t}=e,r=new Array(t)
for(let i=0,n=t;i<n;i++){const t=e[i]
if('string'===typeof t)r[i]=new Buffer(t)
else if(!Buffer.isBuffer(t))return null
else r[i]=t}return r}function _(e,t){if(!e._queue)e._queue=[],e.once('listening',m)
e._queue.push(t)}function m(){const e=this._queue
this._queue=void 0
for(let t=0;t<e.length;t++)e[t]()}function b(e,r,i,n,s,o,f){if(e){if('function'===typeof f)return f(e),void 0
return r.emit('error',e),void 0}else if(!r._handle)return
var h=Buffer.concat(n),u=r._handle.send(h,o,i,(function(e,r){if(e)e=t(e,'send',s,o)
else e=null
if('function'===typeof f)f(e,r)}))
if(u&&f)e=t(u,'send',s,o),process.nextTick(f,e)}var w={BROADCAST:0,TTL:1,MULTICASTTTL:2,MULTICASTLOOPBACK:3}
function g(e,t,i,n){var s=t.owner
if(e<0)return s.emit('error',r(e,'recvmsg'))
n.size=i.length,s.emit('message',i,n)}const y={Socket,createSocket:c}
export{Socket,c as createSocket,y as default}
