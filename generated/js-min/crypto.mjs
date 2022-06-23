const{base64Encode:e,shaEncode:t,rsaVerify:r}=import.meta.native
var a={sha1:4,sha256:6},i=['sha1','sha256']
function n(e){if(!(this instanceof n))return new n(e)
if(e=e.toLowerCase(),i.indexOf(e)<0)throw new Error('Unknown signing algorithm.'+'Please use crypto.getSignatures()')
Object.defineProperty(this,'hashtype',{value:e,enumerable:true})}function f(e){if(!(this instanceof f))return new f(e)
if(i.indexOf(e)<0)throw new Error('Unknown hashing algorithm. Please use crypto.getHashes()')
Object.defineProperty(this,'hashtype',{value:e,writable:false,enumerable:true})}function s(){return i}function o(e){return new f(e)}function h(e){return new n(e)}n.prototype.update=function(e){if(this.data){if(Buffer.isBuffer(e))return this.data=Buffer.concat([this.data,e]),void 0
return this.data=Buffer.concat([this.data,new Buffer(e)]),void 0}if(Buffer.isBuffer(e))return this.data=e,void 0
this.data=new Buffer(e)},n.prototype.verify=function(e,i){if(this.data){var n=a[this.hashtype],f=t(this.data,n)
return r(n,f,e,i)}throw new Error('verify shouldn\'t be called on an empty Verify')},f.prototype.update=function(e){if(this.data){if(Buffer.isBuffer(e))return this.data=Buffer.concat(this.data,e),void 0
return this.data=Buffer.concat([this.data,new Buffer(e)]),void 0}this.data=new Buffer(e)},f.prototype.digest=function(r){if(this._finished)throw new Error('Digest can not be called twice on the same Hash object')
var i,n=a[this.hashtype]
if(i=t(this.data,n),'base64'===r)i=e(i)
else if('hex'===r)i=i.toString('hex')
return Object.defineProperty(this,'_finished',{value:true,writable:false,enumerable:false}),i}
const u={createHash:o,getHashes:s,createVerify:h}
export{o as createHash,h as createVerify,u as default,s as getHashes}
