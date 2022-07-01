import{validateString as e,validateObject as t}from'internal/validators'
const r=65,i=97,l=90,f=122,n=46,o=47,s=92,a=58,c=63,h='win32'===process.platform
function d(e){return e===o||e===s}function u(e){return e===o}function C(e){return e>=r&&e<=l||e>=i&&e<=f}function A(e,t,r,i){let l='',f=0,s=-1,a=0,c=0
for(let h=0;h<=e.length;++h){if(h<e.length)c=e.charCodeAt(h)
else if(i(c))break
else c=o
if(i(c)){if(s===h-1||1===a);else if(2===a){if(l.length<2||2!==f||l.charCodeAt(l.length-1)!==n||l.charCodeAt(l.length-2)!==n)if(l.length>2){const e=l.lastIndexOf(r)
if(-1===e)l='',f=0
else l=l.slice(0,e),f=l.length-1-l.lastIndexOf(r)
s=h,a=0
continue}else if(0!==l.length){l='',f=0,s=h,a=0
continue}if(t)l+=l.length>0?`${r}..`:'..',f=2}else{if(l.length>0)l+=`${r}${e.slice(s+1,h)}`
else l=e.slice(s+1,h)
f=h-s-1}s=h,a=0}else if(c===n&&-1!==a)++a
else a=-1}return l}function g(e,r){t(r,'pathObject')
const i=r.dir||r.root,l=r.base||`${r.name||''}${r.ext||''}`
if(!i)return l
return i===r.root?`${i}${l}`:`${i}${e}${l}`}const $={resolve(...t){let r='',i='',l=false
for(let f=t.length-1;f>=-1;f--){let n
if(f>=0){if(n=t[f],e(n,'path'),0===n.length)continue}else if(0===r.length)n=process.cwd()
else if(n=process.env[`=${r}`]||process.cwd(),void 0===n||n.slice(0,2).toLowerCase()!==r.toLowerCase()&&n.charCodeAt(2)===s)n=`${r}\\`
const o=n.length
let c=0,h='',u=false
const A=n.charCodeAt(0)
if(1===o){if(d(A))c=1,u=true}else if(d(A))if(u=true,d(n.charCodeAt(1))){let e=2,t=e
while(e<o&&!d(n.charCodeAt(e)))e++
if(e<o&&e!==t){const r=n.slice(t,e)
t=e
while(e<o&&d(n.charCodeAt(e)))e++
if(e<o&&e!==t){t=e
while(e<o&&!d(n.charCodeAt(e)))e++
if(e===o||e!==t)h=`\\\\${r}\\${n.slice(t,e)}`,c=e}}}else c=1
else if(C(A)&&n.charCodeAt(1)===a)if(h=n.slice(0,2),c=2,o>2&&d(n.charCodeAt(2)))u=true,c=3
if(h.length>0)if(r.length>0){if(h.toLowerCase()!==r.toLowerCase())continue}else r=h
if(l){if(r.length>0)break}else if(i=`${n.slice(c)}\\${i}`,l=u,u&&r.length>0)break}return i=A(i,!l,'\\',d),l?`${r}\\${i}`:`${r}${i}`||'.'},normalize(t){e(t,'path')
const r=t.length
if(0===r)return'.'
let i=0,l,f=false
const n=t.charCodeAt(0)
if(1===r)return u(n)?'\\':t
if(d(n))if(f=true,d(t.charCodeAt(1))){let e=2,f=e
while(e<r&&!d(t.charCodeAt(e)))e++
if(e<r&&e!==f){const n=t.slice(f,e)
f=e
while(e<r&&d(t.charCodeAt(e)))e++
if(e<r&&e!==f){f=e
while(e<r&&!d(t.charCodeAt(e)))e++
if(e===r)return`\\\\${n}\\${t.slice(f)}\\`
if(e!==f)l=`\\\\${n}\\${t.slice(f,e)}`,i=e}}}else i=1
else if(C(n)&&t.charCodeAt(1)===a)if(l=t.slice(0,2),i=2,r>2&&d(t.charCodeAt(2)))f=true,i=3
let o=i<r?A(t.slice(i),!f,'\\',d):''
if(0===o.length&&!f)o='.'
if(o.length>0&&d(t.charCodeAt(r-1)))o+='\\'
if(void 0===l)return f?`\\${o}`:o
return f?`${l}\\${o}`:`${l}${o}`},isAbsolute(t){e(t,'path')
const r=t.length
if(0===r)return false
const i=t.charCodeAt(0)
return d(i)||r>2&&C(i)&&t.charCodeAt(1)===a&&d(t.charCodeAt(2))},join(...t){if(0===t.length)return'.'
let r,i
for(let l=0;l<t.length;++l){const f=t[l]
if(e(f,'path'),f.length>0)if(void 0===r)r=i=f
else r+=`\\${f}`}if(void 0===r)return'.'
let l=true,f=0
if(d(i.charCodeAt(0))){++f
const e=i.length
if(e>1&&d(i.charCodeAt(1)))if(++f,e>2)if(d(i.charCodeAt(2)))++f
else l=false}if(l){while(f<r.length&&d(r.charCodeAt(f)))f++
if(f>=2)r=`\\${r.slice(f)}`}return $.normalize(r)},relative(t,r){if(e(t,'from'),e(r,'to'),t===r)return''
const i=$.resolve(t),l=$.resolve(r)
if(i===l)return''
if(t=i.toLowerCase(),r=l.toLowerCase(),t===r)return''
let f=0
while(f<t.length&&t.charCodeAt(f)===s)f++
let n=t.length
while(n-1>f&&t.charCodeAt(n-1)===s)n--
const o=n-f
let a=0
while(a<r.length&&r.charCodeAt(a)===s)a++
let c=r.length
while(c-1>a&&r.charCodeAt(c-1)===s)c--
const h=c-a,d=o<h?o:h
let u=-1,C=0
for(;C<d;C++){const e=t.charCodeAt(f+C)
if(e!==r.charCodeAt(a+C))break
else if(e===s)u=C}if(C!==d){if(-1===u)return l}else{if(h>d){if(r.charCodeAt(a+C)===s)return l.slice(a+C+1)
if(2===C)return l.slice(a+C)}if(o>d)if(t.charCodeAt(f+C)===s)u=C
else if(2===C)u=3
if(-1===u)u=0}let A=''
for(C=f+u+1;C<=n;++C)if(C===n||t.charCodeAt(C)===s)A+=0===A.length?'..':'\\..'
if(a+=u,A.length>0)return`${A}${l.slice(a,c)}`
if(l.charCodeAt(a)===s)++a
return l.slice(a,c)},toNamespacedPath(e){if('string'!==typeof e||0===e.length)return e
const t=$.resolve(e)
if(t.length<=2)return e
if(t.charCodeAt(0)===s){if(t.charCodeAt(1)===s){const e=t.charCodeAt(2)
if(e!==c&&e!==n)return`\\\\?\\UNC\\${t.slice(2)}`}}else if(C(t.charCodeAt(0))&&t.charCodeAt(1)===a&&t.charCodeAt(2)===s)return`\\\\?\\${t}`
return e},dirname(t){e(t,'path')
const r=t.length
if(0===r)return'.'
let i=-1,l=0
const f=t.charCodeAt(0)
if(1===r)return d(f)?t:'.'
if(d(f)){if(i=l=1,d(t.charCodeAt(1))){let e=2,f=e
while(e<r&&!d(t.charCodeAt(e)))e++
if(e<r&&e!==f){f=e
while(e<r&&d(t.charCodeAt(e)))e++
if(e<r&&e!==f){f=e
while(e<r&&!d(t.charCodeAt(e)))e++
if(e===r)return t
if(e!==f)i=l=e+1}}}}else if(C(f)&&t.charCodeAt(1)===a)i=r>2&&d(t.charCodeAt(2))?3:2,l=i
let n=-1,o=true
for(let e=r-1;e>=l;--e)if(d(t.charCodeAt(e))){if(!o){n=e
break}}else o=false
if(-1===n){if(-1===i)return'.'
n=i}return t.slice(0,n)},basename(t,r){if(void 0!==r)e(r,'ext')
e(t,'path')
let i=0,l=-1,f=true
if(t.length>=2&&C(t.charCodeAt(0))&&t.charCodeAt(1)===a)i=2
if(void 0!==r&&r.length>0&&r.length<=t.length){if(r===t)return''
let e=r.length-1,n=-1
for(let o=t.length-1;o>=i;--o){const s=t.charCodeAt(o)
if(d(s)){if(!f){i=o+1
break}}else{if(-1===n)f=false,n=o+1
if(e>=0)if(s===r.charCodeAt(e)){if(-1===--e)l=o}else e=-1,l=n}}if(i===l)l=n
else if(-1===l)l=t.length
return t.slice(i,l)}for(let e=t.length-1;e>=i;--e)if(d(t.charCodeAt(e))){if(!f){i=e+1
break}}else if(-1===l)f=false,l=e+1
if(-1===l)return''
return t.slice(i,l)},extname(t){e(t,'path')
let r=0,i=-1,l=0,f=-1,o=true,s=0
if(t.length>=2&&t.charCodeAt(1)===a&&C(t.charCodeAt(0)))r=l=2
for(let e=t.length-1;e>=r;--e){const r=t.charCodeAt(e)
if(d(r)){if(!o){l=e+1
break}continue}if(-1===f)o=false,f=e+1
if(r===n){if(-1===i)i=e
else if(1!==s)s=1}else if(-1!==i)s=-1}if(-1===i||-1===f||0===s||1===s&&i===f-1&&i===l+1)return''
return t.slice(i,f)},format:g.bind(null,'\\'),parse(t){e(t,'path')
const r={root:'',dir:'',base:'',ext:'',name:''}
if(0===t.length)return r
const i=t.length
let l=0,f=t.charCodeAt(0)
if(1===i){if(d(f))return r.root=r.dir=t,r
return r.base=r.name=t,r}if(d(f)){if(l=1,d(t.charCodeAt(1))){let e=2,r=e
while(e<i&&!d(t.charCodeAt(e)))e++
if(e<i&&e!==r){r=e
while(e<i&&d(t.charCodeAt(e)))e++
if(e<i&&e!==r){r=e
while(e<i&&!d(t.charCodeAt(e)))e++
if(e===i)l=e
else if(e!==r)l=e+1}}}}else if(C(f)&&t.charCodeAt(1)===a){if(i<=2)return r.root=r.dir=t,r
if(l=2,d(t.charCodeAt(2))){if(3===i)return r.root=r.dir=t,r
l=3}}if(l>0)r.root=t.slice(0,l)
let o=-1,s=l,c=-1,h=true,u=t.length-1,A=0
for(;u>=l;--u){if(f=t.charCodeAt(u),d(f)){if(!h){s=u+1
break}continue}if(-1===c)h=false,c=u+1
if(f===n){if(-1===o)o=u
else if(1!==A)A=1}else if(-1!==o)A=-1}if(-1!==c)if(-1===o||0===A||1===A&&o===c-1&&o===s+1)r.base=r.name=t.slice(s,c)
else r.name=t.slice(s,o),r.base=t.slice(s,c),r.ext=t.slice(o,c)
if(s>0&&s!==l)r.dir=t.slice(0,s-1)
else r.dir=r.root
return r},sep:'\\',delimiter:';'},p=(()=>{if(h){const e=/\\/g
return()=>{const t=process.cwd().replace(e,'/')
return t.slice(t.indexOf('/'))}}return()=>process.cwd()})(),m={resolve(...t){let r='',i=false
for(let l=t.length-1;l>=-1&&!i;l--){const f=l>=0?t[l]:p()
if(e(f,'path'),0===f.length)continue
r=`${f}/${r}`,i=f.charCodeAt(0)===o}if(r=A(r,!i,'/',u),i)return`/${r}`
return r.length>0?r:'.'},normalize(t){if(e(t,'path'),0===t.length)return'.'
const r=t.charCodeAt(0)===o,i=t.charCodeAt(t.length-1)===o
if(t=A(t,!r,'/',u),0===t.length){if(r)return'/'
return i?'./':'.'}if(i)t+='/'
return r?`/${t}`:t},isAbsolute:t=>(e(t,'path'),t.length>0&&t.charCodeAt(0)===o),join(...t){if(0===t.length)return'.'
let r
for(let i=0;i<t.length;++i){const l=t[i]
if(e(l,'path'),l.length>0)if(void 0===r)r=l
else r+=`/${l}`}if(void 0===r)return'.'
return m.normalize(r)},relative(t,r){if(e(t,'from'),e(r,'to'),t===r)return''
if(t=m.resolve(t),r=m.resolve(r),t===r)return''
const i=1,l=t.length,f=l-i,n=1,s=r.length-n,a=f<s?f:s
let c=-1,h=0
for(;h<a;h++){const e=t.charCodeAt(i+h)
if(e!==r.charCodeAt(n+h))break
else if(e===o)c=h}if(h===a)if(s>a){if(r.charCodeAt(n+h)===o)return r.slice(n+h+1)
if(0===h)return r.slice(n+h)}else if(f>a)if(t.charCodeAt(i+h)===o)c=h
else if(0===h)c=0
let d=''
for(h=i+c+1;h<=l;++h)if(h===l||t.charCodeAt(h)===o)d+=0===d.length?'..':'/..'
return`${d}${r.slice(n+c)}`},toNamespacedPath:e=>e,dirname(t){if(e(t,'path'),0===t.length)return'.'
const r=t.charCodeAt(0)===o
let i=-1,l=true
for(let e=t.length-1;e>=1;--e)if(t.charCodeAt(e)===o){if(!l){i=e
break}}else l=false
if(-1===i)return r?'/':'.'
if(r&&1===i)return'//'
return t.slice(0,i)},basename(t,r){if(void 0!==r)e(r,'ext')
e(t,'path')
let i=0,l=-1,f=true
if(void 0!==r&&r.length>0&&r.length<=t.length){if(r===t)return''
let e=r.length-1,n=-1
for(let s=t.length-1;s>=0;--s){const a=t.charCodeAt(s)
if(a===o){if(!f){i=s+1
break}}else{if(-1===n)f=false,n=s+1
if(e>=0)if(a===r.charCodeAt(e)){if(-1===--e)l=s}else e=-1,l=n}}if(i===l)l=n
else if(-1===l)l=t.length
return t.slice(i,l)}for(let e=t.length-1;e>=0;--e)if(t.charCodeAt(e)===o){if(!f){i=e+1
break}}else if(-1===l)f=false,l=e+1
if(-1===l)return''
return t.slice(i,l)},extname(t){e(t,'path')
let r=-1,i=0,l=-1,f=true,s=0
for(let e=t.length-1;e>=0;--e){const a=t.charCodeAt(e)
if(a===o){if(!f){i=e+1
break}continue}if(-1===l)f=false,l=e+1
if(a===n){if(-1===r)r=e
else if(1!==s)s=1}else if(-1!==r)s=-1}if(-1===r||-1===l||0===s||1===s&&r===l-1&&r===i+1)return''
return t.slice(r,l)},format:g.bind(null,'/'),parse(t){e(t,'path')
const r={root:'',dir:'',base:'',ext:'',name:''}
if(0===t.length)return r
const i=t.charCodeAt(0)===o
let l
if(i)r.root='/',l=1
else l=0
let f=-1,s=0,a=-1,c=true,h=t.length-1,d=0
for(;h>=l;--h){const e=t.charCodeAt(h)
if(e===o){if(!c){s=h+1
break}continue}if(-1===a)c=false,a=h+1
if(e===n){if(-1===f)f=h
else if(1!==d)d=1}else if(-1!==f)d=-1}if(-1!==a){const e=0===s&&i?1:s
if(-1===f||0===d||1===d&&f===a-1&&f===s+1)r.base=r.name=t.slice(e,a)
else r.name=t.slice(e,f),r.base=t.slice(e,a),r.ext=t.slice(f,a)}if(s>0)r.dir=t.slice(0,s-1)
else if(i)r.dir='/'
return r},sep:'/',delimiter:':'},b=h?$:m,{basename:w,delimiter:v,dirname:k,extname:x,format:L,isAbsolute:z,join:j,normalize:N,parse:O,relative:P,resolve:I,sep:y,toNamespacedPath:U}=b
export{w as basename,b as default,v as delimiter,k as dirname,x as extname,L as format,z as isAbsolute,j as join,N as normalize,O as parse,m as posix,P as relative,I as resolve,y as sep,U as toNamespacedPath,$ as win32}
