import t from'tls'
import e from'net'
import{ClientRequest as r}from'http_client'
import o from'http_server'
const n=(o,n)=>{o.port=o.port||443
var s=new t.TLSSocket(new e.Socket,o)
return new r(o,n,s)}
class s extends t.Server{constructor(t,e){super(t,o.connectionListener),t.allowHalfOpen=true,o.initServer.call(this,t,e)}setTimeout(t,e){this.timeout=t,e&&this.on('timeout',e)}}const i=(t,e)=>new s(t,e),c=(t,e)=>{const r=n(t,e)
return r.end(),r},m={get:c,createServer:i,request:n}
export{i as createServer,m as default,c as get,n as request}
