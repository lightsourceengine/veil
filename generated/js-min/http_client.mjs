import t from'util'
import{OutgoingMessage as e}from'http_outgoing'
import s from'http_common'
import o from'http_parser'
function r(t,s,o){e.call(this)
var r=t.method||'GET',i=t.path||'/'
if(t.host=t.hostname||t.host||'127.0.0.1',t.headers)for(var n=Object.keys(t.headers),a=0,h=n.length;a<h;a++){var c=n[a]
this.setHeader(c,t.headers[c])}if(t.host&&!this.getHeader('host')){var f=t.host
if(this._port&&80!==+this._port)f+=':'+this._port
this.setHeader('Host',f)}if(this._storeHeader(r+' '+i+' HTTP/1.1\r\n'),s)this.once('response',s)
this.socket=o,this.options=t}function i(t){var e=t.socket,r=s.createHTTPParser(o.RESPONSE)
e.parser=r,e._httpMessage=t,r.socket=e,r.incoming=null,r._headers=[],r.onIncoming=u,t.parser=r,e.on('error',c),e.on('data',f),e.on('end',p),e.on('close',h),process.nextTick((function(){t.emit('socket',e)}))}function n(t){var e=t.parser,s=t._httpMessage
if(e)e.finish(),e=null,t.parser=null,s.parser=null
t.destroy()}function a(t,e){var s=t._httpMessage
if(e){var o
if(o=s.getHeader('host'))e.message+=': '+o
s.emit('error',e)}}function h(){var t=this,e=t._httpMessage
if(e.emit('close'),e.res&&e.res.readable){var s=e.res
s.on('end',(function(){s.emit('close')})),s.push(null)}n(this)}function c(t){n(this),a(this,t)}function f(t){var e=this,s=this._httpMessage,o=this.parser,r=o.execute(t)
if(r instanceof Error)n(e),s.emit('error',r)}function p(){n(this)}function u(t){var e=this.socket,s=e._httpMessage
if(s.res)return e.destroy(),false
return s.res=t,t.req=s,t.on('end',m),s.emit('response',t),'HEAD'===s.method}t.inherits(r,e),r.prototype.end=function(t,s,o){var r=this
this.socket.connect(this.options,(function(){r._connected=true,e.prototype.end.call(r,t,s,o)})),i(this)}
var m=function(){var t=this,e=t.req,s=e.socket
if(s._socketState.writable)s.destroySoon()}
r.prototype.abort=function(){if(this.emit('abort'),this.socket)n(this.socket)},r.prototype.setTimeout=function(t,e){var s=this
if(e)s.once('timeout',e)
setTimeout((function(){s.emit('timeout')}),t)}
export{r as ClientRequest,r as default}
