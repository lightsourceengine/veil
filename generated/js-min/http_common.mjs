import{IncomingMessage as t}from'http_incoming'
import i from'http_parser'
const s=s=>{var h=new i(s)
return h.OnHeaders=r,h.OnHeadersComplete=n,h.OnBody=o,h.OnMessageComplete=e,h._IncomingMessage=t,h}
function e(){var t=this.incoming
if(!t)return
t.complete=true,t.push(null),t.socket.resume()}function n(t){var s=t.headers,e=t.url
if(!e)e=this._url,this.url=''
if(!s)s=this._headers,this._headers=[]
if(this.incoming=new this._IncomingMessage(this.socket),this.incoming.url=e,this.incoming.httpVersion=t.http_major+'.'+t.http_minor,this.incoming.addHeaders(s),'number'===typeof t.method)this.incoming.method=i.methods[t.method]
else this.incoming.statusCode=t.status,this.incoming.statusMessage=t.status_msg
var n=this.onIncoming(this.incoming,t.shouldkeepalive)
return n}function o(t,i,s){var e=this.incoming
if(!e)return
var n=t.slice(i,i+s)
e.push(n)}function r(t,i){if(this._headers.push.apply(this._headers,t),i)this._url+=i}export{s as createHTTPParser,s as default}
