const{native:t}=import.meta
function r(t,r,e,n,i,o){if(r>i||r<o)throw new TypeError('value is out of bounds')
if(e+n>t.length)throw new RangeError('index out of range')}function e(t,r,e){if(t+r>e)throw new RangeError('index out of range')}function n(t){switch(t){case'hex':return 0
case'base64':return 1
default:return-1}}function i(r,e){if(!i.isBuffer(this))return new i(r,e)
if('number'===typeof r)this.length=r>0?r>>>0:0
else if('string'===typeof r)this.length=i.byteLength(r,e)
else if(i.isBuffer(r)||Array.isArray(r))this.length=r.length
else throw new TypeError('Bad arguments: Buffer(string|number|Buffer|Array)')
if(t(this,this.length),'string'===typeof r)if('string'===typeof e)if(e=n(e),-1!==e)t.writeDecode(this,e,r,0,this.length)
else this.write(r)
else this.write(r)
else if(i.isBuffer(r))r.copy(this)
else if(Array.isArray(r))for(var o=0;o<this.length;++o)t.writeUInt8(this,r[o],o)}i.byteLength=function(r,e){var n=t.byteLength(r)
if('string'===typeof e)switch(e){case'hex':return n>>>1
case'base64':var i=r.length
if(i>=4&&61===r.charCodeAt(i-1))if(i--,61===r.charCodeAt(i-2))i--
return i}return n},i.concat=function(t){if(!Array.isArray(t))throw new TypeError('Bad arguments: Buffer.concat([Buffer])')
var r=0,e
for(e=0;e<t.length;++e){if(!i.isBuffer(t[e]))throw new TypeError('Bad arguments: Buffer.concat([Buffer])')
r+=t[e].length}var n=new i(r),o=0
for(e=0;e<t.length;++e)t[e].copy(n,o),o+=t[e].length
return n},i.isBuffer=t=>t instanceof i,i.prototype.equals=function(r){if(!i.isBuffer(r))throw new TypeError('Bad arguments: buffer.equals(Buffer)')
return 0==t.compare(this,r)},i.prototype.compare=function(r){if(!i.isBuffer(r))throw new TypeError('Bad arguments: buffer.compare(Buffer)')
return t.compare(this,r)},i.prototype.copy=function(r,e,n,o){if(!i.isBuffer(r))throw new TypeError('Bad arguments: buff.copy(Buffer)')
if(e=void 0===e?0:~~e,n=void 0===n?0:~~n,o=void 0===o?this.length:~~o,o>n&&e<0)throw new RangeError('Attempt to write outside buffer bounds')
return t.copy(this,r,e,n,o)},i.prototype.write=function(r,e,i,o){if('string'!==typeof r)throw new TypeError('Bad arguments: buff.write(string)')
if(e=void 0===e?0:~~e,r.length>0&&(e<0||e>=this.length))throw new RangeError('Attempt to write outside buffer bounds')
var f=this.length-e
if(i=void 0===i?f:~~i,'string'===typeof o)if(o=n(o),-1!=o)return t.writeDecode(this,o,r,e,i)
return t.write(this,r,e,i)},i.prototype.slice=function(r,e){return r=void 0===r?0:~~r,e=void 0===e?this.length:~~e,t.slice(this,r,e)},i.prototype.toString=function(r,e,i){if('string'===typeof r)r=n(r)
else r=-1
return e=void 0===e?0:~~e,i=void 0===i?this.length:~~i,t.toString(this,r,e,i)},i.prototype.writeUInt8=function(e,n,i){if(e=+e,n>>>=0,!i)r(this,e,n,1,255,0)
return t.writeUInt8(this,255&e,n),n+1},i.prototype.writeUInt16LE=function(e,n,i){if(e=+e,n>>>=0,!i)r(this,e,n,2,65535,0)
return t.writeUInt8(this,255&e,n),t.writeUInt8(this,e>>>8&255,n+1),n+2},i.prototype.writeUInt32LE=function(e,n,i){if(e=+e,n>>>=0,!i)r(this,e,n,4,-1>>>0,0)
return t.writeUInt8(this,e>>>24&255,n+3),t.writeUInt8(this,e>>>16&255,n+2),t.writeUInt8(this,e>>>8&255,n+1),t.writeUInt8(this,255&e,n),n+4},i.prototype.readUInt8=function(r,n){if(r>>>=0,!n)e(r,1,this.length)
return t.readUInt8(this,r)},i.prototype.readInt8=function(r,n){if(r>>>=0,!n)e(r,1,this.length)
var i=t.readUInt8(this,r)
return!(128&i)?i:-1*(255-i+1)},i.prototype.readUInt16LE=function(r,n){if(r>>>=0,!n)e(r,2,this.length)
return t.readUInt8(this,r)|t.readUInt8(this,r+1)<<8},i.prototype.fill=function(r){if('number'===typeof r){r&=255
for(var e=0;e<this.length;e++)t.writeUInt8(this,r,e)}return this}
const o=()=>{throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object')},f=(r,e,n)=>{const f=t.fromArrayBuffer(r,e,n)
if(f)return f
if(i.isBuffer(r)||'string'===typeof r||Array.isArray(r))return new i(r,e)
o()}
i.from=f,i.alloc=(t,r=0,e='utf8')=>new i(t,e).fill(r),i.allocUnsafe=t=>new i(t),i.allocUnsafeSlow=i.allocUnsafe,global.Buffer=i
export{i as Buffer,i as default}
