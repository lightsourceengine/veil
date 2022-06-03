import t from'util'
import{OutgoingMessage as e}from'http_outgoing'
import r from'http_common'
import s from'http_parser'
function o(t,r,s){e.call(this)
var o=t.method||'GET'
var i=t.path||'/'
t.host=t.hostname||t.host||'127.0.0.1'
if(t.headers){var n=Object.keys(t.headers)
for(var a=0,h=n.length;a<h;a++){var c=n[a]
this.setHeader(c,t.headers[c])}}if(t.host&&!this.getHeader('host')){var f=t.host
if(this._port&&+this._port!==80){f+=':'+this._port}this.setHeader('Host',f)}this._storeHeader(o+' '+i+' HTTP/1.1\r\n')
if(r){this.once('response',r)}this.socket=s
this.options=t}t.inherits(o,e)
o.prototype.end=function(t,r,s){var o=this
this.socket.connect(this.options,(function(){o._connected=true
e.prototype.end.call(o,t,r,s)}))
i(this)}
function i(t){var e=t.socket
var o=r.createHTTPParser(s.RESPONSE)
e.parser=o
e._httpMessage=t
o.socket=e
o.incoming=null
o._headers=[]
o.onIncoming=u
t.parser=o
e.on('error',c)
e.on('data',f)
e.on('end',p)
e.on('close',h)
process.nextTick((function(){t.emit('socket',e)}))}function n(t){var e=t.parser
var r=t._httpMessage
if(e){e.finish()
e=null
t.parser=null
r.parser=null}t.destroy()}function a(t,e){var r=t._httpMessage
if(e){var s
if(s=r.getHeader('host')){e.message+=': '+s}r.emit('error',e)}}function h(){var t=this
var e=t._httpMessage
e.emit('close')
if(e.res&&e.res.readable){var r=e.res
r.on('end',(function(){r.emit('close')}))
r.push(null)}n(this)}function c(t){n(this)
a(this,t)}function f(t){var e=this
var r=this._httpMessage
var s=this.parser
var o=s.execute(t)
if(o instanceof Error){n(e)
r.emit('error',o)}}function p(){n(this)}function u(t){var e=this.socket
var r=e._httpMessage
if(r.res){e.destroy()
return false}r.res=t
t.req=r
t.on('end',m)
r.emit('response',t)
return r.method==='HEAD'}var m=function(){var t=this
var e=t.req
var r=e.socket
if(r._socketState.writable){r.destroySoon()}}
o.prototype.abort=function(){this.emit('abort')
if(this.socket){n(this.socket)}}
o.prototype.setTimeout=function(t,e){var r=this
if(e)r.once('timeout',e)
setTimeout((function(){r.emit('timeout')}),t)}
export{o as ClientRequest,o as default}
