import t from'net'
import{ClientRequest as e}from'http_client'
export{ClientRequest}from'http_client'
import{IncomingMessage as r}from'http_incoming'
export{IncomingMessage}from'http_incoming'
import o from'http_parser'
import n,{ServerResponse as i}from'http_server'
export{ServerResponse}from'http_server'
import s from'util'
const p=(r,o)=>{var n=new t.Socket
r.port=r.port||80
return new e(r,o,n)}
function m(e,r){if(!(this instanceof m)){return new m(e,r)}t.Server.call(this,{allowHalfOpen:true},n.connectionListener)
n.initServer.call(this,e,r)}s.inherits(m,t.Server)
m.prototype.setTimeout=function(t,e){this.timeout=t
if(e){this.on('timeout',e)}}
const c=(t,e)=>new m(t,e)
const f=o.methods
const h=(t,e)=>{var r=p(t,e)
r.end()
return r}
const u={get:h,METHODS:f,createServer:c,Server:m,request:p,ClientRequest:e,IncomingMessage:r,ServerResponse:i}
export{f as METHODS,m as Server,c as createServer,u as default,h as get,p as request}
