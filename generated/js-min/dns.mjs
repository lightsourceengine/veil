const{native:e}=import.meta,t=e.AI_ADDRCONFIG,r=e.AI_V4MAPPED,i=(i,o,n)=>{var a=0,s=-1
if('string'!==typeof i)throw TypeError('invalid argument: hostname must be a string')
if('string'===typeof o)n=o,s=0
else if('function'!==typeof n)throw TypeError('invalid argument: callback must be passed')
else if(null!==o&&'object'===typeof o){if(a=o.hints>>>0,s=o.family>>>0,a<0||a>(t|r))throw new TypeError('invalid argument: invalid hints flags')}else if('number'===typeof o)s=~~o
else throw TypeError('invalid argument: options must be either an object or number')
if(0!==s&&4!==s&&6!==s)throw new TypeError('invalid argument: family must be 4 or 6')
if('nuttx'!==process.platform)e.getaddrinfo(i,s,a,n)
else process.nextTick((()=>{e.getaddrinfo(i,s,a,n)}))},o={lookup:i,ADDRCONFIG:t,V4MAPPED:r}
export{t as ADDRCONFIG,r as V4MAPPED,o as default,i as lookup}
