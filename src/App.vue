<template>
  <div id="app" class="sidebar-mini wrapper">
    <Header v-if="!showMenu1"></Header>
    <div id="box" class="clear" v-if="!showMenu1">
      <Menu></Menu>
      <div id="content">
        <div id="tablebox">
          <router-view :status="isLogin"></router-view>
        </div>
      </div>
      <Footer></Footer>
    </div>
    <router-view v-if="showMenu1"></router-view>
  </div>
</template>

<script>
import getGlobalConfig from "./config";
import Header from "./components/header";
import Footer from "./components/footer";
import Menu from "./components/menu";
import Nav from "./components/nav";
export default {
  name: "App",
  components: {
    Footer,
    Header,
    Menu,
    Nav
  },
  beforeCreate() {
    getGlobalConfig();
  },
  data() {
    return {
      navPath: ["/login","/register"],
      isShowMenu: "",
      isLogin: ""
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
  methods: {}
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
/*ui框架样式统一*/
</style>
