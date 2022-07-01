class AssertionError extends Error{constructor(e){if(super(),this.name='AssertionError',this.actual=e.actual,this.expected=e.expected,this.operator=e.operator,e.message)this.message=e.message
else this.message=t(this)}}function t(t){return JSON.stringify(t,['actual','expected','operator'])}function e(t,e){if(!t)r(t,true,e,'==')}function r(t,e,r,n){throw new AssertionError({message:r,actual:t,expected:e,operator:n})}function n(t,e,n){if(t!=e)r(t,e,n,'==')}function o(t,e,n){if(t==e)r(t,e,n,'!=')}function s(t,e,n){if(t!==e)r(t,e,n,'===')}function i(t,e,n){if(t===e)r(t,e,n,'!==')}function a(t,e,n){var o
try{t()}catch(t){o=t}if(n=(e&&e.name?'('+e.name+').':'.')+(n?' '+n:'.'),!o)r(o,e,'Missing expected exception'+n)
if(e&&!(o instanceof e))throw o}function c(t,e){var n
try{t()}catch(t){n=t}if(e=e?' '+e:'',n)r(n,null,'Got unwanted exception.'+e)}Object.assign(e,{fail:r,equal:n,notEqual:o,strictEqual:s,notStrictEqual:i,throws:a,doesNotThrow:c})
export{AssertionError,e as default,c as doesNotThrow,n as equal,r as fail,o as notEqual,i as notStrictEqual,s as strictEqual,a as throws}
