class t extends Error{constructor(t){if(super(),this.name='AssertionError',this.actual=t.actual,this.expected=t.expected,this.operator=t.operator,t.message)this.message=t.message
else this.message=e(this)}}function e(t){return JSON.stringify(t,['actual','expected','operator'])}function n(t,e){if(!t)i(t,true,e,'==')}function i(e,n,i,a){throw new t({message:i,actual:e,expected:n,operator:a})}function a(t,e,n){if(t!=e)i(t,e,n,'==')}function o(t,e,n){if(t==e)i(t,e,n,'!=')}function s(t,e,n){if(t!==e)i(t,e,n,'===')}function r(t,e,n){if(t===e)i(t,e,n,'!==')}function c(t,e,n){var a
try{t()}catch(t){a=t}if(n=(e&&e.name?'('+e.name+').':'.')+(n?' '+n:'.'),!a)i(a,e,'Missing expected exception'+n)
if(e&&!(a instanceof e))throw a}function u(t,e){var n
try{t()}catch(t){n=t}if(e=e?' '+e:'',n)i(n,null,'Got unwanted exception.'+e)}Object.assign(n,{fail:i,equal:a,notEqual:o,strictEqual:s,notStrictEqual:r,throws:c,doesNotThrow:u})
export{t as AssertionError,n as default,u as doesNotThrow,a as equal,i as fail,o as notEqual,r as notStrictEqual,s as strictEqual,c as throws}
