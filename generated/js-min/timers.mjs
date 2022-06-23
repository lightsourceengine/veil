const{native:e}=import.meta,t='2147483647.0'-0,i={setTimeout:0,setInterval:1,setImmediate:2}
function a(e){this.after=e,this.isRepeat=false,this.callback=null,this.handler=null}function l(e,l,n,...o){if('function'!==typeof l)throw new TypeError('Bad arguments: callback must be a Function')
if(e===i.setImmediate)n=0
else if(n*=1,n<1||n>t)n=1
var r=new a(n)
if(0===o.length)r.callback=l
else r.callback=l.bind.apply(l,[r,...o.slice(3)])
return r.isRepeat=e===i.setInterval,r.ref(),r}function n(e,t){if(t)if(t instanceof a)t.unref()
else throw new Error(e+'() - invalid timeout')}e.prototype.handleTimeout=function(){var e=this.timeoutObj
if(e&&e.callback){try{e.callback()}catch(t){throw e.unref(),t}if(!e.isRepeat)e.unref()}},a.prototype.ref=function(){var t=0,i=new e
if(this.isRepeat)t=this.after
i.timeoutObj=this,this.handler=i,i.start(this.after,t)},a.prototype.unref=function(){if(this.callback=void 0,this.handler)this.handler.timeoutObj=void 0,this.handler.stop(),this.handler=void 0}
const o=global.setTimeout=l.bind(void 0,i.setTimeout),r=global.setInterval=l.bind(void 0,i.setInterval),s=global.setImmediate=l.bind(void 0,i.setImmediate),c=global.clearTimeout=n.bind(void 0,'clearTimeout'),f=global.clearInterval=n.bind(void 0,'clearInterval'),u={setTimeout:o,setInterval:r,setImmediate:s,clearTimeout:c,clearInterval:f}
export{f as clearInterval,c as clearTimeout,u as default,s as setImmediate,r as setInterval,o as setTimeout}
