const r=r=>r===null
const e=r=>r===undefined
const t=r=>r===null||r===undefined
const n=r=>typeof r==='number'
const o=r=>r===0||r!==r/2
const i=r=>typeof r==='boolean'
const s=r=>typeof r==='string'
const c=r=>typeof r==='object'&&r!=null
const a=r=>typeof r==='function'
const u=(r,e)=>{r.prototype=Object.create(e.prototype,{constructor:{value:r,enumerable:false,writable:true,configurable:true}})}
const l=(...r)=>{const[e]=r
if(t(e)){throw new TypeError('target cannot be null or undefined')}for(var n=1;n<r.length;++n){var o=r[n]
if(!t(o)){for(var i in o){if(o.hasOwnProperty(i)){e[i]=o[i]}}}}return e}
const f=(...r)=>{const[e]=r
if(typeof e==='string'){if(e.includes('%'));else if(r.length===1){return e}else{return r.map(g).join(' ')}}else{if(r.length===0){return''}else if(r.length===1){return g(e)}else{return r.map(g).join(' ')}}let t=1
var n
var o=''
var i=0
var s=0
while(s<e.length){if(e.charAt(s)!=='%'){s++
continue}o+=e.slice(i,s)
switch(e.charAt(s+1)){case's':n=String(r[t])
break
case'd':n=Number(r[t])
break
case'j':try{n=JSON.stringify(r[t])}catch(r){n='[Circular]'}break
case'%':o+='%'
i=s=s+2
continue
default:o=o+'%'+e.charAt(s+1)
i=s=s+2
continue}if(t>=r.length){o=o+'%'+e.charAt(s+1)}else{t++
o+=n}i=s=s+2}o+=e.slice(i,s)
while(t<r.length){o+=' '+g(r[t++])}return o}
const g=r=>{if(!r){return String(r)}else if(Array.isArray(r)){return`[${r.toString()}]`}else if(r instanceof Error){const{message:e,stack:t}=r
const n=r.code?`Error [${r.code}]: ${e}`:`Error: ${e}`
if(Array.isArray(t)){return n+'\n'+t.map((r=>`    at ${r}`)).join('\n')}return n}else if(typeof r==='object'){return JSON.stringify(r,null,2)}else{return r.toString()}}
const y=(r,e)=>{var t=Number(r)
return isNaN(t)?e:t}
const p=(r,e,t)=>{var n='error'
var o=e+' '+n
if(t)o+=' '+t
var i=new Error(o)
i.code=n
i.errno=n
i.syscall=e
return i}
const d=(r,e,t,n,o)=>{var i
if(n&&n>0){i=t+':'+n}else{i=t}if(o){i+=' - Local ('+o+')'}var s=p(r,e,i)
s.address=t
if(n){s.port=n}return s}
const h=/(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])/
const b=r=>{const e=`${r}`
const t=h.exec(e)
if(!t){return e}throw Error('toUSVString() is not implemented')}
const{isBuffer:m}=Buffer
const{isArray:v}=Array
const F={isNull:r,isUndefined:e,isNullOrUndefined:t,isNumber:n,isBoolean:i,isString:s,isObject:c,isFinite:o,isFunction:a,isBuffer:m,isArray:v,exceptionWithHostPort:d,errnoException:p,stringToNumber:y,inherits:u,mixin:l,format:f,toUSVString:b}
export{F as default,p as errnoException,d as exceptionWithHostPort,f as format,u as inherits,v as isArray,i as isBoolean,m as isBuffer,o as isFinite,a as isFunction,r as isNull,t as isNullOrUndefined,n as isNumber,c as isObject,s as isString,e as isUndefined,l as mixin,y as stringToNumber,b as toUSVString}
