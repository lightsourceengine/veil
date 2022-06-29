import{OutgoingMessage as t}from'http_outgoing'
import{createHTTPParser as e}from'http_common'
import s from'http_parser'
class o extends t{constructor(t,e,s){super()
var o=t.method||'GET',r=t.path||'/'
if(t.host=t.hostname||t.host||'127.0.0.1',t.headers)for(const e of Object.keys(t.headers))this.setHeader(e,t.headers[e])
if(t.host&&!this.getHeader('host')){var i=t.host
if(this._port&&80!==+this._port)i+=':'+this._port
this.setHeader('Host',i)}if(this._storeHeader(o+' '+r+' HTTP/1.1\r\n'),e)this.once('response',e)
this.socket=s,this.options=t}end(e,s,o){const i=this
this.socket.connect(this.options,(()=>{i._connected=true,t.prototype.end.call(i,e,s,o)})),r(this)}abort(){this.emit('abort'),this.socket&&i(this.socket)}setTimeout(t,e){e&&this.once('timeout',e),setTimeout((()=>this.emit('timeout')),t)}}function r(t){var o=t.socket,r=e(s.RESPONSE)
o.parser=r,o._httpMessage=t,r.socket=o,r.incoming=null,r._headers=[],r.onIncoming=f,t.parser=r,o.on('error',a),o.on('data',c),o.on('end',p),o.on('close',h),process.nextTick((function(){t.emit('socket',o)}))}function i(t){var e=t.parser,s=t._httpMessage
if(e)e.finish(),e=null,t.parser=null,s.parser=null
t.destroy()}function n(t,e){var s=t._httpMessage
if(e){var o
if(o=s.getHeader('host'))e.message+=': '+o
s.emit('error',e)}}function h(){var t=this,e=t._httpMessage
if(e.emit('close'),e.res&&e.res.readable){var s=e.res
s.on('end',(function(){s.emit('close')})),s.push(null)}i(this)}function a(t){i(this),n(this,t)}function c(t){var e=this,s=this._httpMessage,o=this.parser,r=o.execute(t)
if(r instanceof Error)i(e),s.emit('error',r)}function p(){i(this)}function f(t){var e=this.socket,s=e._httpMessage
if(s.res)return e.destroy(),false
return s.res=t,t.req=s,t.on('end',u),s.emit('response',t),'HEAD'===s.method}var u=function(){var t=this,e=t.req,s=e.socket
if(s._socketState.writable)s.destroySoon()}
export{o as ClientRequest,o as default}
