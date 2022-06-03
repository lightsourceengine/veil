import i from'util'
import{IncomingMessage as t}from'http_incoming'
import s from'http_parser'
const e=i=>{var e=new s(i)
e.OnHeaders=h
e.OnHeadersComplete=r
e.OnBody=o
e.OnMessageComplete=n
e._IncomingMessage=t
return e}
function n(){var i=this.incoming
if(!i){return}i.complete=true
i.push(null)
i.socket.resume()}function r(t){var e=t.headers
var n=t.url
if(!n){n=this._url
this.url=''}if(!e){e=this._headers
this._headers=[]}this.incoming=new this._IncomingMessage(this.socket)
this.incoming.url=n
this.incoming.httpVersion=t.http_major+'.'+t.http_minor
this.incoming.addHeaders(e)
if(i.isNumber(t.method)){this.incoming.method=s.methods[t.method]}else{this.incoming.statusCode=t.status
this.incoming.statusMessage=t.status_msg}var r=this.onIncoming(this.incoming,t.shouldkeepalive)
return r}function o(i,t,s){var e=this.incoming
if(!e){return}var n=i.slice(t,t+s)
e.push(n)}function h(i,t){this._headers.push.apply(this._headers,i)
if(t){this._url+=t}}export{e as createHTTPParser,e as default}
