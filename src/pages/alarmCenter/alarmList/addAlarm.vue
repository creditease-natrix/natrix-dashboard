<template>
    <div>
        <div id="nav">
            <span class="title">云拨测——添加告警</span>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <a :href="href" class="home">云拨测<i class="el-breadcrumb__separator el-icon-arrow-right"></i></a>
                <el-breadcrumb-item :to="{path:''}">告警中心</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/alarmList' }">告警列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form 
        :model="ruleForm" 
        :rules="rules" 
        size="mini"
        ref="ruleForm" 
        label-width="140px" 
        class="demo-ruleForm">
            <el-form-item label="告警名称" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="告警描述" prop="description">
                <el-input  type="textarea" v-model="ruleForm.description"></el-input>
            </el-form-item>
            <el-form-item label="协议类型" prop="protocolType">
                <el-select 
                @change="getTaskList"
                v-model="protocolType" 
                placeholder="请选择请求方式">
                    <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="任务选择" prop="task_id" >
                <el-select 
                v-model="ruleForm.task_id" 
                @change="getMonitorList(),getTaskDescription()"
                placeholder="请选择任务">
                    <el-option 
                    :label="item.name" 
                    :value="item.id" 
                    v-for="(item) in taskList" 
                    :key="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="任务描述">
                <p>{{task_description}}</p>
            </el-form-item>
            <el-form-item label="指标项" prop="monitor_type">
                <el-select 
                @change="showConditionHandle"
                v-model="ruleForm.monitor_type"
                >
                    <el-option 
                    :label="$t(item.name)" 
                    :value="item.value" 
                    v-for="(item) in monitorTypeList" 
                    :key="item.value"></el-option>
                </el-select>
            </el-form-item>
            <div class="clear judge" v-if="is_condition">
                <el-form-item label="判断操作" class="fl" prop="operation">
                    <el-select v-model="ruleForm.operation">
                        <el-option label="大于" value="gt"></el-option>
                        <el-option label="小于" value="lt"></el-option>
                        <el-option label="等于" value="eq"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="阈值" class="fl threshold" prop="threshold">
                    <el-input  type="text" v-model.number="ruleForm.threshold"></el-input>
                    <span class="unit">{{threshold_desc}}</span>
                </el-form-item>
            </div>
            <div class="clear judge" v-if="showAggregation">
                <el-form-item label="聚合条件" class="fl" prop="aggregation_type" >
                    <el-select v-model="ruleForm.aggregation_type">
                        <el-option 
                        :label="$t(item)" 
                        :value="item" 
                        :key="index"
                        v-for="(item,index) in agg_types">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="监控点数量≥" class="fl" prop="aggregation_condition" v-if="ruleForm.aggregation_type == 'individuality'">
                    <el-input  type="text" v-model.number="ruleForm.aggregation_condition"></el-input>
                </el-form-item>
            </div>
            <el-form-item class="formButtonbox">
                <el-button @click="resetForm('ruleForm')" size="mini" type="warning">取消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')" size="mini">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

