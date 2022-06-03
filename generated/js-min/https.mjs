import t from'tls'
import e from'net'
import{ClientRequest as r}from'http_client'
import o from'http_server'
import n from'util'
const i=(o,n)=>{o.port=o.port||443
var i=new t.TLSSocket(new e.Socket,o)
return new r(o,n,i)}
function s(e,r){if(!(this instanceof s)){return new s(e,r)}e.allowHalfOpen=true
t.Server.call(this,e,o.connectionListener)
o.initServer.call(this,e,r)}n.inherits(s,t.Server)
s.prototype.setTimeout=function(t,e){this.timeout=t
if(e){this.on('timeout',e)}}
const c=(t,e)=>new s(t,e)
const m=(t,e)=>{var r=i(t,e)
r.end()
return r}
const p={get:m,createServer:c,request:i}
export{c as createServer,p as default,m as get,i as request}
