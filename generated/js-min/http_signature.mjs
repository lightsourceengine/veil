import e from'crypto'
function r(e){var r=false
var t=false
if(e.headers['authorization']){t='authorization'
r=e.headers['authorization']}else if(e.headers['Authorization']){t='Authorization'
r=e.headers['Authorization']}if(!r){throw new Error('Authorization header is not present, invalid request.')}var a={'request-line':e.method+' '+e.url+' HTTP/'+e.httpVersion,'(request-target)':'(request-target): '+e.method.toLowerCase()+' '+e.url}
for(var i in e.headers){if(i!==t){var o=i.toLowerCase()
a[o]=o+': '+e.headers[i]}}var s={}
var n=0
var h=['keyId=','signature=','algorithm=','headers=']
for(var u=0;u<h.length;u++){if((n=r.indexOf(h[u]))<0){throw new Error('Couldn\'t find header: ',h[u])}n+=h[u].length+1
var d=r.substring(n).indexOf('"')+n
s[h[u].slice(0,-1)]=r.substring(n,d)}return{requestObject:a,authObject:s}}function t(r,t){var a=r.authObject.algorithm.toLowerCase()
if(a.indexOf('rsa-sha')<0){throw new Error('Only rsa-shaX signatures are supported')}var i=e.createVerify(a.split('-')[1])
var o=r.authObject.headers.split(' ')
for(var s=0;s<o.length;s++){i.update(r.requestObject[o[s]])
if(s+1!==o.length){i.update('\n')}}return i.verify(t,r.authObject.signature)}const a={verifySignature:t,parseRequest:r}
export{a as default,r as parseRequest,t as verifySignature}
