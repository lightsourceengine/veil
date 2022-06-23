const e=(e,r,t)=>{if('string'===typeof t)return class extends r{code=e
message=t}
return class extends r{code=e
constructor(...e){super(),this.message=t(this,...e)}}},r=e('ERR_INVALID_ARG_TYPE',Error,((e,r,t,n)=>`The ${r} argument must be of type ${t}. Received ${typeof n}`)),t=(e,t)=>{if('function'!==typeof e)throw new r(t,'Function',e)},{toUSVString:n}=import.meta.native,i=e=>null===e,o=e=>void 0===e,s=e=>null===e||void 0===e,l=e=>'number'===typeof e,u=e=>0===e||e!==e/2,c=e=>'boolean'===typeof e,f=e=>'string'===typeof e,a=e=>'object'===typeof e&&null!=e,p=e=>'function'===typeof e,y=(e,r)=>{e.prototype=Object.create(r.prototype,{constructor:{value:e,enumerable:false,writable:true,configurable:true}})},g=(...e)=>{const[r]=e
if(s(r))throw new TypeError('target cannot be null or undefined')
for(let t=1;t<e.length;++t){const n=e[t]
if(!s(n))for(const e in n)if(n.hasOwnProperty(e))r[e]=n[e]}return r},b=Symbol.for('nodejs.util.promisify.custom'),m=Symbol('customPromisifyArgs'),d=e=>{let r
if(t(e,'original'),e[b])return r=e[b],t(r,'util.promisify.custom'),Object.defineProperty(r,b,{value:r,enumerable:false,writable:false,configurable:true})
const n=e[m]
return r=function(...r){return new Promise(((t,i)=>{r.push(((e,...r)=>{if(e)return i(e)
if(void 0!==n&&r.length>1){const e={}
for(let t=0;t<n.length;t++)e[n[t]]=r[t]
t(e)}else t(r[0])})),Reflect.apply(e,this,r)}))},Object.setPrototypeOf(r,Object.getPrototypeOf(e)),Object.defineProperty(r,b,{value:r,enumerable:false,writable:false,configurable:true}),Object.defineProperties(r,Object.getOwnPropertyDescriptors(e))}
d.custom=b
const h=(...e)=>{const[r]=e
if('string'===typeof r)if(r.includes('%'));else if(1===e.length)return r
else return e.map($).join(' ')
else if(0===e.length)return''
else if(1===e.length)return $(r)
else return e.map($).join(' ')
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
while(t<e.length)i+=' '+$(e[t++])
return i},$=e=>{if(!e)return String(e)
else if(Array.isArray(e))return`[${e.toString()}]`
else if(e instanceof Error){const{message:r,stack:t}=e,n=e.code?`Error [${e.code}]: ${r}`:`Error: ${r}`
if(Array.isArray(t))return n+'\n'+t.map((e=>`    at ${e}`)).join('\n')
return n}else if('object'===typeof e)return JSON.stringify(e,null,2)
else return e.toString()},j=(e,r)=>{const t=Number(e)
return isNaN(t)?r:t},O=(e,r,t)=>{const n='error',i=`${r} ${n}`,o=Error(t?`${i} ${t}`:i)
return o.code=n,o.errno=n,o.syscall=r,o},A=(e,r,t,n,i)=>{const o=n>>>0>0,s=o?`${t}:${n}`:t,l=O(e,r,i?`${s} - Local (${i})`:s)
if(l.address=t,o)l.port=n
return l},{isBuffer:w}=Buffer,{isArray:S}=Array,N={isNull:i,isUndefined:o,isNullOrUndefined:s,isNumber:l,isBoolean:c,isString:f,isObject:a,isFinite:u,isFunction:p,isBuffer:w,isArray:S,exceptionWithHostPort:A,errnoException:O,stringToNumber:j,inherits:y,mixin:g,format:h,promisify:d,toUSVString:n}
export{N as default,O as errnoException,A as exceptionWithHostPort,h as format,y as inherits,S as isArray,c as isBoolean,w as isBuffer,u as isFinite,p as isFunction,i as isNull,s as isNullOrUndefined,l as isNumber,a as isObject,f as isString,o as isUndefined,g as mixin,d as promisify,j as stringToNumber,n as toUSVString}
