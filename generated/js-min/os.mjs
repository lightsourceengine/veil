const{homedir:o,hostname:t,tmpdir:r}=import.meta.native
const s=()=>process.platform
const a=()=>process.arch
const e=process.platform==='win32'?'\r\n':'\n'
const m={EOL:e,arch:a,homedir:o,hostname:t,platform:s,tmpdir:r}
export{e as EOL,a as arch,m as default,o as homedir,t as hostname,s as platform,r as tmpdir}
