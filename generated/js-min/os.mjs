const{homedir:r,hostname:o,tmpdir:t}=import.meta.native,a=()=>process.platform,e=()=>process.arch,m='win32'===process.platform?'\r\n':'\n',p={EOL:m,arch:e,homedir:r,hostname:o,platform:a,tmpdir:t}
export{m as EOL,e as arch,p as default,r as homedir,o as hostname,a as platform,t as tmpdir}
