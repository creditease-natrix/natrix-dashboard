<template>
    <div>
        <div id="nav">
            <span class="title">许可证管理——许可证列表</span>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <a :href=href class="home"> 管理系统 <i class="el-breadcrumb__separator el-icon-arrow-right"></i></a>
                <el-breadcrumb-item :to="{ path: '' }">许可证管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/licenseList' }">许可证列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="optionBox clear">
            <el-button type="primary" size="mini" @click="applyHandle">申请</el-button>
            <div class="fr">
                <el-switch
                v-model="switchValue"
                active-color="#13ce66"
                inactive-color="#ff4949">
                </el-switch>
                <span class="switchTxt hiddenSn" v-show="!switchValue">隐藏序列号</span>
                <span class="switchTxt showSn" v-show="switchValue">显示序列号</span>
                <el-select 
                size="mini"
                @change="getLicenseList(1)"
                v-model="filterValue" 
                placeholder="请选择">
                    <el-option
                    v-for="item in filterOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div>
            <ul class="licenseList clear">
                <el-card 
                class="box-card"
                :key="index"
                v-for="(item,index) in licenseList">
                    <div slot="header" class="clearfix">
                        <input type="hidden" :id='"licenseInput" + index' :value="item.key"/>
                        <span v-show="!switchValue">{{item.key.substring(0,2)+'******'+item.key.substring(item.key.length-2)}}</span>
                        <span :id='"license" + index' class="license" v-show="switchValue">{{item.key}}</span>
                        <span class="copyBtn cursor" data-clipboard-action="copy" @click="copySn(index,$event)">复制</span>
                        <el-button style="float: right; padding: 3px 0" type="danger" size="mini" @click="handleDel(item.key)">删除</el-button>
                    </div>
                    <div  class="text item">
                        <div class="clear itemContent"><span class="fl statusTitle">状&nbsp;&nbsp;态：</span><span class="successBk statusBtn " :class="{warningBk : item.status == 'binding'}">{{$t(item.status)}}</span></div>
                        <div class="clear itemContent"><span class="fl">绑定设备：</span><span class="fr"></span>{{item.device_id}}</div>
                        <div class="clear itemContent"><span class="fl">最近时间：</span><span class="fr"></span>{{item.bind_time}}</div>
                    </div>
                </el-card>
            </ul>
        </div>
        <page :pageCount='page_Count' 
        :item_count="item_count"
        v-on:page-change='pageChangeHandle' 
        v-show="pageShow"></page>
        <el-dialog 
        id="licenseDialog"
        title="申请许可证" 
        :visible.sync="dialogFormVisible">
            <el-form 
            ref="form" 
            size="mini"
            :rules="rules"
            :model="form" 
            label-width="80px">
                <el-form-item label="申请数量" prop="number">
                    <el-input v-model.number="form.number" type="number"></el-input>
                </el-form-item>
                <el-form-item class="formButtonbox">
                    <el-button type="warning" size="mini" @click="resetForm('form')">取消</el-button>
                    <el-button type="primary" @click="submitForm('form')" size="mini">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        
    </div>  
</template>

<script>
import page from "../../components/page.vue"
import {timeStamp1,messageTip} from "../../until/index.js"
export default {
    name:'',
    components:{
       page
    },
    data() {
        return {
            href: ManageIndex,
            page_Count:1,
            pageShow:false,
            item_count:0,
            switchValue:false,
            filterValue:"all",
            dialogFormVisible:false,
            form:{
                number:5
            },
            rules:{
                number: [
                    { required: true, message: '请输入数量', trigger: 'blur' },
                    
                ],
            },
            filterOptions:[
                {
                    value:"all",
                    label:"全部"
                },
                {
                    value:"used",
                    label:"已用"
                },
                {
                    value:"available",
                    label:"可用"
                }
            ],
            licenseList:[
                
            ]
            
            
        };
    },
    created(){
       
    },
    watch:{
       
        
    },
    mounted(){
        this.getLicenseList(1)
    },
    methods: {
        pageChangeHandle(currentPageNum){
            this.getLicenseList(currentPageNum)
        },
        applyHandle(){
            this.dialogFormVisible = true
        },
        copySn(index,event){
            let that = this
            let dom = document.getElementById('licenseInput'+index)
            let clipboard
            if(this.switchValue){
                event.target.setAttribute("data-clipboard-target","#license"+index)
                clipboard = new ClipboardJS('.copyBtn');

            }else{
                clipboard = new ClipboardJS('.copyBtn', {
                    text: function() {
                            return dom.value
                        }
                });
            }
            clipboard.on('success', function(e) {
                that.$message({
                    type:"success",
                    message:"复制成功！"
                })
            });
            clipboard.on('error', function(e) {
                that.$message({
                    type:"error",
                    message:"复制出错啦！"
                })
            });

        },
        getLicenseList(num){
            this.$get({
                url:HP1+"/terminal/licenses/list/v1",
                data:{
                    status:this.filterValue,
                    is_paginate:true,
                    pagenum:num
                }
            }).then(res=>{
                if(res.data.code == 200){
                    res.data.info.forEach((item,index)=>{
                        if(item.bind_time){
                            item.bind_time =  timeStamp1(item.bind_time)
                        }else{
                            item.bind_time = ""
                        }
                    })
                    this.licenseList = res.data.info
                    this.page_Count = res.data.page_count
                    this.item_count = res.data.item_count
                    this.pageShow = res.data.page_count > 0 ? true : false
                }else{
                    messageTip("error",this.$t(res.data.message))
                }
                
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.applyDevice()
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.dialogFormVisible  = false
        },
        applyDevice(){
            this.$get({
                url:HP1+"/terminal/licenses/apply/v1",
                data:{
                    count:this.form.number
                }
            }).then(res=>{
                if(res.data.code == 200){
                    this.dialogFormVisible = false
                    messageTip("success",this.$t(res.data.message))
                    this.getLicenseList(1)
                }else{
                    messageTip("error",this.$t(res.data.message))
                }
            })
        },
        handleDel(key){
            this.$confirm("删除许可证，可能会导致关联设备删除", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                    this.deleteHandle(key);
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        deleteHandle(key){
            this.$delete({
                url:HP1+"/terminal/licenses/apply/v1",
                data:{
                    license_key:key
                }
            }).then(res=>{
                if(res.data.code == 200){
                    messageTip("success",this.$t(res.data.message))
                    this.getLicenseList(1)
                }else{
                    messageTip("error",this.$t(res.data.message))
                }
            })
        }
    }
};
</script>
<style>
#licenseDialog .el-input{
    width:200px;
}
.licenseList .el-card__body{
    padding:10px;
}
.licenseList .el-card__header{
    padding:10px 5px;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.licenseList .el-card{
    width:280px;
    float:left;
    margin:0 10px 10px 0;

}
.licenseList  .itemContent{
    font-size:14px;
    line-height:30px;
    height:30px;
}
.switchTxt{
    margin-right:20px;
}
.copyBtn{
    color:#409EFF;
}
.statusBtn{
    padding:0px 3px ;
}
.statusTitle{
    letter-spacing:5px;
}
</style>
