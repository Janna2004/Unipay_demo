import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
import router from '@/router/index.js'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus, {
  locale: zhCn
})
app.use(router)
app.$mount()
//app.mount('#app')
// #endif
 
// #ifdef VUE3
import { createSSRApp } from 'vue'
import {request} from '/config/request.js'

// import check from '/utils/isMail.js'
export function createApp() {
  const app = createSSRApp(App)
  app.config.globalProperties.$r = request
  // app.config.globalProperties.$c = check
  return {
    app
  }
}
// #endif

