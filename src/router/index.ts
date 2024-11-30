import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/index.vue')
    },
    {
      path: '/',
      component: () => import('@/layout/index.vue'),
      children: [
        // 用户模块 - 修改路由配置
        {
          path: 'user',
          name: 'user',
          component: () => import('@/views/user/index.vue')
        },
        // 树洞模块
        {
          path: 'tree-hole',
          component: () => import('@/views/tree-hole/index.vue'),
          children: [
            { 
              path: 'question',
              component: () => import('@/views/tree-hole/question.vue')
            },
            { 
              path: 'confession',
              component: () => import('@/views/tree-hole/confession.vue')
            }
          ]
        },
        // 个人展示模块
        {
          path: 'showcase',
          component: () => import('@/views/showcase/index.vue'),
          children: [
            { 
              path: 'photo-wall',
              component: () => import('@/views/showcase/photo-wall.vue')
            },
            { 
              path: 'articles',
              component: () => import('@/views/showcase/articles.vue')
            }
          ]
        },
        // 博客模块
        {
          path: 'blog',
          component: () => import('@/views/blog/index.vue')
        },
        // 工具模块
        {
          path: 'tools',
          component: () => import('@/views/tools/index.vue'),
          children: [
            { 
              path: 'bookmarks',
              component: () => import('@/views/tools/bookmarks.vue')
            },
            { 
              path: 'files',
              component: () => import('@/views/tools/files.vue')
            },
            { 
              path: 'games',
              component: () => import('@/views/tools/games.vue')
            },
            { 
              path: 'websites',
              component: () => import('@/views/tools/websites.vue')
            }
          ]
        },
        // 互动模块
        {
          path: 'interaction',
          component: () => import('@/views/interaction/index.vue')
        },
        // 工作模版
        {
          path: 'work-templates',
          component: () => import('@/views/work-templates/index.vue')
        }
      ]
    }
  ]
})

export default router