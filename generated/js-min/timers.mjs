const{native:e}=import.meta,t='2147483647.0'-0,i={setTimeout:0,setInterval:1,setImmediate:2}
function a(e){this.after=e,this.isRepeat=false,this.callback=null,this.handler=null}function n(e,n,r,...l){if('function'!==typeof n)throw new TypeError('Bad arguments: callback must be a Function')
if(e===i.setImmediate)r=0
else if(r*=1,r<1||r>t)r=1
var o=new a(r)
if(0===l.length)o.callback=n
else o.callback=n.bind.apply(n,[o,...l.slice(3)])
return o.isRepeat=e===i.setInterval,o.ref(),o}function r(e,t){if(t)if(t instanceof a)t.unref()
else throw new Error(e+'() - invalid timeout')}e.prototype.handleTimeout=function(){var e=this.timeoutObj
if(e&&e.callback){try{e.callback()}catch(t){throw e.unref(),t}if(!e.isRepeat)e.unref()}},a.prototype.ref=function(){var t=0,i=new e
if(this.isRepeat)t=this.after
i.timeoutObj=this,this.handler=i,i.start(this.after,t)},a.prototype.unref=function(){if(this.callback=void 0,this.handler)this.handler.timeoutObj=void 0,this.handler.stop(),this.handler=void 0}
const l=n.bind(void 0,i.setTimeout),o=n.bind(void 0,i.setInterval),s=n.bind(void 0,i.setImmediate),c=r.bind(void 0,'clearTimeout'),d=r.bind(void 0,'clearInterval'),m=r.bind(void 0,'clearImmediate')
Object.assign(global,{setTimeout:l,setInterval:o,setImmediate:s,clearTimeout:c,clearInterval:d,clearImmediate:m})
const f={setTimeout:l,setInterval:o,setImmediate:s,clearTimeout:c,clearInterval:d,clearImmediate:m}
export{m as clearImmediate,d as clearInterval,c as clearTimeout,f as default,s as setImmediate,o as setInterval,l as setTimeout}
