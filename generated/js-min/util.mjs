const r=(r,e,t)=>{if('string'===typeof t)return class extends e{code=r
message=t}
return class extends e{code=r
constructor(...r){super(),this.message=t(this,...r)}}},e=r('ERR_INVALID_ARG_TYPE',Error,((r,e,t,i)=>`The ${e} argument must be of type ${t}. Received ${typeof i}`)),t=(r,t)=>{if('function'!==typeof r)throw new e(t,'Function',r)},i=Object.getPrototypeOf,{errname:n,errmessage:s,toUSVString:o}=import.meta.native,a=Symbol.for('nodejs.util.promisify.custom'),l=Symbol('customPromisifyArgs'),c=r=>{let e
if(t(r,'original'),r[a])return e=r[a],t(e,'util.promisify.custom'),Object.defineProperty(e,a,{value:e,enumerable:false,writable:false,configurable:true})
const n=r[l]
return e=function(...e){return new Promise(((t,i)=>{e.push(((r,...e)=>{if(r)return i(r)
if(void 0!==n&&e.length>1){const r={}
for(let t=0;t<n.length;t++)r[n[t]]=e[t]
t(r)}else t(e[0])})),Reflect.apply(r,this,e)}))},Object.setPrototypeOf(e,i(r)),Object.defineProperty(e,a,{value:e,enumerable:false,writable:false,configurable:true}),Object.defineProperties(e,Object.getOwnPropertyDescriptors(r))}
c.custom=a
const u=(...r)=>{const[e]=r
if('string'===typeof e)if(e.includes('%'));else if(1===r.length)return e
else return r.map(y).join(' ')
else if(0===r.length)return''
else if(1===r.length)return y(e)
else return r.map(y).join(' ')
let t=1,i,n='',s=0,o=0
while(o<e.length){if('%'!==e.charAt(o)){o++
continue}switch(n+=e.slice(s,o),e.charAt(o+1)){case's':i=String(r[t])
break
case'd':i=Number(r[t])
break
case'j':try{i=JSON.stringify(r[t])}catch(r){i='[Circular]'}break
case'%':n+='%',s=o+=2
continue
default:n=n+'%'+e.charAt(o+1),s=o+=2
continue}if(t>=r.length)n=n+'%'+e.charAt(o+1)
else t++,n+=i
s=o+=2}n+=e.slice(s,o)
while(t<r.length)n+=' '+y(r[t++])
return n},y=r=>{if(!r)return String(r)
else if(Array.isArray(r))return`[${r.toString()}]`
else if(r instanceof Error){const{message:e,stack:t}=r,i=r.code?`Error [${r.code}]: ${e}`:`Error: ${e}`
if(Array.isArray(t))return i+'\n'+t.map((r=>`    at ${r}`)).join('\n')
return i}else if('object'===typeof r)return JSON.stringify(r,null,2)
else return r.toString()},f=(r,e,t)=>{const i=n(r),o=s(r),a=Error(t?`${o} ${t}`:o)
return a.code=i,a.errno=i,a.syscall=e,a},p=(r,e,t,i,n)=>{const s=(0|i)>0,o=s?`${t}:${i}`:t,a=f(r,e,n?`${o} - Local (${n})`:o)
if(a.address=t,s)a.port=i
return a},A=r=>{var e,t
return null==r?void 0:null==(e=r.__proto__)?void 0:null==(t=e.constructor)?void 0:t.name},g={isTypedArray:r=>'TypedArray'===A(null==r?void 0:r.__proto__),isPromise:r=>'Promise'===A(r),isUint8Array:r=>'Uint8Array'===A(r),isUint8ClampedArray:r=>'Uint8ClampedArray'===A(r),isUint16Array:r=>'Uint16Array'===A(r),isUint32Array:r=>'Uint32Array'===A(r),isInt8Array:r=>'Int8Array'===A(r),isInt16Array:r=>'Int16Array'===A(r),isInt32Array:r=>'Int32Array'===A(r),isFloat32Array:r=>'Float32Array'===A(r),isFloat64Array:r=>'Float64Array'===A(r),isBigInt64Array:r=>'BigInt64Array'===A(r),isBigUint64Array:r=>'BigUint64Array'===A(r)},m={exceptionWithHostPort:p,errnoException:f,format:u,types:g,promisify:c,toUSVString:o}
export{m as default,f as errnoException,p as exceptionWithHostPort,u as format,c as promisify,o as toUSVString,g as types}
