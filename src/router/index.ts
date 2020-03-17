import Vue from 'vue'
import VueRouter from 'vue-router'
import AuctionList from '../views/AuctionList.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'AuctionList',
    component: AuctionList
  }
]

const router = new VueRouter({
  routes
})

export default router
