<template>
    <div id="workDetailBox">
        <div id="nav">
            <span class="title">组织管理——组织信息详情</span>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <a :href=href class="home"> 管理系统 <i class="el-breadcrumb__separator el-icon-arrow-right"></i></a>
                <el-breadcrumb-item :to="{ path: '' }">组织管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/workInfoManage' }">组织信息管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="tableCaption">
            <h4 class="tableTitle">组织配置信息</h4>
            <el-table
                :data="regionData"
                border
                style="width: 100%,margin-top:30px;">
                <el-table-column
                prop="name"
                label="组织名称"
                width="200">
                </el-table-column>
                <el-table-column
                prop="level"
                width="100"
                label="组织级别"
                >
                </el-table-column>
                <el-table-column
                prop="parent"
                
                label="上级组织">
                </el-table-column>
                
                <el-table-column
                prop="comment"
                width="220"
                label="备注">
                </el-table-column>
                
            </el-table>
            
        </div>
        <div class="tableCaption">
            <h4 class="tableTitle">下级组织信息</h4>
            <el-table
                :data="childrenData"
                border
                style="width: 100%,margin-top:30px;">
                <el-table-column
                prop="name"
                label="下级组织名称"
                >
                </el-table-column>
                <el-table-column
                prop="level"
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
            <h4 class="tableTitle">组织地址信息</h4>
            <el-table
                :data="addressData"
                border
                style="width: 100%,margin-top:30px;">
                
                <el-table-column
                prop="province"
                label="省/直辖市"
                width="150">
                </el-table-column>
                <el-table-column
                prop="city"
                label="市/区"
                width="150"
                >
                </el-table-column>
                <el-table-column
                prop="postcode"
                label="邮政编码"
                width="150"
                >
                </el-table-column>
                <el-table-column
                prop="address"
                label="详细地址"
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
                prop="identity_verbosename"
                width="100"
                label="职能">
                </el-table-column>
                
            </el-table>
        </div>
        <div class="tableCaption">
            <h4 class="tableTitle">组织终端设备信息</h4>
            <el-table
                :data="deviceData"
                border
                style="width: 100%,margin-top:30px;">
                <el-table-column
               
                label="终端设备SN"
               >
                    <template slot-scope="scope">
                        <span @click="getDevice(scope.row.sn)" class="deviceBox">
                                {{ scope.row.sn}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                prop="local_ip"
                label="终端mac"
                width="200">
                    <template slot-scope="scope">
                        <div>
                            <span  class="siteBox" 
                            @click="getDeviceSite(item.id)"
                            v-for="(item,index) in scope.row.terminals" 
                            :key="index">
                                {{ item.mac }}
                            </span>
                            
                        </div>
                        
                    </template>
                </el-table-column>
                <el-table-column
                prop="type"
                label="设备类型"

                >
                </el-table-column>
                <el-table-column
                prop="piclient_version"
                label="piclient版本"
                >
                </el-table-column>
                <el-table-column
                prop="last_online_time"
                label="更新日期"
                >
                </el-table-column>
                <el-table-column
                prop="comment"
                label="备注"
                >
                </el-table-column>
               
            </el-table>
        </div>
        <el-dialog
        :visible.sync="dialogVisibleDevice"
       
        >
            <el-form ref="form" :model="deviceForm" label-width="120px">
                <el-form-item label="监测设备主机名">
                    <p>{{deviceForm.hostname}}</p>
                </el-form-item>
                <el-form-item label="监测设备类型">
                    <p>{{deviceForm.device_type}}</p>
                </el-form-item>
                <el-form-item label="监测设备UUID">
                    <p>{{deviceForm.uuid}}</p>
                </el-form-item>
                <el-form-item label="Django版本">
                    <p>{{deviceForm.django_version}}</p>
                </el-form-item>
                <el-form-item label="CPU信息">
                    <p>{{deviceForm.cpu_info}}</p>
                </el-form-item>
                <el-form-item label="CPU使用率">
                    <p>{{deviceForm.cpu_usage}}</p>
                </el-form-item>
                <el-form-item label="内存大小">
                    <p>{{deviceForm.memory}}</p>
                </el-form-item>
                <el-form-item label="内存使用率">
                    <p>{{deviceForm.memory_usage}}</p>
                </el-form-item>
                <el-form-item label="磁盘大小">
                    <p>{{deviceForm.disk}}</p>
                </el-form-item>
                <el-form-item label="磁盘使用率">
                    <p>{{deviceForm.disk_usage}}</p>
                </el-form-item>
                <el-form-item label="开机启动时间">
                    <p>{{deviceForm.boot_time}}</p>
                </el-form-item>
                <el-form-item label="客户端版本">
                    <p>{{deviceForm.piclient_version}}</p>
                </el-form-item>
                <el-form-item label="python版本">
                    <p>{{deviceForm.python_version}}</p>
                </el-form-item>
                <el-form-item label="采购日期">
                    <p>{{deviceForm.purchase_time}}</p>
                </el-form-item>
                <el-form-item label="上线日期">
                    <p>{{deviceForm.first_online_time}}</p>
                </el-form-item>
                <el-form-item label="最近更新日期">
                    <p>{{deviceForm.last_online_time}}</p>
                </el-form-item>
            </el-form>
            <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleDevice = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="dialogVisibleDevice = false" size="mini">确 定</el-button>
            </span> -->
        </el-dialog>
        <el-dialog
        :visible.sync="dialogVisibleSite"
        >
            <el-form ref="form" :model="siteForm" label-width="120px">
                <el-form-item label="监测点mac">
                    <p>{{siteForm.mac}}</p>
                </el-form-item>
                <el-form-item label="上网方式">
                    <p>{{siteForm.type}}</p>
                </el-form-item>
                <el-form-item label="本地IP">
                    <p>{{siteForm.localip}}</p>
                </el-form-item>
                <el-form-item label="公网IP">
                    <p>{{siteForm.publicip}}</p>
                </el-form-item>
                <el-form-item label="子网掩码">
                    <p>{{siteForm.netmask}}</p>
                </el-form-item>
                <el-form-item label="网关">
                    <p>{{siteForm.gateway}}</p>
                </el-form-item>
                <el-form-item label="监测点状态">
                    <p>{{siteForm.status}}</p>
                </el-form-item>
            </el-form>
            <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleDevice = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="dialogVisibleDevice = false" size="mini">确 定</el-button>
            </span> -->
        </el-dialog>
        <el-dialog
        :visible.sync="dialogVisibleBroadband"
        
        >
            <el-form ref="form" :model="broadBandForm" label-width="140px">
                <el-form-item label="宽带名称">
                    <p>{{broadBandForm.name}}</p>
                </el-form-item>
                <el-form-item label="运营商">
                    <p>{{broadBandForm.operator_verbosename}}</p>
                </el-form-item>
                <el-form-item label="宽带接入类型">
                    <p>{{broadBandForm.access_type_verbosename}}</p>
                </el-form-item>
                <el-form-item label="租期开始时间">
                    <p>{{broadBandForm.start_time}}</p>
                </el-form-item>
                <el-form-item label="租期结束时间">
                    <p>{{broadBandForm.end_time}}</p>
                </el-form-item>
                <el-form-item label="公司宽带负责人">
                    <p>{{broadBandForm.staff_contact}}</p>
                </el-form-item>
                <el-form-item label="公司宽带负责人电话">
                    <p>{{broadBandForm.staff_contact_telephone}}</p>
                </el-form-item>
                <el-form-item label="公司宽带负责人邮箱">
                    <p>{{broadBandForm.staff_contact_email}}</p>
                </el-form-item>
                <el-form-item label="运营商负责人">
                    <p>{{broadBandForm.isp_contact}}</p>
                </el-form-item>
                <el-form-item label="运营商负责人电话">
                    <p>{{broadBandForm.isp_contact_telephone}}</p>
                </el-form-item>
                <el-form-item label="运营商负责人邮箱">
                    <p>{{broadBandForm.isp_contact_email}}</p>
                </el-form-item>
                <el-form-item label="宽带速度">
                    <p>{{broadBandForm.speed}}</p>
                </el-form-item>
                <el-form-item label="备注">
                    <p>{{broadBandForm.comment}}</p>
                </el-form-item>
            </el-form>
            
        </el-dialog>
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
            addressData:[],//组织地址信息
            childrenData:[],//下级组织信息
            contactData:[],//联系人信息
            exportData:[],//出口信息
            deviceData:[],//设备信息
            networkData:[],//地址网络信息
            broadBandData:[],//宽带信息
            
            dialogVisibleDevice:false,
            dialogVisibleSite:false,
            dialogVisibleBroadband:false,
            deviceForm:{

            },
            siteForm:{

            },
            broadBandForm:{

            }

            
            
        };
    },
    created(){
       
    },
    watch:{
        

    },
    mounted(){
        
        this.getWorkDetail()
    },
    methods: {
        
        getWorkDetail(){
            this.$get({
                url:HP1+'/terminal/organization/v1',
                data:{
                   id:this.$route.query.id
                }
            }).then(res=>{
                if(res.data.code == 200){
                    this.regionData.push(res.data.info.organization) 
                    this.childrenData = res.data.info.children
                    this.addressData = res.data.info.addresses
                    this.networkData = res.data.info.networks
                    this.contactData = res.data.info.contacts
                    this.broadBandData = res.data.info.broadbands
                    this.exportData = res.data.info.exports
                    this.deviceData = res.data.info.devices
                    this.deviceData.forEach((item,index)=>{
                        item.last_online_time = new Date(item.last_online_time).toMyStr()
                    })
                }
                 
            })
            
        },
        // handleClose(done) {
        //     this.$confirm('确认关闭？')
        //     .then(_ => {
        //         done();
        //     })
        //     .catch(_ => {});
        // },
        getBroadBandInfo(id){
            this.dialogVisibleBroadband = true
            this.$get({
                url:HP1+'/terminal/organization/broadband/v1',
                data:{
                    id:id
                }

            }).then(res=>{
                if(res.data.code == 200){
                    this.broadBandForm = {...res.data.info}
                }
            })
        },
        getDeviceSite(id){
            this.dialogVisibleSite = true
            this.$get({
                url:HP1+"/terminal/organization/terminal/v1",
                data:{
                    id:id
                }
            }).then(res=>{
                if(res.data.code == 200){
                    this.siteForm = res.data.info
                }
            })
        },
        getDevice(id){
            
            this.$router.push({
                path:'terminalDetail',
                query:{
                    sn:id
                }
            })
        },
        
        
        
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#workDetailBox .el-form-item{
    margin-bottom: 12px;
}
#workDetailBox .el-dialog{
    height:500px;
    overflow-y:auto;
}
.el-table .cell .broadBandName{
    color:#409EFF;
}
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
.siteBox{
    display:inline-block;
    width: 100%;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    border-bottom: 1px solid #ddd;
}
.siteBox:last-child{
    border-bottom:none;
}
.deviceBox, .siteBox{
    color:#409EFF;
}
</style>
