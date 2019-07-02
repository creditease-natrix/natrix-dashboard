<template>
    <div class="timedTaskInfo">
        <el-form 
        size="mini"
        label-width="140px" 
        class="demo-ruleForm">
            <el-form-item label="任务名称：" >
                <p>{{taskInfo.name}}</p>
            </el-form-item>
            <div class="clear">
                <el-form-item label="任务状态："  class="fl">
                    <p class="labelItem">{{$t(taskInfo.status)}}</p>
                </el-form-item>
                <el-form-item label="监控地址："  class="fl">
                    <p class="labelItem">{{taskInfo.destination}}</p>
                </el-form-item>
                
            </div>
            <div class="clear">
                <el-form-item label="协议类型："  class="fl">
                    <p class="labelItem">{{taskInfo.protocol_type}}</p>
                </el-form-item>
                <el-form-item label="监控频率："  class="fl">
                    <p class="labelItem">{{taskInfo.frequency}}</p>
                </el-form-item>
                <el-form-item label="创建时间："  class="fl">
                    <p class="labelItem">{{taskInfo.create_time}}</p>
                </el-form-item>
            </div>
            <el-form-item label="任务描述：">
                <p class="description">{{taskInfo.description}}</p>
            </el-form-item>
        </el-form>
    </div>
    
</template>

<script>
export default {
    name:'timedTaskInfo',
    props:{
        taskInfo:{
            type:Object,
            required:true,
            default:{}
        }
    },
    data() {

        return {
            
            
        };
    },
    created(){
       
    },
    watch:{
    },
    mounted(){
    },
    methods: {
       

        
    },
    
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
<style scoped>
.labelItem{
    width:150px;
}
.timedTaskInfo{
    background:#fff;
    padding:5px;
}
.description{
    width:500px;
}
</style>