import {timeStamp1,messageTip} from "../../../until/index.js"
export default {
    name:'',
    components:{
    },
    data() {

        return {
            href: ManageIndex,
            task_description:"",
            is_condition:false,
            showAggregation:false,//是否显示聚合条件
            protocolType:"all",
            agg_types:[

            ],
            ruleForm:{
                name:"",
                description:"",
                task_id:"",
                monitor_type:"",
                operation:"gt",
                threshold:0,
                aggregation_type:"average",
                aggregation_condition:null,
                threshold_desc:''
            },
            monitorTypeList:[], 
            taskList:[],           
            rules:{
                name: [
                    { required: true, message: '请输入告警名称', trigger: 'blur' },
                    { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
                ],  
                
                task_id:[
                    { required: true, message: '请选择任务', trigger: 'change' }
                ],
                monitor_type:[
                    { required: true, message: '请选择指标项', trigger: 'change' }
                ],
                operation:[
                    { required: true, message: '请选择操作', trigger: 'change' }
                ],
                threshold:[
                    { required: true, message: '请输入阈值', trigger: 'blur' },
                    { type: 'number', min:0, message: '阈值必须大于等于0'}
                ],
                aggregation_type:[
                    { required: true, message: '请选择聚合条件', trigger: 'change' }
                ],
                aggregation_conditon:[
                    { required: true, message: '请输入聚合阈值', trigger: 'blur' },
                    { type: 'number', min:0, message: '聚合阈值必须大于等于0'}
                ]



            },
            typeOptions: [
                {
                    value: "all",
                    label: "全部"
                },
                {
                    value: "ping",
                    label: "PING"
                },
                {
                    value: "http",
                    label: "HTTP"
                },
                {
                    value: "dns",
                    label: "DNS"
                }
            ]
        };
    },
    created(){
       
    },
    watch:{
    },
    mounted(){
        this.getTaskList()
    },
    methods: {
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addForm()
                    
                } else {
                    return false;
                }
            });
        },
        resetForm(formName){
            // this.$refs[formName].resetFields();
            window.history.go(-1)
        },
        addForm(){

            let data  
            if(!this.is_condition){
                data = {
                    ...this.ruleForm,
                    operation:null,
                    threshold:null,
                }
            }else if(!this.showAggregation){
                data = {
                    ...this.ruleForm,
                    aggregation_type:null,
                    aggregation_condition:null
                }
            }else {
                
                data = {...this.ruleForm}
                
            }

            this.$post({
                url:HP1+"/sentinel/alarm/v1",
                data:data
            }).then(res=>{
                if(res.data.code == 200){
                    this.$router.push({
                        path:"alarmList"
                    })
                }else{
                    messageTip("error",res.data.message)
                    
                }
            })
        },
        getMonitorList(){
            let protocolType
            this.taskList.forEach((item,index)=>{
                if(this.ruleForm.task_id == item.id){
                    protocolType = item.protocol
                    return false
                } 
            })
            this.$get({
                url:HP1+"/sentinel/monitor/list/v1",
                data:{
                    protocol_type:protocolType
                }
            }).then(res=>{
                if(res.data.code == 200){
                    this.monitorTypeList = res.data.info
                    if(this.monitorTypeList.length >= 1){
                        this.ruleForm.monitor_type = this.monitorTypeList[0].value
                        this.is_condition = this.monitorTypeList[0].is_condition
                        this.showAggregation = this.monitorTypeList[0].is_agg
                        this.agg_types = this.monitorTypeList[0].agg_types
                        this.ruleForm.aggregation_type = this.agg_types[0]
                    }
                    this.monitorTypeList.forEach((item,index)=>{
                        if(item.value == this.ruleForm.monitor_type){
                            this.threshold_desc = item.threshold_desc
                        }
                    })
                    
                }else{
                    messageTip("error",res.data.message)
                }
            })
        },
        getTaskList(){
            this.$get({
                url:HP1+"/benchmark/timed/task/select/v1",
                data:{
                    protocol_type:this.protocolType
                }
            }).then(res=>{
                if(res.data.code == 200){
                    this.taskList = res.data.info
                    if(this.taskList.length >= 1){
                        this.ruleForm.task_id = this.taskList[0].id
                        this.task_description = this.taskList[0].description
                        this.getMonitorList()
                    }
                    
                }else{
                     messageTip("error",res.data.message)
                }
            })
        },
        getTaskDescription(){
            this.taskList.forEach((item,index)=>{
                if(item.id == this.ruleForm.task_id){
                    this.task_description = item.description
                    return false
                }

            })
        },
        showConditionHandle(){
            this.monitorTypeList.forEach((item,index)=>{
                if(item.value == this.ruleForm.monitor_type){
                    this.showAggregation = item.is_agg
                    this.is_condition = item.is_condition
                    this.agg_types = item.agg_types
                    this.ruleForm.aggregation_type = this.agg_types[0]
                    this.threshold_desc = item.threshold_desc
                }
            })
        }
        
    }
    
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.el-breadcrumb__item:last-child .el-breadcrumb__inner:hover{
    cursor:pointer!important;
}
.judge .threshold{
    width:500px;
}
</style>
<style scoped>
@import "../../../../static/css/resetEle.css";
.judge .el-input{
    width:200px;
}
.unit{
    color:#409EFF;
}
</style>
