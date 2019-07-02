<template>
    <div>
        <div id="nav">
            <span class="title">云拨测——任务分析</span>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <a :href="href" class="home">云拨测<i class="el-breadcrumb__separator el-icon-arrow-right"></i></a>
                <el-breadcrumb-item>定时测</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/timedAnalysis' }">任务分析</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <timedFilter 
        ref="filter" 
        :taskId="task"
        v-on:getdata="getInfoData" 
        v-on:gettaskdata="gettaskParam"></timedFilter>
        <timedTaskInfo :taskInfo="taskInfo"></timedTaskInfo>
        <div id="navBox">
            <timedNav
            :navData="navData" 
            v-on:handle="getValue"
            ref="nav"></timedNav>
        </div>
        <div id="timedContent">
            <timedPingAnalysis 
            v-if="type == 'ping'" 
            :active="active"
            :taskObj="taskObj"
            ref="timedPing"
            >
            </timedPingAnalysis>
            <timedHttpAnalysis 
            v-if="type == 'http'" 
            :active="active"
            :taskObj="taskObj"
            ref="timedHttp"
            >
            </timedHttpAnalysis>
            <timedDnsAnalysis 
            v-if="type == 'dns'" 
            :active="active"
            :taskObj="taskObj"
            ref="timedDns"
            >
            </timedDnsAnalysis>
        </div>
        
    </div>
    
</template>

<script>
import timedFilter from "./components/timedFilter.vue"
import timedTaskInfo from "./components/timedTaskInfo.vue"
import timedNav from "./components/timedNav.vue"
import timedPingAnalysis from "./timedPingAnalysis.vue"
import timedHttpAnalysis from "./timedHttpAnalysis.vue"
import timedDnsAnalysis from "./timedDnsAnalysis.vue"
import {timeStamp1} from "../../../until/index.js"
export default {
    name:'',
    components:{
        timedFilter,
        timedTaskInfo,
        timedNav,
        timedPingAnalysis,
        timedHttpAnalysis,
        timedDnsAnalysis
       
    },
    data() {
        return {
            href: ManageIndex,
            taskInfo:{},
            active:0,
            navData:[
                {
                    name:"地域分析",
                    index:0
                },
                {
                    name:"时间分析",
                    index:1
                },
                {
                    name:"综合分析",
                    index:2
                }
            ],
            type:'',
            taskObj:{},
            task:''
            
        };
    },
    created(){
      
    },
    watch:{
        type:function(newval,oldval){
            if(newval != oldval){
                this.active = 0
                this.$refs.nav.active = this.active
            }
            if(newval != 'dns'){
                
                this.navData = [
                    {
                        name:"地域分析",
                        index:0
                    },
                    {
                        name:"时间分析",
                        index:1
                    },
                    {
                        name:"综合分析",
                        index:2
                    }
                ]
            }else{
                this.navData = [
                    {
                        name:"地域分析",
                        index:0
                    },
                    {
                        name:"时间分析",
                        index:1
                    }
                ]
            }
            
        }
    },
    mounted(){
        if(this.$route.query.taskId){
            this.task = this.$route.query.taskId
            
        }
        
    },
    methods: {
        getValue(index){
            this.active = index

        },
        getInfoData(obj){
            if(JSON.stringify(obj) != "{}"){
                this.type = obj.protocol_type
                this.taskInfo = obj
                this.taskInfo.create_time = timeStamp1(this.taskInfo.create_time)
                
            }
               
        },
        gettaskParam(obj){
            this.taskObj = obj
            this.$nextTick(_=>{
                switch(this.type){
                    case "ping":
                        this.$refs.timedPing.updateInfo(obj)
                        break;
                    case "http":
                        this.$refs.timedHttp.updateInfo(obj)
                        break;
                    case "dns":
                        this.$refs.timedDns.updateInfo(obj)
                        break;

                }
            })
            
        }
    }
    
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
<style scoped>
#navBox{
    margin:10px 0 0 0;
}
#timedContent{
    width:100%;
}
</style>
