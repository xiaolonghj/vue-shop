import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

/* 全局导入ElementUI */
import ElementUI from 'element-ui'
/* 全局样式 */
import './assets/css/global.css'
/* 字体库样式 */
import './assets/css/iconfont.css'
/* 引入axios */
import axios from 'axios'
/* 配置根路径 */
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
/*  axios请求拦截器添加token */
axios.interceptors.request.use(config => {
  //为请求拦截器对象添加token验证的Authorization字段
  console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config
})
/* 引入网格table组件 */
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

Vue.use(ElementUI)

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
