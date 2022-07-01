import e from'net'
import{Duplex as t}from'stream'
const{native:s}=import.meta
class TLSSocket extends t{_native_read=s.read
_native_write=s.write
_native_connect=s.connect
constructor(t,o){if(super(),'_tlsSocket'in t)throw Error('Socket already bound')
if(this._socket=t,t._tlsSocket=this,this.authorized=false,this._socket.on('connect',this.onconnect),this._socket.on('data',this.ondata),this._socket.on('error',this.onerror),this._socket.on('close',this.onclose),this._socket instanceof e.Socket)this._socket.on('finish',this.onfinish)
else this._socket.on('finish',this.onend)
this._socket.on('end',this.onend)
var n=o.secureContext
if(!n)n=r(o)
s.TlsInit(this,o,n),this._socketState=t._socketState
const i=this
if(t._writableState.ready&&!o.isServer)process.nextTick((()=>{i._native_connect(o.servername||o.host||'localhost'),i._native_read(null)}))}connect(e,t){if(this._native_connect(e.servername||e.host||'localhost'),'function'===typeof t)this.on('secureConnect',t)
this._socket.connect(e)}_write(e,t,s){e=this._native_write(e),this._socket.write(e,t),s()}end(e,t){super.end(e,t),this._socket.end()}destroy(){this._socket.destroy()}destroySoon(){this._socket.destroySoon()}onconnect(){this._tlsSocket._native_read(null)}encrypted(){return true}address(){return this._socket.address()}localAddress(){return this._socket.address().address}setTimeout(e,t){return this._socket.setTimeout(e,t)}ondata(e){this._tlsSocket._native_read(e)}onerror(e){this._tlsSocket.emit('error',e)}onclose(){this._tlsSocket.emit('close')}onfinish(){this._tlsSocket.emit('finish')}onend(){this._tlsSocket.emit('end')}onwrite(e){return this._socket.write(e)}onread(e){this.emit('data',e)}onhandshakedone(e,t){this.authorized=t
var s=this._server
if(e){if(e=Error('handshake failed'),s)s.emit('tlsClientError',e,this)
else this.emit('error',e)
return this.end(),void 0}if(this._readyToWrite(),s)s.emit('secureConnection',this)
else this.emit('secureConnect')}}function o(e){var t=new TLSSocket(e,{isServer:true,secureContext:this._secureContext})
t._server=this}class Server extends e.Server{constructor(e,t){if(super(e,o),this._secureContext=r(e),t)this.on('secureConnection',t)}}function r(e){return new s.TlsContext(e)}function n(e,t){return new Server(e,t)}function i(t,s,o,r){var n={}
if('object'==typeof t)n=Object.create(t,{isServer:{value:false,enumerable:true}}),n.host=n.host||'localhost',n.port=n.port||443,n.rejectUnauthorized=n.rejectUnauthorized||false,r=s
else if('number'==typeof t)if('string'==typeof s)if('object'==typeof o)n=Object.create(o,{isServer:{value:false,enumerable:true}}),n.port=t,n.host=s,n.rejectUnauthorized=n.rejectUnauthorized||false
else n={isServer:false,rejectUnauthorized:false,port:t,host:s},r=o
else if('object'==typeof s)n=Object.create(s,{isServer:{value:false,enumerable:true}}),n.port=t,n.host=n.host||'localhost',n.rejectUnauthorized=n.rejectUnauthorized||false,r=o
else n={isServer:false,rejectUnauthorized:false,host:'localhost',port:t},r=s
var i=new TLSSocket(n.socket||new e.Socket,n)
if(i._socket instanceof e.Socket)i.connect(n,r)
else if('function'===typeof r)i.on('secureConnect',r)
return i}const c={TLSSocket,Server,createSecureContext:r,createServer:n,connect:i}
export{Server,TLSSocket,i as connect,r as createSecureContext,n as createServer,c as default}
