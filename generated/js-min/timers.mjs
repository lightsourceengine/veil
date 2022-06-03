const{native:e}=import.meta
const t='2147483647.0'-0
const n={setTimeout:0,setInterval:1,setImmediate:2}
function i(e){this.after=e
this.isRepeat=false
this.callback=null
this.handler=null}e.prototype.handleTimeout=function(){var e=this.timeoutObj
if(e&&e.callback){try{e.callback()}catch(t){e.unref()
throw t}if(!e.isRepeat){e.unref()}}}
i.prototype.ref=function(){var t=0
var n=new e
if(this.isRepeat){t=this.after}n.timeoutObj=this
this.handler=n
n.start(this.after,t)}
i.prototype.unref=function(){this.callback=undefined
if(this.handler){this.handler.timeoutObj=undefined
this.handler.stop()
this.handler=undefined}}
function a(e,a,l,...s){if(typeof a!=='function'){throw new TypeError('Bad arguments: callback must be a Function')}if(e===n.setImmediate){l=0}else{l*=1
if(l<1||l>t){l=1}}var r=new i(l)
if(s.length===0){r.callback=a}else{r.callback=a.bind.apply(a,[r,...s.slice(3)])}r.isRepeat=e===n.setInterval
r.ref()
return r}function l(e,t){if(t){if(t instanceof i){t.unref()}else{throw new Error(e+'() - invalid timeout')}}}const s=global.setTimeout=a.bind(undefined,n.setTimeout)
const r=global.setInterval=a.bind(undefined,n.setInterval)
const o=global.setImmediate=a.bind(undefined,n.setImmediate)
const c=global.clearTimeout=l.bind(undefined,'clearTimeout')
const f=global.clearInterval=l.bind(undefined,'clearInterval')
const u={setTimeout:s,setInterval:r,setImmediate:o,clearTimeout:c,clearInterval:f}
export{f as clearInterval,c as clearTimeout,u as default,o as setImmediate,r as setInterval,s as setTimeout}
