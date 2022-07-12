const{native:t}=import.meta
function r(t,r,e,i,n,o){if(r>n||r<o)throw new TypeError('value is out of bounds')
if(e+i>t.length)throw new RangeError('index out of range')}function e(t,r,e){if(t+r>e)throw new RangeError('index out of range')}function i(t){switch(t){case'hex':return 0
case'base64':return 1
default:return-1}}function n(r,e){if(!n.isBuffer(this))return new n(r,e)
if('number'===typeof r)this.length=r>0?r>>>0:0
else if('string'===typeof r)this.length=n.byteLength(r,e)
else if(n.isBuffer(r)||Array.isArray(r))this.length=r.length
else throw new TypeError('Bad arguments: Buffer(string|number|Buffer|Array)')
if(t(this,this.length),'string'===typeof r)if('string'===typeof e)if(e=i(e),-1!==e)t.writeDecode(this,e,r,0,this.length)
else this.write(r)
else this.write(r)
else if(n.isBuffer(r))r.copy(this)
else if(Array.isArray(r))for(var o=0;o<this.length;++o)t.writeUInt8(this,r[o],o)}n.byteLength=function(r,e){var i=t.byteLength(r)
if('string'===typeof e)switch(e){case'hex':return i>>>1
case'base64':var n=r.length
if(n>=4&&61===r.charCodeAt(n-1))if(n--,61===r.charCodeAt(n-2))n--
return n}return i},n.concat=function(t){if(!Array.isArray(t))throw new TypeError('Bad arguments: Buffer.concat([Buffer])')
var r=0,e
for(e=0;e<t.length;++e){if(!n.isBuffer(t[e]))throw new TypeError('Bad arguments: Buffer.concat([Buffer])')
r+=t[e].length}var i=new n(r),o=0
for(e=0;e<t.length;++e)t[e].copy(i,o),o+=t[e].length
return i},n.isBuffer=t=>t instanceof n,n.prototype.equals=function(r){if(!n.isBuffer(r))throw new TypeError('Bad arguments: buffer.equals(Buffer)')
return 0==t.compare(this,r)},n.prototype.compare=function(r){if(!n.isBuffer(r))throw new TypeError('Bad arguments: buffer.compare(Buffer)')
return t.compare(this,r)},n.prototype.copy=function(r,e,i,o){if(!n.isBuffer(r))throw new TypeError('Bad arguments: buff.copy(Buffer)')
if(e=void 0===e?0:~~e,i=void 0===i?0:~~i,o=void 0===o?this.length:~~o,o>i&&e<0)throw new RangeError('Attempt to write outside buffer bounds')
return t.copy(this,r,e,i,o)},n.prototype.write=function(r,e,n,o){if('string'!==typeof r)throw new TypeError('Bad arguments: buff.write(string)')
if(e=void 0===e?0:~~e,r.length>0&&(e<0||e>=this.length))throw new RangeError('Attempt to write outside buffer bounds')
var f=this.length-e
if(n=void 0===n?f:~~n,'string'===typeof o)if(o=i(o),-1!=o)return t.writeDecode(this,o,r,e,n)
return t.write(this,r,e,n)},n.prototype.slice=function(r,e){return r=void 0===r?0:~~r,e=void 0===e?this.length:~~e,t.slice(this,r,e)},n.prototype.toString=function(r,e,n){if('string'===typeof r)r=i(r)
else r=-1
return e=void 0===e?0:~~e,n=void 0===n?this.length:~~n,t.toString(this,r,e,n)},n.prototype.writeUInt8=function(e,i,n){if(e=+e,i>>>=0,!n)r(this,e,i,1,255,0)
return t.writeUInt8(this,255&e,i),i+1},n.prototype.writeUInt16LE=function(e,i,n){if(e=+e,i>>>=0,!n)r(this,e,i,2,65535,0)
return t.writeUInt8(this,255&e,i),t.writeUInt8(this,e>>>8&255,i+1),i+2},n.prototype.writeUInt32LE=function(e,i,n){if(e=+e,i>>>=0,!n)r(this,e,i,4,-1>>>0,0)
return t.writeUInt8(this,e>>>24&255,i+3),t.writeUInt8(this,e>>>16&255,i+2),t.writeUInt8(this,e>>>8&255,i+1),t.writeUInt8(this,255&e,i),i+4},n.prototype.readUInt8=function(r,i){if(r>>>=0,!i)e(r,1,this.length)
return t.readUInt8(this,r)},n.prototype.readInt8=function(r,i){if(r>>>=0,!i)e(r,1,this.length)
var n=t.readUInt8(this,r)
return!(128&n)?n:-1*(255-n+1)},n.prototype.readUInt16LE=function(r,i){if(r>>>=0,!i)e(r,2,this.length)
return t.readUInt8(this,r)|t.readUInt8(this,r+1)<<8},n.prototype.fill=function(r){if('number'===typeof r){r&=255
for(var e=0;e<this.length;e++)t.writeUInt8(this,r,e)}return this}
const o=()=>{throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object')},f=(r,e,i)=>{const f=t.fromArrayBuffer(r,e,i)
if(f)return f
if(n.isBuffer(r)||'string'===typeof r||Array.isArray(r))return new n(r,e)
o()},s=t=>new n(t)
n.from=f,n.alloc=(t,r=0,e='utf8')=>s(t).fill(r),n.allocUnsafe=s,n.allocUnsafeSlow=s,global.Buffer=n
export{n as Buffer,n as default}
