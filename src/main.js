// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import axios from "axios";
import echarts from "echarts";
import "echarts/theme/macarons.js";
import "echarts/lib/chart/map";
import "echarts/map/js/china.js";
Vue.prototype.$echarts = echarts;

Vue.config.productionTip = false;
Vue.use(ElementUI);

import VueI18n from "vue-i18n";
Vue.use(VueI18n);
import i18n from "../i18n/i18n.js"; //vue-i18n

import htmlToPdf from "./until/htmlToPdf.js";
Vue.use(htmlToPdf);

import { get, post, get_no, put, deleteMethod } from "./until/api.js";

import { LS } from "./until/ls.js";
Vue.prototype.$http = axios;
Vue.prototype.$post = post;
Vue.prototype.$get = get;
Vue.prototype.$get_no = get_no;
Vue.prototype.$put = put;
Vue.prototype.$delete = deleteMethod;

let token = LS.get("user");
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    // 判断该路由是否需要登录权限
    if (token != "") {
      next();
    } else {
      if (to.name === "login") {
        next();
        return;
      }
      next({
        path: "/login",
        query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    }
  } else {
    next();
  }
});

/* eslint-disable no-new */
let rootvue = new Vue({
  el: "#app",
  router,
  i18n,
  components: { App },
  template: "<App/>"
});
export default rootvue;



