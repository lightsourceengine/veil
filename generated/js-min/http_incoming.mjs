import{Readable as e}from'stream'
class t extends e{readable=true
headers={}
complete=false
url=''
method=null
httpVersion=''
statusCode=null
statusMessage=null
socket=null
constructor(e){super(),this.socket=e}addHeaders(e){if(!this.headers)this.headers={}
for(var t=0;t<e.length;t+=2)this.headers[e[t]]=e[t+1]}setTimeout(e,t){if(t)this.once('timeout',t)
this.socket.setTimeout(e,t)}}export{t as IncomingMessage,t as default}
