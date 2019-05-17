
const login = () => import ('../pages/registration/login.vue')  //登录

// 终端管理
import terminalOverview from '../pages/systemManage/terminal/terminalOverview.vue'
const terminalList = () => import ('../pages/systemManage/terminal/terminalList.vue')
const terminalDetail = () => import("../pages/systemManage/terminal/terminalDetail.vue")
const terminalSite = () => import("../pages/systemManage/terminal/terminalSite.vue");
const editTerminal = () => import("../pages/systemManage/terminal/editTerminal.vue");
const terminalCheckList = () =>import("../pages/systemManage/terminal/terminalCheckList.vue");
//职场管理——Organization
import workInfoManage from  '../pages/systemManage/organization/workInfoManage.vue'
const  addWorkInfo = () => import('../pages/systemManage/organization/addWorkInfo.vue')
const  editWorkInfo = () => import ('../pages/systemManage/organization/editWorkInfo.vue')
const  workDetail = () => import ('../pages/systemManage/organization/workDetail.vue')
const  monitorDeviceDetail = () => import ('../pages/systemManage/organization/monitorDeviceDetail.vue')
const  monitorSiteDetail = () => import ('../pages/systemManage/organization/monitorSiteDetail.vue')
const  broadBandDetail = () => import ('../pages/systemManage/organization/broadBandDetail.vue')

//即时测
import pingAnalysis from '../pages/instantTest/ping/pingAnalysis.vue' // ping
import httpAnalysis from '../pages/instantTest/http/httpAnalysis.vue' // http
import tracerouteAnalysis from '../pages/instantTest/traceroute/tracerouteAnalysis.vue' //transroute
import dnsAnalysis from "../pages/instantTest/dns/dnsAnalysis.vue"; //dns

let routes = [
  { path: "/login", name: "login", component: login },

  // 终端管理相关页面
  {
    path: "/terminalOverview",
    name: "terminalOverview",
    component: terminalOverview,
    meta: { requireAuth: true }
  }, //终端概览
  {
    path: "/terminalList",
    name: "terminalList",
    component: terminalList,
    meta: { requireAuth: true }
  },
  {
    path: "/terminalDetail",
    name: "terminalDetail",
    component: terminalDetail,
    meta: { requireAuth: true }
  },
  {
    path: "/terminalSite",
    name: "terminalSite",
    component: terminalSite,
    meta: { requireAuth: true }
  },
  {
    path: "/editTerminal",
    name: "editTerminal",
    component: editTerminal,
    meta: { requireAuth: true }
  },
  {
    path: "/terminalCheckList",
    name: "terminalCheckList",
    component: terminalCheckList,
    meta: { requireAuth: true }
  },
  // 组织管理相关页面
  {
    path: "/workInfoManage",
    name: "workInfoManage",
    component: workInfoManage,
    meta: { requireAuth: true }
  }, //职场信息管理
  {
    path: "/addWorkInfo",
    name: "addWorkInfo",
    component: addWorkInfo,
    meta: { requireAuth: true }
  }, //增加职场信息联系人
  {
    path: "/workDetail",
    name: "workDetail",
    component: workDetail,
    meta: { requireAuth: true }
  }, //职场信息详细
  {
    path: "/editWorkInfo",
    name: "editWorkInfo",
    component: editWorkInfo,
    meta: { requireAuth: true }
  }, //编辑职场信息
  {
    path: "/monitorDeviceDetail",
    name: "monitorDeviceDetail",
    component: monitorDeviceDetail,
    meta: { requireAuth: true }
  }, //监测设备信息
  {
    path: "/monitorSiteDetail",
    name: "monitorSiteDetail",
    component: monitorSiteDetail,
    meta: { requireAuth: true }
  }, //监测点信息
  {
    path: "/broadBandDetail",
    name: "broadBandDetail",
    component: broadBandDetail,
    meta: { requireAuth: true }
  }, //宽带信息

  //即时测
  { path: "/pingAnalysis", name: "pingAnalysis", component: pingAnalysis }, //ping
  {
    path: "/httpAnalysis",
    name: "httpAnalysis",
    component: httpAnalysis
  }, //http
  {
    path: "/tracerouteAnalysis",
    name: "tracerouteAnalysis",
    component: tracerouteAnalysis
  },
  {
    path: "/dnsAnalysis",
    name: "dnsAnalysis",
    component: dnsAnalysis
  },
  
];

export default routes
