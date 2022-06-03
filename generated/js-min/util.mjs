const e=e=>e===null
const r=e=>e===undefined
const t=e=>e===null||e===undefined
const n=e=>typeof e==='number'
const o=e=>e===0||e!==e/2
const s=e=>typeof e==='boolean'
const i=e=>typeof e==='string'
const c=e=>typeof e==='object'&&e!=null
const a=e=>typeof e==='function'
const l=(e,r)=>{e.prototype=Object.create(r.prototype,{constructor:{value:e,enumerable:false,writable:true,configurable:true}})}
const f=(...e)=>{const[r]=e
if(t(r)){throw new TypeError('target cannot be null or undefined')}for(var n=1;n<e.length;++n){var o=e[n]
if(!t(o)){for(var s in o){if(o.hasOwnProperty(s)){r[s]=o[s]}}}}return r}
const u=(...e)=>{const[r]=e
if(typeof r==='string'){if(r.includes('%'));else if(e.length===1){return r}else{return e.map(y).join(' ')}}else{if(e.length===0){return''}else if(e.length===1){return y(r)}else{return e.map(y).join(' ')}}let t=1
var n
var o=''
var s=0
var i=0
while(i<r.length){if(r.charAt(i)!=='%'){i++
continue}o+=r.slice(s,i)
switch(r.charAt(i+1)){case's':n=String(e[t])
break
case'd':n=Number(e[t])
break
case'j':try{n=JSON.stringify(e[t])}catch(e){n='[Circular]'}break
case'%':o+='%'
s=i=i+2
continue
default:o=o+'%'+r.charAt(i+1)
s=i=i+2
continue}if(t>=e.length){o=o+'%'+r.charAt(i+1)}else{t++
o+=n}s=i=i+2}o+=r.slice(s,i)
while(t<e.length){o+=' '+y(e[t++])}return o}
const y=e=>{if(!e){return String(e)}else if(Array.isArray(e)){return`[${e.toString()}]`}else if(e instanceof Error){const{message:r,stack:t}=e
const n=e.code?`Error [${e.code}]: ${r}`:`Error: ${r}`
if(Array.isArray(t)){return n+'\n'+t.map((e=>`    at ${e}`)).join('\n')}return n}else if(typeof e==='object'){return JSON.stringify(e,null,2)}else{return e.toString()}}
const g=(e,r)=>{var t=Number(e)
return isNaN(t)?r:t}
const p=(e,r,t)=>{var n='error'
var o=r+' '+n
if(t)o+=' '+t
var s=new Error(o)
s.code=n
s.errno=n
s.syscall=r
return s}
const d=(e,r,t,n,o)=>{var s
if(n&&n>0){s=t+':'+n}else{s=t}if(o){s+=' - Local ('+o+')'}var i=p(e,r,s)
i.address=t
if(n){i.port=n}return i}
const{isBuffer:h}=Buffer
const{isArray:b}=Array
class v extends Error{constructor(e,r,t){super()
this.code='ERR_INVALID_ARG_TYPE'
this.message=`The ${e} argument must be of type ${r}. Received ${typeof t}`}}const m={validateObject:(e,r)=>{if(typeof e!=='object'||e.constructor!==Object){throw new v(r,'Object',e)}},validateString:(e,r)=>{if(typeof e!=='string'){throw new v(r,'string',e)}},ERR_INVALID_ARG_TYPE:v}
const A={isNull:e,isUndefined:r,isNullOrUndefined:t,isNumber:n,isBoolean:s,isString:i,isObject:c,isFinite:o,isFunction:a,isBuffer:h,isArray:b,exceptionWithHostPort:d,errnoException:p,stringToNumber:g,inherits:l,mixin:f,format:u,_internal:m}
export{m as _internal,A as default,p as errnoException,d as exceptionWithHostPort,u as format,l as inherits,b as isArray,s as isBoolean,h as isBuffer,o as isFinite,a as isFunction,e as isNull,t as isNullOrUndefined,n as isNumber,c as isObject,i as isString,r as isUndefined,f as mixin,g as stringToNumber}
