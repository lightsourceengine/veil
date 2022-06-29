import{Writable as e}from'stream'
class t extends e{writable=true
_hasBody=true
finished=false
_sentHeader=false
_connected=false
_chunks=[]
socket=null
_header=null
_headers={}
end(e,t,s){if('function'===typeof e)s=e,e=null
else if('function'===typeof t)s=t,t=null
if(this.finished)return false
if(!this._header)this._implicitHeader()
if(e)this.write(e,t)
if('function'===typeof s)this.once('finish',s)
return this._send('',(()=>this.emit('finish'))),this.finished=true,this.emit('prefinish'),true}_send(e,t,s){if('function'===typeof t)s=t
if(!this._sentHeader)this._chunks.push(this._header+'\r\n'),this._sentHeader=true
if(!this._connected)return this._chunks.push(e),false
else while(this._chunks.length)this.socket.write(this._chunks.shift(),t,s)
if(this.socket)return this.socket.write(e,t,s)
return false}write(e,t,s){if(!this._header)this._implicitHeader()
if(!this._hasBody)return true
return this._send(e,t,s)}_storeHeader(e){let t=''
if(this._headers)for(const e of Object.keys(this._headers))t+=e+': '+this._headers[e]+'\r\n'
this._header=e+t}setHeader(e,t){if('string'!==typeof e)throw new TypeError('Name must be string.')
if(null===t||void 0===t)throw new Error('value required in setHeader('+e+', value)')
if(null===this._headers)this._headers={}
this._headers[e.toLowerCase()]=t}removeHeader(e){if(null!==this._headers)delete this._headers[e]}getHeader(e){return this._headers[e]}setTimeout(e,t){if(t)this.once('timeout',t)
if(!this.socket)this.once('socket',(t=>t.setTimeout(e)))
else this.socket.setTimeout(e)}}export{t as OutgoingMessage,t as default}
