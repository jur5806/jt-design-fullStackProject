/*
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-11-30 16:30:04
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-11-30 16:53:03
 * @FilePath: \jt-design\src\router.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from './view/Home.vue';
import About from './view/About.vue';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    component: About,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router