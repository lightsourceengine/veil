const{native:t}=import.meta
function r(t,r,e,n,i,f){if(r>i||r<f)throw new TypeError('value is out of bounds')
if(e+n>t.length)throw new RangeError('index out of range')}function e(t,r,e){if(t+r>e)throw new RangeError('index out of range')}function n(t){switch(t){case'hex':return 0
case'base64':return 1
default:return-1}}function i(r,e){if(!i.isBuffer(this)){return new i(r,e)}if(typeof r==='number'){this.length=r>0?r>>>0:0}else if(typeof r==='string'){this.length=i.byteLength(r,e)}else if(i.isBuffer(r)||Array.isArray(r)){this.length=r.length}else{throw new TypeError('Bad arguments: Buffer(string|number|Buffer|Array)')}t(this,this.length)
if(typeof r==='string'){if(typeof e==='string'){e=n(e)
if(e!==-1){t.writeDecode(this,e,r,0,this.length)}else{this.write(r)}}else{this.write(r)}}else if(i.isBuffer(r)){r.copy(this)}else if(Array.isArray(r)){for(var f=0;f<this.length;++f){t.writeUInt8(this,r[f],f)}}}i.byteLength=function(r,e){var n=t.byteLength(r)
if(typeof e==='string'){switch(e){case'hex':return n>>>1
case'base64':var i=r.length
if(i>=4&&r.charCodeAt(i-1)===61){i--
if(r.charCodeAt(i-2)===61){i--}}return i}}return n}
i.concat=function(t){if(!Array.isArray(t)){throw new TypeError('Bad arguments: Buffer.concat([Buffer])')}var r=0
var e
for(e=0;e<t.length;++e){if(!i.isBuffer(t[e])){throw new TypeError('Bad arguments: Buffer.concat([Buffer])')}r+=t[e].length}var n=new i(r)
var f=0
for(e=0;e<t.length;++e){t[e].copy(n,f)
f+=t[e].length}return n}
i.isBuffer=t=>t instanceof i
i.prototype.equals=function(r){if(!i.isBuffer(r)){throw new TypeError('Bad arguments: buffer.equals(Buffer)')}return t.compare(this,r)==0}
i.prototype.compare=function(r){if(!i.isBuffer(r)){throw new TypeError('Bad arguments: buffer.compare(Buffer)')}return t.compare(this,r)}
i.prototype.copy=function(r,e,n,f){if(!i.isBuffer(r)){throw new TypeError('Bad arguments: buff.copy(Buffer)')}e=e===undefined?0:~~e
n=n===undefined?0:~~n
f=f===undefined?this.length:~~f
if(f>n&&e<0){throw new RangeError('Attempt to write outside buffer bounds')}return t.copy(this,r,e,n,f)}
i.prototype.write=function(r,e,i,f){if(typeof r!=='string'){throw new TypeError('Bad arguments: buff.write(string)')}e=e===undefined?0:~~e
if(r.length>0&&(e<0||e>=this.length)){throw new RangeError('Attempt to write outside buffer bounds')}var o=this.length-e
i=i===undefined?o:~~i
if(typeof f==='string'){f=n(f)
if(f!=-1){return t.writeDecode(this,f,r,e,i)}}return t.write(this,r,e,i)}
i.prototype.slice=function(r,e){r=r===undefined?0:~~r
e=e===undefined?this.length:~~e
return t.slice(this,r,e)}
i.prototype.toString=function(r,e,i){if(typeof r==='string'){r=n(r)}else{r=-1}e=e===undefined?0:~~e
i=i===undefined?this.length:~~i
return t.toString(this,r,e,i)}
i.prototype.writeUInt8=function(e,n,i){e=+e
n=n>>>0
if(!i)r(this,e,n,1,255,0)
t.writeUInt8(this,e&255,n)
return n+1}
i.prototype.writeUInt16LE=function(e,n,i){e=+e
n=n>>>0
if(!i)r(this,e,n,2,65535,0)
t.writeUInt8(this,e&255,n)
t.writeUInt8(this,e>>>8&255,n+1)
return n+2}
i.prototype.writeUInt32LE=function(e,n,i){e=+e
n=n>>>0
if(!i)r(this,e,n,4,-1>>>0,0)
t.writeUInt8(this,e>>>24&255,n+3)
t.writeUInt8(this,e>>>16&255,n+2)
t.writeUInt8(this,e>>>8&255,n+1)
t.writeUInt8(this,e&255,n)
return n+4}
i.prototype.readUInt8=function(r,n){r=r>>>0
if(!n)e(r,1,this.length)
return t.readUInt8(this,r)}
i.prototype.readInt8=function(r,n){r=r>>>0
if(!n)e(r,1,this.length)
var i=t.readUInt8(this,r)
return!(i&128)?i:(255-i+1)*-1}
i.prototype.readUInt16LE=function(r,n){r=r>>>0
if(!n)e(r,2,this.length)
return t.readUInt8(this,r)|t.readUInt8(this,r+1)<<8}
i.prototype.fill=function(r){if(typeof r==='number'){r=r&255
for(var e=0;e<this.length;e++){t.writeUInt8(this,r,e)}}return this}
const f=()=>{throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object')}
const o=(r,e,n)=>{const o=t.fromArrayBuffer(r,e,n)
if(o){return o}if(i.isBuffer(r)||typeof r==='string'||Array.isArray(r)){return new i(r,e)}f()}
i.from=o
global.Buffer=i
export{i as Buffer,i as default}
