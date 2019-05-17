import Vue from 'vue'
import routes from './route.js'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

export default new VueRouter({
  routes: routes
})

