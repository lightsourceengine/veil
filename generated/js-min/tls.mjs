import t from'net'
import e from'util'
import{Duplex as o}from'stream'
const{native:n}=import.meta
function r(e,s){if(!(this instanceof r))return new r(e,s)
if('_tlsSocket'in e)throw Error('Socket already bound')
if(this._socket=e,e._tlsSocket=this,o.call(this),this.authorized=false,this._socket.on('connect',this.onconnect),this._socket.on('data',this.ondata),this._socket.on('error',this.onerror),this._socket.on('close',this.onclose),this._socket instanceof t.Socket)this._socket.on('finish',this.onfinish)
else this._socket.on('finish',this.onend)
this._socket.on('end',this.onend)
var i=s.secureContext
if(!i)i=c(s)
n.TlsInit(this,s,i),this._socketState=e._socketState
var a=this
if(e._writableState.ready&&!s.isServer)process.nextTick((function(){a._native_connect(s.servername||s.host||'localhost'),a._native_read(null)}))}function s(t){var e=new r(t,{isServer:true,secureContext:this._secureContext})
e._server=this}function i(e,o){if(!(this instanceof i))return new i(e,o)
if(this._secureContext=c(e),t.Server.call(this,e,s),o)this.on('secureConnection',o)}function c(t){return new n.TlsContext(t)}function a(t,e){return new i(t,e)}function h(o,n,s,i){var c={}
if('object'==typeof o)c=Object.create(o,{isServer:{value:false,enumerable:true}}),c.host=c.host||'localhost',c.port=c.port||443,c.rejectUnauthorized=c.rejectUnauthorized||false,i=n
else if('number'==typeof o)if('string'==typeof n)if('object'==typeof s)c=Object.create(s,{isServer:{value:false,enumerable:true}}),c.port=o,c.host=n,c.rejectUnauthorized=c.rejectUnauthorized||false
else c={isServer:false,rejectUnauthorized:false,port:o,host:n},i=s
else if('object'==typeof n)c=Object.create(n,{isServer:{value:false,enumerable:true}}),c.port=o,c.host=c.host||'localhost',c.rejectUnauthorized=c.rejectUnauthorized||false,i=s
else c={isServer:false,rejectUnauthorized:false,host:'localhost',port:o},i=n
var a=new r(c.socket||new t.Socket,c)
if(a._socket instanceof t.Socket)a.connect(c,i)
else if(e.isFunction(i))a.on('secureConnect',i)
return a}e.inherits(r,o),r.prototype._native_read=n.read,r.prototype._native_write=n.write,r.prototype._native_connect=n.connect,r.prototype.connect=function(t,o){if(this._native_connect(t.servername||t.host||'localhost'),e.isFunction(o))this.on('secureConnect',o)
this._socket.connect(t)},r.prototype._write=function(t,e,o){t=this._native_write(t),this._socket.write(t,e),o()},r.prototype.end=function(t,e){o.prototype.end.call(this,t,e),this._socket.end()},r.prototype.destroy=function(){this._socket.destroy()},r.prototype.destroySoon=function(){this._socket.destroySoon()},r.prototype.onconnect=function(){this._tlsSocket._native_read(null)},r.prototype.encrypted=function(){return true},r.prototype.address=function(){return this._socket.address()},r.prototype.localAddress=function(){return this._socket.address().address},r.prototype.setTimeout=function(t,e){return this._socket.setTimeout(t,e)},r.prototype.ondata=function(t){var e=this._tlsSocket
e._native_read(t)},r.prototype.onerror=function(t){this._tlsSocket.emit('error',t)},r.prototype.onclose=function(){this._tlsSocket.emit('close')},r.prototype.onfinish=function(){this._tlsSocket.emit('finish')},r.prototype.onend=function(){this._tlsSocket.emit('end')},r.prototype.onwrite=function(t){return this._socket.write(t)},r.prototype.onread=function(t){this.emit('data',t)},r.prototype.onhandshakedone=function(t,e){this.authorized=e
var o=this._server
if(t){if(t=Error('handshake failed'),o)o.emit('tlsClientError',t,this)
else this.emit('error',t)
return this.end(),void 0}if(this._readyToWrite(),o)o.emit('secureConnection',this)
else this.emit('secureConnect')},e.inherits(i,t.Server)
const u={TLSSocket:r,Server:i,createSecureContext:c,createServer:a,connect:h}
export{i as Server,r as TLSSocket,h as connect,c as createSecureContext,a as createServer,u as default}
