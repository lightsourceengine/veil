const r=r=>r===null
const e=r=>r===undefined
const t=r=>r===null||r===undefined
const n=r=>typeof r==='number'
const i=r=>r===0||r!==r/2
const o=r=>typeof r==='boolean'
const s=r=>typeof r==='string'
const c=r=>typeof r==='object'&&r!=null
const a=r=>typeof r==='function'
const l=(r,e)=>{r.prototype=Object.create(e.prototype,{constructor:{value:r,enumerable:false,writable:true,configurable:true}})}
const u=(...r)=>{const[e]=r
if(t(e)){throw new TypeError('target cannot be null or undefined')}for(var n=1;n<r.length;++n){var i=r[n]
if(!t(i)){for(var o in i){if(i.hasOwnProperty(o)){e[o]=i[o]}}}}return e}
const f=(...r)=>{const[e]=r
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
const g=(r,e)=>{var t=Number(r)
return isNaN(t)?e:t}
const p=(r,e,t)=>{var n='error'
var i=e+' '+n
if(t)i+=' '+t
var o=new Error(i)
o.code=n
o.errno=n
o.syscall=e
return o}
const d=(r,e,t,n,i)=>{var o
if(n&&n>0){o=t+':'+n}else{o=t}if(i){o+=' - Local ('+i+')'}var s=p(r,e,o)
s.address=t
if(n){s.port=n}return s}
const{isBuffer:h}=Buffer
const{isArray:b}=Array
const v={isNull:r,isUndefined:e,isNullOrUndefined:t,isNumber:n,isBoolean:o,isString:s,isObject:c,isFinite:i,isFunction:a,isBuffer:h,isArray:b,exceptionWithHostPort:d,errnoException:p,stringToNumber:g,inherits:l,mixin:u,format:f}
export{v as default,p as errnoException,d as exceptionWithHostPort,f as format,l as inherits,b as isArray,o as isBoolean,h as isBuffer,i as isFinite,a as isFunction,r as isNull,t as isNullOrUndefined,n as isNumber,c as isObject,s as isString,e as isUndefined,u as mixin,g as stringToNumber}
