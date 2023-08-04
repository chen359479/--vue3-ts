export default [
  {
    path: 'broadcastMessage',
    name: 'broadcastMessage',
    meta: {
      title: '广播列表',
      icon: 'TrendCharts'
    },
    component: () => import('@/view/broadcast/broadcastMessage/broadcastMessage.vue')
  },
  {
    path: 'sendBroadcast',
    name: 'sendBroadcast',
    meta: {
      title: '发送广播',
      icon: 'TrendCharts'
    },
    component: () => import('@/view/broadcast/sendBroadcast/sendBroadcast.vue')
  }
]
