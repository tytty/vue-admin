import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI, { Message, MessageBox } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css'
import '@/assets/css/global.css'
import '@/assets/fonts/font.css'
import axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'

Vue.component('tree-table', ZkTable)

Vue.use(ElementUI)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
Vue.prototype.$request = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
