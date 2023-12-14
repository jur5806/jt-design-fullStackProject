/*
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-11-30 16:30:04
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-12-08 16:09:42
 * @FilePath: \jt-design\src\router.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/view/Home.vue';
import About from '@/view/About.vue';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: '首页',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    component: About,
  },
  {
    path: '/vue3_communication',
    name: 'vue3组件通信学习',
    children: [
        {
          path: '/props_pre',
          name: 'props_pre',
          component: () => import('@/view/vue3Communication/01_props/PropsTest.vue'),
        },
        {
          path: '/event_pre',
          name: 'event_pre',
          component: () => import('@/view/vue3Communication/02_custom-event/EventTest.vue'),
        },
        {
          path: '/bus_pre',
          name: 'bus_pre',
          component: () => import('@/view/vue3Communication/03_event-bus/EventBusTest.vue'),
        },
        {
          path: '/model_pre',
          name: 'model_pre',
          component: () => import('@/view/vue3Communication/04_v-model/ModelTest.vue'),
        },
        {
          path: '/attrs-listeners_pre',
          name: 'attrs-listeners_pre',
          component: () => import('@/view/vue3Communication/05_attrs-listeners/AttrsListenersTest.vue'),
        },
        {
          path: '/ref-parent_pre',
          name: 'ref-parent_pre',
          component: () => import('@/view/vue3Communication/06_ref-children-parent/RefChildrenParentTest.vue'),
        },
        {
          path: '/provide-inject_pre',
          name: 'provide-inject_pre',
          component: () => import('@/view/vue3Communication/07_provide-inject/ProvideInjectTest.vue'),
        },
        {
          path: '/vuex_pre',
          name: 'vuex_pre',
          component: () => import('@/view/vue3Communication/08_pinia/index.vue'),
        },
        {
          path: '/slot_pre',
          name: 'slot_pre',
          component: () => import('@/view/vue3Communication/09_slot/SlotTest.vue'),
        },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router