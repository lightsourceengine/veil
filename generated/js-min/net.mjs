import e from'events'
import t from'stream'
import n from'util'
import{assert as r}from'assert'
import i from'tcp'
function o(){return new i}var a
if(process.platform==='nuttx'){a=new Buffer('\\e\\n\\d')}function s(e){this.connecting=false
this.connected=false
this.writable=true
this.readable=true
this.destroyed=false
this.errored=false
this.allowHalfOpen=e&&e.allowHalfOpen||false}function l(e){if(!(this instanceof l)){return new l(e)}if(e===undefined){e={}}t.Duplex.call(this,e)
this._timer=null
this._timeout=0
this._socketState=new s(e)
if(e.handle){this._handle=e.handle
this._handle.owner=this}this.on('finish',v)
this.on('end',y)}n.inherits(l,t.Duplex)
l.prototype.connect=function(){var e=this
var t=e._socketState
var r=g(arguments)
var i=r[0]
var a=r[1]
if(t.connecting||t.connected){return e}if(!e._handle){e._handle=o()
e._handle.owner=e}if(n.isFunction(a)){e.once('connect',a)}u(e)
t.connecting=true
var s=require('dns')
var l=i.host?i.host:'localhost'
var f=i.port
var h={family:i.family>>>0,hints:0}
if(!n.isNumber(f)||f<0||f>65535)throw new RangeError('port should be >= 0 and < 65536: '+i.port)
if(h.family!==0&&h.family!==4&&h.family!==6)throw new RangeError('family should be 4 or 6: '+h.family)
e._host=l
s.lookup(l,h,(function(t,n,r){if(e._socketState.destroyed){return}e.emit('lookup',t,n,r)
if(t){process.nextTick((function(){e.emit('error',t)
e.destroy()}))}else{u(e)
c(e,n,f)}}))
return e}
l.prototype.write=function(e,r){if(!n.isString(e)&&!n.isBuffer(e)){throw new TypeError('invalid argument')}return t.Duplex.prototype.write.call(this,e,r)}
l.prototype._write=function(e,t,i){r(n.isBuffer(e))
r(n.isFunction(i))
var o=this
if(o.errored){process.nextTick(i,1)
if(n.isFunction(t)){process.nextTick((function(e,n){t.call(e,n)}),o,1)}}else{u(o)
o._handle.owner=o
o._handle.write(e,(function(e){i(e)
if(n.isFunction(t)){t.call(o,e)}}))}}
l.prototype.end=function(e,n){var r=this
var i=r._socketState
t.Writable.prototype.end.call(r,e,n)
i.writable=false}
l.prototype.destroy=function(){var e=this
var t=e._socketState
if(t.destroyed){return}if(t.writable){e.end()}h(e)
if(e._writableState.ended&&e._handle){f(e)
t.destroyed=true}else{e.once('finish',(function(){e.destroy()}))}}
l.prototype.destroySoon=function(){var e=this
var t=e._socketState
if(t.writable){e.end()}if(e._writableState.finished){e.destroy()}else{e.once('finish',e.destroy)}}
l.prototype.setKeepAlive=function(e,t){var n=this
e=+Boolean(e)
if(n._handle&&n._handle.setKeepAlive){n._handle.setKeepAlive(e,~~(t/1e3))}}
l.prototype.address=function(){if(!this._handle||!this._handle.getsockname){return{}}if(!this._sockname){var e={}
var t=this._handle.getsockname(e)
if(t)return{}
this._sockname=e}return this._sockname}
l.prototype.setTimeout=function(e,t){var n=this
n._timeout=e
h(n)
if(e===0){if(t){n.removeListener('timeout',t)}}else{n._timer=setTimeout((function(){n.emit('timeout')
h(n)}),e)
if(t){n.once('timeout',t)}}}
function c(e,t,n){var r=function(t){var n=e._socketState
n.connecting=false
if(n.destroyed){return}if(t===0){_(e)
e.emit('connect')}else{e.destroy()
d(e,new Error('connect failed - status: '+i.errname(t)))}}
var o=e._handle.connect(t,n,r)
if(o){d(e,new Error('connect failed - status: '+i.errname(o)))}}function f(e){e._handle.owner=e
e._handle.onclose=function(){e.emit('close')}
var t=e._handle
e._handle=null
t.close()
if(e._server){var n=e._server
n._socketCount--
n._emitCloseIfDrained()
e._server=null}}function u(e){var t=e._socketState
if(!t.destroyed){h(e)
e._timer=setTimeout((function(){e.emit('timeout')
h(e)}),e._timeout)}}function h(e){if(e._timer){clearTimeout(e._timer)
e._timer=null}}function d(e,n){e.errored=true
t.Duplex.prototype.end.call(e,'',(function(){e.destroy()}))
e._readyToWrite()
e.emit('error',n)}function p(e){var t=e._socketState
if(!t.connecting&&!t.writable&&!t.readable){e.destroy()}}function _(e){var t=e._socketState
t.connecting=false
t.connected=true
u(e)
e._readyToWrite()
process.nextTick((function(){e._handle.owner=e
e._handle.onread=m
e._handle.readStart()}))}function m(e,n,r,i){var o=e._socketState
u(e)
if(r){t.Readable.prototype.push.call(e,null)
if(e._readableState.length===0){o.readable=false
p(e)}}else if(n<0){var s=new Error('read error: '+n)
t.Readable.prototype.error.call(e,s)}else if(n>0){if(process.platform!=='nuttx'){t.Readable.prototype.push.call(e,i)
return}var l=6
var c=i.length
var f=false
if(c>=l&&a.compare(i.slice(c-l,c))===0){f=true
i=i.slice(0,c-l)}if(c===l&&f);else{t.Readable.prototype.push.call(e,i)}if(f){m(e,0,true,null)}}}function v(){var e=this
var t=e._socketState
if(!t.readable||e._readableState.ended||!e._handle){return e.destroy()}else{e._handle.shutdown((function(){if(e._readableState.ended){e.destroy()}}))}}function y(){var e=this._socketState
p(this)
if(!e.allowHalfOpen){this.destroySoon()}}function w(t,r){if(!(this instanceof w)){return new w(t,r)}e.call(this)
if(n.isFunction(t)){r=t
t={}}else{t=t||{}}if(n.isFunction(r)){this.on('connection',r)}this._handle=null
this._socketCount=0
this.allowHalfOpen=t.allowHalfOpen||false}n.inherits(w,e)
w.prototype.listen=function(){var e=this
var t=b(arguments)
var r=t[0]
var i=t[1]
var a=r.port
var s=n.isString(r.host)?r.host:'0.0.0.0'
var l=n.isNumber(r.backlog)?r.backlog:511
if(!n.isNumber(a)){throw new Error('invalid argument - need port number')}if(n.isFunction(i)){e.once('listening',i)}if(!e._handle){e._handle=o()}var c=e._handle.bind(s,a)
if(c){e._handle.close()
return e.emit('error',c)}e._handle.onconnection=k
e._handle.createTCP=o
e._handle.owner=e
c=e._handle.listen(l)
if(c){e._handle.close()
return e.emit('error',c)}process.nextTick((function(){if(e._handle){e.emit('listening')}}))
return this}
w.prototype.address=function(){if(this._handle&&this._handle.getsockname){var e={}
this._handle.getsockname(e)
return e}return null}
w.prototype.close=function(e){if(n.isFunction(e)){if(!this._handle){this.once('close',(function(){e(new Error('Not running'))}))}else{this.once('close',e)}}if(this._handle){this._handle.close()
this._handle=null}this._emitCloseIfDrained()
return this}
w.prototype._emitCloseIfDrained=function(){var e=this
if(e._handle||e._socketCount>0){return}process.nextTick((function(){e.emit('close')}))}
function k(e,t){var n=this.owner
if(e){n.emit('error',new Error('accept error: '+i.errname(e)))
return}var r=new l({handle:t,allowHalfOpen:n.allowHalfOpen})
r._server=n
_(r)
n._socketCount++
n.emit('connection',r)}function b(e){var t={}
if(n.isObject(e[0])){t=e[0]}else{var r=0
t.port=e[r++]
if(n.isString(e[r])){t.host=e[r++]}if(n.isNumber(e[r])){t.backlog=e[r++]}}var i=e[e.length-1]
return n.isFunction(i)?[t,i]:[t]}function g(e){var t={}
if(n.isObject(e[0])){t=e[0]}else{t.port=e[0]
if(n.isString(e[1])){t.host=e[1]}}var r=e[e.length-1]
return n.isFunction(r)?[t,r]:[t]}const S=(e,t)=>new w(e,t)
const T=()=>{var e=g(arguments)
var t=new l(e[0])
return l.prototype.connect.apply(t,e)}
const x={createServer:S,createConnection:T,connect:T,Socket:l,Server:w}
export{w as Server,l as Socket,T as connect,T as createConnection,S as createServer,x as default}
