<template>
    <div>
        <el-dialog 
        :title="title" 
        :visible.sync="dialogFormVisible">
            <el-form 
            :model="form"
            ref="ruleForm"
            size="mini"
            :rules="rules"
            label-width="80px" 
            >
                <el-form-item label="告警规则">
                    <p>{{alarmName}}</p>
                </el-form-item>
                <el-form-item label="描述" 
                prop="description">
                    <el-input v-model="form.description" type="textarea" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="通知方式" 
                prop="notify_type">
                    <el-select 
                    v-model="form.notify_type" 
                    size="mini"
                    placeholder="请选择通知方式">
                        <el-option label="邮件" value="email"></el-option>
                        <!-- <el-option label="短信" value="sms"></el-option> -->
                    </el-select>
                </el-form-item>
                <el-form-item label="通知用户" prop="users">
                    <el-select 
                    size="mini"
                    multiple
                    collapse-tags
                    v-model="form.users" 
                    placeholder="请选择通知用户">
                        <el-option 
                        :label="item.name" 
                        :value="item.id" 
                        v-for="(item) in usersList" 
                        :key="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="恢复通知" prop="is_recovery">
                    <el-switch
                    v-model="form.is_recovery"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <el-form-item label="通知频率" prop="frequency" id="frequency">
                   <el-input v-model.number="form.frequency" placeholder="请输入频率" size="mini"></el-input>单位：(min)
                </el-form-item>
                <!-- <el-form-item label="通知时间" prop="noticeTime">
                    <el-time-picker
                        is-range
                        value-format="HH:mm"
                        format="HH:mm"
                        v-model="form.noticeTime"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        placeholder="选择时间范围">
                    </el-time-picker>
                </el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer submitBox">
                <el-button @click="dialogFormVisible = false" size="mini" type="warning">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')" size="mini">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {messageTip} from "../../../../until/index.js"
export default {
    name:'noticeDialog',
    props:{
        showDialog:{
            type:Boolean,
            default:false
        },
        alarmId:{
            type:[String,Number],
            required:true
        },
        alarmName:{
            type:String,
            required:true
        },
        notifyId:{
            type:Number
        },
        isEdit:{
            type:Boolean,
            default:false
        }
    },
    data() {

        return {
            dialogFormVisible:this.showDialog,
            title:"添加通知",
            // dialogFormVisible:true,
            usersList:[],
            // time:[new Date(2019, 9, 10, 0, 0), new Date(2019, 9, 10, 23, 59)],
            form:{
                description:"",
                notify_type:"email",
                is_recovery:true,
                users:[],
                frequency:10,
                noticeTime:["00:00","23:59"],
                start_time:"",
                end_time:""
            },
            isEditValue:false,
            rules:{
                notify_type: [
                    { required: true, message: '请选择通知方式', trigger: 'change' }
                ],  
                users:[
                    { required: true, message: '请选择通知用户', trigger: 'change' }
                ],
                frequency:[
                    { required: true, message: '请输入通知频率', trigger: 'blur' }
                ],
                noticeTime:[
                    { required: true, message: '请选择通知时间', trigger: 'change' }
                ]
            }

        };
    },
    created(){
       
    },
    watch:{
        
    },
    mounted(){
        this.getUserList()
    },
    methods: {
        getUserList(){
            this.$get({
                url:HP1+"/rbac/api/colleagues/v1",
                data:{

                }
            }).then(res=>{
                if(res.data.code == 200){
                    this.usersList = res.data.colleagures
                }
            })
        },
        addNotice(){
            let alarm_id = this.alarmId
            
            let data = {
                ...this.form,
                alarm_id:alarm_id,
                start_time:this.form.noticeTime[0],
                end_time:this.form.noticeTime[1]
            }
            this.$post({
                url:HP1+"/sentinel/alarm/notify/v1",
                data:data
            }).then(res=>{
                if(res.data.code == 200){
                    this.dialogFormVisible = false
                    this.$emit("updateList")
                }else{
                    this.dialogFormVisible = true
                    messageTip("error",this.$t(res.data.message))
                }

            })
        },
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.isEditValue){
                        this.editNotice()
                    }else{
                        this.addNotice()
                    }
                } else {
                    return false;
                }
            });
        },
        editNotice(){
            let data = {
                ...this.form,
                notify_id:this.notifyId,
                start_time:this.form.noticeTime[0],
                end_time:this.form.noticeTime[1]
            }
            this.$put({
                url:HP1+"/sentinel/alarm/notify/v1",
                data:data
            }).then(res=>{
                if(res.data.code == 200){
                    this.dialogFormVisible = false
                    this.$emit("updateList")
                    messageTip("success",this.$t(res.data.message))
                }else{
                    this.dialogFormVisible = true
                    messageTip("error",this.$t(res.data.message))
                }
            })
        },
        getNoticeInfo(notifyId){
            this.$get({
                url:HP1+"/sentinel/alarm/notify/v1",
                data:{
                   alarm_id:this.alarmId, 
                   notify_id:notifyId
                }
            }).then(res=>{
                if(res.data.code == 200){
                    this.form = {...res.data.info}
                    this.form.users = []
                    this.form.noticeTime = [this.form.start_time,this.form.end_time]
                    res.data.info.users.forEach((item,index)=>{
                        this.form.users.push(item.user_id)
                    })
                    
                }
            })
        }
        
    }
    
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#frequency .el-input{
    width:100px;
}
</style>
<style scoped>
@import "../../../../../static/css/resetEle.css";

</style>
