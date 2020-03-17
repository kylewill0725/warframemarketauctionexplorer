import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueJsonp from 'vue-jsonp'
import Moment from 'vue-moment'
import VueMeta from 'vue-meta'

Vue.use(Moment)
Vue.use(VueJsonp)
Vue.use(VueMeta, {
  refreshOnceOnNavigation: true
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
