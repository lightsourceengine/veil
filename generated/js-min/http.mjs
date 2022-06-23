import e from'net'
import{ClientRequest as t}from'http_client'
export{ClientRequest}from'http_client'
import{IncomingMessage as r}from'http_incoming'
export{IncomingMessage}from'http_incoming'
import o from'http_parser'
import n,{ServerResponse as i}from'http_server'
export{ServerResponse}from'http_server'
import s from'util'
const p=(r,o)=>{var n=new e.Socket
return r.port=r.port||80,new t(r,o,n)}
function m(t,r){if(!(this instanceof m))return new m(t,r)
e.Server.call(this,{allowHalfOpen:true},n.connectionListener),n.initServer.call(this,t,r)}s.inherits(m,e.Server),m.prototype.setTimeout=function(e,t){if(this.timeout=e,t)this.on('timeout',t)}
const c=(e,t)=>new m(e,t),f=o.methods,h=(e,t)=>{var r=p(e,t)
return r.end(),r},u={get:h,METHODS:f,createServer:c,Server:m,request:p,ClientRequest:t,IncomingMessage:r,ServerResponse:i}
export{f as METHODS,m as Server,c as createServer,u as default,h as get,p as request}
