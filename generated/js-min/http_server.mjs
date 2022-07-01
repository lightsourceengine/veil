import{format as e}from'util'
import{IncomingMessage as t}from'http_incoming'
import{OutgoingMessage as o}from'http_outgoing'
import{createHTTPParser as s}from'http_common'
import i from'http_parser'
const r={100:'Continue',101:'Switching Protocols',200:'OK',201:'Created',202:'Accepted',203:'Non-Authoritative Information',204:'No Content',205:'Reset Content',206:'Partial Content',300:'Multiple Choices',301:'Moved Permanently',302:'Found',303:'See Other',304:'Not Modified',305:'Use Proxy',307:'Temporary Redirect',400:'Bad Request',401:'Unauthorized',402:'Payment Required',403:'Forbidden',404:'Not Found',405:'Method Not Allowed',406:'Not Acceptable',407:'Proxy Authentication Required',408:'Request Timeout',409:'Conflict',410:'Gone',411:'Length Required',412:'Precondition Failed',413:'Payload Too Large',414:'URI Too Large',415:'Unsupported Media Type',416:'Range Not Satisfiable',417:'Expectation Failed',426:'Upgrade Required',500:'Internal Server Error',501:'Not Implemented',502:'Bad Gateway',503:'Service Unavailable',504:'Gateway Time-out',505:'HTTP Version Not Supported'}
class ServerResponse extends o{statusCode=200
statusMessage=void 0
_hasBody=true
constructor(e){if(super(),'HEAD'===e.method)this._hasBody=false}_implicitHeader(){this.writeHead(this.statusCode,this.statusMessage)}writeHead(t,o,s){if('string'===typeof o)this.statusMessage=o
else this.statusMessage=r[t]||'unknown',s=o
var i=e('HTTP/1.1 %s %s\r\n',t.toString(),this.statusMessage)
if(this.statusCode=t,204===t||304===t||100<=t&&t<=199)this._hasBody=false
if(null!==s&&'object'===typeof s){if(!this._headers)this._headers={}
for(const e in s)if(s.hasOwnProperty(e))this._headers[e]=s[e]}this._storeHeader(i)}assignSocket(e){this._connected=true,e._httpMessage=this,this.socket=e,e.on('close',(()=>{var t
return null==(t=e._httpMessage)?void 0:t.emit('close')})),this.emit('socket',e)}detachSocket(){this.socket._httpMessage=null,this.socket=null,this._connected=false}}function n(e,o){if('function'===typeof e)o=e
if('object'!==typeof e)e={}
if('function'===typeof o)this.addListener('request',o)
this._IncomingMessage=e.IncomingMessage||t,this._ServerResponse=e.ServerResponse||ServerResponse,this.httpAllowHalfOpen=false,this.on('clientError',(function(e,t){t.destroy(e)})),this.timeout=2*1e3*60}function a(e){var t=this,o=s(i.REQUEST)
if(o._headers=[],o._url='',o.onIncoming=l,o._IncomingMessage=t._IncomingMessage,o.socket=e,o.incoming=null,e.parser=o,e.on('data',c),e.on('end',u),e.on('close',h),e.on('timeout',d),e.on('error',p),t.timeout)e.setTimeout(t.timeout)}function c(e){var t=this,o=t.parser.execute(e)
if(o instanceof Error)t.destroy()}function u(){var e=this,t=e._server,o=e.parser.finish()
if(o instanceof Error)return e.destroy(),void 0
if(e.parser=null,!t.httpAllowHalfOpen&&e._socketState.writable)e.end()}function h(){var e=this
if(e.parser)e.parser=null}function d(){var e=this,t=e._server,o=t.emit('timeout',e),s=e.parser&&e.parser.incoming,i=s&&!s.complete&&s.emit('timeout',e),r=e._httpMessage,n=r&&r.emit('timeout',e)
if(!o&&!i&&!n)e.destroy()}function p(e){var t=this,o=t._server
o.emit('clientError',e,t)}function l(e){var t=e.socket,o=t._server,s=new o._ServerResponse(e)
return s.assignSocket(t),s.on('prefinish',f),o.emit('request',e,s),false}function f(){var e=this,t=e.socket
e.detachSocket(),t.destroySoon()}const m={connectionListener:a,initServer:n,ServerResponse,STATUS_CODES:r}
export{r as STATUS_CODES,ServerResponse,a as connectionListener,m as default,n as initServer}
