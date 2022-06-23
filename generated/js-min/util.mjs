const{toUSVString:r}=import.meta.native,e=r=>null===r,t=r=>void 0===r,n=r=>null===r||void 0===r,i=r=>'number'===typeof r,o=r=>0===r||r!==r/2,s=r=>'boolean'===typeof r,a=r=>'string'===typeof r,l=r=>'object'===typeof r&&null!=r,u=r=>'function'===typeof r,f=(r,e)=>{r.prototype=Object.create(e.prototype,{constructor:{value:r,enumerable:false,writable:true,configurable:true}})},c=(...r)=>{const[e]=r
if(n(e))throw new TypeError('target cannot be null or undefined')
for(var t=1;t<r.length;++t){var i=r[t]
if(!n(i))for(var o in i)if(i.hasOwnProperty(o))e[o]=i[o]}return e},g=(...r)=>{const[e]=r
if('string'===typeof e)if(e.includes('%'));else if(1===r.length)return e
else return r.map(y).join(' ')
else if(0===r.length)return''
else if(1===r.length)return y(e)
else return r.map(y).join(' ')
let t=1
var n,i='',o=0,s=0
while(s<e.length){if('%'!==e.charAt(s)){s++
continue}switch(i+=e.slice(o,s),e.charAt(s+1)){case's':n=String(r[t])
break
case'd':n=Number(r[t])
break
case'j':try{n=JSON.stringify(r[t])}catch(r){n='[Circular]'}break
case'%':i+='%',o=s+=2
continue
default:i=i+'%'+e.charAt(s+1),o=s+=2
continue}if(t>=r.length)i=i+'%'+e.charAt(s+1)
else t++,i+=n
o=s+=2}i+=e.slice(o,s)
while(t<r.length)i+=' '+y(r[t++])
return i},y=r=>{if(!r)return String(r)
else if(Array.isArray(r))return`[${r.toString()}]`
else if(r instanceof Error){const{message:e,stack:t}=r,n=r.code?`Error [${r.code}]: ${e}`:`Error: ${e}`
if(Array.isArray(t))return n+'\n'+t.map((r=>`    at ${r}`)).join('\n')
return n}else if('object'===typeof r)return JSON.stringify(r,null,2)
else return r.toString()},p=(r,e)=>{var t=Number(r)
return isNaN(t)?e:t},h=(r,e,t)=>{var n='error',i=e+' '+n
if(t)i+=' '+t
var o=new Error(i)
return o.code=n,o.errno=n,o.syscall=e,o},b=(r,e,t,n,i)=>{var o
if(n&&n>0)o=t+':'+n
else o=t
if(i)o+=' - Local ('+i+')'
var s=h(r,e,o)
if(s.address=t,n)s.port=n
return s},{isBuffer:d}=Buffer,{isArray:m}=Array,v={isNull:e,isUndefined:t,isNullOrUndefined:n,isNumber:i,isBoolean:s,isString:a,isObject:l,isFinite:o,isFunction:u,isBuffer:d,isArray:m,exceptionWithHostPort:b,errnoException:h,stringToNumber:p,inherits:f,mixin:c,format:g,toUSVString:r}
export{v as default,h as errnoException,b as exceptionWithHostPort,g as format,f as inherits,m as isArray,s as isBoolean,d as isBuffer,o as isFinite,u as isFunction,e as isNull,n as isNullOrUndefined,i as isNumber,l as isObject,a as isString,t as isUndefined,c as mixin,p as stringToNumber,r as toUSVString}
