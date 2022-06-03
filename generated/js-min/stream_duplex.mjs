import t from'util'
import{Readable as r}from'stream_readable'
import{Writable as e}from'stream_writable'
function o(t){if(!(this instanceof o)){return new o(t)}r.call(this,t)
t=t||{}
t._isDuplex=true
e.call(this,t)}t.inherits(o,r)
var i=Object.keys(e.prototype)
for(var a=0;a<i.length;++a){var p=i[a]
if(!o.prototype[p]){o.prototype[p]=e.prototype[p]}}export{o as Duplex,o as default}
