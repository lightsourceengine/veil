import e from'stream_internal'
import{Duplex as t}from'stream'
import{Writable as i}from'stream_writable'
const r=Symbol.for('constructor')
function n(e){e=e||{},this.buffer=[],this.length=0,this.defaultEncoding=e.defaultEncoding||'utf8',this.flowing=false,this.ended=false,this.endEmitted=false}class s extends e{static[r](e,t){e._readableState=new n(t)}constructor(e){super(),s[r](this,e)}read(e){var t=this._readableState,i
if('number'!==typeof e||e>t.length)e=t.length
else if(e<0)e=0
if(e>0)i=l(this,e)
else i=null
return i}on(e,t){var i=super.on(e,t)
if('data'===e)this.resume()
return i}isPaused(){return!this._readableState.flowing}pause(){var e=this._readableState
if(e.flowing)e.flowing=false,this.emit('pause')
return this}resume(){var e=this._readableState
if(!e.flowing)e.flowing=true,this.read()
return this}error(e){this.emit('error',e)}push(e,t){var i=this._readableState
if(null===e)u(this)
else if('string'!==typeof e&&!Buffer.isBuffer(e))this.error(TypeError('Invalid chunk'))
else if(i.ended)this.error(Error('stream.push() after EOF'))
else{if('string'===typeof e)t=t||i.defaultEncoding,e=new Buffer(e,t)
if(i.flowing)o(this,e)
else i.length+=e.length,i.buffer.push(e),this.emit('readable')}}pipe(e,r){if(!(e instanceof i||e instanceof t))throw new TypeError('pipe excepts stream.Writable or'+' stream.Duplex as argument')
r=r||{end:true}
var n={readableListener:a.bind(this),dataListener:d.bind(e),endListener:f.bind(e)}
if(this.on('readable',n.readableListener),this.on('data',n.dataListener),r.end)this.on('end',n.endListener)
return this._piped=this._piped||[],this._piped.push(e),this._piped_listeners=this._piped_listeners||[],this._piped_listeners.push(n),e}unpipe(e){if(void 0===e)return this.removeAllListeners(),this._piped=void 0,this._piped_listeners=void 0,void 0
var t=this._piped.indexOf(e)
if(-1===t)return
this._piped.splice(t,1)
var i=this._piped_listeners.splice(t,1)[0]
return this.removeListener('readable',i.readableListener),this.removeListener('data',i.dataListener),this.removeListener('end',i.endListener),e}}function a(){this.resume()}function d(e){this.write(e)}function f(){this.end()}function l(e,t){var i=e._readableState,r
if(!t)t=i.length
if(0===i.buffer.length||0===i.length)r=null
else if(t>=i.length)r=Buffer.concat(i.buffer),i.buffer=[],i.length=0,o(e,r)
else throw new Error('not implemented')
return r}function h(e){var t=e._readableState
if(e.length>0||!t.ended)throw new Error('stream ended on non-EOF stream')
if(!t.endEmitted)t.endEmitted=true,e.emit('end')}function o(e,t){var i=e._readableState
if(0===i.buffer.length||0===i.length)e.emit('data',t)
if(i.ended&&0===i.length)h(e)}function u(e){var t=e._readableState
if(t.ended=true,0===t.length)h(e)}export{s as Readable,s as default}
