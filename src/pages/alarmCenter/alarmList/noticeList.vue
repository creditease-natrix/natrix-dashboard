<template>
    <div>
        <div id="nav">
            <span class="title">云拨测——通知列表</span>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <a :href="href" class="home">云拨测<i class="el-breadcrumb__separator el-icon-arrow-right"></i></a>
                <el-breadcrumb-item>告警中心</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/alarmList' }">告警列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div id="subTitle">
            <p>{{this.$route.query.alarmName}}</p>
        </div>
        <div class="optionBox clear">
            <div class="fl">
                <el-button type="primary" 
                size="mini" 
                icon="el-icon-plus"
                @click="addNotice" 
                >创建通知</el-button>
            </div>
        </div>
        <el-table
            :data="tableData"
            border
            >
            <el-table-column
            label="类型"
            width="100">
                <template slot-scope="scope">
                    {{$t(scope.row.notify_type)}}
                </template>
            </el-table-column>
            <el-table-column
            prop="description"
            label="描述"
            width="100">
            </el-table-column>
            <el-table-column
            prop="userName"
            width="200"
            label="用户列表">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top" v-if="scope.row.users.length > 0">
                        <p v-for="(item) in scope.row.users" :key="item.user_id">{{ item.user_name}}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.users[0].user_name}}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
            width="60"
            label="状态">
                <template slot-scope="scope">
                    <span class="statusBtn successBk" v-show="scope.row.status">开启</span>
                    <span class="statusBtn errorBk" v-show="!scope.row.status">关闭</span>
                </template>
            </el-table-column>
            <el-table-column
            prop="create_time"
            label="创建时间">
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
                    v-show="!scope.row.status"
                    type="success"
                    @click="turnOnHandle(scope.$index, scope.row)">开启</el-button>
                    <el-button
                    v-show="scope.row.status"
                    size="mini"
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
        v-on:updateList="updateHandle"
        :notifyId="notifyId"
        :alarmId="alarmId"
        :alarmName="alarmName"
        :showDialog="showDialog" 
        ref="dialog"></noticeDialog>
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
            alarmName:"",
            notifyId:-1
        };
    },
    created(){
       
    },
    watch:{
    },
    mounted(){
        this.alarmId = this.$route.query.alarmId
        this.alarmName = this.$route.query.alarmName
        this.getNoticeList(1)
    },
    methods: {
        addNotice(){
            this.$refs.dialog.isEditValue = false
            this.$refs.dialog.title = "添加通知"
            this.$refs.dialog.dialogFormVisible = true
            this.$refs.dialog.form = {
                description:"",
                notify_type:"email",
                is_recovery:true,
                users:[],
                frequency:10,
                noticeTime:["00:00","23:59"],
                start_time:"",
                end_time:""
            }
        },
        pageChangeHandle(currentPageNum){
            this.getNoticeList(currentPageNum)
        },
        getNoticeList(num){
            this.$get({
                url:HP1+"/sentinel/alarm/notify/list/v1",
                data:{
                    alarm_id:this.$route.query.alarmId,
                    is_paginate:true,
                    pagenum:num
                }
            }).then(res=>{
                if(res.data.code == 200){
                    res.data.info.forEach((item,index)=>{
                        item.create_time = timeStamp1(item.create_time)
                        item.isEditValue = false
                    })
                    this.tableData = res.data.info
                    this.page_Count = res.data.page_count
                    this.item_count = res.data.item_count
                    this.pageShow = this.page_Count > 0 ? true : false
                }
            })
        },
        
        handleEdit(index,row){
            this.$refs.dialog.dialogFormVisible = true
            this.$refs.dialog.title = "编辑通知"
            this.notifyId = row.id
            this.$refs.dialog.isEditValue = true //是否是编辑操作
            this.$refs.dialog.getNoticeInfo(row.id)
        },
        handleDel(index,row){
            this.$confirm('该操作将永久删除告警通知配置，是否继续？', '提示', {
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
                url:HP1+"/sentinel/alarm/notify/v1",
                data:{
                    notify_id:id
                }
            }).then(res=>{
                if(res.data.code == 200){
                    messageTip("success",this.$t(res.data.message))
                    this.$refs.page.currentPage = 1
                    this.getNoticeList(1)
                }else{
                    messageTip("error",this.$t(res.data.message))
                }
            })
        },
        turnOnHandle(index,row){
            this.$put({
                url:HP1+"/sentinel/alarm/notify/operation/v1",
                data:{
                    notify_id:row.id,
                    operation:"on"
                }
            }).then(res=>{
                if(res.data.code == 200){
                    messageTip("success",this.$t(res.data.message))
                    this.$refs.page.currentPage = 1
                    this.getNoticeList(1)
                }else{
                    messageTip("error",this.$t(res.data.message))
                }

            })
        },
        turnOffHandle(index,row){
            this.$put({
                url:HP1+"/sentinel/alarm/notify/operation/v1",
                data:{
                    notify_id:row.id,
                    operation:"off"
                }
            }).then(res=>{
                if(res.data.code == 200){
                    messageTip("success",this.$t(res.data.message))
                    this.$refs.page.currentPage = 1
                    this.getNoticeList(1)
                }else{
                    messageTip("error",this.$t(res.data.message))
                }
            })
        },
        updateHandle(){
            this.getNoticeList(1)
        }
    }
    
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.el-breadcrumb__item:last-child .el-breadcrumb__inner:hover{
    cursor:pointer!important;
}
</style>
<style scoped>
@import "../../../../static/css/resetEle.css";
#subTitle{
    font-size:12px;
    line-height:30px;
}
</style>
