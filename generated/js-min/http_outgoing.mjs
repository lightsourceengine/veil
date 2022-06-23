import e from'util'
import t from'stream'
function i(){t.Writable.call(this),this.writable=true,this._hasBody=true,this.finished=false,this._sentHeader=false,this._connected=false,this._chunks=[],this.socket=null,this._header=null,this._headers={}}e.inherits(i,t.Writable),i.prototype.end=function(t,i,s){var r=this
if(e.isFunction(t))s=t,t=null
else if(e.isFunction(i))s=i,i=null
if(this.finished)return false
if(!this._header)this._implicitHeader()
if(t)this.write(t,i)
if(e.isFunction(s))this.once('finish',s)
return this._send('',(function(){r.emit('finish')})),this.finished=true,this.emit('prefinish'),true},i.prototype._send=function(t,i,s){if(e.isFunction(i))s=i
if(!this._sentHeader)this._chunks.push(this._header+'\r\n'),this._sentHeader=true
if(!this._connected)return this._chunks.push(t),false
else while(this._chunks.length)this.socket.write(this._chunks.shift(),i,s)
if(this.socket)return this.socket.write(t,i,s)
return false},i.prototype.write=function(e,t,i){if(!this._header)this._implicitHeader()
if(!this._hasBody)return true
return this._send(e,t,i)},i.prototype._storeHeader=function(e){var t='',i
if(this._headers){i=Object.keys(this._headers)
for(var s=0;s<i.length;s++){var r=i[s]
t+=r+': '+this._headers[r]+'\r\n'}}this._header=e+t},i.prototype.setHeader=function(t,i){if('string'!=typeof t)throw new TypeError('Name must be string.')
if(e.isNullOrUndefined(i))throw new Error('value required in setHeader('+t+', value)')
if(null===this._headers)this._headers={}
this._headers[t.toLowerCase()]=i},i.prototype.removeHeader=function(e){if(null===this._headers)return
delete this._headers[e]},i.prototype.getHeader=function(e){return this._headers[e]},i.prototype.setTimeout=function(e,t){if(t)this.once('timeout',t)
if(!this.socket)this.once('socket',(function(t){t.setTimeout(e)}))
else this.socket.setTimeout(e)}
export{i as OutgoingMessage,i as default}
