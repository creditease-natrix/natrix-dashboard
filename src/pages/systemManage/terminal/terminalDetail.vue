<template>
    <div>
        <div id="nav">
            <span class="title">终端管理——终端设备详情</span>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <a :href=href class="home">管理系统 <i class="el-breadcrumb__separator el-icon-arrow-right"></i></a>
                <el-breadcrumb-item :to="{ path: '' }">终端管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/terminalList' }">终端设备列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="optionBox clear">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="基本信息" name="first">基本信息</el-tab-pane>
                <el-tab-pane label="系统信息" name="second">系统信息</el-tab-pane>
                <el-tab-pane label="硬件信息" name="third">硬件信息</el-tab-pane>
                <el-tab-pane label="网络信息" name="fourth">网络信息</el-tab-pane>
                <el-tab-pane label="保活信息" name="fifth">保活信息</el-tab-pane>
            </el-tabs>
            <div id="primaryInfo" v-show="activeName == 'first' ">
                <ul class="primaryList">
                    <li>
                        <span class="listLabel">设备序列号：</span><span>{{primaryInfo.sn}}</span>
                    </li>
                    <li>
                        <span class="listLabel">主机名称：</span><span>{{primaryInfo.hostname}}</span>
                    </li>
                    <li>
                        <span class="listLabel">设备类型：</span><span>{{primaryInfo.type}}</span>
                    </li>
                    <li>
                        <span class="listLabel">操作系统：</span><span>{{primaryInfo.os_type}}</span>
                    </li>
                    <li>
                        <span class="listLabel">操作系统版本：</span><span>{{primaryInfo.os_version}}</span>
                    </li>
                    <li>
                        <span class="listLabel">客户端版本：</span><span>{{primaryInfo.client_version}}</span>
                    </li>
                    <li>
                        <span class="listLabel">状态：</span><span>{{$t(primaryInfo.status)}}</span>
                    </li>
                    <li>
                        <span class="listLabel">更新时间：</span><span>{{primaryInfo.update_time}}</span>
                    </li>
                    
                </ul>
                <ul class="primaryList  orgList">
                    <li>
                        <span class="listLabel">登记组织：</span>
                        <span>
                            <strong class="org" 
                            :class="{active : activeIndex == index1 || activeId2 == item1.id}"
                            @mouseover="mouseoverHandle(index1,item1)"
                            @mouseout="mouseoutHandle"
                            v-for="(item1,index1) in primaryInfo.reg_orgs" 
                            :key="index1">
                            {{item1.name}}
                            </strong>
                        </span>
                    </li>
                    <li>
                        <span class="listLabel">检测组织：</span>
                        <span>
                            <strong class="org" 
                            v-for="(item2,index2) in primaryInfo.detect_orgs" 
                            @mouseover="mouseoverHandle1(index2,item2)"
                            @mouseout="mouseoutHandle1"
                            :class="{active:activeId == item2.id || activeIndex2 == index2}"
                            :key="index2">{{item2.name}}</strong>
                        </span>
                    </li>
                    <li>
                        <span class="listLabel">注释：</span><span>{{primaryInfo.comment}}</span>
                    </li>
                </ul>
            </div>
            <div id="systemInfo" v-show="activeName == 'second' ">
                <ul class="primaryList">
                    <li>
                        <span class="listLabel">操作系统：</span><span>{{systemInfo.os}}</span>
                    </li>
                    <li>
                        <span class="listLabel">操作系统名称：</span><span>{{systemInfo.os_name}}</span>
                    </li>
                    <li>
                        <span class="listLabel">操作系统版本：</span><span>{{systemInfo.os_version}}</span>
                    </li>
                    <li>
                        <span class="listLabel">操作系统内核版本：</span><span>{{systemInfo.os_kernel_version}}</span>
                    </li>
                    <li>
                        <span class="listLabel">架构信息：</span><span>{{systemInfo.arch_info}}</span>
                    </li>
                    <li>
                        <span class="listLabel">综合平台信息：</span><span>{{systemInfo.platform}}</span>
                    </li>
                    <li>
                        <span class="listLabel">python版本：</span><span>{{systemInfo.python_version}}</span>
                    </li>
                    <li>
                        <span class="listLabel">natrix版本：</span><span>{{systemInfo.natrix_version}}</span>
                    </li>
                    <li>
                        <span class="listLabel">chrome版本：</span><span>{{systemInfo.chrome_version}}</span>
                    </li>
                    <li>
                        <span class="listLabel">chrome webdriver版本：</span><span>{{systemInfo.chrome_version}}</span>
                    </li>
                    <li>
                        <span class="listLabel">firefox版本：</span><span>{{systemInfo.firefox_version}}</span>
                    </li>
                    <li>
                        <span class="listLabel">firefox webdriver版本：</span><span>{{systemInfo.firefox_webdriver_version}}</span>
                    </li>
                </ul>
            </div>
            <div id="deviceInfo" v-show="activeName == 'third' ">
                <ul class="primaryList">
                    <li>
                        <span class="listLabel">设备序号：</span><span>{{deviceInfo.sn}}</span>
                    </li>
                    <li>
                        <span class="listLabel">启动时间：</span><span>{{deviceInfo.boot_time}}</span>
                    </li>
                    <li>
                        <span class="listLabel">产品信息：</span><span>{{deviceInfo.product}}</span>
                    </li>
                    <li>
                        <span class="listLabel">CPU型号：</span><span>{{deviceInfo.cpu_info.cpu_model}}</span>
                    </li>
                    <li>
                        <span class="listLabel">CPU使用率（%）：</span><span>{{deviceInfo.cpu_info.cpu_percent}}</span>
                    </li>
                    <li>
                        <span class="listLabel">内存信息：</span><span>{{deviceInfo.memory_info.memory_total}}</span>
                    </li>
                    <li>
                        <span class="listLabel">内存使用率（%）：</span><span>{{deviceInfo.memory_info.memory_percent}}</span>
                    </li>
                    <li>
                        <span class="listLabel">磁盘使用率（%）：</span><span>{{deviceInfo.disk_info.disk_percent}}</span>
                    </li>
                    
                </ul>
            </div>
            <div id="netInfo" v-show="activeName == 'fourth' ">
                <el-collapse v-model="activeNames"  v-for="(item,index) in netInfo" :key="index">
                    <el-collapse-item :title="item.name+'-'+item.type" :name="index">
                        <ul class="primaryList">
                            <li>
                                <span class="listLabel">本地IP地址：</span><span>{{item.localip}}</span>
                            </li>
                            <li>
                                <span class="listLabel">子网掩码：</span><span>{{item.netmask}}</span>
                            </li>
                            <li>
                                <span class="listLabel">网关地址：</span><span>{{item.gateway}}</span>
                            </li>
                            <li>
                                <span class="listLabel">MAC地址：</span><span>{{item.macaddress}}</span>
                            </li>
                            <li>
                                <span class="listLabel">公网地址：</span><span>{{item.publicip}}</span>
                            </li>
                            <li>
                                <span class="listLabel">地域信息：</span><span>{{item.location_info.country +'-' +item.location_info.province +'-' +item.location_info.city}}</span>
                            </li>
                            <li style="width:70%;">
                                <span class="listLabel">状态：</span>
                                <span class="listOption">
                                    <span><i class="icon iconfont icon-kaiqi" :class="{success:item.is_active,error:!item.is_active}"></i>开启</span>
                                    <span><i class="icon iconfont icon-queshengye" :class="{success:item.is_default,error:!item.is_default}"></i>缺省网卡</span>
                                    <span><i class="icon iconfont icon-wuxianjuyuwang" :class="{success:item.access_intranet,error:!item.access_intranet}"></i>局域网访问</span>
                                    <span><i class="icon iconfont icon-neiwang" :class="{success:item.access_corporate,error:!item.access_corporate}"></i>企业网访问</span>
                                    <span><i class="icon iconfont icon-gongsiwangdian" :class="{success:item.access_internet,error:!item.access_internet}"></i>互联网访问</span>
                                </span>
                            </li>
                        </ul>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <div id="alive" v-show="activeName == 'fifth' ">
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%,margin-top:50px;">
                    <el-table-column
                    prop="receive_time"
                    label="接收时间"
                    width="200">
                    </el-table-column>
                    <el-table-column
                    prop="send_time"
                    label="发送时间"
                    width="200">
                    </el-table-column>
                    <el-table-column
                    prop="type"
                    label="信息类型">
                    </el-table-column>
                </el-table>
                <page :pageCount='page_Count' 
                v-on:page-change='pageChangeHandle' 
                v-show="pageShow"></page>
            </div>
        </div>
        
        
    </div>  
