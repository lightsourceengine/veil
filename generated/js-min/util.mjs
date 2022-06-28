const r=(r,e,t)=>{if('string'===typeof t)return class extends e{code=r
message=t}
return class extends e{code=r
constructor(...r){super(),this.message=t(this,...r)}}},e=r('ERR_INVALID_ARG_TYPE',Error,((r,e,t,n)=>`The ${e} argument must be of type ${t}. Received ${typeof n}`)),t=(r,t)=>{if('function'!==typeof r)throw new e(t,'Function',r)},{errname:n,errmessage:i,toUSVString:o}=import.meta.native,s=Object.freeze({}),a=r=>null===r,l=r=>void 0===r,c=r=>null===r||void 0===r,u=r=>'number'===typeof r,f=r=>0===r||r!==r/2,y=r=>'boolean'===typeof r,p=r=>'string'===typeof r,g=r=>'object'===typeof r&&null!=r,m=r=>'function'===typeof r,A=(r,e)=>{r.prototype=Object.create(e.prototype,{constructor:{value:r,enumerable:false,writable:true,configurable:true}})},b=(...r)=>{const[e]=r
if(c(e))throw new TypeError('target cannot be null or undefined')
for(let t=1;t<r.length;++t){const n=r[t]
if(!c(n))for(const r in n)if(n.hasOwnProperty(r))e[r]=n[r]}return e},d=Symbol.for('nodejs.util.promisify.custom'),h=Symbol('customPromisifyArgs'),O=r=>{let e
if(t(r,'original'),r[d])return e=r[d],t(e,'util.promisify.custom'),Object.defineProperty(e,d,{value:e,enumerable:false,writable:false,configurable:true})
const n=r[h]
return e=function(...e){return new Promise(((t,i)=>{e.push(((r,...e)=>{if(r)return i(r)
if(void 0!==n&&e.length>1){const r={}
for(let t=0;t<n.length;t++)r[n[t]]=e[t]
t(r)}else t(e[0])})),Reflect.apply(r,this,e)}))},Object.setPrototypeOf(e,Object.getPrototypeOf(r)),Object.defineProperty(e,d,{value:e,enumerable:false,writable:false,configurable:true}),Object.defineProperties(e,Object.getOwnPropertyDescriptors(r))}
O.custom=d
const j=(...r)=>{const[e]=r
if('string'===typeof e)if(e.includes('%'));else if(1===r.length)return e
else return r.map(P).join(' ')
else if(0===r.length)return''
else if(1===r.length)return P(e)
else return r.map(P).join(' ')
let t=1,n,i='',o=0,s=0
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
while(t<r.length)i+=' '+P(r[t++])
return i},P=r=>{if(!r)return String(r)
else if(Array.isArray(r))return`[${r.toString()}]`
else if(r instanceof Error){const{message:e,stack:t}=r,n=r.code?`Error [${r.code}]: ${e}`:`Error: ${e}`
if(Array.isArray(t))return n+'\n'+t.map((r=>`    at ${r}`)).join('\n')
return n}else if('object'===typeof r)return JSON.stringify(r,null,2)
else return r.toString()},U=(r,e)=>{const t=Number(r)
return isNaN(t)?e:t},$=(r,e,t)=>{const o=n(r),s=i(r),a=Error(t?`${s} ${t}`:s)
return a.code=o,a.errno=o,a.syscall=e,a},w=(r,e,t,n,i)=>{const o=(0|n)>0,s=o?`${t}:${n}`:t,a=$(r,e,i?`${s} - Local (${i})`:s)
if(a.address=t,o)a.port=n
return a},{isBuffer:S}=Buffer,{isArray:v}=Array,N=r=>{var e
return null==r?void 0:null==(e=r.constructor)?void 0:e.name},I={isTypedArray:r=>'TypedArray'===N(Object.getPrototypeOf(Object.getPrototypeOf(r??s))),isPromise:r=>'Promise'===N(r),isUint8Array:r=>'Uint8Array'===N(r),isUint8ClampedArray:r=>'Uint8ClampedArray'===N(r),isUint16Array:r=>'Uint16Array'===N(r),isUint32Array:r=>'Uint32Array'===N(r),isInt8Array:r=>'Int8Array'===N(r),isInt16Array:r=>'Int16Array'===N(r),isInt32Array:r=>'Int32Array'===N(r),isFloat32Array:r=>'Float32Array'===N(r),isFloat64Array:r=>'Float64Array'===N(r),isBigInt64Array:r=>'BigInt64Array'===N(r),isBigUint64Array:r=>'BigUint64Array'===N(r)},E={isNull:a,isUndefined:l,isNullOrUndefined:c,isNumber:u,isBoolean:y,isString:p,isObject:g,isFinite:f,isFunction:m,isBuffer:S,isArray:v,exceptionWithHostPort:w,errnoException:$,stringToNumber:U,inherits:A,mixin:b,format:j,types:I,promisify:O,toUSVString:o}
export{E as default,$ as errnoException,w as exceptionWithHostPort,j as format,A as inherits,v as isArray,y as isBoolean,S as isBuffer,f as isFinite,m as isFunction,a as isNull,c as isNullOrUndefined,u as isNumber,g as isObject,p as isString,l as isUndefined,b as mixin,O as promisify,U as stringToNumber,o as toUSVString,I as types}
