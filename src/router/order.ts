export default [
  {
    path: 'order',
    name: 'order',
    meta: {
      title: '订单',
      icon: 'TrendCharts'
    },
    component: () => import('@/view/order/order.vue')
  }
]
