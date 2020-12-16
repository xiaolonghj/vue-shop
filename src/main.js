import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

/* 全局导入ElementUI */
import ElementUI from 'element-ui'
/* 全局样式 */
import './assets/css/global.css'
/* 引入axios */
import axios from 'axios'
/* 配置根路径 */
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

Vue.use(ElementUI)

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
