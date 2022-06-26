const{native:t}=import.meta,e='2147483647.0'-0,i={setTimeout:0,setInterval:1,setImmediate:2}
function a(t){this.after=t,this.isRepeat=false,this.callback=null,this.handler=null}function n(t,n,r,...l){if('function'!==typeof n)throw new TypeError('Bad arguments: callback must be a Function')
if(t===i.setImmediate)r=0
else if(r*=1,r<1||r>e)r=1
var s=new a(r)
if(0===l.length)s.callback=n
else s.callback=n.bind.apply(n,[s,...l.slice(3)])
return s.isRepeat=t===i.setInterval,s.ref(),s}function r(t,e){if(e)if(e instanceof a)e.unref()
else throw new Error(t+'() - invalid timeout')}t.prototype.handleTimeout=function(){var t=this.timeoutObj
if(t&&t.callback){try{t.callback()}catch(e){throw t.unref(),e}if(!t.isRepeat)t.unref()}},a.prototype.ref=function(){var e=0,i=new t
if(this.isRepeat)e=this.after
i.timeoutObj=this,this.handler=i,i.start(this.after,e)},a.prototype.unref=function(){if(this.callback=void 0,this.handler)this.handler.timeoutObj=void 0,this.handler.stop(),this.handler=void 0}
const l=n.bind(void 0,i.setTimeout),s=n.bind(void 0,i.setInterval),o=n.bind(void 0,i.setImmediate),c=r.bind(void 0,'clearTimeout'),f=r.bind(void 0,'clearInterval')
Object.assign(global,{setTimeout:l,setInterval:s,setImmediate:o,clearTimeout:c,clearInterval:f})
const u={setTimeout:l,setInterval:s,setImmediate:o,clearTimeout:c,clearInterval:f}
export{f as clearInterval,c as clearTimeout,u as default,o as setImmediate,s as setInterval,l as setTimeout}
