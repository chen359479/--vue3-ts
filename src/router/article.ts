export default [
  {
    path: 'articleInfo',
    name: 'articleInfo',
    meta: {
      title: '资源内容',
      icon: 'TrendCharts'
    },
    component: () => import('@/view/article/articleInfo/articleInfo.vue')
  },
  {
    path: 'articleText',
    name: 'articleText',
    meta: {
      title: '文本内容',
      icon: 'TrendCharts'
    },
    component: () => import('@/view/article/articleText/articleText.vue')
  }
]
