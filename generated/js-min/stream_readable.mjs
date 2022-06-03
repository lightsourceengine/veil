import e from'stream_internal'
import{Duplex as t}from'stream'
import{Writable as i}from'stream_writable'
import r from'util'
function n(e){e=e||{}
this.buffer=[]
this.length=0
this.defaultEncoding=e.defaultEncoding||'utf8'
this.flowing=false
this.ended=false
this.endEmitted=false}class s extends e{constructor(e){super()
this._readableState=new n(e)}read(e){var t=this._readableState
var i
if(!r.isNumber(e)||e>t.length){e=t.length}else if(e<0){e=0}if(e>0){i=l(this,e)}else{i=null}return i}on(e,t){var i=super.on(this,e,t)
if(e==='data'){this.resume()}return i}isPaused(){return!this._readableState.flowing}pause(){var e=this._readableState
if(e.flowing){e.flowing=false
this.emit('pause')}return this}resume(){var e=this._readableState
if(!e.flowing){e.flowing=true
this.read()}return this}error(e){this.emit('error',e)}push(e,t){var i=this._readableState
if(e===null){o(this)}else if(!r.isString(e)&&!Buffer.isBuffer(e)){this.error(TypeError('Invalid chunk'))}else if(i.ended){this.error(Error('stream.push() after EOF'))}else{if(r.isString(e)){t=t||i.defaultEncoding
e=new Buffer(e,t)}if(i.flowing){u(this,e)}else{i.length+=e.length
i.buffer.push(e)
this.emit('readable')}}}pipe(e,r){if(!(e instanceof i||e instanceof t)){throw new TypeError('pipe excepts stream.Writable or'+' stream.Duplex as argument')}r=r||{end:true}
var n={readableListener:a.bind(this),dataListener:d.bind(e),endListener:f.bind(e)}
this.on('readable',n.readableListener)
this.on('data',n.dataListener)
if(r.end){this.on('end',n.endListener)}this._piped=this._piped||[]
this._piped.push(e)
this._piped_listeners=this._piped_listeners||[]
this._piped_listeners.push(n)
return e}unpipe(e){if(e===undefined){this.removeAllListeners()
this._piped=undefined
this._piped_listeners=undefined
return}var t=this._piped.indexOf(e)
if(t===-1){return}this._piped.splice(t,1)
var i=this._piped_listeners.splice(t,1)[0]
this.removeListener('readable',i.readableListener)
this.removeListener('data',i.dataListener)
this.removeListener('end',i.endListener)
return e}}function a(){this.resume()}function d(e){this.write(e)}function f(){this.end()}function l(e,t){var i=e._readableState
var r
if(!t){t=i.length}if(i.buffer.length===0||i.length===0){r=null}else if(t>=i.length){r=Buffer.concat(i.buffer)
i.buffer=[]
i.length=0
u(e,r)}else{throw new Error('not implemented')}return r}function h(e){var t=e._readableState
if(e.length>0||!t.ended){throw new Error('stream ended on non-EOF stream')}if(!t.endEmitted){t.endEmitted=true
e.emit('end')}}function u(e,t){var i=e._readableState
if(i.buffer.length===0||i.length===0){e.emit('data',t)}if(i.ended&&i.length===0){h(e)}}function o(e){var t=e._readableState
t.ended=true
if(t.length===0){h(e)}}export{s as Readable,s as default}
