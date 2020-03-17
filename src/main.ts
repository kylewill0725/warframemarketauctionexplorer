import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueJsonp from 'vue-jsonp'
import Clipboard from 'vue-clipboard2'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(VueJsonp)
Vue.use(Clipboard)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
