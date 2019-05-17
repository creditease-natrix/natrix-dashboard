<template>
    <div>
        <div id="nav">
            <span class="title">职场信息管理</span>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <a :href=href class="home"> 管理系统 <i class="el-breadcrumb__separator el-icon-arrow-right"></i></a>
                <el-breadcrumb-item :to="{ path: '' }">组织管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/workInfoManage' }">组织信息管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="tableCaption">
            <ul class="deviceList">
                <li class="deviceOption">
                    <span>监测设备主机名</span><span></span>
                </li>
                <li class="deviceOption">
                    <span>监测设备类型</span><span></span>
                </li>
                <li class="deviceOption">
                    <span>监测设备UUID</span><span></span>
                </li>
                <li class="deviceOption">
                    <span>Django版本</span><span></span>
                </li>
                <li class="deviceOption">
                    <span>CPU信息</span><span></span>
                </li>
                <li class="deviceOption">
                    <span>CPU使用率</span><span></span>
                </li>
                <li class="deviceOption">
                    <span>内存大小</span><span></span>
                </li>
                <li class="deviceOption">
                    <span>内存使用率</span><span></span>
                </li>
                <li class="deviceOption">
                    <span>磁盘大小</span><span></span>
                </li>
                <li class="deviceOption">
                    <span>磁盘使用率</span><span></span>
                </li>
                <li class="deviceOption">
                    <span>开机启动时间</span><span></span>
                </li>
                <li class="deviceOption">
                    <span>客户端版本</span><span></span>
                </li>
                <li class="deviceOption">
                    <span>python版本</span><span></span>
                </li>
                <li class="deviceOption">
                    <span>采购日期</span><span></span>
                </li>
                <li class="deviceOption">
                    <span>上线日期</span><span></span>
                </li>
                <li class="deviceOption">
                    <span>最近更新日期</span><span></span>
                </li>
               
            </ul>
            
        </div>
        
        
    </div>
    
</template>

<script>

import {toMyTime} from '../../../until/index.js' 
import {toMyStr} from '../../../until/index.js' 
export default {
    name:'',
    components:{
       
    },
    data() {

        return {
            href:ManageIndex,
            
            
            
        };
    },
    created(){
       
    },
    watch:{
        

    },
    mounted(){
        
        // this.getWorkDetail()
    },
    methods: {
        
        getWorkDetail(){
            this.$get({
                url:HP1+'/raspi/workplace/detail/v1',
                data:{
                   id:this.$route.query.id
                }
            }).then(res=>{
                if(res.permission){
                    if(res.data.code == 200){
                        this.regionData.push({
                            city:res.data.info.city,
                            province:res.data.info.province,
                            create_time:new Date(res.data.info.create_time).toMyStr(),
                            update_time:new Date(res.data.info.update_time).toMyStr(),
                            worklevel1:res.data.info.workplace.level1,
                            worklevel2:res.data.info.workplace.level2,
                            worklevel4:res.data.info.workplace.level4,
                            worklevel5:res.data.info.workplace.level5,
                            comment:res.data.info.comment
                        })
                        this.contactData = res.data.info.contacts
                        this.networkData = res.data.info.addresses_networks
                        res.data.info.events.forEach((item,index)=>{
                            item.create_time = new Date(item.create_time).toMyStr()
                        })
                        this.eventData = res.data.info.events
                        
                        res.data.info.isps.forEach((item,index)=>{
                            item.end_time = new Date(item.end_time).toMyStr()
                            if(item.start_time != ''){
                                item.start_time = new Date(item.start_time).toMyStr()
                            }
                            
                        })
                        this.ispData = res.data.info.isps
                        this.outputData = res.data.info.output
                        this.terminalData = res.data.info.terminals

                    }else{
                        this.$message({
                            type:'error',
                            message:res.data.message
                        })
                    }
                }else{
                    this.$message.error('您当前没有权限查看此信息');
                }
            })
            
        }
        
        
        
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
<style scoped>
.tableTitle{
    font-size:14px;
    line-height:48px;
    height: 48px;
    text-align:center;
    border:1px solid #ebeef5;
    border-bottom:none;
    background: #F2F6FC;
}
.tableCaption{
    margin-bottom:50px;
}

.deviceList{
    width:500px;
    margin:0 auto;
    border:1px solid #ebeef5;
}
.deviceOption{
    font-size:12px;
    line-height:28px;
    height: 28px;
    border-bottom:1px solid #ebeef5;

}
.deviceOption span{
    display:inline-block;
    width:50%;
    text-align:center;
}
.deviceOption span:first-child{
    border-right:1px solid #ebeef5;
    
}
</style>
