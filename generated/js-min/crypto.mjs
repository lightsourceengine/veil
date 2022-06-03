const{base64Encode:e,shaEncode:t,rsaVerify:r}=import.meta.native
var a={sha1:4,sha256:6}
var n=['sha1','sha256']
function i(e){if(!(this instanceof i)){return new i(e)}e=e.toLowerCase()
if(n.indexOf(e)<0){throw new Error('Unknown signing algorithm.'+'Please use crypto.getSignatures()')}Object.defineProperty(this,'hashtype',{value:e,enumerable:true})}i.prototype.update=function(e){if(this.data){if(Buffer.isBuffer(e)){this.data=Buffer.concat([this.data,e])
return}this.data=Buffer.concat([this.data,new Buffer(e)])
return}if(Buffer.isBuffer(e)){this.data=e
return}this.data=new Buffer(e)}
i.prototype.verify=function(e,n){if(this.data){var i=a[this.hashtype]
var f=t(this.data,i)
return r(i,f,e,n)}throw new Error('verify shouldn\'t be called on an empty Verify')}
function f(e){if(!(this instanceof f)){return new f(e)}if(n.indexOf(e)<0){throw new Error('Unknown hashing algorithm. Please use crypto.getHashes()')}Object.defineProperty(this,'hashtype',{value:e,writable:false,enumerable:true})}f.prototype.update=function(e){if(this.data){if(Buffer.isBuffer(e)){this.data=Buffer.concat(this.data,e)
return}this.data=Buffer.concat([this.data,new Buffer(e)])
return}this.data=new Buffer(e)}
f.prototype.digest=function(r){if(this._finished){throw new Error('Digest can not be called twice on the same Hash object')}var n
var i=a[this.hashtype]
n=t(this.data,i)
if(r==='base64'){n=e(n)}else if(r==='hex'){n=n.toString('hex')}Object.defineProperty(this,'_finished',{value:true,writable:false,enumerable:false})
return n}
function s(){return n}function h(e){return new f(e)}function o(e){return new i(e)}const u={createHash:h,getHashes:s,createVerify:o}
export{h as createHash,o as createVerify,u as default,s as getHashes}
