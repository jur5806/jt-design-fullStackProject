/*
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-12-19 12:42:56
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-12-19 12:54:56
 * @FilePath: \jt-design\src\components\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import SvgIcon from './global/SvgIcon.vue';
import {Component} from 'vue'
interface GlobalComponents{[key: string]:Component}
const allGlobalComponents:GlobalComponents  = {SvgIcon};

export default {
  install(app:any){
    Object.keys(allGlobalComponents).forEach(key =>{
      app.component(key,allGlobalComponents[key]);
    })

  }
}