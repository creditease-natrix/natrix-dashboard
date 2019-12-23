<template>
    <div>
        <div id="nav">
            <span class="title">云拨测——修改个人信息</span>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <a :href="href" class="home">云拨测<i class="el-breadcrumb__separator el-icon-arrow-right"></i></a>
                <el-breadcrumb-item :to="{path:'/groupList'}">组管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form 
        size="mini"
        :model="ruleForm" 
        ref="ruleForm" 
        label-width="100px" 
        class="demo-ruleForm">
            <el-form-item label="用户名">
                <el-input v-model="ruleForm.username" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
                <el-input v-model="ruleForm.email" type="email" placeholder="请输入邮件名称"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="phone">
                <el-input v-model="ruleForm.phone" type="telephone" placeholder="请输入联系方式"></el-input>
            </el-form-item>
            <el-form-item label="所属监控组">
                <el-select 
                v-model="ruleForm.groups" 
                multiple 
                disabled>
                    <el-option 
                    v-for="(item,index) in groupsList" 
                    :key="index"
                    :value="item"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分页数" prop="per_page">
                <el-select 
                v-model="ruleForm.per_page" 
                placeholder="请选择分页数">
                    <el-option 
                    v-for="(item,index) in pageList" 
                    :label="item" 
                    :value="item" 
                    :key="index">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                <el-button type="warning" @click="resetForm('ruleForm')">取消</el-button>
            </el-form-item>
        </el-form>
        
      
        
    </div>
    
</template>

<script>
import {messageTip} from "../../until/index.js"
export default {
    name:'',
    components:{
    },
    data() {

        return {
            href: ManageIndex,
            ruleForm:{
                username:"",
                email:"",
                phone:"",
                per_page:10,
                groups:[],
                roles:[]
            },
            rolesList:[],
            pageList:[
               5, 10,20,50
            ],
            groupsList:[]
            
        };
    },
    created(){
       
    },
    watch:{
    },
    mounted(){
        this.getUserInfo()
    },
    methods: {
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.editInfo()
                } else {
                    return false;
                }
            });
        },
        resetForm(formName){
            this.$refs[formName].resetFields();
        },
        getUserInfo(){
            this.$get({
                url:HP1+"/rbac/user/v1",
                data:{}
            }).then(res=>{
                if(res.data.code == 200){
                    this.ruleForm = {...res.data.info}
                    this.ruleForm.groups.forEach((item,index)=>{
                        this.groupsList.push({
                            value:item,
                            label:item
                        })
                    })
                }else{
                    messageTip("error",this.$t(res.data.message))
                }
            })
        },
        editInfo(){
            this.$put({
                url:HP1+"/rbac/user/v1",
                data:{
                    email:this.ruleForm.email,
                    phone:this.ruleForm.phone,
                    per_page:this.ruleForm.per_page
                }
            }).then(res=>{
                if(res.data.code == 200){
                    messageTip("success",this.$t(res.data.message))
                    window.location.href = NatrixIndex

                }else{
                    messageTip("error",this.$t(res.data.message))
                }
            })
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.el-breadcrumb__item:last-child .el-breadcrumb__inner:hover{
    cursor:pointer;
}
#addUser .el-input{
    width:173px;
}
</style>
<style scoped>
@import "../../../static/css/resetEle.css";
</style>
