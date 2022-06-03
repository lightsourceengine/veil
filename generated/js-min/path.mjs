import{_internal as e}from'util'
const{validateString:t,validateObject:r}=e
const l=65
const i=97
const n=90
const f=122
const o=46
const s=47
const c=92
const a=58
const h=63
const d=process.platform==='win32'
function u(e){return e===s||e===c}function C(e){return e===s}function A(e){return e>=l&&e<=n||e>=i&&e<=f}function g(e,t,r,l){let i=''
let n=0
let f=-1
let c=0
let a=0
for(let h=0;h<=e.length;++h){if(h<e.length)a=e.charCodeAt(h)
else if(l(a))break
else a=s
if(l(a)){if(f===h-1||c===1);else if(c===2){if(i.length<2||n!==2||i.charCodeAt(i.length-1)!==o||i.charCodeAt(i.length-2)!==o){if(i.length>2){const e=i.lastIndexOf(r)
if(e===-1){i=''
n=0}else{i=i.slice(0,e)
n=i.length-1-i.lastIndexOf(r)}f=h
c=0
continue}else if(i.length!==0){i=''
n=0
f=h
c=0
continue}}if(t){i+=i.length>0?`${r}..`:'..'
n=2}}else{if(i.length>0)i+=`${r}${e.slice(f+1,h)}`
else i=e.slice(f+1,h)
n=h-f-1}f=h
c=0}else if(a===o&&c!==-1){++c}else{c=-1}}return i}function $(e,t){r(t,'pathObject')
const l=t.dir||t.root
const i=t.base||`${t.name||''}${t.ext||''}`
if(!l){return i}return l===t.root?`${l}${i}`:`${l}${e}${i}`}const p={resolve(...e){let r=''
let l=''
let i=false
for(let n=e.length-1;n>=-1;n--){let f
if(n>=0){f=e[n]
t(f,'path')
if(f.length===0){continue}}else if(r.length===0){f=process.cwd()}else{f=process.env[`=${r}`]||process.cwd()
if(f===undefined||f.slice(0,2).toLowerCase()!==r.toLowerCase()&&f.charCodeAt(2)===c){f=`${r}\\`}}const o=f.length
let s=0
let h=''
let d=false
const C=f.charCodeAt(0)
if(o===1){if(u(C)){s=1
d=true}}else if(u(C)){d=true
if(u(f.charCodeAt(1))){let e=2
let t=e
while(e<o&&!u(f.charCodeAt(e))){e++}if(e<o&&e!==t){const r=f.slice(t,e)
t=e
while(e<o&&u(f.charCodeAt(e))){e++}if(e<o&&e!==t){t=e
while(e<o&&!u(f.charCodeAt(e))){e++}if(e===o||e!==t){h=`\\\\${r}\\${f.slice(t,e)}`
s=e}}}}else{s=1}}else if(A(C)&&f.charCodeAt(1)===a){h=f.slice(0,2)
s=2
if(o>2&&u(f.charCodeAt(2))){d=true
s=3}}if(h.length>0){if(r.length>0){if(h.toLowerCase()!==r.toLowerCase())continue}else{r=h}}if(i){if(r.length>0)break}else{l=`${f.slice(s)}\\${l}`
i=d
if(d&&r.length>0){break}}}l=g(l,!i,'\\',u)
return i?`${r}\\${l}`:`${r}${l}`||'.'},normalize(e){t(e,'path')
const r=e.length
if(r===0)return'.'
let l=0
let i
let n=false
const f=e.charCodeAt(0)
if(r===1){return C(f)?'\\':e}if(u(f)){n=true
if(u(e.charCodeAt(1))){let t=2
let n=t
while(t<r&&!u(e.charCodeAt(t))){t++}if(t<r&&t!==n){const f=e.slice(n,t)
n=t
while(t<r&&u(e.charCodeAt(t))){t++}if(t<r&&t!==n){n=t
while(t<r&&!u(e.charCodeAt(t))){t++}if(t===r){return`\\\\${f}\\${e.slice(n)}\\`}if(t!==n){i=`\\\\${f}\\${e.slice(n,t)}`
l=t}}}}else{l=1}}else if(A(f)&&e.charCodeAt(1)===a){i=e.slice(0,2)
l=2
if(r>2&&u(e.charCodeAt(2))){n=true
l=3}}let o=l<r?g(e.slice(l),!n,'\\',u):''
if(o.length===0&&!n)o='.'
if(o.length>0&&u(e.charCodeAt(r-1)))o+='\\'
if(i===undefined){return n?`\\${o}`:o}return n?`${i}\\${o}`:`${i}${o}`},isAbsolute(e){t(e,'path')
const r=e.length
if(r===0)return false
const l=e.charCodeAt(0)
return u(l)||r>2&&A(l)&&e.charCodeAt(1)===a&&u(e.charCodeAt(2))},join(...e){if(e.length===0)return'.'
let r
let l
for(let i=0;i<e.length;++i){const n=e[i]
t(n,'path')
if(n.length>0){if(r===undefined)r=l=n
else r+=`\\${n}`}}if(r===undefined)return'.'
let i=true
let n=0
if(u(l.charCodeAt(0))){++n
const e=l.length
if(e>1&&u(l.charCodeAt(1))){++n
if(e>2){if(u(l.charCodeAt(2)))++n
else{i=false}}}}if(i){while(n<r.length&&u(r.charCodeAt(n))){n++}if(n>=2)r=`\\${r.slice(n)}`}return p.normalize(r)},relative(e,r){t(e,'from')
t(r,'to')
if(e===r)return''
const l=p.resolve(e)
const i=p.resolve(r)
if(l===i)return''
e=l.toLowerCase()
r=i.toLowerCase()
if(e===r)return''
let n=0
while(n<e.length&&e.charCodeAt(n)===c){n++}let f=e.length
while(f-1>n&&e.charCodeAt(f-1)===c){f--}const o=f-n
let s=0
while(s<r.length&&r.charCodeAt(s)===c){s++}let a=r.length
while(a-1>s&&r.charCodeAt(a-1)===c){a--}const h=a-s
const d=o<h?o:h
let u=-1
let C=0
for(;C<d;C++){const t=e.charCodeAt(n+C)
if(t!==r.charCodeAt(s+C))break
else if(t===c)u=C}if(C!==d){if(u===-1)return i}else{if(h>d){if(r.charCodeAt(s+C)===c){return i.slice(s+C+1)}if(C===2){return i.slice(s+C)}}if(o>d){if(e.charCodeAt(n+C)===c){u=C}else if(C===2){u=3}}if(u===-1)u=0}let A=''
for(C=n+u+1;C<=f;++C){if(C===f||e.charCodeAt(C)===c){A+=A.length===0?'..':'\\..'}}s+=u
if(A.length>0)return`${A}${i.slice(s,a)}`
if(i.charCodeAt(s)===c)++s
return i.slice(s,a)},toNamespacedPath(e){if(typeof e!=='string'||e.length===0)return e
const t=p.resolve(e)
if(t.length<=2)return e
if(t.charCodeAt(0)===c){if(t.charCodeAt(1)===c){const e=t.charCodeAt(2)
if(e!==h&&e!==o){return`\\\\?\\UNC\\${t.slice(2)}`}}}else if(A(t.charCodeAt(0))&&t.charCodeAt(1)===a&&t.charCodeAt(2)===c){return`\\\\?\\${t}`}return e},dirname(e){t(e,'path')
const r=e.length
if(r===0)return'.'
let l=-1
let i=0
const n=e.charCodeAt(0)
if(r===1){return u(n)?e:'.'}if(u(n)){l=i=1
if(u(e.charCodeAt(1))){let t=2
let n=t
while(t<r&&!u(e.charCodeAt(t))){t++}if(t<r&&t!==n){n=t
while(t<r&&u(e.charCodeAt(t))){t++}if(t<r&&t!==n){n=t
while(t<r&&!u(e.charCodeAt(t))){t++}if(t===r){return e}if(t!==n){l=i=t+1}}}}}else if(A(n)&&e.charCodeAt(1)===a){l=r>2&&u(e.charCodeAt(2))?3:2
i=l}let f=-1
let o=true
for(let t=r-1;t>=i;--t){if(u(e.charCodeAt(t))){if(!o){f=t
break}}else{o=false}}if(f===-1){if(l===-1)return'.'
f=l}return e.slice(0,f)},basename(e,r){if(r!==undefined)t(r,'ext')
t(e,'path')
let l=0
let i=-1
let n=true
if(e.length>=2&&A(e.charCodeAt(0))&&e.charCodeAt(1)===a){l=2}if(r!==undefined&&r.length>0&&r.length<=e.length){if(r===e)return''
let t=r.length-1
let f=-1
for(let o=e.length-1;o>=l;--o){const s=e.charCodeAt(o)
if(u(s)){if(!n){l=o+1
break}}else{if(f===-1){n=false
f=o+1}if(t>=0){if(s===r.charCodeAt(t)){if(--t===-1){i=o}}else{t=-1
i=f}}}}if(l===i)i=f
else if(i===-1)i=e.length
return e.slice(l,i)}for(let t=e.length-1;t>=l;--t){if(u(e.charCodeAt(t))){if(!n){l=t+1
break}}else if(i===-1){n=false
i=t+1}}if(i===-1)return''
return e.slice(l,i)},extname(e){t(e,'path')
let r=0
let l=-1
let i=0
let n=-1
let f=true
let s=0
if(e.length>=2&&e.charCodeAt(1)===a&&A(e.charCodeAt(0))){r=i=2}for(let t=e.length-1;t>=r;--t){const r=e.charCodeAt(t)
if(u(r)){if(!f){i=t+1
break}continue}if(n===-1){f=false
n=t+1}if(r===o){if(l===-1)l=t
else if(s!==1)s=1}else if(l!==-1){s=-1}}if(l===-1||n===-1||s===0||s===1&&l===n-1&&l===i+1){return''}return e.slice(l,n)},format:$.bind(null,'\\'),parse(e){t(e,'path')
const r={root:'',dir:'',base:'',ext:'',name:''}
if(e.length===0)return r
const l=e.length
let i=0
let n=e.charCodeAt(0)
if(l===1){if(u(n)){r.root=r.dir=e
return r}r.base=r.name=e
return r}if(u(n)){i=1
if(u(e.charCodeAt(1))){let t=2
let r=t
while(t<l&&!u(e.charCodeAt(t))){t++}if(t<l&&t!==r){r=t
while(t<l&&u(e.charCodeAt(t))){t++}if(t<l&&t!==r){r=t
while(t<l&&!u(e.charCodeAt(t))){t++}if(t===l){i=t}else if(t!==r){i=t+1}}}}}else if(A(n)&&e.charCodeAt(1)===a){if(l<=2){r.root=r.dir=e
return r}i=2
if(u(e.charCodeAt(2))){if(l===3){r.root=r.dir=e
return r}i=3}}if(i>0)r.root=e.slice(0,i)
let f=-1
let s=i
let c=-1
let h=true
let d=e.length-1
let C=0
for(;d>=i;--d){n=e.charCodeAt(d)
if(u(n)){if(!h){s=d+1
break}continue}if(c===-1){h=false
c=d+1}if(n===o){if(f===-1)f=d
else if(C!==1)C=1}else if(f!==-1){C=-1}}if(c!==-1){if(f===-1||C===0||C===1&&f===c-1&&f===s+1){r.base=r.name=e.slice(s,c)}else{r.name=e.slice(s,f)
r.base=e.slice(s,c)
r.ext=e.slice(f,c)}}if(s>0&&s!==i)r.dir=e.slice(0,s-1)
else r.dir=r.root
return r},sep:'\\',delimiter:';'}
const m=(()=>{if(d){const e=/\\/g
return()=>{const t=process.cwd().replace(e,'/')
return t.slice(t.indexOf('/'))}}return()=>process.cwd()})()
const b={resolve(...e){let r=''
let l=false
for(let i=e.length-1;i>=-1&&!l;i--){const n=i>=0?e[i]:m()
t(n,'path')
if(n.length===0){continue}r=`${n}/${r}`
l=n.charCodeAt(0)===s}r=g(r,!l,'/',C)
if(l){return`/${r}`}return r.length>0?r:'.'},normalize(e){t(e,'path')
if(e.length===0)return'.'
const r=e.charCodeAt(0)===s
const l=e.charCodeAt(e.length-1)===s
e=g(e,!r,'/',C)
if(e.length===0){if(r)return'/'
return l?'./':'.'}if(l)e+='/'
return r?`/${e}`:e},isAbsolute(e){t(e,'path')
return e.length>0&&e.charCodeAt(0)===s},join(...e){if(e.length===0)return'.'
let r
for(let l=0;l<e.length;++l){const i=e[l]
t(i,'path')
if(i.length>0){if(r===undefined)r=i
else r+=`/${i}`}}if(r===undefined)return'.'
return b.normalize(r)},relative(e,r){t(e,'from')
t(r,'to')
if(e===r)return''
e=b.resolve(e)
r=b.resolve(r)
if(e===r)return''
const l=1
const i=e.length
const n=i-l
const f=1
const o=r.length-f
const c=n<o?n:o
let a=-1
let h=0
for(;h<c;h++){const t=e.charCodeAt(l+h)
if(t!==r.charCodeAt(f+h))break
else if(t===s)a=h}if(h===c){if(o>c){if(r.charCodeAt(f+h)===s){return r.slice(f+h+1)}if(h===0){return r.slice(f+h)}}else if(n>c){if(e.charCodeAt(l+h)===s){a=h}else if(h===0){a=0}}}let d=''
for(h=l+a+1;h<=i;++h){if(h===i||e.charCodeAt(h)===s){d+=d.length===0?'..':'/..'}}return`${d}${r.slice(f+a)}`},toNamespacedPath(e){return e},dirname(e){t(e,'path')
if(e.length===0)return'.'
const r=e.charCodeAt(0)===s
let l=-1
let i=true
for(let t=e.length-1;t>=1;--t){if(e.charCodeAt(t)===s){if(!i){l=t
break}}else{i=false}}if(l===-1)return r?'/':'.'
if(r&&l===1)return'//'
return e.slice(0,l)},basename(e,r){if(r!==undefined)t(r,'ext')
t(e,'path')
let l=0
let i=-1
let n=true
if(r!==undefined&&r.length>0&&r.length<=e.length){if(r===e)return''
let t=r.length-1
let f=-1
for(let o=e.length-1;o>=0;--o){const c=e.charCodeAt(o)
if(c===s){if(!n){l=o+1
break}}else{if(f===-1){n=false
f=o+1}if(t>=0){if(c===r.charCodeAt(t)){if(--t===-1){i=o}}else{t=-1
i=f}}}}if(l===i)i=f
else if(i===-1)i=e.length
return e.slice(l,i)}for(let t=e.length-1;t>=0;--t){if(e.charCodeAt(t)===s){if(!n){l=t+1
break}}else if(i===-1){n=false
i=t+1}}if(i===-1)return''
return e.slice(l,i)},extname(e){t(e,'path')
let r=-1
let l=0
let i=-1
let n=true
let f=0
for(let t=e.length-1;t>=0;--t){const c=e.charCodeAt(t)
if(c===s){if(!n){l=t+1
break}continue}if(i===-1){n=false
i=t+1}if(c===o){if(r===-1)r=t
else if(f!==1)f=1}else if(r!==-1){f=-1}}if(r===-1||i===-1||f===0||f===1&&r===i-1&&r===l+1){return''}return e.slice(r,i)},format:$.bind(null,'/'),parse(e){t(e,'path')
const r={root:'',dir:'',base:'',ext:'',name:''}
if(e.length===0)return r
const l=e.charCodeAt(0)===s
let i
if(l){r.root='/'
i=1}else{i=0}let n=-1
let f=0
let c=-1
let a=true
let h=e.length-1
let d=0
for(;h>=i;--h){const t=e.charCodeAt(h)
if(t===s){if(!a){f=h+1
break}continue}if(c===-1){a=false
c=h+1}if(t===o){if(n===-1)n=h
else if(d!==1)d=1}else if(n!==-1){d=-1}}if(c!==-1){const t=f===0&&l?1:f
if(n===-1||d===0||d===1&&n===c-1&&n===f+1){r.base=r.name=e.slice(t,c)}else{r.name=e.slice(t,n)
r.base=e.slice(t,c)
r.ext=e.slice(n,c)}}if(f>0)r.dir=e.slice(0,f-1)
else if(l)r.dir='/'
return r},sep:'/',delimiter:':'}
const w=d?p:b
const{basename:k,delimiter:v,dirname:x,extname:L,format:j,isAbsolute:z,join:O,normalize:N,parse:P,relative:I,resolve:y,sep:S,toNamespacedPath:U}=w
export{k as basename,w as default,v as delimiter,x as dirname,L as extname,j as format,z as isAbsolute,O as join,N as normalize,P as parse,b as posix,I as relative,y as resolve,S as sep,U as toNamespacedPath,p as win32}
