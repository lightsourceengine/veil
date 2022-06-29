const{native:e}=import.meta,t='2147483647.0'-0,i={setTimeout:0,setInterval:1,setImmediate:2}
function a(e){this.after=e,this.isRepeat=false,this.callback=null,this.handler=null}function n(e,n,s,...l){if('function'!==typeof n)throw new TypeError('Bad arguments: callback must be a Function')
if(e===i.setImmediate)s=0
else if(s*=1,s<1||s>t)s=1
const r=new a(s)
if(0===l.length)r.callback=n
else r.callback=n.bind.apply(n,[r,...l.slice(3)])
return r.isRepeat=e===i.setInterval,r.ref(),r}e.prototype.handleTimeout=function(){var e=this.timeoutObj
if(e&&e.callback){try{e.callback()}catch(t){throw e.unref(),t}if(!e.isRepeat)e.unref()}},a.prototype.ref=function(){var t=0,i=new e
if(this.isRepeat)t=this.after
i.timeoutObj=this,this.handler=i,i.start(this.after,t)},a.prototype.unref=function(){if(this.callback=void 0,this.handler)this.handler.timeoutObj=void 0,this.handler.stop(),this.handler=void 0}
const s=n.bind(void 0,i.setTimeout),l=n.bind(void 0,i.setInterval),r=n.bind(void 0,i.setImmediate),o=e=>e instanceof a&&e.unref(),c=e=>e instanceof a&&e.unref(),f=e=>e instanceof a&&e.unref()
Object.assign(global,{setTimeout:s,setInterval:l,setImmediate:r,clearTimeout:o,clearInterval:c,clearImmediate:f})
const u={setTimeout:s,setInterval:l,setImmediate:r,clearTimeout:o,clearInterval:c,clearImmediate:f}
export{f as clearImmediate,c as clearInterval,o as clearTimeout,u as default,r as setImmediate,l as setInterval,s as setTimeout}
