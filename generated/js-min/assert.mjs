import t from'util'
function e(t){this.name='AssertionError'
this.actual=t.actual
this.expected=t.expected
this.operator=t.operator
if(t.message){this.message=t.message}else{this.message=i(this)}}t.inherits(e,Error)
function i(t){return JSON.stringify(t,['actual','expected','operator'])}function n(t,e){if(!t){o(t,true,e,'==')}}function o(t,i,n,o){throw new e({message:n,actual:t,expected:i,operator:o})}function r(t,e,i){if(t!=e){o(t,e,i,'==')}}function a(t,e,i){if(t==e){o(t,e,i,'!=')}}function s(t,e,i){if(t!==e){o(t,e,i,'===')}}function c(t,e,i){if(t===e){o(t,e,i,'!==')}}function f(t,e,i){var n
try{t()}catch(t){n=t}i=(e&&e.name?'('+e.name+').':'.')+(i?' '+i:'.')
if(!n){o(n,e,'Missing expected exception'+i)}if(e&&!(n instanceof e)){throw n}}function u(t,e){var i
try{t()}catch(t){i=t}e=e?' '+e:''
if(i){o(i,null,'Got unwanted exception.'+e)}}const h={AssertionError:e,assert:n,fail:o,equal:r,notEqual:a,strictEqual:s,notStrictEqual:c,throws:f,doesNotThrow:u}
export{e as AssertionError,n as assert,h as default,u as doesNotThrow,r as equal,o as fail,a as notEqual,c as notStrictEqual,s as strictEqual,f as throws}
