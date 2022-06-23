class e{_events={}
emit(e,...t){if(!this._events)this._events={}
if('error'===e&&!this._events.error){var r=t[0]
if(r instanceof Error)throw r
else throw Error('Uncaught \'error\' event')}var s=this._events[e]
if(Array.isArray(s)){s=s.slice()
for(var i=0;i<s.length;++i)s[i].apply(this,t)
return true}return false}addListener(e,t){if('function'!==typeof t)throw new TypeError('listener must be a function')
if(!this._events)this._events={}
if(!this._events[e])this._events[e]=[]
return this._events[e].push(t),this}on(e,t){this.addListener(e,t)}once(e,t){if('function'!==typeof t)throw new TypeError('listener must be a function')
var r=()=>{this.removeListener(r.type,r),r.listener.apply(this,[e,t])}
return r.type=e,r.listener=t,this.on(e,r),this}removeListener(e,t){if('function'!==typeof t)throw new TypeError('listener must be a function')
var r=this._events[e]
if(Array.isArray(r))for(var s=r.length-1;s>=0;--s)if(r[s]===t||r[s].listener&&r[s].listener===t){if(r.splice(s,1),!r.length)delete this._events[e]
break}return this}removeAllListeners(...e){if(0===e.length)this._events={}
else delete this._events[e[0]]
return this}}export{e as EventEmitter,e as default}
