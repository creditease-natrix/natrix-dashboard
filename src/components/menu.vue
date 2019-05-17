<template>
    <div id="menu">
        <el-menu 
        v-for="(item,index) in menu"
        :key="index"
        :index=item.indexValue
        class="el-menu-vertical-demo"  
        @open="handleOpen" 
        @close="handleClose" 
        background-color="#222d32"
        text-color="#b8c7ce"
        active-text-color="#b8c7ce"
        :default-openeds=[]
        :router = true
        :unique-opened = true>
            <h3>{{item.title}}</h3> 
            <el-submenu 
            v-for="(item1,index1) in item.menus"
            :key="index1"
            :index=item1.indexValue
            :unique-opened = true
            :default-openeds=[]
            @click.native="jumpUrl(item1.url,item1.path)">
                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span slot="title">{{item1.name}}</span>
                </template>
                <el-menu-item-group 
                v-if="item1.children"
                >
                    <el-menu-item 
                    v-for="(item2,index2) in item1.children"
                    v-if="item2.path  == undefined "
                    :key="index2"
                    @click.native.stop="jumpUrl(item2.url,item2.path)"
                    :index=item2.indexValue
                    >
                        <i class="el-icon-menu"></i>{{item2.name}}
                    </el-menu-item>
                    <el-menu-item 
                    v-for="(item2,index2) in item1.children"
                    v-if="item2.path != undefined "
                    :key="index2"
                    @click.native.stop="jumpUrl(item2.url,item2.path)"
                    :index=item2.path
                    >
                        <i class="el-icon-menu"></i>{{item2.name}}
                    </el-menu-item>
                    
                </el-menu-item-group>
            </el-submenu>
            
        </el-menu>
        
        
        
    </div>
</template>

<script>
export default {
    name:'Menu',
    data() {
        return {
            data:'',
            defaultProps: {
            children: 'children',
            label: 'label'
            },
            menu:[],
            user:''
        };
    },
    mounted(){
        this.user=window.localStorage.getItem('user')
        this.getMenu()
    },
    methods: {
        handleOpen(key, keyPath) {
            
        },
        handleClose(key, keyPath) {
        },
        jumpUrl(url,path){
            
            if(path != undefined){
                this.$router.push({
                    path:path,

                })
            }else{
                if(url){
                  window.location.href=HP1+url  
                }
                
            }
           
        },
        getMenu(){
            this.$get_no({
                url:HP1+'/rbac/api/getmenu',
                data:{
                    
                }
                
            }).then(res=>{
                res.menuinfo.forEach((item,index)=>{
                    item.indexValue = index
                    item.menus.forEach((item1,index1)=>{
                        item1.indexValue = item.indexValue + '-' +index1
                        if(item1.children && item1.children != 'undefined'){
                            item1.children.forEach((item2,index2)=>{
                                item2.indexValue = item1.indexValue + '-'+index2
                            })
                        }
                    })
                })
                this.menu = res.menuinfo
                
            })
        }

    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.el-submenu__title{
    font-size: 14px;
    color:#b8c7ce !important;

}
.el-submenu__title,.el-menu-item{
    color:#b8c7ce !important;
    height: 40px !important;
    line-height: 40px !important;
}
.el-submenu__title a{
    color:#b8c7ce !important;
}

.el-submenu .el-menu-item{
    height: 40px;
    line-height: 40px;
}
.el-menu{
    background:none!important;
}

.el-menu-item-group__title{
    padding-top:0 !important;
    padding-bottom: 0 !important;
}
#menu{
    width:230px;
    background: #222d32;
    min-height: 100%;
    overflow-y:auto;
    position: absolute;
    left:0;
    top:0;
    bottom:0;
    z-index: 1000;
}
#menu h3{
    color:#4b646f;
    font-size: 16px;
    font-weight: bold;
    padding:10px 0 10px 20px;
}

</style>
<style scoped>



</style>
