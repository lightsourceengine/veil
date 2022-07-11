const e={},t=TypeError,r=URIError,o=RangeError,n=(t,r,o=Error)=>{if('string'===typeof r)r=e=>r
e[t]=class extends o{code=t
constructor(...e){super(),this.message=r(this,...e)}}}
n('ERR_INVALID_URI','URI malformed',r),n('ERR_EVENT_RECURSION',((e,t)=>`The event "${t}" is already being dispatched`)),n('ERR_IPC_ONE_PIPE','Child process can have only one IPC pipe'),n('ERR_IPC_SYNC_FORK','IPC cannot be used with synchronous forks'),n('ERR_INVALID_ARG_TYPE',((e,t,r,o)=>`The ${t} argument must be of type ${r}. Received ${typeof o}`)),n('ERR_ARG_NOT_ITERABLE',((e,t)=>`${t} must be iterable`),t),n('ERR_INVALID_ARG_VALUE',((e,t,r,o='is invalid')=>`The ${t.includes('.')?'property':'argument'} '${t}' ${o}. Received ${typeof r}`),t),n('ERR_INVALID_FILE_URL_HOST',((e,t)=>`File URL host must be "localhost" or empty on ${t}`),t),n('ERR_INVALID_FILE_URL_PATH',((e,t)=>`File URL path ${t}`),t),n('ERR_INVALID_THIS',((e,t)=>`Value of "this" must be of type ${t}`),t),n('ERR_INVALID_TUPLE',((e,...t)=>`${t[0]} must be an iterable ${t[1]} tuple`),t),n('ERR_INVALID_URL',((e,t)=>(e.input=t,'Invalid URL')),t),n('ERR_INVALID_URL_SCHEME',((e,t)=>{if('string'===typeof t)t=[t]
if(t.length>2)return'assert: expected.length <= 2'
const r=2===t.length?`one of scheme ${t[0]} or ${t[1]}`:`of scheme ${t[0]}`
return`The URL must be ${r}`}),t),n('ERR_MISSING_ARGS',((e,...t)=>{const{length:r}=t
if(!r)return'assert: At least one arg needs to be specified'
let o='The '
const n=r,i=e=>`"${e}"`
switch(t=t.map((e=>Array.isArray(e)?e.map(i).join(' or '):i(e))),n){case 1:o+=`${t[0]} argument`
break
case 2:o+=`${t[0]} and ${t[1]} arguments`
break
default:o+=t.slice(0,n-1).join(', '),o+=`, and ${t[n-1]} arguments`
break}return`${o} must be specified`}),t),n('ERR_UNHANDLED_ERROR',((e,t=void 0)=>{const r='Unhandled error.'
return void 0===t?r:`${r} (${t})`})),n('ERR_OUT_OF_RANGE',((t,r,o,n,i=false)=>{if(!o)throw new e.ERR_MISSING_ARGS('range')
let R=i?r:`The value of "${r}" is out of range.`,a
if(Number.isInteger(n)&&Math.abs(n)>2**32)a=s(String(n))
else if('bigint'===typeof n){if(a=String(n),n>2n**32n||n<-(2n**32n))a=s(a)
a+='n'}else a=n
return R+=` It must be ${o}. Received ${a}`,R}),o),n('ERR_INVALID_SYNC_FORK_INPUT',((e,t)=>`Asynchronous forks do not support Buffer, TypedArray, DataView or string input: ${t}`),t),n('ERR_UNKNOWN_SIGNAL',((e,t)=>`Unknown signal: ${t}`),t),n('ERR_UNKNOWN_ENCODING',((e,t)=>`Unknown encoding: ${t}`),t),n('ERR_MODULE_NOT_FOUND',((e,t)=>`Cannot find module '${t}'`)),n('ERR_INVALID_PACKAGE_CONFIG',((e,t,r,o)=>`Invalid package config ${t}${r?` while importing ${r}`:''}${o?`. ${o}`:''}`)),n('ERR_PACKAGE_IMPORT_NOT_DEFINED',((e,t,r,o)=>`Package import specifier "${t}" is not defined${r?` in package ${r}package.json`:''} imported from ${o}`),t),n('ERR_PACKAGE_PATH_NOT_EXPORTED',((e,t,r,o=void 0)=>{if('.'===r)return`No "exports" main defined in ${t}package.json${o?` imported from ${o}`:''}`
return`Package subpath '${r}' is not defined by "exports" in ${t}package.json${o?` imported from ${o}`:''}`})),n('ERR_UNSUPPORTED_DIR_IMPORT',((e,...t)=>`Directory import '${t[0]}' is not supported resolving ES modules imported from ${t[1]}`)),n('ERR_NETWORK_IMPORT_DISALLOWED',((e,...t)=>`import of '${t[0]}' by ${t[1]} is not supported: ${t[2]}`)),n('ERR_UNSUPPORTED_ESM_URL_SCHEME',((e,t,r)=>{let o=`Only URLs with a scheme in: ${r.join(', ')} are supported by the default ESM loader`
if('win32'===process.platform&&2===t.protocol.length)o+='. On Windows, absolute paths must be valid file:// URLs'
return o+=`. Received protocol '${t.protocol}'`,o})),n('ERR_INVALID_PACKAGE_TARGET',((e,t,r,o,n=false,i=void 0)=>{const s='string'===typeof o&&!n&&o.length&&!o.startsWith('./')
if('.'===r){if(false!==n)throw Error(`isImport must be false when key = '.'`)
return`Invalid "exports" main target ${JSON.stringify(o)} defined `+`in the package config ${t}package.json${i?` imported from ${i}`:''}${s?'; targets must start with "./"':''}`}return`Invalid "${n?'imports':'exports'}" target ${JSON.stringify(o)} defined for '${r}' in the package config ${t}package.json${i?` imported from ${i}`:''}${s?'; targets must start with "./"':''}`})),n('ERR_INVALID_MODULE_SPECIFIER',((e,t,r,o=void 0)=>`Invalid module "${t}" ${r}${o?` imported from ${o}`:''}`),t),n('ERR_UNKNOWN_FILE_EXTENSION',((e,t,r,o)=>{let n=`Unknown file extension "${t}" for ${r}`
if(o)n+=`. ${o}`
return n}),t)
const i=(e,t,r)=>{const o=new Error(`${t} (${e}): ${r}`)
return o.errno=e,o.code=e.toString(),o.syscall=t,o}
class AbortError extends Error{constructor(e='The operation was aborted'){super(e),this.code='ABORT_ERR',this.name='AbortError'}}const s=e=>{let t='',r=e.length,o='-'===e[0]?1:0
for(;r>=o+4;r-=3)t=`_${e.slice(r-3,r)}${t}`
return`${e.slice(0,r)}${t}`}
export{AbortError,e as codes,i as errnoException}
