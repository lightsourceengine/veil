import e from'util'
const{native:i}=import.meta,r=i.AI_ADDRCONFIG,t=i.AI_V4MAPPED,n=(n,o,a)=>{var s=0,l=-1
if(!e.isString(n))throw TypeError('invalid argument: hostname must be a string')
if(e.isFunction(o))a=o,l=0
else if(!e.isFunction(a))throw TypeError('invalid argument: callback must be passed')
else if(e.isObject(o)){if(s=o.hints>>>0,l=o.family>>>0,s<0||s>(r|t))throw new TypeError('invalid argument: invalid hints flags')}else if(e.isNumber(o))l=~~o
else throw TypeError('invalid argument: options must be either an object or number')
if(0!==l&&4!==l&&6!==l)throw new TypeError('invalid argument: family must be 4 or 6')
if('nuttx'!==process.platform)i.getaddrinfo(n,l,s,a)
else process.nextTick((()=>{i.getaddrinfo(n,l,s,a)}))},o={lookup:n,ADDRCONFIG:r,V4MAPPED:t}
export{r as ADDRCONFIG,t as V4MAPPED,o as default,n as lookup}
