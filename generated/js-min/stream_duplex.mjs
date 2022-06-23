import t from'util'
import{Readable as r}from'stream_readable'
import{Writable as e}from'stream_writable'
function o(t){if(!(this instanceof o))return new o(t)
r.call(this,t),t=t||{},t._isDuplex=true,e.call(this,t)}t.inherits(o,r)
for(var i=Object.keys(e.prototype),p=0;p<i.length;++p){var a=i[p]
if(!o.prototype[a])o.prototype[a]=e.prototype[a]}export{o as Duplex,o as default}
