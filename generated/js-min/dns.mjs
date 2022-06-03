import e from'util'
const{native:r}=import.meta
const t=r.AI_ADDRCONFIG
const i=r.AI_V4MAPPED
const n=(n,o,s)=>{var a=0
var l=-1
if(!e.isString(n)){throw TypeError('invalid argument: hostname must be a string')}if(e.isFunction(o)){s=o
l=0}else if(!e.isFunction(s)){throw TypeError('invalid argument: callback must be passed')}else if(e.isObject(o)){a=o.hints>>>0
l=o.family>>>0
if(a<0||a>(t|i)){throw new TypeError('invalid argument: invalid hints flags')}}else if(e.isNumber(o)){l=~~o}else{throw TypeError('invalid argument: options must be either an object or number')}if(l!==0&&l!==4&&l!==6)throw new TypeError('invalid argument: family must be 4 or 6')
if(process.platform!=='nuttx'){r.getaddrinfo(n,l,a,s)}else{process.nextTick((()=>{r.getaddrinfo(n,l,a,s)}))}}
const o={lookup:n,ADDRCONFIG:t,V4MAPPED:i}
export{t as ADDRCONFIG,i as V4MAPPED,o as default,n as lookup}
