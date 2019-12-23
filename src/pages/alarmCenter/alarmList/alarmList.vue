<template>
    <div>
        <div id="nav">
            <span class="title">云拨测——告警列表</span>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <a :href="href" class="home">云拨测<i class="el-breadcrumb__separator el-icon-arrow-right"></i></a>
                <el-breadcrumb-item :to="{path:''}">告警中心</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/alarmList' }">告警列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="optionBox clear">
            <div class="fl">
                <el-button type="primary" 
                size="mini" 
                icon="el-icon-plus"
                @click="gotoAddalarm" 
                >创建告警</el-button>
            </div>
        </div>
        <el-table
            :data="tableData"
            border
            >
            <el-table-column
            prop="name"
            label="告警名称"
            width="180">
                <template slot-scope="scope">
                    <a class="detailColor cursor" @click="gotoAlarmInfo(scope.row.id)">{{scope.row.name}}</a>
                </template>
            </el-table-column>
            <el-table-column
            prop="scope"
            label="定时测任务"
            width="100">
                <template slot-scope="scope">
                    <a class="detailColor cursor" @click="gotoTaskInfo(scope.row.task_id)">{{scope.row.task_name}}</a>
                </template>
            </el-table-column>
            <el-table-column
            prop="monitor_type"
            width="100"
            label="指标项">
            </el-table-column>
            <el-table-column
            width="60"
            label="状态">
                <template slot-scope="scope">
                    <span class="statusBtn successBk" v-if="scope.row.alarm_status == 'on'">{{$t(scope.row.alarm_status)}}</span>
                    <span class="statusBtn errorBk" v-if="scope.row.alarm_status == 'off'">{{$t(scope.row.alarm_status)}}</span>
                    <span class="statusBtn errorBk1" v-if="scope.row.alarm_status == 'trigger'">{{$t(scope.row.alarm_status)}}</span>
                    <span class="statusBtn defaultBk" v-if="scope.row.alarm_status == 'unkown'">{{$t(scope.row.alarm_status)}}</span>
                </template>
            </el-table-column>
            <el-table-column
            prop="create_time"
            width="140"
            label="创建时间">
            </el-table-column>
            <el-table-column
            width="200"
            label="告警通知">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    type="primary"
                    @click="addNotice(scope.row)"
                    >添加通知</el-button>
                    <el-button
                    size="mini"
                    type="primary"
                    @click="gotoNoticeList(scope.row)"
                    >通知列表</el-button>    
                </template>
            </el-table-column>
            <el-table-column
            label="操作">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    type="warning"
                    @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button
                    size="mini"
                    v-if="!scope.row.status"
                    type="success"
                    @click="turnOnHandle(scope.$index, scope.row)">开启</el-button>
                    <el-button
                    size="mini"
                    v-if="scope.row.status"
                    type="off"
                    @click="turnOffHandle(scope.$index, scope.row)">暂停</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <page 
        :pageCount='page_Count'
        :item_count="item_count" 
        ref="page"
        :currentPage="currentPageNum"
        v-on:page-change='pageChangeHandle' 
        v-show="pageShow"></page>
        <noticeDialog
        :showDialog="showDialog"
        :alarmId="alarmId"
        :alarmName="alarmName"
        ref="dialog"
        >
        </noticeDialog>
    </div>
    
</template>

<script>
import noticeDialog from "./components/noticeDialog.vue"
import page from '../../../components/page'
import {timeStamp1,messageTip} from "../../../until/index.js"
export default {
    name:'',
    components:{
       page,noticeDialog
    },
    data() {

        return {
            href: ManageIndex,
            tableData:[ 

            ],
            page_Count:1,
            pageNum: 1,
            pageShow:true,
            currentPageNum:1,
            item_count:0,
            showDialog:false,
            alarmId:"",
            alarmName:""
        };
    },
    created(){
       
    },
    watch:{
    },
    mounted(){
        this.getAlarmList(1)
    },
    methods: {
        pageChangeHandle(currentPageNum){
            this.getAlarmList(currentPageNum)
            
        },
        getAlarmList(num){
            this.$get({
                url:HP1+"/sentinel/alarm/list/v1",
                data:{
                    is_paginate:true,
                    pagenum:num
                }
            }).then(res=>{
                if(res.data.code ==200 ){
                    this.page_Count = res.data.page_count
                    this.item_count = res.data.item_count
                    this.tableData = res.data.info
                    this.tableData.forEach((item,index)=>{
                        item.create_time = timeStamp1(item.create_time)
                        item.monitor_type = this.$t(item.monitor_type)
                    })
                }else{
                    messageTip("error",this.$t(res.data.message))
                }
            })
        },
        gotoAddalarm(){
            this.$router.push({
                path:"addAlarm"
            })
        },
        gotoTaskInfo(id){
            this.$router.push({
                path:"timedAnalysis",
                query:{
                    taskId:id
                }
            })
            
        },
        gotoAlarmInfo(id){
            this.$router.push({
                path:"alarmInfo",
                query:{
                    alarmId:id
                }
            })
        },
        handleEdit(index,row){
            this.$router.push({
                path:"editAlarm",
                query:{
                    alarmId:row.id
                }
            })
        },
        handleDel(index,row){
            this.$confirm('该操作将永久删除告警及相关通知配置，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteHandle(row.id)
                
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        deleteHandle(id){
            this.$delete({
                url:HP1+"/sentinel/alarm/v1",
                data:{
                    alarm_id:id
                }
            }).then(res=>{
                if(res.data.code == 200){
                    messageTip("success",this.$t(res.data.message))
                    this.$refs.page.currentPage = 1
                    this.getAlarmList(1)
                }else{
                    messageTip("error",this.$t(res.data.message))
                }
            })
        },
        turnOnHandle(index,row){
            this.$put({
                url:HP1+"/sentinel/alarm/operation/v1",
                data:{
                    alarm_id:row.id,
                    operation:"on"
                }
            }).then(res=>{
                if(res.data.code == 200){
                    messageTip("success",this.$t(res.data.message))
                    this.$refs.page.currentPage = 1
                    this.getAlarmList(1)
                }else{
                    messageTip("error",this.$t(res.data.message))
                }

            })
        },
        turnOffHandle(index,row){
            this.$put({
                url:HP1+"/sentinel/alarm/operation/v1",
                data:{
                    alarm_id:row.id,
                    operation:"off"
                }
            }).then(res=>{
                if(res.data.code == 200){
                    messageTip("success",this.$t(res.data.message))
                    this.$refs.page.currentPage = 1
                    this.getAlarmList(1)
                }else{
                    messageTip("error",this.$t(res.data.message))
                }

            })
        },
        gotoNoticeList(row){
            this.$router.push({
                path:"noticeList",
                query:{
                    alarmId:row.id,
                    alarmName:row.name
                }
            })
        },
        addNotice(row){
            this.$refs.dialog.dialogFormVisible = true
            this.showDialog = true
            this.alarmId = row.id
            this.alarmName = row.name
        }

    }
    
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.el-breadcrumb__item:last-child .el-breadcrumb__inner:hover{
    cursor:pointer;
}
</style>
<style scoped>
@import "../../../../static/css/resetEle.css";
</style>
