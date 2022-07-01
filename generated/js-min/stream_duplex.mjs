import{Readable as t}from'stream_readable'
import{Writable as e}from'stream_writable'
import{EventEmitter as o}from'events'
const p=Symbol.for('constructor')
class Duplex extends o{constructor(o){super(),t[p](this,o),o=o||{},o._isDuplex=true,e[p](this,o)}}Object.setPrototypeOf(Duplex.prototype,t.prototype),Object.setPrototypeOf(Duplex,t)
{const t=Object.keys(e.prototype)
for(let o=0;o<t.length;o++){const p=t[o]
if(!Duplex.prototype[p])Duplex.prototype[p]=e.prototype[p]}}export{Duplex,Duplex as default}
