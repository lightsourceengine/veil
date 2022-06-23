import i from'util'
import{IncomingMessage as t}from'http_incoming'
import s from'http_parser'
const e=i=>{var e=new s(i)
return e.OnHeaders=h,e.OnHeadersComplete=o,e.OnBody=r,e.OnMessageComplete=n,e._IncomingMessage=t,e}
function n(){var i=this.incoming
if(!i)return
i.complete=true,i.push(null),i.socket.resume()}function o(t){var e=t.headers,n=t.url
if(!n)n=this._url,this.url=''
if(!e)e=this._headers,this._headers=[]
if(this.incoming=new this._IncomingMessage(this.socket),this.incoming.url=n,this.incoming.httpVersion=t.http_major+'.'+t.http_minor,this.incoming.addHeaders(e),i.isNumber(t.method))this.incoming.method=s.methods[t.method]
else this.incoming.statusCode=t.status,this.incoming.statusMessage=t.status_msg
var o=this.onIncoming(this.incoming,t.shouldkeepalive)
return o}function r(i,t,s){var e=this.incoming
if(!e)return
var n=i.slice(t,t+s)
e.push(n)}function h(i,t){if(this._headers.push.apply(this._headers,i),t)this._url+=t}export{e as createHTTPParser,e as default}
