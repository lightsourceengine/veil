import e from'net'
import{Duplex as t}from'stream'
const{native:s}=import.meta
class o extends t{_native_read=s.read
_native_write=s.write
_native_connect=s.connect
constructor(t,o){if(super(),'_tlsSocket'in t)throw Error('Socket already bound')
if(this._socket=t,t._tlsSocket=this,this.authorized=false,this._socket.on('connect',this.onconnect),this._socket.on('data',this.ondata),this._socket.on('error',this.onerror),this._socket.on('close',this.onclose),this._socket instanceof e.Socket)this._socket.on('finish',this.onfinish)
else this._socket.on('finish',this.onend)
this._socket.on('end',this.onend)
var r=o.secureContext
if(!r)r=i(o)
s.TlsInit(this,o,r),this._socketState=t._socketState
const n=this
if(t._writableState.ready&&!o.isServer)process.nextTick((()=>{n._native_connect(o.servername||o.host||'localhost'),n._native_read(null)}))}connect(e,t){if(this._native_connect(e.servername||e.host||'localhost'),'function'===typeof t)this.on('secureConnect',t)
this._socket.connect(e)}_write(e,t,s){e=this._native_write(e),this._socket.write(e,t),s()}end(e,t){super.end(e,t),this._socket.end()}destroy(){this._socket.destroy()}destroySoon(){this._socket.destroySoon()}onconnect(){this._tlsSocket._native_read(null)}encrypted(){return true}address(){return this._socket.address()}localAddress(){return this._socket.address().address}setTimeout(e,t){return this._socket.setTimeout(e,t)}ondata(e){this._tlsSocket._native_read(e)}onerror(e){this._tlsSocket.emit('error',e)}onclose(){this._tlsSocket.emit('close')}onfinish(){this._tlsSocket.emit('finish')}onend(){this._tlsSocket.emit('end')}onwrite(e){return this._socket.write(e)}onread(e){this.emit('data',e)}onhandshakedone(e,t){this.authorized=t
var s=this._server
if(e){if(e=Error('handshake failed'),s)s.emit('tlsClientError',e,this)
else this.emit('error',e)
return this.end(),void 0}if(this._readyToWrite(),s)s.emit('secureConnection',this)
else this.emit('secureConnect')}}function r(e){var t=new o(e,{isServer:true,secureContext:this._secureContext})
t._server=this}class n extends e.Server{constructor(e,t){if(super(e,r),this._secureContext=i(e),t)this.on('secureConnection',t)}}function i(e){return new s.TlsContext(e)}function c(e,t){return new n(e,t)}function a(t,s,r,n){var i={}
if('object'==typeof t)i=Object.create(t,{isServer:{value:false,enumerable:true}}),i.host=i.host||'localhost',i.port=i.port||443,i.rejectUnauthorized=i.rejectUnauthorized||false,n=s
else if('number'==typeof t)if('string'==typeof s)if('object'==typeof r)i=Object.create(r,{isServer:{value:false,enumerable:true}}),i.port=t,i.host=s,i.rejectUnauthorized=i.rejectUnauthorized||false
else i={isServer:false,rejectUnauthorized:false,port:t,host:s},n=r
else if('object'==typeof s)i=Object.create(s,{isServer:{value:false,enumerable:true}}),i.port=t,i.host=i.host||'localhost',i.rejectUnauthorized=i.rejectUnauthorized||false,n=r
else i={isServer:false,rejectUnauthorized:false,host:'localhost',port:t},n=s
var c=new o(i.socket||new e.Socket,i)
if(c._socket instanceof e.Socket)c.connect(i,n)
else if('function'===typeof n)c.on('secureConnect',n)
return c}const h={TLSSocket:o,Server:n,createSecureContext:i,createServer:c,connect:a}
export{n as Server,o as TLSSocket,a as connect,i as createSecureContext,c as createServer,h as default}
