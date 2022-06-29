import e from'net'
import{ClientRequest as t}from'http_client'
export{ClientRequest}from'http_client'
import{IncomingMessage as r}from'http_incoming'
export{IncomingMessage}from'http_incoming'
import o from'http_parser'
import n,{ServerResponse as s}from'http_server'
export{ServerResponse}from'http_server'
const i=(r,o)=>{var n=new e.Socket
return r.port=r.port||80,new t(r,o,n)}
class p extends e.Server{constructor(e,t){super({allowHalfOpen:true},n.connectionListener),n.initServer.call(this,e,t)}setTimeout(e,t){this.timeout=e,t&&this.on('timeout',t)}}const m=(e,t)=>new p(e,t),c=o.methods,a=(e,t)=>{var r=i(e,t)
return r.end(),r},u={get:a,METHODS:c,createServer:m,Server:p,request:i,ClientRequest:t,IncomingMessage:r,ServerResponse:s}
export{c as METHODS,p as Server,m as createServer,u as default,a as get,i as request}
