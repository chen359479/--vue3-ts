import { createApp } from 'vue'
import '@/assets/css/reset.css'
import '@/assets/css/iconfont/iconfont.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// 实例化 Pinia
const pinia = createPinia()

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

// @ts-ignore
const app = createApp(App)
app.use(router)
  .use(ElementPlus, { locale: zhCn })
  .use(router)
  .use(pinia)
  .mount('#app')

// 全局注册图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
