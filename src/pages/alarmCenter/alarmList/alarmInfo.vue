<template>
    <div>
        <div id="nav">
            <span class="title">云拨测——告警详情</span>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <a :href="href" class="home">云拨测<i class="el-breadcrumb__separator el-icon-arrow-right"></i></a>
                <el-breadcrumb-item :to="{path:''}">告警中心</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/alarmList' }">告警列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form 
        :model="ruleForm" 
        size="mini"
        ref="ruleForm" 
        label-width="140px" 
        class="demo-ruleForm">
            <el-form-item label="告警名称" prop="">
                <p>{{ruleForm.name}}</p>
            </el-form-item>
            <el-form-item label="告警描述" prop="description">
                <p>{{ruleForm.description}}</p>
            </el-form-item>
            <el-form-item label="任务选择" prop="" >
                <p>{{ruleForm.task_name}}</p>
            </el-form-item>
            <el-form-item label="任务描述">
                <p>{{ruleForm.task_description}}</p>
            </el-form-item>
            <el-form-item label="指标项">
                <p>{{$t(ruleForm.monitor_type)}}</p>
            </el-form-item>
            <div class="clear judge">
                <el-form-item label="判断操作" class="fl">
                    <p>{{$t(ruleForm.operation)}}</p>
                </el-form-item>
                <el-form-item label="阈值" class="fl">
                    <p>{{ruleForm.threshold}}</p>
                </el-form-item>
            </div>
            <div class="clear judge">
                <el-form-item label="聚合条件" class="fl">
                    <p>{{$t(ruleForm.aggregation_type)}}</p>
                </el-form-item>
                <el-form-item label="监控点数量≥" class="fl">
                    <p>{{ruleForm.aggregation_condition}}</p>
                </el-form-item>
            </div>
            
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
            ruleForm:{
                name:"",
                description:"",
                task_description:"",
                protocolType:"all",
                task_name:"",
                monitor_type:"",
                operation:"",
                threshold:0,
                aggregation_type:"",
                aggregation_conditon:"",

            }
        };
    },
    created(){
       
    },
    watch:{
    },
    mounted(){
        this.getAlarmInfo()
    },
    methods: {
        getAlarmInfo(id){
            this.$get({
                url:HP1+"/sentinel/alarm/v1",
                data:{
                    alarm_id:this.$route.query.alarmId
                }
            }).then(res=>{
                if(res.data.code == 200){
                    this.ruleForm = {...res.data.info}
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
.judge .el-form-item{
    width:300px;
}
.el-breadcrumb__item:last-child .el-breadcrumb__inner:hover{
    cursor:pointer!important;
}
</style>
<style scoped>
@import "../../../../static/css/resetEle.css";
</style>
