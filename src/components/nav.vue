<template>
    <div id="nav">
        <span class="title">线路监控{{title}}</span>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <!-- <el-breadcrumb-item  :to='realList.path'>{{realList.name}}</el-breadcrumb-item> -->
            <!-- <el-breadcrumb-item v-for="(item,index) in brumblist" :key="index" :to='item.path'>{{item.meta.breadcrumbName}}</el-breadcrumb-item> -->
        </el-breadcrumb>
    </div>
    
    
</template>

<script>

export default {
    name: 'Nav',
    data () {
        return {
            realList: [],
            title: '',  // 页面标题
            brumblist: '' // 路由集合
        }
    },
    created(){
        // this.getRoutePath();
    },
    methods:{
        getRoutePath() {
            this.realList = this.$route.meta.routeList[this.$route.meta.routeList.length-1];
        },
        // getBreadcrumb () {
        //     this.brumblist = this.$route.matched;
        //     this.$route.matched.forEach((item, index) => {
        //         // 判断父级路由是否为空字符串或者meta是否为首页,直接复写路径到根目录
        //         // 后面的就是判断路由和当前遍历的项目是否一致,是的话把标题的值给上
        //         item.meta.breadcrumbName === '首页' ? item.path = '/' : this.$route.path === item.path ? this.title = item.meta.breadcrumbName : '';
        //     })
        // }
    },
    // beforeRouteEnter(to,from, next) {
    //     next((vm) => {
    //         vm.realList = to.meta.routeList;
    //     });
    // },
    watch:{
        // $route:function(newV,oldV) {
        //     this.realList = this.$route.meta.routeList[this.$route.meta.routeList.length-1];
        //     console.log(this.realList,'realList')
            
        // },
        // $route () {
        //     this.getBreadcrumb();
        // }
    }

}
</script>
<style>
.dropdown-menu{
    display:block;
}
.el-breadcrumb{
    display:inline-block;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


.main-header{
    background-color: #3c8dbc;
    color:#333;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 50px;
}
a{
  color:#333;
}
a:hover{
  color:#fff;
}

.navbar-nav>.user-menu>.dropdown-menu>li.user-header>p{
    color:#000;
}
#nav{
    margin:10px 0;
    width: 100%;
    font-size: 14px;
    line-height: 1;
    height: 30px;
}
.title{
    font-size:14px;
    line-height: 1;
    float: left;
    font-weight: bold;
}
.el-breadcrumb{
    float: left;
    margin-left:750px;
}
</style>
