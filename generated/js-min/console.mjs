import{format as o}from'util'
const{stdout:t,stderr:r}=import.meta.native
class s{log(...r){t(o(...r))}info(...o){this.log(...o)}error(...t){r(o(...t))}warn(...o){this.error(...o)}}const e=new s
global.console=e
export{e as console,e as default}
