<template>
  <div id="menu" :class="{collapsed:collapseValue}">
    <el-menu
    :default-active="activeValue" 
    class="el-menu-vertical-demo"
    background-color="#fff"
    text-color="#333"
    active-text-color="rgb(59, 132, 210)"
    router
    
    >
      <div
      v-for="(item) in menu"
      :key="item.indexValue"
      :index="item.indexValue"
      >
        <h3>{{item.title}}</h3>
        <div>
            <el-submenu
            v-for="(item1) in item.menus"
            :key="item1.indexValue"
            :index="item1.indexValue"
            :disabled="collapseValue"
            @click.native="jumpUrl(item1.url,item1.path)"
            >
                
                <span slot="title"><i class="el-icon-menu"></i>{{item1.name}}</span>
              <el-menu-item
              v-if="item1.children"
              v-for="(item2) in item1.children"
              :key="item2.indexValue"
              :index="item2.indexValue"
              :disabled="collapseValue"
              @click.native="jumpUrl(item2.url,item2.path)"
              >
                <span slot="title"><i class="el-icon-menu"></i>{{item2.name}}</span>
              </el-menu-item>
            </el-submenu>
        </div>
      </div>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "Menu",
  props: {
    collapseValue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      data: "",
      defaultProps: {
        children: "children",
        label: "label"
      },
      menu: [],
      user: "",
      activeValue:'0' //当前激活菜单的index 
    };
  },
  mounted() {
    this.user = window.localStorage.getItem("user");
    this.getMenu();
  },
  watch:{
    $route(newroute,oldroute){
      let name = newroute.name
      this.init(name)
      
    }

  },
  methods: {
    jumpUrl(url, path) {
      if (!this.collapseValue) {
        if (path != undefined) {
          this.$router.push({
            path: path
          });
        } 
      } else {
        return false;
      }
    },
    getMenu() {
      this.$get_no({
        url: HP1 + "/rbac/api/getmenu",
        data: {}
      }).then(res => {
        res.menuinfo.forEach((item, index) => {
          item.indexValue = index+"";
          item.menus.forEach((item1, index1) => {
            item1.indexValue = item.indexValue + "-" + index1;
            if (item1.children && item1.children != "undefined") {
              item1.children.forEach((item2, index2) => {
                item2.indexValue = item1.indexValue + "-" + index2;
              });
            }
          });
        });
        this.menu = res.menuinfo;
        this.init(this.$route.name)
      });
    },
    init(name){
      this.menu.forEach((item,index)=>{
        if(item.menus && item.menus.length > 0){
          item.menus.forEach((item1,index1)=>{
            if(item1.children){
               item1.children.forEach((item2,index)=>{
                 if(name == item2.path){
                   this.activeValue = item2.indexValue
                   return false
                 }
               })
            }else{
              if(name == item1.path){
                this.activeValue = item1.indexValue
                return false
              }
            }
          })
        }
      })
      this.activeValue = this.activeValue + ""
      
    }

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.el-submenu__title {
  font-size: 14px;
}
.el-submenu__title {
  background: none !important;
  padding: 0 15px !important;
}
.el-menu-item {
  background: none !important;
  color: #333;
}
.el-submenu__title,
.el-menu-item {
  height: 40px !important;
  line-height: 40px !important;
  color: #333;
}
.el-submenu__title a {
  color: #333;
}

.el-submenu .el-menu-item {
  height: 40px;
  line-height: 40px;
  font-weight: bold;
}
.el-menu {
  background: none !important;
  border-right: none;
}

.el-menu-item-group__title {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
#menu {
  width: 230px;
  background: #fff;
  min-height: 100%;
  overflow-y: auto;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  border-right: solid 1px #e6e6e6;
}
#menu h3 {
  color: #333 !important;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 0 10px 20px;
}
.el-submenu__title .is_active {
  color: rgb(59, 132, 210);
}
#menu.collapsed {
  width: 45px;
  overflow: hidden;
}
#menu.collapsed h3 {
  display: none;
  white-space: nowrap;
}
#menu.collapsed .el-submenu__icon-arrow {
  display: none;
}
</style>
<style scoped>
</style>
