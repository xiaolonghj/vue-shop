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

//导入NProgress的js和css文件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

/* 配置根路径 */
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
/*  axios请求拦截器添加token */

//在request拦截器展示NProgress.start()
axios.interceptors.request.use(config => {
  NProgress.start();
  //为请求拦截器对象添加token验证的Authorization字段
  console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config
})
//在respone拦截器展示NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done();
  return config
})

/* 引入网格table组件 */
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

//设置时间过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.use(ElementUI)

//导入复文本编辑器
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor, /* { default global options } */)



Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
