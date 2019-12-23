<template>
  <header class="main-header">
    <!-- Logo -->
    <a :href="href" class="logo" :class="{miniLogo:collapseValue}">
      <!-- mini logo for sidebar mini 50x50 pixels -->
      <span class="logo-mini" v-show="collapseValue">
        <b>Na</b>trix
      </span>
      <!-- logo for regular state and mobile devices -->
      <span class="logo-lg" v-show="!collapseValue">
        <b>Natrix</b>
      </span>
    </a>
    <!-- Header Navbar: style can be found in header.less -->
    <nav class="navbar navbar-static-top" :class="{miniNav:collapseValue}">
      <!-- Sidebar toggle button-->
      <a href="javascript:void(0);" 
      @click="collapseHandle"
      class="sidebar-toggle"  
      role="button">
        <span class="sr-only">Toggle navigation</span>
      </a>

      <div class="navbar-custom-menu">
        <ul class="nav navbar-nav">
          <li 
          class="dropdown notifications-menu" 
          v-if="this.user != ''" 
          @click.stop="showGroup">
            <a href="javascript:void(0);" class="dropdown-toggle">
              <i class="fa fa-group"></i>
              {{curr_group}}
            </a>
            <ul class="dropdown-menu" v-if="isgroupShow">
              <li class="header">请选择分组：</li>
              <li>
                <ul class="menu">
                  <li 
                  v-for="(item,index) in group" 
                  :key="index" 
                  @click="changeGroup(item.id)">
                    <a href="javascript:void(0);">
                      <i class="fa fa-group text-aqua"></i>
                      {{item.name}}
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li class="dropdown user user-menu" v-if="this.user != '' " @click.stop="showInfo">
            <a href="javascript:void(0);" class="dropdown-toggle">
              <img src="../assets/img/user.jpg" class="user-image" alt="User Image">
              <span class="hidden-xs">{{user}}</span>
            </a>
            <ul class="dropdown-menu" v-show="isShow">
              <!-- User image -->
              <li class="user-header">
                <img src="../assets/img/user.jpg" class="img-circle" alt="User Image">
                <p>{{user}}</p>
              </li>
              <!-- Menu Footer-->
              <li class="user-footer">
                <div class="pull-left">
                  <a
                    href="javascript:void(0)"
                    class="btn btn-default btn-flat"
                    @click="userInfo"
                  >个人信息</a>
                </div>
                <div class="pull-right">
                  <a href="javascript:void(0)" class="btn btn-default btn-flat" @click="loginOut">登出</a>
                </div>
              </li>
            </ul>
          </li>
          <li class="dropdown user user-menu" v-if="this.user == '' " @click="loginHandle">
            <a href="javascript:void(0);" class="dropdown-toggle">
              <img src="../assets/img/user.jpg" class="user-image" alt="User Image">
              <span class="hidden-xs">登录</span>
            </a>
          </li>
          <li class="dropdown user user-menu" v-if="this.user == '' " @click="registerHandle">
            <a href="javascript:void(0);" class="dropdown-toggle">
              <span class="hidden-xs">注册</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import {messageTip} from "../until/index.js"
export default {
  name: "Header",
  props:{
    collapseValue:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      user: "",
      curr_group: "",
      group: "",
      isShow: false, //是否显示用户信息
      isgroupShow: false,
      href: "",
      isCollapse:false
    };
  },
  created() {
    this.href = NatrixIndex;
    let that = this;

    document.onclick = function(ev) {
      ev.stopPropagation();
      that.isgroupShow = false;
      that.isShow = false;
    };
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      this.$get({
        url: HP1 + "/rbac/get/userinfo",
        data: {}
      }).then(res => {
          if (res.data.code == 200) {
            this.user = res.data.user;
            window.localStorage.setItem("user", this.user);
            this.curr_group = res.data.curr_group;
            this.group = res.data.groups;
          } else {
            window.localStorage.setItem("user", "");
          }
         
      });
    },
    showInfo() {
      this.isShow = !this.isShow;
    },
    showGroup() {
      this.isgroupShow = !this.isgroupShow;
    },
    loginHandle() {
      this.$router.push({
        path: "login"
      });
    },
    registerHandle(){
      this.$router.push({
        path: "register"
      });
    },
    loginOut() {
      this.$get({
        url: HP1 + "/rbac/logout/v1",
        data: {}
      }).then(res => {
        if (res.permission) {
          if (res.data.code == 200) {
            messageTip("success",this.$t(res.data.message))
            window.localStorage.setItem("user", "");
            window.location.href = NatrixIndex;
          }else{
            messageTip("error",this.$t(res.data.message))
          }
        }
      });
    },
    emptyClick() {
      document.onclick = function(ev) {
        ev.stopPropagation();
        this.isgroupShow = false;
        this.isShow = false;
      };
    },
    changeGroup(id) {
      this.$post({
        url: HP1 + "/rbac/api/change_group",
        data: {
          id: id
        }
      }).then(res => {
          if (res.data.code == 200) {
            this.curr_group = res.data.curr_group;
            this.$message({
              message: "切换分组成功!",
              type: "success"
            });
            window.location.href = NatrixIndex
          }else{
            messageTip("error",this.$t(res.data.message))
          }
      });
    },
    userInfo() {
      this.$router.push({
        path:"userInfo"
      })
    },
    collapseHandle(){
      this.isCollapse = !this.isCollapse
      this.$emit("onCollapse",this.isCollapse)
    }
  }
};
</script>
<style>
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dropdown-menu {
  display: block;
}
.main-header {
  /* background-color: #054353; */
  color: #333;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 50px;
  background:rgb(59, 132, 210);
}
a {
  color: #fff;
}

.hidden-xs {
  color: #fff;
}

.dropdown-toggle a:hover .hidden-xs {
  color: #333;
}
.navbar-nav > .user-menu > .dropdown-menu > li.user-header > p {
  color: #000;
}
a:hover {
  color: #333;
}

.nav > li > a:hover .hidden-xs {
  color: #333;
}
.nav > li > a:focus .hidden-xs {
  color: #333;
}
.main-header .miniLogo{
  width:60px;

}
.main-header>.miniNav{
  margin-left:60px;
}
</style>
