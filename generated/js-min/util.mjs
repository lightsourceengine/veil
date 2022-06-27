const e=(e,r,t)=>{if('string'===typeof t)return class extends r{code=e
message=t}
return class extends r{code=e
constructor(...e){super(),this.message=t(this,...e)}}},r=e('ERR_INVALID_ARG_TYPE',Error,((e,r,t,n)=>`The ${r} argument must be of type ${t}. Received ${typeof n}`)),t=(e,t)=>{if('function'!==typeof e)throw new r(t,'Function',e)},{errname:n,errmessage:i,toUSVString:o}=import.meta.native,s=e=>null===e,l=e=>void 0===e,u=e=>null===e||void 0===e,c=e=>'number'===typeof e,f=e=>0===e||e!==e/2,a=e=>'boolean'===typeof e,p=e=>'string'===typeof e,y=e=>'object'===typeof e&&null!=e,g=e=>'function'===typeof e,m=(e,r)=>{e.prototype=Object.create(r.prototype,{constructor:{value:e,enumerable:false,writable:true,configurable:true}})},b=(...e)=>{const[r]=e
if(u(r))throw new TypeError('target cannot be null or undefined')
for(let t=1;t<e.length;++t){const n=e[t]
if(!u(n))for(const e in n)if(n.hasOwnProperty(e))r[e]=n[e]}return r},d=Symbol.for('nodejs.util.promisify.custom'),h=Symbol('customPromisifyArgs'),j=e=>{let r
if(t(e,'original'),e[d])return r=e[d],t(r,'util.promisify.custom'),Object.defineProperty(r,d,{value:r,enumerable:false,writable:false,configurable:true})
const n=e[h]
return r=function(...r){return new Promise(((t,i)=>{r.push(((e,...r)=>{if(e)return i(e)
if(void 0!==n&&r.length>1){const e={}
for(let t=0;t<n.length;t++)e[n[t]]=r[t]
t(e)}else t(r[0])})),Reflect.apply(e,this,r)}))},Object.setPrototypeOf(r,Object.getPrototypeOf(e)),Object.defineProperty(r,d,{value:r,enumerable:false,writable:false,configurable:true}),Object.defineProperties(r,Object.getOwnPropertyDescriptors(e))}
j.custom=d
const O=(...e)=>{const[r]=e
if('string'===typeof r)if(r.includes('%'));else if(1===e.length)return r
else return e.map(A).join(' ')
else if(0===e.length)return''
else if(1===e.length)return A(r)
else return e.map(A).join(' ')
let t=1,n,i='',o=0,s=0
while(s<r.length){if('%'!==r.charAt(s)){s++
continue}switch(i+=r.slice(o,s),r.charAt(s+1)){case's':n=String(e[t])
break
case'd':n=Number(e[t])
break
case'j':try{n=JSON.stringify(e[t])}catch(e){n='[Circular]'}break
case'%':i+='%',o=s+=2
continue
default:i=i+'%'+r.charAt(s+1),o=s+=2
continue}if(t>=e.length)i=i+'%'+r.charAt(s+1)
else t++,i+=n
o=s+=2}i+=r.slice(o,s)
while(t<e.length)i+=' '+A(e[t++])
return i},A=e=>{if(!e)return String(e)
else if(Array.isArray(e))return`[${e.toString()}]`
else if(e instanceof Error){const{message:r,stack:t}=e,n=e.code?`Error [${e.code}]: ${r}`:`Error: ${r}`
if(Array.isArray(t))return n+'\n'+t.map((e=>`    at ${e}`)).join('\n')
return n}else if('object'===typeof e)return JSON.stringify(e,null,2)
else return e.toString()},$=(e,r)=>{const t=Number(e)
return isNaN(t)?r:t},w=(e,r,t)=>{const o=n(e),s=i(e),l=Error(t?`${s} ${t}`:s)
return l.code=o,l.errno=o,l.syscall=r,l},S=(e,r,t,n,i)=>{const o=(0|n)>0,s=o?`${t}:${n}`:t,l=w(e,r,i?`${s} - Local (${i})`:s)
if(l.address=t,o)l.port=n
return l},{isBuffer:N}=Buffer,{isArray:P}=Array,E={isNull:s,isUndefined:l,isNullOrUndefined:u,isNumber:c,isBoolean:a,isString:p,isObject:y,isFinite:f,isFunction:g,isBuffer:N,isArray:P,exceptionWithHostPort:S,errnoException:w,stringToNumber:$,inherits:m,mixin:b,format:O,promisify:j,toUSVString:o}
export{E as default,w as errnoException,S as exceptionWithHostPort,O as format,m as inherits,P as isArray,a as isBoolean,N as isBuffer,f as isFinite,g as isFunction,s as isNull,u as isNullOrUndefined,c as isNumber,y as isObject,p as isString,l as isUndefined,b as mixin,j as promisify,$ as stringToNumber,o as toUSVString}
