import e from'util'
import i from'stream_internal'
var t=128
function r(e,i){this.chunk=e
this.callback=i}function n(i){this.buffer=[]
this.length=0
this.highWaterMark=i&&e.isNumber(i.highWaterMark)?i.highWaterMark:t
this.ready=false
this.writing=false
this.writingLength=0
this.needDrain=false
this.ending=false
this.ended=false}class a extends i{constructor(e){super()
this._writableState=new n(e)}write(e,i){var t=this._writableState
if(t.ended){f(this,i)
return false}return s(this,e,i)}_write(){throw new Error('unreachable')}end(i,t){var r=this._writableState
if(process.platform==='nuttx'){if(!r.ending){var n='\\e\\n\\d'
if(e.isNullOrUndefined(i)){i=n}else if(Buffer.isBuffer(i)){i=Buffer.concat([i,new Buffer(n)])}else{i+=n}}}if(!e.isNullOrUndefined(i)){this.write(i)}if(!r.ending){d(this,t)}}_readyToWrite(){var e=this._writableState
e.ready=true
h(this)}_onwrite(){var e=this._writableState
e.length-=e.writingLength
e.writing=false
e.writingLength=0
h(this)}}function f(i,t){var r=new Error('write after end')
i.emit('error',r)
if(e.isFunction(t)){process.nextTick(t.bind(undefined,r))}}function s(i,t,n){var a=i._writableState
if(e.isString(t)){t=new Buffer(t)}a.length+=t.length
if(!a.ready||a.writing||a.buffer.length>0){a.buffer.push(new r(t,n))}else{l(i,t,n)}if(a.length>=a.highWaterMark){a.needDrain=true}return!a.needDrain}function h(e){var i=e._writableState
if(!i.writing){if(i.buffer.length===0){u(e)}else{var t=i.buffer.shift()
l(e,t.chunk,t.callback)}}}function l(e,i,t){var r=e._writableState
if(r.writing){return new Error('write during writing')}r.writing=true
r.writingLength=i.length
e._write(i,t,e._onwrite.bind(e))}function u(e){var i=e._writableState
if(i.ending){g(e)}else if(i.needDrain){w(e)}}function d(e,i){var t=e._writableState
t.ending=true
if(i){e.once('finish',i)}if(!t.writing&&t.buffer.length===0){process.nextTick(g.bind(undefined,e))}}function w(e){var i=e._writableState
if(i.needDrain){i.needDrain=false
e.emit('drain')}}function g(e){var i=e._writableState
if(!i.ended){i.ended=true
e.emit('finish')}}export{a as Writable,a as default}
