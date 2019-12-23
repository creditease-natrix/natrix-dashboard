
const login = () => import ('../pages/registration/login.vue')  //登录
const register = () => import ("../pages/registration/register.vue")

// 终端管理
import terminalOverview from '../pages/systemManage/terminal/terminalOverview.vue'
const terminalList = () => import ('../pages/systemManage/terminal/terminalList.vue')
const terminalDetail = () => import("../pages/systemManage/terminal/terminalDetail.vue")
const terminalSite = () => import("../pages/systemManage/terminal/terminalSite.vue")
const editTerminal = () => import("../pages/systemManage/terminal/editTerminal.vue")
const terminalCheckList = () =>import("../pages/systemManage/terminal/terminalCheckList.vue")
//职场管理——Organization
import workInfoManage from  '../pages/systemManage/organization/workInfoManage.vue'
const  addWorkInfo = () => import('../pages/systemManage/organization/addWorkInfo.vue')
const  editWorkInfo = () => import ('../pages/systemManage/organization/editWorkInfo.vue')
const  workDetail = () => import ('../pages/systemManage/organization/workDetail.vue')
//即时测
import pingAnalysis from '../pages/instantTest/ping/pingAnalysis.vue' // ping
import httpAnalysis from '../pages/instantTest/http/httpAnalysis.vue' // http
import tracerouteAnalysis from '../pages/instantTest/traceroute/tracerouteAnalysis.vue' //transroute
import dnsAnalysis from "../pages/instantTest/dns/dnsAnalysis.vue" //dns
//定时测任务管理
import timedTaskList from "../pages/regularTest/taskManage/timedTaskList.vue"
import focusTask from "../pages/regularTest/taskManage/focusTask.vue"
import addTask from "../pages/regularTest/taskManage/addTask.vue"
import editTask from "../pages/regularTest/taskManage/editTask.vue"
import taskInfo from "../pages/regularTest/taskManage/taskInfo.vue"
//任务分析
import timedAnalysis from "../pages/regularTest/taskAnalysis/timedAnalysis.vue";
//告警中心
import alarmList from "../pages/alarmCenter/alarmList/alarmList.vue"
import addAlarm from "../pages/alarmCenter/alarmList/addAlarm.vue"
import editAlarm from "../pages/alarmCenter/alarmList/editAlarm.vue"
import alarmInfo from "../pages/alarmCenter/alarmList/alarmInfo.vue"
import noticeList from "../pages/alarmCenter/alarmList/noticeList.vue"

//许可证管理
import licenseList from "../pages/licenseManage/licenseList.vue"

//组管理
import groupList from "../pages/groupManage/groupList.vue"
import userInfo from "../pages/groupManage/userInfo.vue"

let routes = [
  { path: "/login", name: "login", component: login },
  { path: "/register", name: "register", component: register },

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
  //定时测任务管理
  {
    path: "/timedTaskList",
    name: "timedTaskList",
    component: timedTaskList,
    meta: { requireAuth: true }
  },
  {
    path: "/focusTask",
    name: "focusTask",
    component: focusTask,
    meta: { requireAuth: true }
  },
  {
    path: "/addTask",
    name: "addTask",
    component: addTask,
    meta: { requireAuth: true }
  },
  {
    path: "/editTask",
    name: "editTask",
    component: editTask,
    meta: { requireAuth: true }
  },
  {
    path: "/taskInfo",
    name: "taskInfo",
    component: taskInfo,
    meta: { requireAuth: true }
  },
  {
    path: "/timedAnalysis",
    name: "timedAnalysis",
    component: timedAnalysis,
    meta: { requireAuth: true }
  },
  {
    path: "/alarmList",
    name: "alarmList",
    component: alarmList,
    meta: { requireAuth: true }
  },
  {
    path: "/addAlarm",
    name: "addAlarm",
    component: addAlarm,
    meta: { requireAuth: true }
  },
  {
    path: "/editAlarm",
    name: "editAlarm",
    component: editAlarm,
    meta: { requireAuth: true }
  },
  {
    path: "/alarmInfo",
    name: "alarmInfo",
    component: alarmInfo,
    meta: { requireAuth: true }
  },
  {
    path: "/noticeList",
    name: "noticeList",
    component: noticeList,
    meta: { requireAuth: true }
  },
  {
    path: "/licenseList",
    name: "licenseList",
    component: licenseList,
    meta: { requireAuth: true }
  },
  {
    path: "/groupList",
    name: "groupList",
    component: groupList,
    meta: { requireAuth: true }
  },
  {
    path: "/userInfo",
    name: "userInfo",
    component: userInfo,
    meta: { requireAuth: true }
  }
];

export default routes
