export default [
  {
    path: 'menus',
    name: 'menus',
    meta: {
      title: '订单',
      icon: 'Files'
    },
    component: () => import('@/view/setting/menus/menus.vue')
  }, {
    path: 'classSet',
    name: 'classSet',
    meta: {
      title: '类别设置',
      icon: 'Files'
    },
    component: () => import('@/view/setting/classSet/classSet.vue')
  }, {
    path: 'userManagement',
    name: 'userManagement',
    meta: {
      title: '用户管理',
      icon: 'Files'
    },
    component: () => import('@/view/setting/userManagement/userManagement.vue')
  }, {
    path: 'personalCenter',
    name: 'personalCenter',
    meta: {
      title: '个人中心',
      icon: 'Files'
    },
    component: () => import('@/view/setting/personalCenter/personalCenter.vue')
  }, {
    path: 'wxUser',
    name: 'wxUser',
    meta: {
      title: '微信用户',
      icon: 'Files'
    },
    component: () => import('@/view/setting/wxUser/wxUser.vue')
  }

]
