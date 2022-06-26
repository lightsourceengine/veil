import{Readable as t}from'stream_readable'
import{Writable as o}from'stream_writable'
import{EventEmitter as e}from'events'
const r=Symbol.for('constructor')
class p extends e{constructor(e){super(),t[r](this,e),e=e||{},e._isDuplex=true,o[r](this,e)}}Object.setPrototypeOf(p.prototype,t.prototype),Object.setPrototypeOf(p,t)
{const t=Object.keys(o.prototype)
for(let e=0;e<t.length;e++){const r=t[e]
if(!p.prototype[r])p.prototype[r]=o.prototype[r]}}export{p as Duplex,p as default}
