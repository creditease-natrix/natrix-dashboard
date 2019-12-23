<template>
  <div id="app" class="sidebar-mini wrapper">
    <Header 
    v-if="!showMenu1" 
    v-on:onCollapse="collapseHandle" 
    :collapseValue="collapseValue">
    </Header>
    <div id="box" class="clear" v-if="!showMenu1">
      <Menu v-on:onCollapse="collapseHandle" :collapseValue="collapseValue"></Menu>
      <div id="content" v-on:onCollapse="collapseHandle" :class="{collapsed:collapseValue}">
        <div id="tablebox">
          <router-view :status="isLogin" ref="child"></router-view>
        </div>
      </div>
      <Footer v-on:onCollapse="collapseHandle" :collapseValue="collapseValue"></Footer>
    </div>
    <router-view v-if="showMenu1"></router-view>
  </div>
</template>

<script>
import getGlobalConfig from "./config";
import Header from "./components/header";
import Footer from "./components/footer";
import Menu from "./components/menu";
export default {
  name: "App",
  components: {
    Footer,
    Header,
    Menu,
  },
  beforeCreate() {
    getGlobalConfig();
  },
  data() {
    return {
      navPath: ["/login","/register"],
      isShowMenu: "",
      isLogin: "",
      collapseValue:false,
      changeValue:false //是否切换成功
    };
  },
  created() {
  },
  mounted() {},
  computed: {
    showMenu1() {
      return this.navPath.some(item => item == this.$route.path);
    }
  },
  methods: {
    collapseHandle(value){
      this.collapseValue = value
    }
  }
};
</script>

<style>
html,
body {
  height: 100%;
  width: 100%;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
}

#box {
  position: relative;
  left: 0;
  top: 50px;
  min-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
}
#content {
  min-height: 890px;
  overflow: auto;
  padding: 20px 20px 0 20px;
  position: relative;
  width: 100%;
  padding-left: 250px;
  background: #ebeef585;
}
#tablebox {
  width: 100%;
  height: 100%;
}
.clear:after {
  content: "";
  display: block;
  clear: both;
}

.home {
  float: left;
  color: #333;
  font-weight: bold;
}
.home:hover{
  color:#409EFF;
}
.el-breadcrumb__inner.is-link {
  font-weight: normal;
}
#nav {
  margin: 10px 0;
  width: 100%;
  font-size: 14px;
  line-height: 1;
  height: 30px;
}
.title {
  font-size: 22px;
  line-height: 1;
  float: left;
  font-weight: bold;
}
.el-breadcrumb {
  float: right;
  /* margin-left:750px; */
}
#content.collapsed{
  padding-left:60px;
}
</style>
