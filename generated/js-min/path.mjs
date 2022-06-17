class e extends Error{constructor(e,t,r){super(`The ${e} argument must be of type ${t}. Received ${typeof r}`)
this.code='ERR_INVALID_ARG_TYPE'}}const t=(t,r)=>{if(typeof t!=='object'||t.constructor!==Object){throw new e(r,'Object',t)}}
const r=(t,r)=>{if(typeof t!=='string'){throw new e(r,'string',t)}}
const i=65
const l=97
const n=90
const f=122
const o=46
const s=47
const c=92
const h=58
const a=63
const d=process.platform==='win32'
function u(e){return e===s||e===c}function C(e){return e===s}function A(e){return e>=i&&e<=n||e>=l&&e<=f}function g(e,t,r,i){let l=''
let n=0
let f=-1
let c=0
let h=0
for(let a=0;a<=e.length;++a){if(a<e.length)h=e.charCodeAt(a)
else if(i(h))break
else h=s
if(i(h)){if(f===a-1||c===1);else if(c===2){if(l.length<2||n!==2||l.charCodeAt(l.length-1)!==o||l.charCodeAt(l.length-2)!==o){if(l.length>2){const e=l.lastIndexOf(r)
if(e===-1){l=''
n=0}else{l=l.slice(0,e)
n=l.length-1-l.lastIndexOf(r)}f=a
c=0
continue}else if(l.length!==0){l=''
n=0
f=a
c=0
continue}}if(t){l+=l.length>0?`${r}..`:'..'
n=2}}else{if(l.length>0)l+=`${r}${e.slice(f+1,a)}`
else l=e.slice(f+1,a)
n=a-f-1}f=a
c=0}else if(h===o&&c!==-1){++c}else{c=-1}}return l}function $(e,r){t(r,'pathObject')
const i=r.dir||r.root
const l=r.base||`${r.name||''}${r.ext||''}`
if(!i){return l}return i===r.root?`${i}${l}`:`${i}${e}${l}`}const p={resolve(...e){let t=''
let i=''
let l=false
for(let n=e.length-1;n>=-1;n--){let f
if(n>=0){f=e[n]
r(f,'path')
if(f.length===0){continue}}else if(t.length===0){f=process.cwd()}else{f=process.env[`=${t}`]||process.cwd()
if(f===undefined||f.slice(0,2).toLowerCase()!==t.toLowerCase()&&f.charCodeAt(2)===c){f=`${t}\\`}}const o=f.length
let s=0
let a=''
let d=false
const C=f.charCodeAt(0)
if(o===1){if(u(C)){s=1
d=true}}else if(u(C)){d=true
if(u(f.charCodeAt(1))){let e=2
let t=e
while(e<o&&!u(f.charCodeAt(e))){e++}if(e<o&&e!==t){const r=f.slice(t,e)
t=e
while(e<o&&u(f.charCodeAt(e))){e++}if(e<o&&e!==t){t=e
while(e<o&&!u(f.charCodeAt(e))){e++}if(e===o||e!==t){a=`\\\\${r}\\${f.slice(t,e)}`
s=e}}}}else{s=1}}else if(A(C)&&f.charCodeAt(1)===h){a=f.slice(0,2)
s=2
if(o>2&&u(f.charCodeAt(2))){d=true
s=3}}if(a.length>0){if(t.length>0){if(a.toLowerCase()!==t.toLowerCase())continue}else{t=a}}if(l){if(t.length>0)break}else{i=`${f.slice(s)}\\${i}`
l=d
if(d&&t.length>0){break}}}i=g(i,!l,'\\',u)
return l?`${t}\\${i}`:`${t}${i}`||'.'},normalize(e){r(e,'path')
const t=e.length
if(t===0)return'.'
let i=0
let l
let n=false
const f=e.charCodeAt(0)
if(t===1){return C(f)?'\\':e}if(u(f)){n=true
if(u(e.charCodeAt(1))){let r=2
let n=r
while(r<t&&!u(e.charCodeAt(r))){r++}if(r<t&&r!==n){const f=e.slice(n,r)
n=r
while(r<t&&u(e.charCodeAt(r))){r++}if(r<t&&r!==n){n=r
while(r<t&&!u(e.charCodeAt(r))){r++}if(r===t){return`\\\\${f}\\${e.slice(n)}\\`}if(r!==n){l=`\\\\${f}\\${e.slice(n,r)}`
i=r}}}}else{i=1}}else if(A(f)&&e.charCodeAt(1)===h){l=e.slice(0,2)
i=2
if(t>2&&u(e.charCodeAt(2))){n=true
i=3}}let o=i<t?g(e.slice(i),!n,'\\',u):''
if(o.length===0&&!n)o='.'
if(o.length>0&&u(e.charCodeAt(t-1)))o+='\\'
if(l===undefined){return n?`\\${o}`:o}return n?`${l}\\${o}`:`${l}${o}`},isAbsolute(e){r(e,'path')
const t=e.length
if(t===0)return false
const i=e.charCodeAt(0)
return u(i)||t>2&&A(i)&&e.charCodeAt(1)===h&&u(e.charCodeAt(2))},join(...e){if(e.length===0)return'.'
let t
let i
for(let l=0;l<e.length;++l){const n=e[l]
r(n,'path')
if(n.length>0){if(t===undefined)t=i=n
else t+=`\\${n}`}}if(t===undefined)return'.'
let l=true
let n=0
if(u(i.charCodeAt(0))){++n
const e=i.length
if(e>1&&u(i.charCodeAt(1))){++n
if(e>2){if(u(i.charCodeAt(2)))++n
else{l=false}}}}if(l){while(n<t.length&&u(t.charCodeAt(n))){n++}if(n>=2)t=`\\${t.slice(n)}`}return p.normalize(t)},relative(e,t){r(e,'from')
r(t,'to')
if(e===t)return''
const i=p.resolve(e)
const l=p.resolve(t)
if(i===l)return''
e=i.toLowerCase()
t=l.toLowerCase()
if(e===t)return''
let n=0
while(n<e.length&&e.charCodeAt(n)===c){n++}let f=e.length
while(f-1>n&&e.charCodeAt(f-1)===c){f--}const o=f-n
let s=0
while(s<t.length&&t.charCodeAt(s)===c){s++}let h=t.length
while(h-1>s&&t.charCodeAt(h-1)===c){h--}const a=h-s
const d=o<a?o:a
let u=-1
let C=0
for(;C<d;C++){const r=e.charCodeAt(n+C)
if(r!==t.charCodeAt(s+C))break
else if(r===c)u=C}if(C!==d){if(u===-1)return l}else{if(a>d){if(t.charCodeAt(s+C)===c){return l.slice(s+C+1)}if(C===2){return l.slice(s+C)}}if(o>d){if(e.charCodeAt(n+C)===c){u=C}else if(C===2){u=3}}if(u===-1)u=0}let A=''
for(C=n+u+1;C<=f;++C){if(C===f||e.charCodeAt(C)===c){A+=A.length===0?'..':'\\..'}}s+=u
if(A.length>0)return`${A}${l.slice(s,h)}`
if(l.charCodeAt(s)===c)++s
return l.slice(s,h)},toNamespacedPath(e){if(typeof e!=='string'||e.length===0)return e
const t=p.resolve(e)
if(t.length<=2)return e
if(t.charCodeAt(0)===c){if(t.charCodeAt(1)===c){const e=t.charCodeAt(2)
if(e!==a&&e!==o){return`\\\\?\\UNC\\${t.slice(2)}`}}}else if(A(t.charCodeAt(0))&&t.charCodeAt(1)===h&&t.charCodeAt(2)===c){return`\\\\?\\${t}`}return e},dirname(e){r(e,'path')
const t=e.length
if(t===0)return'.'
let i=-1
let l=0
const n=e.charCodeAt(0)
if(t===1){return u(n)?e:'.'}if(u(n)){i=l=1
if(u(e.charCodeAt(1))){let r=2
let n=r
while(r<t&&!u(e.charCodeAt(r))){r++}if(r<t&&r!==n){n=r
while(r<t&&u(e.charCodeAt(r))){r++}if(r<t&&r!==n){n=r
while(r<t&&!u(e.charCodeAt(r))){r++}if(r===t){return e}if(r!==n){i=l=r+1}}}}}else if(A(n)&&e.charCodeAt(1)===h){i=t>2&&u(e.charCodeAt(2))?3:2
l=i}let f=-1
let o=true
for(let r=t-1;r>=l;--r){if(u(e.charCodeAt(r))){if(!o){f=r
break}}else{o=false}}if(f===-1){if(i===-1)return'.'
f=i}return e.slice(0,f)},basename(e,t){if(t!==undefined)r(t,'ext')
r(e,'path')
let i=0
let l=-1
let n=true
if(e.length>=2&&A(e.charCodeAt(0))&&e.charCodeAt(1)===h){i=2}if(t!==undefined&&t.length>0&&t.length<=e.length){if(t===e)return''
let r=t.length-1
let f=-1
for(let o=e.length-1;o>=i;--o){const s=e.charCodeAt(o)
if(u(s)){if(!n){i=o+1
break}}else{if(f===-1){n=false
f=o+1}if(r>=0){if(s===t.charCodeAt(r)){if(--r===-1){l=o}}else{r=-1
l=f}}}}if(i===l)l=f
else if(l===-1)l=e.length
return e.slice(i,l)}for(let t=e.length-1;t>=i;--t){if(u(e.charCodeAt(t))){if(!n){i=t+1
break}}else if(l===-1){n=false
l=t+1}}if(l===-1)return''
return e.slice(i,l)},extname(e){r(e,'path')
let t=0
let i=-1
let l=0
let n=-1
let f=true
let s=0
if(e.length>=2&&e.charCodeAt(1)===h&&A(e.charCodeAt(0))){t=l=2}for(let r=e.length-1;r>=t;--r){const t=e.charCodeAt(r)
if(u(t)){if(!f){l=r+1
break}continue}if(n===-1){f=false
n=r+1}if(t===o){if(i===-1)i=r
else if(s!==1)s=1}else if(i!==-1){s=-1}}if(i===-1||n===-1||s===0||s===1&&i===n-1&&i===l+1){return''}return e.slice(i,n)},format:$.bind(null,'\\'),parse(e){r(e,'path')
const t={root:'',dir:'',base:'',ext:'',name:''}
if(e.length===0)return t
const i=e.length
let l=0
let n=e.charCodeAt(0)
if(i===1){if(u(n)){t.root=t.dir=e
return t}t.base=t.name=e
return t}if(u(n)){l=1
if(u(e.charCodeAt(1))){let t=2
let r=t
while(t<i&&!u(e.charCodeAt(t))){t++}if(t<i&&t!==r){r=t
while(t<i&&u(e.charCodeAt(t))){t++}if(t<i&&t!==r){r=t
while(t<i&&!u(e.charCodeAt(t))){t++}if(t===i){l=t}else if(t!==r){l=t+1}}}}}else if(A(n)&&e.charCodeAt(1)===h){if(i<=2){t.root=t.dir=e
return t}l=2
if(u(e.charCodeAt(2))){if(i===3){t.root=t.dir=e
return t}l=3}}if(l>0)t.root=e.slice(0,l)
let f=-1
let s=l
let c=-1
let a=true
let d=e.length-1
let C=0
for(;d>=l;--d){n=e.charCodeAt(d)
if(u(n)){if(!a){s=d+1
break}continue}if(c===-1){a=false
c=d+1}if(n===o){if(f===-1)f=d
else if(C!==1)C=1}else if(f!==-1){C=-1}}if(c!==-1){if(f===-1||C===0||C===1&&f===c-1&&f===s+1){t.base=t.name=e.slice(s,c)}else{t.name=e.slice(s,f)
t.base=e.slice(s,c)
t.ext=e.slice(f,c)}}if(s>0&&s!==l)t.dir=e.slice(0,s-1)
else t.dir=t.root
return t},sep:'\\',delimiter:';'}
const b=(()=>{if(d){const e=/\\/g
return()=>{const t=process.cwd().replace(e,'/')
return t.slice(t.indexOf('/'))}}return()=>process.cwd()})()
const m={resolve(...e){let t=''
let i=false
for(let l=e.length-1;l>=-1&&!i;l--){const n=l>=0?e[l]:b()
r(n,'path')
if(n.length===0){continue}t=`${n}/${t}`
i=n.charCodeAt(0)===s}t=g(t,!i,'/',C)
if(i){return`/${t}`}return t.length>0?t:'.'},normalize(e){r(e,'path')
if(e.length===0)return'.'
const t=e.charCodeAt(0)===s
const i=e.charCodeAt(e.length-1)===s
e=g(e,!t,'/',C)
if(e.length===0){if(t)return'/'
return i?'./':'.'}if(i)e+='/'
return t?`/${e}`:e},isAbsolute(e){r(e,'path')
return e.length>0&&e.charCodeAt(0)===s},join(...e){if(e.length===0)return'.'
let t
for(let i=0;i<e.length;++i){const l=e[i]
r(l,'path')
if(l.length>0){if(t===undefined)t=l
else t+=`/${l}`}}if(t===undefined)return'.'
return m.normalize(t)},relative(e,t){r(e,'from')
r(t,'to')
if(e===t)return''
e=m.resolve(e)
t=m.resolve(t)
if(e===t)return''
const i=1
const l=e.length
const n=l-i
const f=1
const o=t.length-f
const c=n<o?n:o
let h=-1
let a=0
for(;a<c;a++){const r=e.charCodeAt(i+a)
if(r!==t.charCodeAt(f+a))break
else if(r===s)h=a}if(a===c){if(o>c){if(t.charCodeAt(f+a)===s){return t.slice(f+a+1)}if(a===0){return t.slice(f+a)}}else if(n>c){if(e.charCodeAt(i+a)===s){h=a}else if(a===0){h=0}}}let d=''
for(a=i+h+1;a<=l;++a){if(a===l||e.charCodeAt(a)===s){d+=d.length===0?'..':'/..'}}return`${d}${t.slice(f+h)}`},toNamespacedPath(e){return e},dirname(e){r(e,'path')
if(e.length===0)return'.'
const t=e.charCodeAt(0)===s
let i=-1
let l=true
for(let t=e.length-1;t>=1;--t){if(e.charCodeAt(t)===s){if(!l){i=t
break}}else{l=false}}if(i===-1)return t?'/':'.'
if(t&&i===1)return'//'
return e.slice(0,i)},basename(e,t){if(t!==undefined)r(t,'ext')
r(e,'path')
let i=0
let l=-1
let n=true
if(t!==undefined&&t.length>0&&t.length<=e.length){if(t===e)return''
let r=t.length-1
let f=-1
for(let o=e.length-1;o>=0;--o){const c=e.charCodeAt(o)
if(c===s){if(!n){i=o+1
break}}else{if(f===-1){n=false
f=o+1}if(r>=0){if(c===t.charCodeAt(r)){if(--r===-1){l=o}}else{r=-1
l=f}}}}if(i===l)l=f
else if(l===-1)l=e.length
return e.slice(i,l)}for(let t=e.length-1;t>=0;--t){if(e.charCodeAt(t)===s){if(!n){i=t+1
break}}else if(l===-1){n=false
l=t+1}}if(l===-1)return''
return e.slice(i,l)},extname(e){r(e,'path')
let t=-1
let i=0
let l=-1
let n=true
let f=0
for(let r=e.length-1;r>=0;--r){const c=e.charCodeAt(r)
if(c===s){if(!n){i=r+1
break}continue}if(l===-1){n=false
l=r+1}if(c===o){if(t===-1)t=r
else if(f!==1)f=1}else if(t!==-1){f=-1}}if(t===-1||l===-1||f===0||f===1&&t===l-1&&t===i+1){return''}return e.slice(t,l)},format:$.bind(null,'/'),parse(e){r(e,'path')
const t={root:'',dir:'',base:'',ext:'',name:''}
if(e.length===0)return t
const i=e.charCodeAt(0)===s
let l
if(i){t.root='/'
l=1}else{l=0}let n=-1
let f=0
let c=-1
let h=true
let a=e.length-1
let d=0
for(;a>=l;--a){const t=e.charCodeAt(a)
if(t===s){if(!h){f=a+1
break}continue}if(c===-1){h=false
c=a+1}if(t===o){if(n===-1)n=a
else if(d!==1)d=1}else if(n!==-1){d=-1}}if(c!==-1){const r=f===0&&i?1:f
if(n===-1||d===0||d===1&&n===c-1&&n===f+1){t.base=t.name=e.slice(r,c)}else{t.name=e.slice(r,n)
t.base=e.slice(r,c)
t.ext=e.slice(n,c)}}if(f>0)t.dir=e.slice(0,f-1)
else if(i)t.dir='/'
return t},sep:'/',delimiter:':'}
const w=d?p:m
const{basename:k,delimiter:x,dirname:v,extname:j,format:L,isAbsolute:O,join:y,normalize:z,parse:N,relative:I,resolve:P,sep:R,toNamespacedPath:E}=w
export{k as basename,w as default,x as delimiter,v as dirname,j as extname,L as format,O as isAbsolute,y as join,z as normalize,N as parse,m as posix,I as relative,P as resolve,R as sep,E as toNamespacedPath,p as win32}
