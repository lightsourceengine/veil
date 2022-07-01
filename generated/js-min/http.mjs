import e from'net'
import{ClientRequest as r}from'http_client'
export{ClientRequest}from'http_client'
import{IncomingMessage as t}from'http_incoming'
export{IncomingMessage}from'http_incoming'
import o from'http_parser'
import n,{ServerResponse as s}from'http_server'
export{ServerResponse}from'http_server'
const i=(t,o)=>{var n=new e.Socket
return t.port=t.port||80,new r(t,o,n)}
class Server extends e.Server{constructor(e,r){super({allowHalfOpen:true},n.connectionListener),n.initServer.call(this,e,r)}setTimeout(e,r){this.timeout=e,r&&this.on('timeout',r)}}const p=(e,r)=>new Server(e,r),m=o.methods,c=(e,r)=>{var t=i(e,r)
return t.end(),t},v={get:c,METHODS:m,createServer:p,Server,request:i,ClientRequest:r,IncomingMessage:t,ServerResponse:s}
export{m as METHODS,Server,p as createServer,v as default,c as get,i as request}
