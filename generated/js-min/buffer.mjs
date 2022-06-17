const{native:t}=import.meta
function e(t,e,r,n,i,f){if(e>i||e<f)throw new TypeError('value is out of bounds')
if(r+n>t.length)throw new RangeError('index out of range')}function r(t,e,r){if(t+e>r)throw new RangeError('index out of range')}function n(t){switch(t){case'hex':return 0
case'base64':return 1
default:return-1}}function i(e,r){if(!i.isBuffer(this)){return new i(e,r)}if(typeof e==='number'){this.length=e>0?e>>>0:0}else if(typeof e==='string'){this.length=i.byteLength(e,r)}else if(i.isBuffer(e)||Array.isArray(e)){this.length=e.length}else{throw new TypeError('Bad arguments: Buffer(string|number|Buffer|Array)')}t(this,this.length)
if(typeof e==='string'){if(typeof r==='string'){r=n(r)
if(r!==-1){t.writeDecode(this,r,e,0,this.length)}else{this.write(e)}}else{this.write(e)}}else if(i.isBuffer(e)){e.copy(this)}else if(Array.isArray(e)){for(var f=0;f<this.length;++f){t.writeUInt8(this,e[f],f)}}}i.byteLength=function(e,r){var n=t.byteLength(e)
if(typeof r==='string'){switch(r){case'hex':return n>>>1
case'base64':var i=e.length
if(i>=4&&e.charCodeAt(i-1)===61){i--
if(e.charCodeAt(i-2)===61){i--}}return i}}return n}
i.concat=function(t){if(!Array.isArray(t)){throw new TypeError('Bad arguments: Buffer.concat([Buffer])')}var e=0
var r
for(r=0;r<t.length;++r){if(!i.isBuffer(t[r])){throw new TypeError('Bad arguments: Buffer.concat([Buffer])')}e+=t[r].length}var n=new i(e)
var f=0
for(r=0;r<t.length;++r){t[r].copy(n,f)
f+=t[r].length}return n}
i.isBuffer=t=>t instanceof i
i.prototype.equals=function(e){if(!i.isBuffer(e)){throw new TypeError('Bad arguments: buffer.equals(Buffer)')}return t.compare(this,e)==0}
i.prototype.compare=function(e){if(!i.isBuffer(e)){throw new TypeError('Bad arguments: buffer.compare(Buffer)')}return t.compare(this,e)}
i.prototype.copy=function(e,r,n,f){if(!i.isBuffer(e)){throw new TypeError('Bad arguments: buff.copy(Buffer)')}r=r===undefined?0:~~r
n=n===undefined?0:~~n
f=f===undefined?this.length:~~f
if(f>n&&r<0){throw new RangeError('Attempt to write outside buffer bounds')}return t.copy(this,e,r,n,f)}
i.prototype.write=function(e,r,i,f){if(typeof e!=='string'){throw new TypeError('Bad arguments: buff.write(string)')}r=r===undefined?0:~~r
if(e.length>0&&(r<0||r>=this.length)){throw new RangeError('Attempt to write outside buffer bounds')}var o=this.length-r
i=i===undefined?o:~~i
if(typeof f==='string'){f=n(f)
if(f!=-1){return t.writeDecode(this,f,e,r,i)}}return t.write(this,e,r,i)}
i.prototype.slice=function(e,r){e=e===undefined?0:~~e
r=r===undefined?this.length:~~r
return t.slice(this,e,r)}
i.prototype.toString=function(e,r,i){if(typeof e==='string'){e=n(e)}else{e=-1}r=r===undefined?0:~~r
i=i===undefined?this.length:~~i
return t.toString(this,e,r,i)}
i.prototype.writeUInt8=function(r,n,i){r=+r
n=n>>>0
if(!i)e(this,r,n,1,255,0)
t.writeUInt8(this,r&255,n)
return n+1}
i.prototype.writeUInt16LE=function(r,n,i){r=+r
n=n>>>0
if(!i)e(this,r,n,2,65535,0)
t.writeUInt8(this,r&255,n)
t.writeUInt8(this,r>>>8&255,n+1)
return n+2}
i.prototype.writeUInt32LE=function(r,n,i){r=+r
n=n>>>0
if(!i)e(this,r,n,4,-1>>>0,0)
t.writeUInt8(this,r>>>24&255,n+3)
t.writeUInt8(this,r>>>16&255,n+2)
t.writeUInt8(this,r>>>8&255,n+1)
t.writeUInt8(this,r&255,n)
return n+4}
i.prototype.readUInt8=function(e,n){e=e>>>0
if(!n)r(e,1,this.length)
return t.readUInt8(this,e)}
i.prototype.readInt8=function(e,n){e=e>>>0
if(!n)r(e,1,this.length)
var i=t.readUInt8(this,e)
return!(i&128)?i:(255-i+1)*-1}
i.prototype.readUInt16LE=function(e,n){e=e>>>0
if(!n)r(e,2,this.length)
return t.readUInt8(this,e)|t.readUInt8(this,e+1)<<8}
i.prototype.fill=function(e){if(typeof e==='number'){e=e&255
for(var r=0;r<this.length;r++){t.writeUInt8(this,e,r)}}return this}
const f=()=>{throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object')}
const o=(e,r,n)=>{const o=t.fromArrayBuffer(e,r,n)
if(o){return o}if(i.isBuffer(e)||typeof e==='string'||Array.isArray(e)){return new i(e,r)}f()}
i.from=o
i.alloc=(t,e=0,r='utf8')=>new i(t,r).fill(e)
i.allocUnsafe=t=>new i(t)
i.allocUnsafeSlow=i.allocUnsafe
global.Buffer=i
export{i as Buffer,i as default}
