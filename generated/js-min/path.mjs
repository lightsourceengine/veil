const e=(e,t,r)=>{if(typeof r==='string'){return class extends t{code=e
message=r}}return class extends t{code=e
constructor(...e){super()
this.message=r(this,...e)}}}
const t=e('ERR_INVALID_ARG_TYPE',Error,((e,t,r,i)=>`The ${t} argument must be of type ${r}. Received ${typeof i}`))
const r=(e,r)=>{if(typeof e!=='object'||e.constructor!==Object){throw new t(r,'Object',e)}}
const i=(e,r)=>{if(typeof e!=='string'){throw new t(r,'string',e)}}
const l=65
const n=97
const f=90
const o=122
const s=46
const c=47
const a=92
const h=58
const d=63
const u=process.platform==='win32'
function C(e){return e===c||e===a}function A(e){return e===c}function g(e){return e>=l&&e<=f||e>=n&&e<=o}function $(e,t,r,i){let l=''
let n=0
let f=-1
let o=0
let a=0
for(let h=0;h<=e.length;++h){if(h<e.length)a=e.charCodeAt(h)
else if(i(a))break
else a=c
if(i(a)){if(f===h-1||o===1);else if(o===2){if(l.length<2||n!==2||l.charCodeAt(l.length-1)!==s||l.charCodeAt(l.length-2)!==s){if(l.length>2){const e=l.lastIndexOf(r)
if(e===-1){l=''
n=0}else{l=l.slice(0,e)
n=l.length-1-l.lastIndexOf(r)}f=h
o=0
continue}else if(l.length!==0){l=''
n=0
f=h
o=0
continue}}if(t){l+=l.length>0?`${r}..`:'..'
n=2}}else{if(l.length>0)l+=`${r}${e.slice(f+1,h)}`
else l=e.slice(f+1,h)
n=h-f-1}f=h
o=0}else if(a===s&&o!==-1){++o}else{o=-1}}return l}function p(e,t){r(t,'pathObject')
const i=t.dir||t.root
const l=t.base||`${t.name||''}${t.ext||''}`
if(!i){return l}return i===t.root?`${i}${l}`:`${i}${e}${l}`}const m={resolve(...e){let t=''
let r=''
let l=false
for(let n=e.length-1;n>=-1;n--){let f
if(n>=0){f=e[n]
i(f,'path')
if(f.length===0){continue}}else if(t.length===0){f=process.cwd()}else{f=process.env[`=${t}`]||process.cwd()
if(f===undefined||f.slice(0,2).toLowerCase()!==t.toLowerCase()&&f.charCodeAt(2)===a){f=`${t}\\`}}const o=f.length
let s=0
let c=''
let d=false
const u=f.charCodeAt(0)
if(o===1){if(C(u)){s=1
d=true}}else if(C(u)){d=true
if(C(f.charCodeAt(1))){let e=2
let t=e
while(e<o&&!C(f.charCodeAt(e))){e++}if(e<o&&e!==t){const r=f.slice(t,e)
t=e
while(e<o&&C(f.charCodeAt(e))){e++}if(e<o&&e!==t){t=e
while(e<o&&!C(f.charCodeAt(e))){e++}if(e===o||e!==t){c=`\\\\${r}\\${f.slice(t,e)}`
s=e}}}}else{s=1}}else if(g(u)&&f.charCodeAt(1)===h){c=f.slice(0,2)
s=2
if(o>2&&C(f.charCodeAt(2))){d=true
s=3}}if(c.length>0){if(t.length>0){if(c.toLowerCase()!==t.toLowerCase())continue}else{t=c}}if(l){if(t.length>0)break}else{r=`${f.slice(s)}\\${r}`
l=d
if(d&&t.length>0){break}}}r=$(r,!l,'\\',C)
return l?`${t}\\${r}`:`${t}${r}`||'.'},normalize(e){i(e,'path')
const t=e.length
if(t===0)return'.'
let r=0
let l
let n=false
const f=e.charCodeAt(0)
if(t===1){return A(f)?'\\':e}if(C(f)){n=true
if(C(e.charCodeAt(1))){let i=2
let n=i
while(i<t&&!C(e.charCodeAt(i))){i++}if(i<t&&i!==n){const f=e.slice(n,i)
n=i
while(i<t&&C(e.charCodeAt(i))){i++}if(i<t&&i!==n){n=i
while(i<t&&!C(e.charCodeAt(i))){i++}if(i===t){return`\\\\${f}\\${e.slice(n)}\\`}if(i!==n){l=`\\\\${f}\\${e.slice(n,i)}`
r=i}}}}else{r=1}}else if(g(f)&&e.charCodeAt(1)===h){l=e.slice(0,2)
r=2
if(t>2&&C(e.charCodeAt(2))){n=true
r=3}}let o=r<t?$(e.slice(r),!n,'\\',C):''
if(o.length===0&&!n)o='.'
if(o.length>0&&C(e.charCodeAt(t-1)))o+='\\'
if(l===undefined){return n?`\\${o}`:o}return n?`${l}\\${o}`:`${l}${o}`},isAbsolute(e){i(e,'path')
const t=e.length
if(t===0)return false
const r=e.charCodeAt(0)
return C(r)||t>2&&g(r)&&e.charCodeAt(1)===h&&C(e.charCodeAt(2))},join(...e){if(e.length===0)return'.'
let t
let r
for(let l=0;l<e.length;++l){const n=e[l]
i(n,'path')
if(n.length>0){if(t===undefined)t=r=n
else t+=`\\${n}`}}if(t===undefined)return'.'
let l=true
let n=0
if(C(r.charCodeAt(0))){++n
const e=r.length
if(e>1&&C(r.charCodeAt(1))){++n
if(e>2){if(C(r.charCodeAt(2)))++n
else{l=false}}}}if(l){while(n<t.length&&C(t.charCodeAt(n))){n++}if(n>=2)t=`\\${t.slice(n)}`}return m.normalize(t)},relative(e,t){i(e,'from')
i(t,'to')
if(e===t)return''
const r=m.resolve(e)
const l=m.resolve(t)
if(r===l)return''
e=r.toLowerCase()
t=l.toLowerCase()
if(e===t)return''
let n=0
while(n<e.length&&e.charCodeAt(n)===a){n++}let f=e.length
while(f-1>n&&e.charCodeAt(f-1)===a){f--}const o=f-n
let s=0
while(s<t.length&&t.charCodeAt(s)===a){s++}let c=t.length
while(c-1>s&&t.charCodeAt(c-1)===a){c--}const h=c-s
const d=o<h?o:h
let u=-1
let C=0
for(;C<d;C++){const r=e.charCodeAt(n+C)
if(r!==t.charCodeAt(s+C))break
else if(r===a)u=C}if(C!==d){if(u===-1)return l}else{if(h>d){if(t.charCodeAt(s+C)===a){return l.slice(s+C+1)}if(C===2){return l.slice(s+C)}}if(o>d){if(e.charCodeAt(n+C)===a){u=C}else if(C===2){u=3}}if(u===-1)u=0}let A=''
for(C=n+u+1;C<=f;++C){if(C===f||e.charCodeAt(C)===a){A+=A.length===0?'..':'\\..'}}s+=u
if(A.length>0)return`${A}${l.slice(s,c)}`
if(l.charCodeAt(s)===a)++s
return l.slice(s,c)},toNamespacedPath(e){if(typeof e!=='string'||e.length===0)return e
const t=m.resolve(e)
if(t.length<=2)return e
if(t.charCodeAt(0)===a){if(t.charCodeAt(1)===a){const e=t.charCodeAt(2)
if(e!==d&&e!==s){return`\\\\?\\UNC\\${t.slice(2)}`}}}else if(g(t.charCodeAt(0))&&t.charCodeAt(1)===h&&t.charCodeAt(2)===a){return`\\\\?\\${t}`}return e},dirname(e){i(e,'path')
const t=e.length
if(t===0)return'.'
let r=-1
let l=0
const n=e.charCodeAt(0)
if(t===1){return C(n)?e:'.'}if(C(n)){r=l=1
if(C(e.charCodeAt(1))){let i=2
let n=i
while(i<t&&!C(e.charCodeAt(i))){i++}if(i<t&&i!==n){n=i
while(i<t&&C(e.charCodeAt(i))){i++}if(i<t&&i!==n){n=i
while(i<t&&!C(e.charCodeAt(i))){i++}if(i===t){return e}if(i!==n){r=l=i+1}}}}}else if(g(n)&&e.charCodeAt(1)===h){r=t>2&&C(e.charCodeAt(2))?3:2
l=r}let f=-1
let o=true
for(let r=t-1;r>=l;--r){if(C(e.charCodeAt(r))){if(!o){f=r
break}}else{o=false}}if(f===-1){if(r===-1)return'.'
f=r}return e.slice(0,f)},basename(e,t){if(t!==undefined)i(t,'ext')
i(e,'path')
let r=0
let l=-1
let n=true
if(e.length>=2&&g(e.charCodeAt(0))&&e.charCodeAt(1)===h){r=2}if(t!==undefined&&t.length>0&&t.length<=e.length){if(t===e)return''
let i=t.length-1
let f=-1
for(let o=e.length-1;o>=r;--o){const s=e.charCodeAt(o)
if(C(s)){if(!n){r=o+1
break}}else{if(f===-1){n=false
f=o+1}if(i>=0){if(s===t.charCodeAt(i)){if(--i===-1){l=o}}else{i=-1
l=f}}}}if(r===l)l=f
else if(l===-1)l=e.length
return e.slice(r,l)}for(let t=e.length-1;t>=r;--t){if(C(e.charCodeAt(t))){if(!n){r=t+1
break}}else if(l===-1){n=false
l=t+1}}if(l===-1)return''
return e.slice(r,l)},extname(e){i(e,'path')
let t=0
let r=-1
let l=0
let n=-1
let f=true
let o=0
if(e.length>=2&&e.charCodeAt(1)===h&&g(e.charCodeAt(0))){t=l=2}for(let i=e.length-1;i>=t;--i){const t=e.charCodeAt(i)
if(C(t)){if(!f){l=i+1
break}continue}if(n===-1){f=false
n=i+1}if(t===s){if(r===-1)r=i
else if(o!==1)o=1}else if(r!==-1){o=-1}}if(r===-1||n===-1||o===0||o===1&&r===n-1&&r===l+1){return''}return e.slice(r,n)},format:p.bind(null,'\\'),parse(e){i(e,'path')
const t={root:'',dir:'',base:'',ext:'',name:''}
if(e.length===0)return t
const r=e.length
let l=0
let n=e.charCodeAt(0)
if(r===1){if(C(n)){t.root=t.dir=e
return t}t.base=t.name=e
return t}if(C(n)){l=1
if(C(e.charCodeAt(1))){let t=2
let i=t
while(t<r&&!C(e.charCodeAt(t))){t++}if(t<r&&t!==i){i=t
while(t<r&&C(e.charCodeAt(t))){t++}if(t<r&&t!==i){i=t
while(t<r&&!C(e.charCodeAt(t))){t++}if(t===r){l=t}else if(t!==i){l=t+1}}}}}else if(g(n)&&e.charCodeAt(1)===h){if(r<=2){t.root=t.dir=e
return t}l=2
if(C(e.charCodeAt(2))){if(r===3){t.root=t.dir=e
return t}l=3}}if(l>0)t.root=e.slice(0,l)
let f=-1
let o=l
let c=-1
let a=true
let d=e.length-1
let u=0
for(;d>=l;--d){n=e.charCodeAt(d)
if(C(n)){if(!a){o=d+1
break}continue}if(c===-1){a=false
c=d+1}if(n===s){if(f===-1)f=d
else if(u!==1)u=1}else if(f!==-1){u=-1}}if(c!==-1){if(f===-1||u===0||u===1&&f===c-1&&f===o+1){t.base=t.name=e.slice(o,c)}else{t.name=e.slice(o,f)
t.base=e.slice(o,c)
t.ext=e.slice(f,c)}}if(o>0&&o!==l)t.dir=e.slice(0,o-1)
else t.dir=t.root
return t},sep:'\\',delimiter:';'}
const b=(()=>{if(u){const e=/\\/g
return()=>{const t=process.cwd().replace(e,'/')
return t.slice(t.indexOf('/'))}}return()=>process.cwd()})()
const w={resolve(...e){let t=''
let r=false
for(let l=e.length-1;l>=-1&&!r;l--){const n=l>=0?e[l]:b()
i(n,'path')
if(n.length===0){continue}t=`${n}/${t}`
r=n.charCodeAt(0)===c}t=$(t,!r,'/',A)
if(r){return`/${t}`}return t.length>0?t:'.'},normalize(e){i(e,'path')
if(e.length===0)return'.'
const t=e.charCodeAt(0)===c
const r=e.charCodeAt(e.length-1)===c
e=$(e,!t,'/',A)
if(e.length===0){if(t)return'/'
return r?'./':'.'}if(r)e+='/'
return t?`/${e}`:e},isAbsolute(e){i(e,'path')
return e.length>0&&e.charCodeAt(0)===c},join(...e){if(e.length===0)return'.'
let t
for(let r=0;r<e.length;++r){const l=e[r]
i(l,'path')
if(l.length>0){if(t===undefined)t=l
else t+=`/${l}`}}if(t===undefined)return'.'
return w.normalize(t)},relative(e,t){i(e,'from')
i(t,'to')
if(e===t)return''
e=w.resolve(e)
t=w.resolve(t)
if(e===t)return''
const r=1
const l=e.length
const n=l-r
const f=1
const o=t.length-f
const s=n<o?n:o
let a=-1
let h=0
for(;h<s;h++){const i=e.charCodeAt(r+h)
if(i!==t.charCodeAt(f+h))break
else if(i===c)a=h}if(h===s){if(o>s){if(t.charCodeAt(f+h)===c){return t.slice(f+h+1)}if(h===0){return t.slice(f+h)}}else if(n>s){if(e.charCodeAt(r+h)===c){a=h}else if(h===0){a=0}}}let d=''
for(h=r+a+1;h<=l;++h){if(h===l||e.charCodeAt(h)===c){d+=d.length===0?'..':'/..'}}return`${d}${t.slice(f+a)}`},toNamespacedPath(e){return e},dirname(e){i(e,'path')
if(e.length===0)return'.'
const t=e.charCodeAt(0)===c
let r=-1
let l=true
for(let t=e.length-1;t>=1;--t){if(e.charCodeAt(t)===c){if(!l){r=t
break}}else{l=false}}if(r===-1)return t?'/':'.'
if(t&&r===1)return'//'
return e.slice(0,r)},basename(e,t){if(t!==undefined)i(t,'ext')
i(e,'path')
let r=0
let l=-1
let n=true
if(t!==undefined&&t.length>0&&t.length<=e.length){if(t===e)return''
let i=t.length-1
let f=-1
for(let o=e.length-1;o>=0;--o){const s=e.charCodeAt(o)
if(s===c){if(!n){r=o+1
break}}else{if(f===-1){n=false
f=o+1}if(i>=0){if(s===t.charCodeAt(i)){if(--i===-1){l=o}}else{i=-1
l=f}}}}if(r===l)l=f
else if(l===-1)l=e.length
return e.slice(r,l)}for(let t=e.length-1;t>=0;--t){if(e.charCodeAt(t)===c){if(!n){r=t+1
break}}else if(l===-1){n=false
l=t+1}}if(l===-1)return''
return e.slice(r,l)},extname(e){i(e,'path')
let t=-1
let r=0
let l=-1
let n=true
let f=0
for(let i=e.length-1;i>=0;--i){const o=e.charCodeAt(i)
if(o===c){if(!n){r=i+1
break}continue}if(l===-1){n=false
l=i+1}if(o===s){if(t===-1)t=i
else if(f!==1)f=1}else if(t!==-1){f=-1}}if(t===-1||l===-1||f===0||f===1&&t===l-1&&t===r+1){return''}return e.slice(t,l)},format:p.bind(null,'/'),parse(e){i(e,'path')
const t={root:'',dir:'',base:'',ext:'',name:''}
if(e.length===0)return t
const r=e.charCodeAt(0)===c
let l
if(r){t.root='/'
l=1}else{l=0}let n=-1
let f=0
let o=-1
let a=true
let h=e.length-1
let d=0
for(;h>=l;--h){const t=e.charCodeAt(h)
if(t===c){if(!a){f=h+1
break}continue}if(o===-1){a=false
o=h+1}if(t===s){if(n===-1)n=h
else if(d!==1)d=1}else if(n!==-1){d=-1}}if(o!==-1){const i=f===0&&r?1:f
if(n===-1||d===0||d===1&&n===o-1&&n===f+1){t.base=t.name=e.slice(i,o)}else{t.name=e.slice(i,n)
t.base=e.slice(i,o)
t.ext=e.slice(n,o)}}if(f>0)t.dir=e.slice(0,f-1)
else if(r)t.dir='/'
return t},sep:'/',delimiter:':'}
const x=u?m:w
const{basename:k,delimiter:v,dirname:j,extname:L,format:y,isAbsolute:O,join:z,normalize:N,parse:I,relative:P,resolve:R,sep:E,toNamespacedPath:_}=x
export{k as basename,x as default,v as delimiter,j as dirname,L as extname,y as format,O as isAbsolute,z as join,N as normalize,I as parse,w as posix,P as relative,R as resolve,E as sep,_ as toNamespacedPath,m as win32}
