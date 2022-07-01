import{Readable as e}from'stream'
class IncomingMessage extends e{readable=true
headers={}
complete=false
url=''
method=null
httpVersion=''
statusCode=null
statusMessage=null
socket=null
constructor(e){super(),this.socket=e}addHeaders(e){if(!this.headers)this.headers={}
for(var s=0;s<e.length;s+=2)this.headers[e[s]]=e[s+1]}setTimeout(e,s){if(s)this.once('timeout',s)
this.socket.setTimeout(e,s)}}export{IncomingMessage,IncomingMessage as default}
