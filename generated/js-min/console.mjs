import{format as o}from'util'
const{stdout:s,stderr:t}=import.meta.native
class Console{log(...t){s(o(...t))}info(...o){this.log(...o)}error(...s){t(o(...s))}warn(...o){this.error(...o)}}const r=new Console
global.console=r
export{r as console,r as default}
