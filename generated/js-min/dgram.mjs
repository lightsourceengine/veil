import e from'events'
import t from'util'
import r from'udp'
import i from'dns'
var n=0,o=1,s=2
function u(e,t,r){return i.lookup(e,t,r)}function h(e,t){return u(e||'0.0.0.0',4,t)}function f(e){if('udp4'===e){var t=new r
return t.lookup=h,t}throw new Error('Bad socket type specified. Valid types are: udp4')}function a(r,i){e.call(this)
var o=void 0
if(t.isObject(r))o=r,r=o.type
var s=f(r)
if(s.owner=this,this._handle=s,this._receiving=false,this._bindState=n,this.type=r,this.fd=null,this._reuseAddr=o&&o.reuseAddr,t.isFunction(i))this.on('message',i)}t.inherits(a,e)
const c=(e,t)=>new a(e,t)
function d(e){e._handle.onmessage=g,e._handle.recvStart(),e._receiving=true,e._bindState=s,e.fd=-42,e.emit('listening')}function l(e,r,i){if(t.isString(e))e=new Buffer(e)
else if(!t.isBuffer(e))throw new TypeError('First argument must be a buffer or string')
return r>>>=0,i>>>=0,e.slice(r,r+i)}function p(e){for(var r=new Array(e.length),i=0,n=e.length;i<n;i++){var o=e[i]
if(t.isString(o))r[i]=new Buffer(o)
else if(!t.isBuffer(o))return null
else r[i]=o}return r}function _(e,t){if(!e._queue)e._queue=[],e.once('listening',m)
e._queue.push(t)}function m(){var e=this._queue
this._queue=void 0
for(var t=0;t<e.length;t++)e[t]()}function b(e,r,i,n,o,s,u){if(e){if(t.isFunction(u))return u(e),void 0
return r.emit('error',e),void 0}else if(!r._handle)return
var h=Buffer.concat(n),f=r._handle.send(h,s,i,(function(e,r){if(e)e=t.exceptionWithHostPort(e,'send',o,s)
else e=null
if(t.isFunction(u))u(e,r)}))
if(f&&u)e=t.exceptionWithHostPort(f,'send',o,s),process.nextTick(u,e)}a.prototype.bind=function(e,r,i){var s=this
if(s._healthCheck(),this._bindState!==n)throw new Error('Socket is already bound')
if(this._bindState=o,t.isFunction(e))i=e,e=0,r=''
else if(t.isObject(e))i=r,r=e.address||'',e=e.port
else if(t.isFunction(r))i=r,r=''
if(t.isFunction(i))s.once('listening',i)
if(!r&&s._handle.lookup===h)r='0.0.0.0'
return s._handle.lookup(r,(function(r,i){if(r)return s._bindState=n,s.emit('error',r),void 0
if(!s._handle)return
if(s._handle._reuseAddr=s._reuseAddr,r=s._handle.bind(i,0|e),r){var o=t.exceptionWithHostPort(r,'bind',i,e)
return s.emit('error',o),s._bindState=n,void 0}d(s)})),s},a.prototype.sendto=function(e,r,i,n,o,s){if(!t.isNumber(r)||!t.isNumber(i))throw new Error('send takes offset and length as args 2 and 3')
if(!t.isString(o))throw new Error(this.type+' sockets must send to port, address')
this.send(e,r,i,n,o,s)},a.prototype.send=function(e,r,i,o,u,h){var f=this,a
if(u||o&&!t.isFunction(o))e=l(e,r,i)
else h=o,o=r,u=i
if(!t.isArray(e))if(t.isString(e))a=[new Buffer(e)]
else if(!t.isBuffer(e))throw new TypeError('First argument must be a buffer or a string')
else a=[e]
else if(!(a=p(e)))throw new TypeError('Buffer list arguments must be buffers or strings')
if(o>>>=0,0===o||o>65535)throw new RangeError('Port should be > 0 and < 65536')
if(!t.isFunction(h))h=void 0
if(f._healthCheck(),f._bindState===n)f.bind(0,null)
if(0===a.length)a.push(new Buffer(0))
if(f._bindState!==s)return _(f,f.send.bind(f,a,o,u,h)),void 0
f._handle.lookup(u,(function e(t,r){b(t,f,r,a,u,o,h)}))},a.prototype.close=function(e){if(t.isFunction(e))this.on('close',e)
if(this._queue)return this._queue.push(this.close.bind(this)),this
this._healthCheck(),this._stopReceiving(),this._handle.close(),this._handle=null
var r=this
return process.nextTick((function(){r.emit('close')})),this},a.prototype.address=function(){this._healthCheck()
var e={},r=this._handle.getsockname(e)
if(r)throw t.errnoException(r,'getsockname')
return e}
var w={BROADCAST:0,TTL:1,MULTICASTTTL:2,MULTICASTLOOPBACK:3}
function g(e,r,i,n){var o=r.owner
if(e<0)return o.emit('error',t.errnoException(e,'recvmsg'))
n.size=i.length,o.emit('message',i,n)}a.prototype.setBroadcast=function(e){var r=this._handle.configure(w.BROADCAST,e?1:0)
if(r)throw t.errnoException(r,'setBroadcast')},a.prototype.setTTL=function(e){if(!t.isNumber(e))throw new TypeError('Argument must be a number')
var r=this._handle.configure(w.TTL,e)
if(r)throw t.errnoException(r,'setTTL')
return e},a.prototype.setMulticastTTL=function(e){if(!t.isNumber(e))throw new TypeError('Argument must be a number')
var r=this._handle.configure(w.MULTICASTTTL,e)
if(r)throw t.errnoException(r,'setMulticastTTL')
return e},a.prototype.setMulticastLoopback=function(e){var r=this._handle.configure(w.MULTICASTLOOPBACK,e?1:0)
if(r)throw t.errnoException(r,'setMulticastLoopback')
return e},a.prototype.addMembership=function(e,r){if(this._healthCheck(),!e)throw new Error('multicast address must be specified')
var i=this._handle.addMembership(e,r)
if(i)throw t.errnoException(i,'addMembership')},a.prototype.dropMembership=function(e,r){if(this._healthCheck(),!e)throw new Error('multicast address must be specified')
var i=this._handle.dropMembership(e,r)
if(i)throw t.errnoException(i,'dropMembership')},a.prototype._healthCheck=function(){if(!this._handle)throw new Error('Not running')},a.prototype._stopReceiving=function(){if(!this._receiving)return
this._handle.recvStop(),this._receiving=false,this.fd=null}
const v={Socket:a,createSocket:c}
export{a as Socket,c as createSocket,v as default}
