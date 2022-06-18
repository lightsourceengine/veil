const{toUSVString:r}=import.meta.native
const e=r=>r===null
const t=r=>r===undefined
const n=r=>r===null||r===undefined
const i=r=>typeof r==='number'
const o=r=>r===0||r!==r/2
const s=r=>typeof r==='boolean'
const c=r=>typeof r==='string'
const a=r=>typeof r==='object'&&r!=null
const l=r=>typeof r==='function'
const u=(r,e)=>{r.prototype=Object.create(e.prototype,{constructor:{value:r,enumerable:false,writable:true,configurable:true}})}
const f=(...r)=>{const[e]=r
if(n(e)){throw new TypeError('target cannot be null or undefined')}for(var t=1;t<r.length;++t){var i=r[t]
if(!n(i)){for(var o in i){if(i.hasOwnProperty(o)){e[o]=i[o]}}}}return e}
const g=(...r)=>{const[e]=r
if(typeof e==='string'){if(e.includes('%'));else if(r.length===1){return e}else{return r.map(y).join(' ')}}else{if(r.length===0){return''}else if(r.length===1){return y(e)}else{return r.map(y).join(' ')}}let t=1
var n
var i=''
var o=0
var s=0
while(s<e.length){if(e.charAt(s)!=='%'){s++
continue}i+=e.slice(o,s)
switch(e.charAt(s+1)){case's':n=String(r[t])
break
case'd':n=Number(r[t])
break
case'j':try{n=JSON.stringify(r[t])}catch(r){n='[Circular]'}break
case'%':i+='%'
o=s=s+2
continue
default:i=i+'%'+e.charAt(s+1)
o=s=s+2
continue}if(t>=r.length){i=i+'%'+e.charAt(s+1)}else{t++
i+=n}o=s=s+2}i+=e.slice(o,s)
while(t<r.length){i+=' '+y(r[t++])}return i}
const y=r=>{if(!r){return String(r)}else if(Array.isArray(r)){return`[${r.toString()}]`}else if(r instanceof Error){const{message:e,stack:t}=r
const n=r.code?`Error [${r.code}]: ${e}`:`Error: ${e}`
if(Array.isArray(t)){return n+'\n'+t.map((r=>`    at ${r}`)).join('\n')}return n}else if(typeof r==='object'){return JSON.stringify(r,null,2)}else{return r.toString()}}
const p=(r,e)=>{var t=Number(r)
return isNaN(t)?e:t}
const d=(r,e,t)=>{var n='error'
var i=e+' '+n
if(t)i+=' '+t
var o=new Error(i)
o.code=n
o.errno=n
o.syscall=e
return o}
const h=(r,e,t,n,i)=>{var o
if(n&&n>0){o=t+':'+n}else{o=t}if(i){o+=' - Local ('+i+')'}var s=d(r,e,o)
s.address=t
if(n){s.port=n}return s}
const{isBuffer:b}=Buffer
const{isArray:v}=Array
const m={isNull:e,isUndefined:t,isNullOrUndefined:n,isNumber:i,isBoolean:s,isString:c,isObject:a,isFinite:o,isFunction:l,isBuffer:b,isArray:v,exceptionWithHostPort:h,errnoException:d,stringToNumber:p,inherits:u,mixin:f,format:g,toUSVString:r}
export{m as default,d as errnoException,h as exceptionWithHostPort,g as format,u as inherits,v as isArray,s as isBoolean,b as isBuffer,o as isFinite,l as isFunction,e as isNull,n as isNullOrUndefined,i as isNumber,a as isObject,c as isString,t as isUndefined,f as mixin,p as stringToNumber,r as toUSVString}
