import{validateFunction as r}from'internal/validators'
const e=Object.getPrototypeOf,{errname:t,errmessage:i,toUSVString:n}=import.meta.native,o=Symbol.for('nodejs.util.promisify.custom'),a=Symbol('customPromisifyArgs'),s=t=>{let i
if(r(t,'original'),t[o])return i=t[o],r(i,'util.promisify.custom'),Object.defineProperty(i,o,{value:i,enumerable:false,writable:false,configurable:true})
const n=t[a]
return i=function(...r){return new Promise(((e,i)=>{r.push(((r,...t)=>{if(r)return i(r)
if(void 0!==n&&t.length>1){const r={}
for(let e=0;e<n.length;e++)r[n[e]]=t[e]
e(r)}else e(t[0])})),Reflect.apply(t,this,r)}))},Object.setPrototypeOf(i,e(t)),Object.defineProperty(i,o,{value:i,enumerable:false,writable:false,configurable:true}),Object.defineProperties(i,Object.getOwnPropertyDescriptors(t))}
s.custom=o
const l=(...r)=>{const[e]=r
if('string'===typeof e)if(e.includes('%'));else if(1===r.length)return e
else return r.map(c).join(' ')
else if(0===r.length)return''
else if(1===r.length)return c(e)
else return r.map(c).join(' ')
let t=1,i,n='',o=0,a=0
while(a<e.length){if('%'!==e.charAt(a)){a++
continue}switch(n+=e.slice(o,a),e.charAt(a+1)){case's':i=String(r[t])
break
case'd':i=Number(r[t])
break
case'j':try{i=JSON.stringify(r[t])}catch(r){i='[Circular]'}break
case'%':n+='%',o=a+=2
continue
default:n=n+'%'+e.charAt(a+1),o=a+=2
continue}if(t>=r.length)n=n+'%'+e.charAt(a+1)
else t++,n+=i
o=a+=2}n+=e.slice(o,a)
while(t<r.length)n+=' '+c(r[t++])
return n},c=r=>{if(!r)return String(r)
else if(Array.isArray(r))return`[${r.toString()}]`
else if(r instanceof Error){const{message:e,stack:t}=r,i=r.code?`Error [${r.code}]: ${e}`:`Error: ${e}`
if(Array.isArray(t))return i+'\n'+t.map((r=>`    at ${r}`)).join('\n')
return i}else if('object'===typeof r)return JSON.stringify(r,null,2)
else return r.toString()},u=(r,e,n)=>{const o=t(r),a=i(r),s=Error(n?`${a} ${n}`:a)
return s.code=o,s.errno=o,s.syscall=e,s},y=(r,e,t,i,n)=>{const o=(0|i)>0,a=o?`${t}:${i}`:t,s=u(r,e,n?`${a} - Local (${n})`:a)
if(s.address=t,o)s.port=i
return s},f=r=>{var e,t
return null==r?void 0:null==(e=r.__proto__)?void 0:null==(t=e.constructor)?void 0:t.name},A={isTypedArray:r=>'TypedArray'===f(null==r?void 0:r.__proto__),isPromise:r=>'Promise'===f(r),isUint8Array:r=>'Uint8Array'===f(r),isUint8ClampedArray:r=>'Uint8ClampedArray'===f(r),isUint16Array:r=>'Uint16Array'===f(r),isUint32Array:r=>'Uint32Array'===f(r),isInt8Array:r=>'Int8Array'===f(r),isInt16Array:r=>'Int16Array'===f(r),isInt32Array:r=>'Int32Array'===f(r),isFloat32Array:r=>'Float32Array'===f(r),isFloat64Array:r=>'Float64Array'===f(r),isBigInt64Array:r=>'BigInt64Array'===f(r),isBigUint64Array:r=>'BigUint64Array'===f(r)},p={exceptionWithHostPort:y,errnoException:u,format:l,types:A,promisify:s,toUSVString:n}
export{p as default,u as errnoException,y as exceptionWithHostPort,l as format,s as promisify,n as toUSVString,A as types}
