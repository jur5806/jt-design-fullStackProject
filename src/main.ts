/*
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-11-24 13:17:17
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-11-30 16:19:30
 * @FilePath: \jt-design\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp , toRaw} from 'vue'
import './style.css' 
import App from './App.vue'
import {createPinia,PiniaPluginContext} from 'pinia'
//pinia持久化
type Options ={
  key: string
}
const __jt__ :String = 'jt'
const setStorage = (key: string,value: any) =>{
  localStorage.setItem(key,JSON.stringify(value))
}
const getStorage = (key: string) =>{
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : {}
}

const piniaPlugin = (options: Options)=>{
  return (context: PiniaPluginContext)=>{
    const {store} = context
    const data = getStorage(`${options?.key ?? __jt__ }- ${store.$id}`)
    store.$subscribe(()=>{
      setStorage(`${options?.key ?? __jt__ }- ${store.$id}`,toRaw(store.$state))
    })
    console.log(store,'store')
    return {
      ...data
    }
  }


}
const store = createPinia()
store.use(piniaPlugin({key:'pinia'}))
let app = createApp(App)
app.use(store)

app.mount('#app')
