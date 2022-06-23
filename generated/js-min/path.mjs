const e=(e,t,r)=>{if('string'===typeof r)return class extends t{code=e
message=r}
return class extends t{code=e
constructor(...e){super(),this.message=r(this,...e)}}},t=e('ERR_INVALID_ARG_TYPE',Error,((e,t,r,i)=>`The ${t} argument must be of type ${r}. Received ${typeof i}`)),r=(e,r)=>{if('object'!==typeof e||e.constructor!==Object)throw new t(r,'Object',e)},i=(e,r)=>{if('string'!==typeof e)throw new t(r,'string',e)},l=65,n=97,f=90,o=122,s=46,c=47,a=92,h=58,d=63,u='win32'===process.platform
function C(e){return e===c||e===a}function A(e){return e===c}function g(e){return e>=l&&e<=f||e>=n&&e<=o}function $(e,t,r,i){let l='',n=0,f=-1,o=0,a=0
for(let h=0;h<=e.length;++h){if(h<e.length)a=e.charCodeAt(h)
else if(i(a))break
else a=c
if(i(a)){if(f===h-1||1===o);else if(2===o){if(l.length<2||2!==n||l.charCodeAt(l.length-1)!==s||l.charCodeAt(l.length-2)!==s)if(l.length>2){const e=l.lastIndexOf(r)
if(-1===e)l='',n=0
else l=l.slice(0,e),n=l.length-1-l.lastIndexOf(r)
f=h,o=0
continue}else if(0!==l.length){l='',n=0,f=h,o=0
continue}if(t)l+=l.length>0?`${r}..`:'..',n=2}else{if(l.length>0)l+=`${r}${e.slice(f+1,h)}`
else l=e.slice(f+1,h)
n=h-f-1}f=h,o=0}else if(a===s&&-1!==o)++o
else o=-1}return l}function p(e,t){r(t,'pathObject')
const i=t.dir||t.root,l=t.base||`${t.name||''}${t.ext||''}`
if(!i)return l
return i===t.root?`${i}${l}`:`${i}${e}${l}`}const m={resolve(...e){let t='',r='',l=false
for(let n=e.length-1;n>=-1;n--){let f
if(n>=0){if(f=e[n],i(f,'path'),0===f.length)continue}else if(0===t.length)f=process.cwd()
else if(f=process.env[`=${t}`]||process.cwd(),void 0===f||f.slice(0,2).toLowerCase()!==t.toLowerCase()&&f.charCodeAt(2)===a)f=`${t}\\`
const o=f.length
let s=0,c='',d=false
const u=f.charCodeAt(0)
if(1===o){if(C(u))s=1,d=true}else if(C(u))if(d=true,C(f.charCodeAt(1))){let e=2,t=e
while(e<o&&!C(f.charCodeAt(e)))e++
if(e<o&&e!==t){const r=f.slice(t,e)
t=e
while(e<o&&C(f.charCodeAt(e)))e++
if(e<o&&e!==t){t=e
while(e<o&&!C(f.charCodeAt(e)))e++
if(e===o||e!==t)c=`\\\\${r}\\${f.slice(t,e)}`,s=e}}}else s=1
else if(g(u)&&f.charCodeAt(1)===h)if(c=f.slice(0,2),s=2,o>2&&C(f.charCodeAt(2)))d=true,s=3
if(c.length>0)if(t.length>0){if(c.toLowerCase()!==t.toLowerCase())continue}else t=c
if(l){if(t.length>0)break}else if(r=`${f.slice(s)}\\${r}`,l=d,d&&t.length>0)break}return r=$(r,!l,'\\',C),l?`${t}\\${r}`:`${t}${r}`||'.'},normalize(e){i(e,'path')
const t=e.length
if(0===t)return'.'
let r=0,l,n=false
const f=e.charCodeAt(0)
if(1===t)return A(f)?'\\':e
if(C(f))if(n=true,C(e.charCodeAt(1))){let i=2,n=i
while(i<t&&!C(e.charCodeAt(i)))i++
if(i<t&&i!==n){const f=e.slice(n,i)
n=i
while(i<t&&C(e.charCodeAt(i)))i++
if(i<t&&i!==n){n=i
while(i<t&&!C(e.charCodeAt(i)))i++
if(i===t)return`\\\\${f}\\${e.slice(n)}\\`
if(i!==n)l=`\\\\${f}\\${e.slice(n,i)}`,r=i}}}else r=1
else if(g(f)&&e.charCodeAt(1)===h)if(l=e.slice(0,2),r=2,t>2&&C(e.charCodeAt(2)))n=true,r=3
let o=r<t?$(e.slice(r),!n,'\\',C):''
if(0===o.length&&!n)o='.'
if(o.length>0&&C(e.charCodeAt(t-1)))o+='\\'
if(void 0===l)return n?`\\${o}`:o
return n?`${l}\\${o}`:`${l}${o}`},isAbsolute(e){i(e,'path')
const t=e.length
if(0===t)return false
const r=e.charCodeAt(0)
return C(r)||t>2&&g(r)&&e.charCodeAt(1)===h&&C(e.charCodeAt(2))},join(...e){if(0===e.length)return'.'
let t,r
for(let l=0;l<e.length;++l){const n=e[l]
if(i(n,'path'),n.length>0)if(void 0===t)t=r=n
else t+=`\\${n}`}if(void 0===t)return'.'
let l=true,n=0
if(C(r.charCodeAt(0))){++n
const e=r.length
if(e>1&&C(r.charCodeAt(1)))if(++n,e>2)if(C(r.charCodeAt(2)))++n
else l=false}if(l){while(n<t.length&&C(t.charCodeAt(n)))n++
if(n>=2)t=`\\${t.slice(n)}`}return m.normalize(t)},relative(e,t){if(i(e,'from'),i(t,'to'),e===t)return''
const r=m.resolve(e),l=m.resolve(t)
if(r===l)return''
if(e=r.toLowerCase(),t=l.toLowerCase(),e===t)return''
let n=0
while(n<e.length&&e.charCodeAt(n)===a)n++
let f=e.length
while(f-1>n&&e.charCodeAt(f-1)===a)f--
const o=f-n
let s=0
while(s<t.length&&t.charCodeAt(s)===a)s++
let c=t.length
while(c-1>s&&t.charCodeAt(c-1)===a)c--
const h=c-s,d=o<h?o:h
let u=-1,C=0
for(;C<d;C++){const r=e.charCodeAt(n+C)
if(r!==t.charCodeAt(s+C))break
else if(r===a)u=C}if(C!==d){if(-1===u)return l}else{if(h>d){if(t.charCodeAt(s+C)===a)return l.slice(s+C+1)
if(2===C)return l.slice(s+C)}if(o>d)if(e.charCodeAt(n+C)===a)u=C
else if(2===C)u=3
if(-1===u)u=0}let A=''
for(C=n+u+1;C<=f;++C)if(C===f||e.charCodeAt(C)===a)A+=0===A.length?'..':'\\..'
if(s+=u,A.length>0)return`${A}${l.slice(s,c)}`
if(l.charCodeAt(s)===a)++s
return l.slice(s,c)},toNamespacedPath(e){if('string'!==typeof e||0===e.length)return e
const t=m.resolve(e)
if(t.length<=2)return e
if(t.charCodeAt(0)===a){if(t.charCodeAt(1)===a){const e=t.charCodeAt(2)
if(e!==d&&e!==s)return`\\\\?\\UNC\\${t.slice(2)}`}}else if(g(t.charCodeAt(0))&&t.charCodeAt(1)===h&&t.charCodeAt(2)===a)return`\\\\?\\${t}`
return e},dirname(e){i(e,'path')
const t=e.length
if(0===t)return'.'
let r=-1,l=0
const n=e.charCodeAt(0)
if(1===t)return C(n)?e:'.'
if(C(n)){if(r=l=1,C(e.charCodeAt(1))){let i=2,n=i
while(i<t&&!C(e.charCodeAt(i)))i++
if(i<t&&i!==n){n=i
while(i<t&&C(e.charCodeAt(i)))i++
if(i<t&&i!==n){n=i
while(i<t&&!C(e.charCodeAt(i)))i++
if(i===t)return e
if(i!==n)r=l=i+1}}}}else if(g(n)&&e.charCodeAt(1)===h)r=t>2&&C(e.charCodeAt(2))?3:2,l=r
let f=-1,o=true
for(let r=t-1;r>=l;--r)if(C(e.charCodeAt(r))){if(!o){f=r
break}}else o=false
if(-1===f){if(-1===r)return'.'
f=r}return e.slice(0,f)},basename(e,t){if(void 0!==t)i(t,'ext')
i(e,'path')
let r=0,l=-1,n=true
if(e.length>=2&&g(e.charCodeAt(0))&&e.charCodeAt(1)===h)r=2
if(void 0!==t&&t.length>0&&t.length<=e.length){if(t===e)return''
let i=t.length-1,f=-1
for(let o=e.length-1;o>=r;--o){const s=e.charCodeAt(o)
if(C(s)){if(!n){r=o+1
break}}else{if(-1===f)n=false,f=o+1
if(i>=0)if(s===t.charCodeAt(i)){if(-1===--i)l=o}else i=-1,l=f}}if(r===l)l=f
else if(-1===l)l=e.length
return e.slice(r,l)}for(let t=e.length-1;t>=r;--t)if(C(e.charCodeAt(t))){if(!n){r=t+1
break}}else if(-1===l)n=false,l=t+1
if(-1===l)return''
return e.slice(r,l)},extname(e){i(e,'path')
let t=0,r=-1,l=0,n=-1,f=true,o=0
if(e.length>=2&&e.charCodeAt(1)===h&&g(e.charCodeAt(0)))t=l=2
for(let i=e.length-1;i>=t;--i){const t=e.charCodeAt(i)
if(C(t)){if(!f){l=i+1
break}continue}if(-1===n)f=false,n=i+1
if(t===s){if(-1===r)r=i
else if(1!==o)o=1}else if(-1!==r)o=-1}if(-1===r||-1===n||0===o||1===o&&r===n-1&&r===l+1)return''
return e.slice(r,n)},format:p.bind(null,'\\'),parse(e){i(e,'path')
const t={root:'',dir:'',base:'',ext:'',name:''}
if(0===e.length)return t
const r=e.length
let l=0,n=e.charCodeAt(0)
if(1===r){if(C(n))return t.root=t.dir=e,t
return t.base=t.name=e,t}if(C(n)){if(l=1,C(e.charCodeAt(1))){let t=2,i=t
while(t<r&&!C(e.charCodeAt(t)))t++
if(t<r&&t!==i){i=t
while(t<r&&C(e.charCodeAt(t)))t++
if(t<r&&t!==i){i=t
while(t<r&&!C(e.charCodeAt(t)))t++
if(t===r)l=t
else if(t!==i)l=t+1}}}}else if(g(n)&&e.charCodeAt(1)===h){if(r<=2)return t.root=t.dir=e,t
if(l=2,C(e.charCodeAt(2))){if(3===r)return t.root=t.dir=e,t
l=3}}if(l>0)t.root=e.slice(0,l)
let f=-1,o=l,c=-1,a=true,d=e.length-1,u=0
for(;d>=l;--d){if(n=e.charCodeAt(d),C(n)){if(!a){o=d+1
break}continue}if(-1===c)a=false,c=d+1
if(n===s){if(-1===f)f=d
else if(1!==u)u=1}else if(-1!==f)u=-1}if(-1!==c)if(-1===f||0===u||1===u&&f===c-1&&f===o+1)t.base=t.name=e.slice(o,c)
else t.name=e.slice(o,f),t.base=e.slice(o,c),t.ext=e.slice(f,c)
if(o>0&&o!==l)t.dir=e.slice(0,o-1)
else t.dir=t.root
return t},sep:'\\',delimiter:';'},b=(()=>{if(u){const e=/\\/g
return()=>{const t=process.cwd().replace(e,'/')
return t.slice(t.indexOf('/'))}}return()=>process.cwd()})(),w={resolve(...e){let t='',r=false
for(let l=e.length-1;l>=-1&&!r;l--){const n=l>=0?e[l]:b()
if(i(n,'path'),0===n.length)continue
t=`${n}/${t}`,r=n.charCodeAt(0)===c}if(t=$(t,!r,'/',A),r)return`/${t}`
return t.length>0?t:'.'},normalize(e){if(i(e,'path'),0===e.length)return'.'
const t=e.charCodeAt(0)===c,r=e.charCodeAt(e.length-1)===c
if(e=$(e,!t,'/',A),0===e.length){if(t)return'/'
return r?'./':'.'}if(r)e+='/'
return t?`/${e}`:e},isAbsolute:e=>(i(e,'path'),e.length>0&&e.charCodeAt(0)===c),join(...e){if(0===e.length)return'.'
let t
for(let r=0;r<e.length;++r){const l=e[r]
if(i(l,'path'),l.length>0)if(void 0===t)t=l
else t+=`/${l}`}if(void 0===t)return'.'
return w.normalize(t)},relative(e,t){if(i(e,'from'),i(t,'to'),e===t)return''
if(e=w.resolve(e),t=w.resolve(t),e===t)return''
const r=1,l=e.length,n=l-r,f=1,o=t.length-f,s=n<o?n:o
let a=-1,h=0
for(;h<s;h++){const i=e.charCodeAt(r+h)
if(i!==t.charCodeAt(f+h))break
else if(i===c)a=h}if(h===s)if(o>s){if(t.charCodeAt(f+h)===c)return t.slice(f+h+1)
if(0===h)return t.slice(f+h)}else if(n>s)if(e.charCodeAt(r+h)===c)a=h
else if(0===h)a=0
let d=''
for(h=r+a+1;h<=l;++h)if(h===l||e.charCodeAt(h)===c)d+=0===d.length?'..':'/..'
return`${d}${t.slice(f+a)}`},toNamespacedPath:e=>e,dirname(e){if(i(e,'path'),0===e.length)return'.'
const t=e.charCodeAt(0)===c
let r=-1,l=true
for(let t=e.length-1;t>=1;--t)if(e.charCodeAt(t)===c){if(!l){r=t
break}}else l=false
if(-1===r)return t?'/':'.'
if(t&&1===r)return'//'
return e.slice(0,r)},basename(e,t){if(void 0!==t)i(t,'ext')
i(e,'path')
let r=0,l=-1,n=true
if(void 0!==t&&t.length>0&&t.length<=e.length){if(t===e)return''
let i=t.length-1,f=-1
for(let o=e.length-1;o>=0;--o){const s=e.charCodeAt(o)
if(s===c){if(!n){r=o+1
break}}else{if(-1===f)n=false,f=o+1
if(i>=0)if(s===t.charCodeAt(i)){if(-1===--i)l=o}else i=-1,l=f}}if(r===l)l=f
else if(-1===l)l=e.length
return e.slice(r,l)}for(let t=e.length-1;t>=0;--t)if(e.charCodeAt(t)===c){if(!n){r=t+1
break}}else if(-1===l)n=false,l=t+1
if(-1===l)return''
return e.slice(r,l)},extname(e){i(e,'path')
let t=-1,r=0,l=-1,n=true,f=0
for(let i=e.length-1;i>=0;--i){const o=e.charCodeAt(i)
if(o===c){if(!n){r=i+1
break}continue}if(-1===l)n=false,l=i+1
if(o===s){if(-1===t)t=i
else if(1!==f)f=1}else if(-1!==t)f=-1}if(-1===t||-1===l||0===f||1===f&&t===l-1&&t===r+1)return''
return e.slice(t,l)},format:p.bind(null,'/'),parse(e){i(e,'path')
const t={root:'',dir:'',base:'',ext:'',name:''}
if(0===e.length)return t
const r=e.charCodeAt(0)===c
let l
if(r)t.root='/',l=1
else l=0
let n=-1,f=0,o=-1,a=true,h=e.length-1,d=0
for(;h>=l;--h){const t=e.charCodeAt(h)
if(t===c){if(!a){f=h+1
break}continue}if(-1===o)a=false,o=h+1
if(t===s){if(-1===n)n=h
else if(1!==d)d=1}else if(-1!==n)d=-1}if(-1!==o){const i=0===f&&r?1:f
if(-1===n||0===d||1===d&&n===o-1&&n===f+1)t.base=t.name=e.slice(i,o)
else t.name=e.slice(i,n),t.base=e.slice(i,o),t.ext=e.slice(n,o)}if(f>0)t.dir=e.slice(0,f-1)
else if(r)t.dir='/'
return t},sep:'/',delimiter:':'},v=u?m:w,{basename:x,delimiter:k,dirname:j,extname:L,format:y,isAbsolute:O,join:z,normalize:N,parse:I,relative:P,resolve:R,sep:E,toNamespacedPath:_}=v
export{x as basename,v as default,k as delimiter,j as dirname,L as extname,y as format,O as isAbsolute,z as join,N as normalize,I as parse,w as posix,P as relative,R as resolve,E as sep,_ as toNamespacedPath,m as win32}
