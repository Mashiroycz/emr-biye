// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import qs from 'qs'
import store from './store/index'
import 'element-ui/lib/theme-chalk/index.css'

axios.defaults.withCredentials = true
Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
axios.defaults.baseURL = '/api'
Vue.use(ElementUI)

/* 重新定义router（this.$router.push）
const routerPush = router.prototype.push
router.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}
*/
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
  components: { App },
  template: '<App/>'
})
