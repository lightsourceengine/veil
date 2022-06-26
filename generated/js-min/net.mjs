import e from'events'
import{Duplex as t}from'stream'
import{assert as i}from'assert'
import n from'tcp'
import{lookup as r}from'dns'
const{errname:s}=n,o=()=>new n
var a
if('nuttx'===process.platform)a=new Buffer('\\e\\n\\d')
function l(e){this.connecting=false,this.connected=false,this.writable=true,this.readable=true,this.destroyed=false,this.errored=false,this.allowHalfOpen=e&&e.allowHalfOpen||false}class h extends t{constructor(e){if(super(),this._timer=null,this._timeout=0,this._socketState=new l(e),e.handle)this._handle=e.handle,this._handle.owner=this
this.on('finish',v),this.on('end',w)}connect(){var e=this._socketState,t=S(arguments),i=t[0],n=t[1]
if(e.connecting||e.connected)return this
if(!this._handle)this._handle=o(),this._handle.owner=this
if('function'===typeof n)this.once('connect',n)
d(this),e.connecting=true
var s=i.host?i.host:'localhost',a=i.port,l={family:i.family>>>0,hints:0}
if('number'!==typeof a||a<0||a>65535)throw new RangeError('port should be >= 0 and < 65536: '+i.port)
if(0!==l.family&&4!==l.family&&6!==l.family)throw new RangeError('family should be 4 or 6: '+l.family)
return this._host=s,r(s,l,((e,t,i)=>{if(this._socketState.destroyed)return
if(this.emit('lookup',e,t,i),e)process.nextTick((()=>{this.emit('error',e),this.destroy()}))
else d(this),f(this,t,a)})),this}write(e,t){if('string'!==typeof e&&!Buffer.isBuffer(e))throw new TypeError('invalid argument')
return super.write(e,t)}_write(e,t,n){if(i(Buffer.isBuffer(e)),i('function'===typeof n),this.errored){if(process.nextTick(n,1),'function'===typeof t)process.nextTick((()=>t.call(this,1)))}else d(this),this._handle.owner=this,this._handle.write(e,(e=>{if(n(e),'function'===typeof t)t.call(this,e)}))}end(e,t){var i=this._socketState
super.end(e,t),i.writable=false}destroy(){var e=this._socketState
if(e.destroyed)return
if(e.writable)this.end()
if(u(this),this._writableState.ended&&this._handle)c(this),e.destroyed=true
else this.once('finish',(()=>this.destroy()))}destroySoon(){var e=this._socketState
if(e.writable)this.end()
if(this._writableState.finished)this.destroy()
else this.once('finish',(()=>this.destroy()))}setKeepAlive(e,t){if(e=Boolean(e),this._handle&&this._handle.setKeepAlive)this._handle.setKeepAlive(e,~~(t/1e3))}address(){if(!this._handle||!this._handle.getsockname)return{}
if(!this._sockname){var e={},t=this._handle.getsockname(e)
if(t)return{}
this._sockname=e}return this._sockname}setTimeout(e,t){if(this._timeout=e,u(this),0===e){if(t)this.removeListener('timeout',t)}else if(this._timer=setTimeout((()=>{this.emit('timeout'),u(this)}),e),t)this.once('timeout',t)}}function f(e,t,i){var n=t=>{var i=e._socketState
if(i.connecting=false,i.destroyed)return
if(0===t)p(e),e.emit('connect')
else e.destroy(),_(e,Error(`connect failed - status: ${s(t)}`))},r=e._handle.connect(t,i,n)
if(r)_(e,Error(`connect failed - status: ${s(r)}`))}function c(e){e._handle.owner=e,e._handle.onclose=()=>e.emit('close')
var t=e._handle
if(e._handle=null,t.close(),e._server){var i=e._server
i._socketCount--,i._emitCloseIfDrained(),e._server=null}}function d(e){var t=e._socketState
if(!t.destroyed)u(e),e._timer=setTimeout((()=>{e.emit('timeout'),u(e)}),e._timeout)}function u(e){if(e._timer)clearTimeout(e._timer),e._timer=null}function _(e,t){e.errored=true,e.end('',(()=>e.destroy())),e._readyToWrite(),e.emit('error',t)}function m(e){var t=e._socketState
if(!t.connecting&&!t.writable&&!t.readable)e.destroy()}function p(e){var t=e._socketState
t.connecting=false,t.connected=true,d(e),e._readyToWrite(),process.nextTick((()=>{e._handle.owner=e,e._handle.onread=y,e._handle.readStart()}))}function y(e,t,i,n){var r=e._socketState
if(d(e),i){if(e.push(null),0===e._readableState.length)r.readable=false,m(e)}else if(t<0){var s=new Error('read error: '+t)
e.error(s)}else if(t>0){if('nuttx'!==process.platform)return e.push(n),void 0
var o=6,l=n.length,h=false
if(l>=o&&0===a.compare(n.slice(l-o,l)))h=true,n=n.slice(0,l-o)
if(l===o&&h);else e.push(n)
if(h)y(e,0,true,null)}}function v(){var e=this,t=e._socketState
if(!t.readable||e._readableState.ended||!e._handle)return e.destroy()
else e._handle.shutdown((()=>{if(e._readableState.ended)e.destroy()}))}function w(){var e=this._socketState
if(m(this),!e.allowHalfOpen)this.destroySoon()}class k extends e{constructor(e,t){if(super(),'function'===typeof e)t=e,e={}
else e=e||{}
if('function'===typeof t)this.on('connection',t)
this._handle=null,this._socketCount=0,this.allowHalfOpen=e.allowHalfOpen||false}listen(){var e=b(arguments),t=e[0],i=e[1],n=t.port,r='string'===typeof t.host?t.host:'0.0.0.0',s='number'===typeof t.backlog?t.backlog:511
if('number'!==typeof n)throw new Error('invalid argument - need port number')
if('function'===typeof i)this.once('listening',i)
if(!this._handle)this._handle=o()
var a=this._handle.bind(r,n)
if(a)return this._handle.close(),this.emit('error',a)
if(this._handle.onconnection=g,this._handle.createTCP=o,this._handle.owner=this,a=this._handle.listen(s),a)return this._handle.close(),this.emit('error',a)
return process.nextTick((()=>{if(this._handle)this.emit('listening')})),this}address(){if(this._handle&&this._handle.getsockname){var e={}
return this._handle.getsockname(e),e}return null}close(e){if('function'===typeof e)if(!this._handle)this.once('close',(()=>e(Error('Not running'))))
else this.once('close',e)
if(this._handle)this._handle.close(),this._handle=null
return this._emitCloseIfDrained(),this}_emitCloseIfDrained(){var e=this
if(e._handle||e._socketCount>0)return
process.nextTick((()=>e.emit('close')))}}function g(e,t){var i=this.owner
if(e)return i.emit('error',Error(`accept error: ${s(e)}`)),void 0
var n=new h({handle:t,allowHalfOpen:i.allowHalfOpen})
n._server=i,p(n),i._socketCount++,i.emit('connection',n)}function b(e){var t={}
if(null!==e[0]&&'object'===typeof e[0])t=e[0]
else{var i=0
if(t.port=e[i++],'string'===typeof e[i])t.host=e[i++]
else if('number'===typeof e[i])t.backlog=e[i++]}var n=e[e.length-1]
return'function'===typeof n?[t,n]:[t]}function S(e){var t={}
if(null!==e[0]&&'object'===typeof e[0])t=e[0]
else if(t.port=e[0],'string'===typeof e[1])t.host=e[1]
var i=e[e.length-1]
return'function'===typeof i?[t,i]:[t]}const T=(e,t)=>new k(e,t),x=()=>{var e=S(arguments),t=new h(e[0])
return h.prototype.connect.apply(t,e)},C={createServer:T,createConnection:x,connect:x,Socket:h,Server:k}
export{k as Server,h as Socket,x as connect,x as createConnection,T as createServer,C as default}
