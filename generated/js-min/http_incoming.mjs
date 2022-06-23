import t from'util'
import e from'stream'
function s(t){e.Readable.call(this),this.socket=t,this.readable=true,this.headers={},this.complete=false,this.url='',this.method=null,this.httpVersion='',this.statusCode=null,this.statusMessage=null}t.inherits(s,e.Readable),s.prototype.read=function(t){return this.read=e.Readable.prototype.read,this.read(t)},s.prototype.addHeaders=function(t){if(!this.headers)this.headers={}
for(var e=0;e<t.length;e+=2)this.headers[t[e]]=t[e+1]},s.prototype.setTimeout=function(t,e){if(e)this.once('timeout',e)
this.socket.setTimeout(t,e)}
export{s as IncomingMessage,s as default}
