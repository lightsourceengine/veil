import e from'tls'
import t from'net'
import{ClientRequest as r}from'http_client'
import o from'http_server'
const n=(o,n)=>{o.port=o.port||443
var s=new e.TLSSocket(new t.Socket,o)
return new r(o,n,s)}
class Server extends e.Server{constructor(e,t){super(e,o.connectionListener),e.allowHalfOpen=true,o.initServer.call(this,e,t)}setTimeout(e,t){this.timeout=e,t&&this.on('timeout',t)}}const s=(e,t)=>new Server(e,t),i=(e,t)=>{const r=n(e,t)
return r.end(),r},c={get:i,createServer:s,request:n}
export{s as createServer,c as default,i as get,n as request}
