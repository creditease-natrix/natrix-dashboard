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
            <h4 class="tableTitle">组织与地域信息</h4>
            <el-table
                :data="regionData"
                border
                style="width: 100%,margin-top:30px;">
                <el-table-column
                prop="worklevel1"
                label="组织名称"
                width="200">
                </el-table-column>
                <el-table-column
                prop="worklevel2"
                label="组织级别"
                >
                </el-table-column>
                <el-table-column
                prop="worklevel4"
                
                label="上级组织">
                </el-table-column>
                
                <el-table-column
                prop="comment"
                width="120"
                label="备注">
                </el-table-column>
                
            </el-table>
            
        </div>
        <div class="tableCaption">
            <h4 class="tableTitle">组织地址信息</h4>
            <el-table
                :data="networkData"
                border
                style="width: 100%,margin-top:30px;">
                
                <el-table-column
                prop="segment"
                label="省/直辖市"
                width="150">
                </el-table-column>
                <el-table-column
                prop="gateway"
                label="市/区"
                width="150"
                >
                </el-table-column>
                <el-table-column
                prop="type"
                label="邮政编码"
                width="150"
                >
                </el-table-column>
                <el-table-column
                prop="comment"
                label="详细地址"
                >
                </el-table-column>
            </el-table>
        </div>
        <div class="tableCaption">
            <h4 class="tableTitle">下级组织信息</h4>
            <el-table
                :data="regionData"
                border
                style="width: 100%,margin-top:30px;">
                <el-table-column
                prop="worklevel1"
                label="下级组织名称"
                >
                </el-table-column>
                <el-table-column
                prop="worklevel2"
                label="组织级别"
                >
                </el-table-column>
                
                
                <el-table-column
                prop="comment"
                width="120"
                label="备注">
                </el-table-column>
                
            </el-table>
            
        </div>
        <div class="tableCaption">
            <h4 class="tableTitle">组织网络信息</h4>
            <el-table
                :data="networkData"
                border
                style="width: 100%,margin-top:30px;">
                
                <el-table-column
                prop="segment"
                label="网段"
                width="200">
                </el-table-column>
                <el-table-column
                prop="gateway"
                label="网关"
                >
                </el-table-column>
                <el-table-column
                prop="type"
                label="网络类型"
                >
                </el-table-column>
                <el-table-column
                prop="comment"
                label="备注"
                >
                </el-table-column>
            </el-table>
        </div>
        <div class="tableCaption">
            <h4 class="tableTitle">组织联系人信息</h4>
            <el-table
                :data="contactData"
                border
                style="width: 100%,margin-top:30px;">
                <el-table-column
                prop="name"
                label="姓名"
                >
                </el-table-column>
                <el-table-column
                prop="telephone"
                label="电话"
                >
                </el-table-column>
                <el-table-column
                prop="email"
                
                label="邮箱">
                </el-table-column>
                <el-table-column
                prop="wechat"
                
                label="微信">
                </el-table-column>
                <el-table-column
                prop="function"
                
                label="职能">
                </el-table-column>
                
            </el-table>
        </div>
        
        <div class="tableCaption">
            <h4 class="tableTitle">组织宽带信息</h4>
            <el-table
                :data="ispData"
                border
                style="width: 100%,margin-top:30px;">
                <el-table-column
                prop="name"
                label="宽带名称"
               >
                </el-table-column>
                <el-table-column
                prop="operator"
                label="运营商"
                width="200">
                </el-table-column>
                <el-table-column
                prop="speed"
                label="宽带速度"
                >
                </el-table-column>
                <!-- <el-table-column
                prop="start_time"
                label="租期开始"
                >
                </el-table-column> -->
                <el-table-column
                prop="end_time"
                label="租期结束"
                >
                </el-table-column>
                <el-table-column
                prop="staff_contact"
                label="公司宽带负责人"
                >
                </el-table-column>
                <el-table-column
                prop="isp_contact"
                label="运营商负责人"
                >
                </el-table-column>
                
            </el-table>
        </div>
        <div class="tableCaption">
            <h4 class="tableTitle">组织网络出口信息</h4>
            <el-table
                :data="outputData"
                border
                style="width: 100%,margin-top:30px;">
                <el-table-column
                prop="type"
                label="出口类型"
               >
                </el-table-column>
                <el-table-column
                prop="device"
                label="出口设备"
                width="200">
                </el-table-column>
                <el-table-column
                prop="ip"
                label="出口IP"
                >
                </el-table-column>
                <el-table-column
                prop="comment"
                label="备注"
                >
                </el-table-column>
                
            </el-table>
        </div>
        <div class="tableCaption">
            <h4 class="tableTitle">组织监测设备信息</h4>
            <el-table
                :data="terminalData"
                border
                style="width: 100%,margin-top:30px;">
                <el-table-column
                prop="terminal_id"
                label="监测设备UUID"
               >
                </el-table-column>
                <el-table-column
                prop="local_ip"
                label="监测点mac"
                width="200">
                </el-table-column>
                <el-table-column
                prop="public_ip"
                label="设备类型"
                >
                </el-table-column>
                <el-table-column
                prop="province"
                label="piclient版本"
                >
                </el-table-column>
                <el-table-column
                prop="city"
                label="更新日期"
                >
                </el-table-column>
                <el-table-column
                prop="county"
                label="备注"
                >
                </el-table-column>
               
            </el-table>
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
            href: ManageIndex,
            regionData:[],//组织地域信息
            contactData:[],//联系人信息
            networkData:[],//地址网络信息
            eventData:[],//事件信息
            terminalData:[],//监测点信息
            ispData:[],//宽带信息
            outputData:[]//出口信息
            
            
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
</style>
