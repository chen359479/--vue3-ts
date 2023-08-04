import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import setting from '@/router/setting'
import document from '@/router/document'
import order from '@/router/order'
import article from '@/router/article'
import broadcast from '@/router/broadcast'

const routes: Array<RouteRecordRaw> = [
  {
    // 路由初始指向
    path: '/',
    redirect: '/login'
  }, {
    // 路由初始指向
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      icon: 'RefreshRight'
    },
    component: () => import('@/view/login/login.vue')
  }, {
    // 路由初始指向
    path: '/main',
    name: 'main',
    meta: {
      title: '主体'
    },
    component: () => import('@/view/main/index.vue'),
    children: [
      {
        path: 'home',
        name: 'home',
        meta: {
          title: '首页',
          icon: 'House'
        },
        component: () => import('@/view/home/home.vue')
      },
      ...order,
      ...article,
      ...document,
      ...setting,
      ...broadcast
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
