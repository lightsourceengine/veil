import e from'util'
import{IncomingMessage as t}from'http_incoming'
import{OutgoingMessage as o}from'http_outgoing'
import i from'http_common'
import s from'http_parser'
var r={100:'Continue',101:'Switching Protocols',200:'OK',201:'Created',202:'Accepted',203:'Non-Authoritative Information',204:'No Content',205:'Reset Content',206:'Partial Content',300:'Multiple Choices',301:'Moved Permanently',302:'Found',303:'See Other',304:'Not Modified',305:'Use Proxy',307:'Temporary Redirect',400:'Bad Request',401:'Unauthorized',402:'Payment Required',403:'Forbidden',404:'Not Found',405:'Method Not Allowed',406:'Not Acceptable',407:'Proxy Authentication Required',408:'Request Timeout',409:'Conflict',410:'Gone',411:'Length Required',412:'Precondition Failed',413:'Payload Too Large',414:'URI Too Large',415:'Unsupported Media Type',416:'Range Not Satisfiable',417:'Expectation Failed',426:'Upgrade Required',500:'Internal Server Error',501:'Not Implemented',502:'Bad Gateway',503:'Service Unavailable',504:'Gateway Time-out',505:'HTTP Version Not Supported'}
function n(e){if(o.call(this),'HEAD'===e.method)this._hasBody=false}function a(){if(this._httpMessage)this._httpMessage.emit('close')}function c(o,i){if(e.isFunction(o))i=o
if('object'!==typeof o)o={}
if(e.isFunction(i))this.addListener('request',i)
this._IncomingMessage=o.IncomingMessage||t,this._ServerResponse=o.ServerResponse||n,this.httpAllowHalfOpen=false,this.on('clientError',(function(e,t){t.destroy(e)})),this.timeout=2*1e3*60}function h(e){var t=this,o=i.createHTTPParser(s.REQUEST)
if(o._headers=[],o._url='',o.onIncoming=m,o._IncomingMessage=t._IncomingMessage,o.socket=e,o.incoming=null,e.parser=o,e.on('data',u),e.on('end',d),e.on('close',p),e.on('timeout',f),e.on('error',l),t.timeout)e.setTimeout(t.timeout)}function u(e){var t=this,o=t.parser.execute(e)
if(o instanceof Error)t.destroy()}function d(){var e=this,t=e._server,o=e.parser.finish()
if(o instanceof Error)return e.destroy(),void 0
if(e.parser=null,!t.httpAllowHalfOpen&&e._socketState.writable)e.end()}function p(){var e=this
if(e.parser)e.parser=null}function f(){var e=this,t=e._server,o=t.emit('timeout',e),i=e.parser&&e.parser.incoming,s=i&&!i.complete&&i.emit('timeout',e),r=e._httpMessage,n=r&&r.emit('timeout',e)
if(!o&&!s&&!n)e.destroy()}function l(e){var t=this,o=t._server
o.emit('clientError',e,t)}function m(e){var t=e.socket,o=t._server,i=new o._ServerResponse(e)
return i.assignSocket(t),i.on('prefinish',g),o.emit('request',e,i),false}function g(){var e=this,t=e.socket
e.detachSocket(),t.destroySoon()}e.inherits(n,o),n.prototype.statusCode=200,n.prototype.statusMessage=void 0,n.prototype._implicitHeader=function(){this.writeHead(this.statusCode,this.statusMessage)},n.prototype.writeHead=function(t,o,i){if(e.isString(o))this.statusMessage=o
else this.statusMessage=r[t]||'unknown',i=o
var s=e.format('HTTP/1.1 %s %s\r\n',t.toString(),this.statusMessage)
if(this.statusCode=t,204===t||304===t||100<=t&&t<=199)this._hasBody=false
if(e.isObject(i)){if(e.isNullOrUndefined(this._headers))this._headers={}
for(var n in i)if(i.hasOwnProperty(n))this._headers[n]=i[n]}this._storeHeader(s)},n.prototype.assignSocket=function(e){this._connected=true,e._httpMessage=this,this.socket=e,e.on('close',a),this.emit('socket',e)},n.prototype.detachSocket=function(){this.socket._httpMessage=null,this.socket=null,this._connected=false}
const _={connectionListener:h,initServer:c,ServerResponse:n,STATUS_CODES:r}
export{r as STATUS_CODES,n as ServerResponse,h as connectionListener,_ as default,c as initServer}
