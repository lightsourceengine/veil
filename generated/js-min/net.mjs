import e from'events'
import t from'stream'
import n from'util'
import{assert as i}from'assert'
import r from'tcp'
function o(){return new r}var s
if('nuttx'===process.platform)s=new Buffer('\\e\\n\\d')
function a(e){this.connecting=false,this.connected=false,this.writable=true,this.readable=true,this.destroyed=false,this.errored=false,this.allowHalfOpen=e&&e.allowHalfOpen||false}function l(e){if(!(this instanceof l))return new l(e)
if(void 0===e)e={}
if(t.Duplex.call(this,e),this._timer=null,this._timeout=0,this._socketState=new a(e),e.handle)this._handle=e.handle,this._handle.owner=this
this.on('finish',v),this.on('end',y)}function c(e,t,n){var i=function(t){var n=e._socketState
if(n.connecting=false,n.destroyed)return
if(0===t)_(e),e.emit('connect')
else e.destroy(),d(e,new Error('connect failed - status: '+r.errname(t)))},o=e._handle.connect(t,n,i)
if(o)d(e,new Error('connect failed - status: '+r.errname(o)))}function f(e){e._handle.owner=e,e._handle.onclose=function(){e.emit('close')}
var t=e._handle
if(e._handle=null,t.close(),e._server){var n=e._server
n._socketCount--,n._emitCloseIfDrained(),e._server=null}}function u(e){var t=e._socketState
if(!t.destroyed)h(e),e._timer=setTimeout((function(){e.emit('timeout'),h(e)}),e._timeout)}function h(e){if(e._timer)clearTimeout(e._timer),e._timer=null}function d(e,n){e.errored=true,t.Duplex.prototype.end.call(e,'',(function(){e.destroy()})),e._readyToWrite(),e.emit('error',n)}function p(e){var t=e._socketState
if(!t.connecting&&!t.writable&&!t.readable)e.destroy()}function _(e){var t=e._socketState
t.connecting=false,t.connected=true,u(e),e._readyToWrite(),process.nextTick((function(){e._handle.owner=e,e._handle.onread=m,e._handle.readStart()}))}function m(e,n,i,r){var o=e._socketState
if(u(e),i){if(t.Readable.prototype.push.call(e,null),0===e._readableState.length)o.readable=false,p(e)}else if(n<0){var a=new Error('read error: '+n)
t.Readable.prototype.error.call(e,a)}else if(n>0){if('nuttx'!==process.platform)return t.Readable.prototype.push.call(e,r),void 0
var l=6,c=r.length,f=false
if(c>=l&&0===s.compare(r.slice(c-l,c)))f=true,r=r.slice(0,c-l)
if(c===l&&f);else t.Readable.prototype.push.call(e,r)
if(f)m(e,0,true,null)}}function v(){var e=this,t=e._socketState
if(!t.readable||e._readableState.ended||!e._handle)return e.destroy()
else e._handle.shutdown((function(){if(e._readableState.ended)e.destroy()}))}function y(){var e=this._socketState
if(p(this),!e.allowHalfOpen)this.destroySoon()}function w(t,i){if(!(this instanceof w))return new w(t,i)
if(e.call(this),n.isFunction(t))i=t,t={}
else t=t||{}
if(n.isFunction(i))this.on('connection',i)
this._handle=null,this._socketCount=0,this.allowHalfOpen=t.allowHalfOpen||false}function k(e,t){var n=this.owner
if(e)return n.emit('error',new Error('accept error: '+r.errname(e))),void 0
var i=new l({handle:t,allowHalfOpen:n.allowHalfOpen})
i._server=n,_(i),n._socketCount++,n.emit('connection',i)}function b(e){var t={}
if(n.isObject(e[0]))t=e[0]
else{var i=0
if(t.port=e[i++],n.isString(e[i]))t.host=e[i++]
if(n.isNumber(e[i]))t.backlog=e[i++]}var r=e[e.length-1]
return n.isFunction(r)?[t,r]:[t]}function g(e){var t={}
if(n.isObject(e[0]))t=e[0]
else if(t.port=e[0],n.isString(e[1]))t.host=e[1]
var i=e[e.length-1]
return n.isFunction(i)?[t,i]:[t]}n.inherits(l,t.Duplex),l.prototype.connect=function(){var e=this,t=e._socketState,i=g(arguments),r=i[0],s=i[1]
if(t.connecting||t.connected)return e
if(!e._handle)e._handle=o(),e._handle.owner=e
if(n.isFunction(s))e.once('connect',s)
u(e),t.connecting=true
var a=require('dns'),l=r.host?r.host:'localhost',f=r.port,h={family:r.family>>>0,hints:0}
if(!n.isNumber(f)||f<0||f>65535)throw new RangeError('port should be >= 0 and < 65536: '+r.port)
if(0!==h.family&&4!==h.family&&6!==h.family)throw new RangeError('family should be 4 or 6: '+h.family)
return e._host=l,a.lookup(l,h,(function(t,n,i){if(e._socketState.destroyed)return
if(e.emit('lookup',t,n,i),t)process.nextTick((function(){e.emit('error',t),e.destroy()}))
else u(e),c(e,n,f)})),e},l.prototype.write=function(e,i){if(!n.isString(e)&&!n.isBuffer(e))throw new TypeError('invalid argument')
return t.Duplex.prototype.write.call(this,e,i)},l.prototype._write=function(e,t,r){i(n.isBuffer(e)),i(n.isFunction(r))
var o=this
if(o.errored){if(process.nextTick(r,1),n.isFunction(t))process.nextTick((function(e,n){t.call(e,n)}),o,1)}else u(o),o._handle.owner=o,o._handle.write(e,(function(e){if(r(e),n.isFunction(t))t.call(o,e)}))},l.prototype.end=function(e,n){var i=this,r=i._socketState
t.Writable.prototype.end.call(i,e,n),r.writable=false},l.prototype.destroy=function(){var e=this,t=e._socketState
if(t.destroyed)return
if(t.writable)e.end()
if(h(e),e._writableState.ended&&e._handle)f(e),t.destroyed=true
else e.once('finish',(function(){e.destroy()}))},l.prototype.destroySoon=function(){var e=this,t=e._socketState
if(t.writable)e.end()
if(e._writableState.finished)e.destroy()
else e.once('finish',e.destroy)},l.prototype.setKeepAlive=function(e,t){var n=this
if(e=+Boolean(e),n._handle&&n._handle.setKeepAlive)n._handle.setKeepAlive(e,~~(t/1e3))},l.prototype.address=function(){if(!this._handle||!this._handle.getsockname)return{}
if(!this._sockname){var e={},t=this._handle.getsockname(e)
if(t)return{}
this._sockname=e}return this._sockname},l.prototype.setTimeout=function(e,t){var n=this
if(n._timeout=e,h(n),0===e){if(t)n.removeListener('timeout',t)}else if(n._timer=setTimeout((function(){n.emit('timeout'),h(n)}),e),t)n.once('timeout',t)},n.inherits(w,e),w.prototype.listen=function(){var e=this,t=b(arguments),i=t[0],r=t[1],s=i.port,a=n.isString(i.host)?i.host:'0.0.0.0',l=n.isNumber(i.backlog)?i.backlog:511
if(!n.isNumber(s))throw new Error('invalid argument - need port number')
if(n.isFunction(r))e.once('listening',r)
if(!e._handle)e._handle=o()
var c=e._handle.bind(a,s)
if(c)return e._handle.close(),e.emit('error',c)
if(e._handle.onconnection=k,e._handle.createTCP=o,e._handle.owner=e,c=e._handle.listen(l),c)return e._handle.close(),e.emit('error',c)
return process.nextTick((function(){if(e._handle)e.emit('listening')})),this},w.prototype.address=function(){if(this._handle&&this._handle.getsockname){var e={}
return this._handle.getsockname(e),e}return null},w.prototype.close=function(e){if(n.isFunction(e))if(!this._handle)this.once('close',(function(){e(new Error('Not running'))}))
else this.once('close',e)
if(this._handle)this._handle.close(),this._handle=null
return this._emitCloseIfDrained(),this},w.prototype._emitCloseIfDrained=function(){var e=this
if(e._handle||e._socketCount>0)return
process.nextTick((function(){e.emit('close')}))}
const S=(e,t)=>new w(e,t),T=()=>{var e=g(arguments),t=new l(e[0])
return l.prototype.connect.apply(t,e)},x={createServer:S,createConnection:T,connect:T,Socket:l,Server:w}
export{w as Server,l as Socket,T as connect,T as createConnection,S as createServer,x as default}
