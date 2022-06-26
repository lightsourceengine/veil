import e from'stream_internal'
const t=128,i=Symbol.for('constructor')
function r(e,t){this.chunk=e,this.callback=t}function n(e){this.buffer=[],this.length=0,this.highWaterMark=e&&'number'===typeof e.highWaterMark?e.highWaterMark:t,this.ready=false,this.writing=false,this.writingLength=0,this.needDrain=false,this.ending=false,this.ended=false}class a extends e{static[i](e,t){e._writableState=new n(t)}constructor(e){super(),a[i](this,e)}write(e,t){var i=this._writableState
if(i.ended)return f(this,t),false
return s(this,e,t)}_write(){throw new Error('unreachable')}end(e,t){var i=this._writableState
if('nuttx'===process.platform)if(!i.ending){var r='\\e\\n\\d'
if(void 0===e||null===e)e=r
else if(Buffer.isBuffer(e))e=Buffer.concat([e,new Buffer(r)])
else e+=r}if(void 0!==e&&null!==e)this.write(e)
if(!i.ending)o(this,t)}_readyToWrite(){var e=this._writableState
e.ready=true,h(this)}_onwrite(){var e=this._writableState
e.length-=e.writingLength,e.writing=false,e.writingLength=0,h(this)}}function f(e,t){var i=new Error('write after end')
if(e.emit('error',i),'function'===typeof t)process.nextTick(t.bind(void 0,i))}function s(e,t,i){var n=e._writableState
if('string'===typeof t)t=new Buffer(t)
if(n.length+=t.length,!n.ready||n.writing||n.buffer.length>0)n.buffer.push(new r(t,i))
else l(e,t,i)
if(n.length>=n.highWaterMark)n.needDrain=true
return!n.needDrain}function h(e){var t=e._writableState
if(!t.writing)if(0===t.buffer.length)u(e)
else{var i=t.buffer.shift()
l(e,i.chunk,i.callback)}}function l(e,t,i){var r=e._writableState
if(r.writing)return new Error('write during writing')
r.writing=true,r.writingLength=t.length,e._write(t,i,e._onwrite.bind(e))}function u(e){var t=e._writableState
if(t.ending)d(e)
else if(t.needDrain)w(e)}function o(e,t){var i=e._writableState
if(i.ending=true,t)e.once('finish',t)
if(!i.writing&&0===i.buffer.length)process.nextTick(d.bind(void 0,e))}function w(e){var t=e._writableState
if(t.needDrain)t.needDrain=false,e.emit('drain')}function d(e){var t=e._writableState
if(!t.ended)t.ended=true,e.emit('finish')}export{a as Writable,a as default}