</template>

<script>
import {timeStamp1,utc2beijing} from '../../../until/index.js'
import page from '../../../components/page'
export default {
    name:'',
    components:{
        page
    },
    data() {
        return {
            href: ManageIndex,
            activeName: 'first',
            checkList:['开启'],
            tableData:[],
            primaryInfo:'',
            systemInfo:'',
            show:false,
            activeNames:[0],
            deviceInfo:{
                cpu_info:{
                    cpu_core:'',
                    cpu_model:'',
                    cpu_percent:''
                },
                memory_info:{
                    memory_used:'',
                    memory_percent:'',
                    memory_frequency:'',
                    memory_total:''
                },
                disk_info:{
                    disk_percent:''
                }
            },
            netInfo:'',
            page_Count:1,
            pageShow:false,
            activeIndex:-1,
            activeId:'',
            activeIndex2:-1,
            activeId2:''


        };
    },
    created(){
       
    },
    watch:{
        
    },
    mounted(){
        this.getPrimaryInfo()
        this.getSystemInfo()
        this.getDeviceInfo()
        this.getNetInfo()
        this.getDeviceList(1)
    },
    methods: {
        handleClick(tab, event) {
            this.activeName = tab.name
        },
        getPrimaryInfo(){
            this.$get({
                url:HP1+'/terminal/device/basic/v1',
                data:{
                    sn:this.$route.query.sn
                }
            }).then(res=>{
                if(res.data.code == 200){
                    this.primaryInfo = res.data.info
                    var time = this.primaryInfo.update_time.replace(/-/g, "/");
                    var times = utc2beijing(time);//时间戳
                    var date = timeStamp1(times);//日期
                    this.primaryInfo.update_time = date 

                }
            })
        },
        getSystemInfo(){
            this.$get({
                url:HP1+'/terminal/device/os/v1',
                data:{
                    sn:this.$route.query.sn
                }
            }).then(res=>{
                if(res.data.code == 200){
                    this.systemInfo = res.data.info
                    

                }
            })
        },
        getDeviceInfo(){
            this.$get({
                url:HP1+'/terminal/device/hardware/v1',
                data:{
                    sn:this.$route.query.sn
                }
            }).then(res=>{
                if(res.data.code == 200){
                    this.deviceInfo = res.data.info
                }
            })
        },
        getNetInfo(){
            this.$post({
                url:HP1+'/terminal/terminal/list/v1',
                data:{
                    sn:this.$route.query.sn,
                    is_paginate:false
                }
            }).then(res=>{
                if(res.data.code == 200){
                    this.netInfo = res.data.info
                    this.netInfo.forEach((item,index)=>{
                        item.showOption = false
                       
                    })
                    

                }
            })
            
        },
        showHandle(item){
            this.show = !this.show
        },
        getDeviceList(num){
            this.$get({
                url:HP1+"/terminal/device/postinfo/v1",
                data:{
                    sn:this.$route.query.sn,
                    is_paginate:true,
                    pagenum:num
                }
            }).then(res=>{
                if(res.data.code == 200){
                    this.tableData = res.data.info
                    this.tableData.forEach((item,index)=>{
                        item.type = this.$t(item.type)
                        item.receive_time =  timeStamp1(item.receive_time)
                        item.send_time =  timeStamp1(item.send_time)
                    })
                    this.page_Count = res.data.page_count 
                    this.pageShow = res.data.page_count > 0 ? true :false 
                }else{
                    this.$message({
                        type:'error',
                        message:res.data.message
                    })
                }
                
            })
        },
        pageChangeHandle(currentPageNum){
            this.getDeviceList(currentPageNum)
        },
        mouseoverHandle(index1,item1){
            this.activeIndex = index1
            this.activeId = item1.id
            
            
        },
        mouseoutHandle(index1,item1){
            this.activeIndex = -1
            this.activeId = ''
           
        },
        mouseoverHandle1(index2,item2){
            this.activeIndex2 = index2
            this.activeId2 = item2.id
        },
        mouseoutHandle1(index1,item1){
            this.activeIndex2 = -1
            this.activeId2 = ''
        },




    }
};
</script>
<style>
.el-tabs__content{
    display:none;
}
.el-collapse-item__header{
    padding-left:10px;
}
#alive .el-table td div{
    margin:0 10px 0 0;
}


</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.optionBox{
    margin-bottom:20px;
    margin-top:20px;
}
.primaryList{
    display:flex;
    display:-webkit-flex;
    display:-moz-flex;
    flex-direction:row;
    flex-wrap:wrap;
    padding-left:10px;
    background:#fff;
}
.primaryList li{
    width:50%;
    font-size:14px;
    line-height:30px;
    margin:0 0 5px 0;
}
.listLabel{
    display:inline-block;
    min-width:150px;
    text-align:left;
}
.listOption{
    display:inline-block;
}
.org{
    padding: 5px;
    display:inline-block;
    border:1px solid #ececec;
    margin:0 5px 0 0;
    color:#409EFF;
    border-radius:5px;

}
.org.active{
    background: #E4E7ED;
    color: #409effc7;
}
.orgList li{
    display:block;
    width:100%;
}
.success{
    color:#67C23A;
}
.error{
    color:#F56C6C;
}
</style>
