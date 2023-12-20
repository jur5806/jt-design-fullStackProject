/*
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-11-30 16:21:52
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-12-20 09:46:49
 * @FilePath: \jt-design\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-11-24 13:17:17
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-12-14 15:37:26
 * @FilePath: \jt-design\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp, toRaw } from 'vue'
import './style.css'
import App from '@/App.vue'
import { createPinia, PiniaPluginContext } from 'pinia'
import router from './router'
import ElementPlus from 'element-plus';
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css';
import '@/styles/index.scss';
//svg插件需要配置代码
import 'virtual:svg-icons-register'
//pinia持久化
type Options = {
  key: string
}
const __jt__: String = 'jt'
const setStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value))
}
const getStorage = (key: string) => {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) as string) : {}
}

const piniaPlugin = (options: Options) => {
  return (context: PiniaPluginContext) => {
    const { store } = context
    const data = getStorage(`${options?.key ?? __jt__}- ${store.$id}`)
    store.$subscribe(() => {
      setStorage(`${options?.key ?? __jt__}- ${store.$id}`, toRaw(store.$state))
    })
    console.log(store, 'store')
    return {
      ...data
    }
  }


}
const store = createPinia()
store.use(piniaPlugin({ key: 'pinia' }))
let app = createApp(App)

//注册svg组件为全局组件，项目中就可以不用引入就可以使用这个组件，自定义插件的用法
import globalComponent from '@/components'
app.use(globalComponent)

app.use(store)
app.use(router as any)//使用路由
app.use(ElementPlus, {
  locale: zhCn,//国际化配置为中文
})

app.mount('#app')
