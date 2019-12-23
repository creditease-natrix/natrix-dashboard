<template>
    <div>
        <div id="nav">
            <span class="title">云拨测——组管理</span>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <a :href="href" class="home">云拨测<i class="el-breadcrumb__separator el-icon-arrow-right"></i></a>
                <el-breadcrumb-item :to="{path:'/groupList'}">组管理</el-breadcrumb-item>
                <!-- <el-breadcrumb-item :to="{ path: '/alarmList' }">告警列表</el-breadcrumb-item> -->
            </el-breadcrumb>
        </div>
        <div class="optionBox clear">
            <div class="fl">
                <el-button type="primary" 
                size="mini" 
                icon="el-icon-plus"
                @click="addGroup" 
                >创建组</el-button>
                <el-button 
                v-show="opt_permission"
                type="primary" 
                size="mini" 
                icon="el-icon-plus"
                @click="gotoAddUser" 
                >增加成员</el-button>
            </div>
        </div>
        <el-table
            :data="tableData"
            border
            >
            <el-table-column
            prop="username"
            label="用户名"
            width="120">
            </el-table-column>
            <el-table-column
            prop="email"
            label="邮箱地址"
            width="150">
            </el-table-column>
            <el-table-column
            label="角色列表">
                <template slot-scope="scope">
                    <div>
                        <span class="statusBtn successBk" v-for="(item,index) in scope.row.roles" :key="index">{{$t(item)}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
            width="200"
            label="操作">
                <template slot-scope="scope">
                    <el-button
                    v-show="opt_permission"
                    size="mini"
                    type="warning"
                    @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button
                    v-show="opt_permission"
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
        <el-dialog 
        id="dialog"
        title="添加组" 
        :visible.sync="dialogFormVisible">
            <el-form 
             :model="addform" 
             :rules="rules"
             size="mini">
                <el-form-item label="组名称" label-width="120px" prop="groupname">
                    <el-input v-model="addform.groupname" ></el-input>
                </el-form-item>
                <el-form-item label="组描述" label-width="120px" prop="description">
                    <el-input v-model="addform.description" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false" type="warning" size="mini">关闭</el-button>
                <el-button type="primary" @click="submit" size="mini">保存</el-button>
            </div>
        </el-dialog>
        <!-- <el-dialog 
        id="dialog"
        title="增加成员" 
        :visible.sync="dialogUserForm">
            <el-form 
             :model="addUserForm" 
             :rules="userFormRules"
             size="mini">
                <el-form-item label="用户" prop="username" id="addUser">
                    <el-input v-model="addUserForm.username" placeholder="请输入用户信息"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="roles">
                    <el-select 
                    v-model="addUserForm.roles" 
                    multiple 
                    value-key="name"
                    placeholder="请选择角色">
                        <el-option 
                        v-for="(item,index) in rolesList" 
                        :label="$t(item.name)" 
                        :value="item.name" 
                        :key="index">
                            <el-tooltip class="item" effect="light" :content="item.desc" placement="top-start">
                                <span>{{item.name}}</span>
                            </el-tooltip>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogUserForm = false" type="warning" size="mini">关闭</el-button>
                <el-button type="primary" @click="addUserSubmit" size="mini">保存</el-button>
            </div>
        </el-dialog> -->
        <groupuser 
        ref="userDialog"
        v-on:update="updateHandle"
        
        >
        </groupuser>
    </div>
    
</template>

<script>
import page from '../../components/page'
import groupuser from "./components/groupuser.vue"
import {timeStamp1,messageTip} from "../../until/index.js"
export default {
    name:'',
    components:{
       page,groupuser
    },
    data() {

        return {
            href: ManageIndex,
            tableData:[],
            page_Count:1,
            pageNum: 1,
            pageShow:true,
            currentPageNum:1,
            item_count:0,
            dialogFormVisible:false,
            opt_permission:true,
            addform:{
                groupname:"",
                description:""
            },
            rules:{
                groupname: [
                    { required: true, message: '请输入组名称', trigger: 'blur' },
                ]
            },
            addUserForm:{
                username:"",
                roles:[]
            },
            userFormRules:{
                username: [
                    { required: true, message: '请输入用户名称', trigger: 'blur' },
                ],
                roles: [
                    { required: true, message: '请选择角色', trigger: 'change' }
                ],
            },
            rolesList:[],
            // dialogUserForm:false
        };
    },
    mounted(){
        this.getMemberList(1)
    },
    methods: {
        pageChangeHandle(currentPageNum){
           this.getMemberList(currentPageNum)
        },
        getMemberList(num){
            this.$get({
                url:HP1+"/rbac/group/user/list/v1",
                data:{
                    is_paginate:true,
                    pagenum:num
                }
            }).then(res=>{
                if(res.data.code == 200){
                    this.tableData = res.data.info
                    this.item_count = res.data.item_count
                    this.page_Count = res.data.page_count
                    this.pageShow = this.page_Count > 0 ? true :false
                    this.opt_permission = res.data.opt_permission
                }else{
                    messageTip("error",this.$t(res.data.message))
                    this.opt_permission = true
                }
                
            })

        },
        
        gotoAddUser(){
            this.$refs.userDialog.dialogUserForm = true
            this.$refs.userDialog.title = "增加用户"
            this.$refs.userDialog.isEdit = false
            this.$refs.userDialog.addUserForm = {
                username:"",
                roles:[]
            }
        },
        addGroup(){
            this.dialogFormVisible = true
        },
        handleEdit(index,row){
            this.$refs.userDialog.dialogUserForm = true
            this.$refs.userDialog.title = "编辑用户"
            this.$refs.userDialog.isEdit = true
            this.$refs.userDialog.getCurrentRoles(row.username)
        },
        handleDel(index,row){
            this.$confirm('该操作将永久删除该用户成员，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteHandle(row.username)
                
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        deleteHandle(name){
            this.$delete({
                url:HP1+"/rbac/group/user/v1",
                data:{
                    username:name
                }
            }).then(res=>{
                if(res.data.code == 200){
                    messageTip("success",this.$t(res.data.message))
                    this.$refs.page.currentPage = 1
                    this.getMemberList(1)
                }else{
                    messageTip("error",this.$t(res.data.message))
                }
            })
        },
        submit(){
            this.addGroupHandle()
        },
        addGroupHandle(){
            let data = {...this.addform}
            this.$post({
                url:HP1+"/rbac/group/v1",
                data:data
            }).then(res=>{
                if(res.data.code == 200){
                    messageTip("success",this.$t(res.data.message))
                    this.dialogFormVisible = false
                    this.$parent.$children[0].getUserInfo()
                }else{
                    messageTip("error",this.$t(res.data.message))
                    this.dialogFormVisible = true
                }

            })
        },
        updateHandle(){
            this.getMemberList(1)
        }
        
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.el-breadcrumb__item:last-child .el-breadcrumb__inner:hover{
    cursor:pointer;
}
#dialog .el-input{
    width:400px;
}
.statusBtn{
    margin:0 5px 0 0;
}
</style>
<style scoped>
@import "../../../static/css/resetEle.css";
</style>
