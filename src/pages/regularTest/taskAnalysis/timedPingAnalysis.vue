<template>
    <div>
        <div v-if="active == 0 ">
            <el-collapse v-model="areaActiveNames">
                <el-collapse-item title="PING丢包（地域分析）" name="1">
                    <natrixMapChart 
                    v-loading="packetLossLoading"
                    element-loading-text="加载中"
                    element-loading-spinner="el-icon-loading"
                    ref="map"
                    :chart_data="ping_packetLoss"
                    :chart_style="this.packetLossRange">
                    </natrixMapChart>
                </el-collapse-item>
                <el-collapse-item title="ping时延（地域分析）" name="2">
                    <natrixMapChart 
                    v-loading="delayLoading"
                    element-loading-text="加载中"
                    element-loading-spinner="el-icon-loading"
                    ref="map"
                    :chart_data="ping_Delay"
                    :chart_style="this.pingDelayRange">
                    </natrixMapChart>
                </el-collapse-item>
            </el-collapse>
        </div>
        <div v-if="active == 1 ">
            <el-collapse v-model="areaTimeNames">
                <el-collapse-item title="PING丢包（时间分析）" name="1">
                    <natrixLineChart 
                    v-loading="packetLossTimeLoading"
                    element-loading-text="加载中"
                    element-loading-spinner="el-icon-loading"
                    :chart_data="ping_packetLossTime">
                    </natrixLineChart>
                </el-collapse-item>
                <el-collapse-item title="ping时延（时间分析）" name="2">
                    <natrixLineChart
                    v-loading="delayTimeLoading"
                    element-loading-text="加载中"
                    element-loading-spinner="el-icon-loading" 
                    :chart_data="ping_DelayTime">
                    </natrixLineChart>
                </el-collapse-item>
                <el-collapse-item title="ping异常（时间分析）" name="3">
                    <natrixLineChart 
                    v-loading="errorTimeLoading"
                    element-loading-text="加载中"
                    element-loading-spinner="el-icon-loading"
                    :chart_data="ping_ErrorTime"></natrixLineChart>
                </el-collapse-item>
            </el-collapse>
        </div>
        <div v-if="active == 2">
            <el-collapse v-model="areaNames">
                <el-collapse-item title="PING时延分布（综合分析）" name="1">
                    <natrixLineChart 
                    v-loading="defaultLoading"
                    element-loading-text="加载中"
                    element-loading-spinner="el-icon-loading"
                    :chart_data="ping_DefaultData"></natrixLineChart>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
    
</template>

<script>

import natrixMapChart from "../../../components/natrixMapChart.vue"
import natrixLineChart from "../../../components/natrixLineChart.vue"
import {timeStamp1} from "../../../until/index.js"
export default {
    name:'timedPingAnalysis',
    props:{
        active:{
            type:Number,
            required:true,
            default:0
        },
        taskObj:{
            type:Object,
            required:true
        }
        
    },
    components:{
        natrixMapChart,
        natrixLineChart
    },
    data() {
        return {
            packetLossLoading:true,
            delayLoading:true,
            packetLossTimeLoading:true,
            delayTimeLoading:true,
            errorTimeLoading:true,
            defaultLoading:true,
            areaActiveNames: ["1", "2"],
            areaTimeNames:["1","2","3"],
            areaNames:["1"],
            packetLossRange: {
                data_map: [
                    {min: 10, level: "critical"},
                    {min: 0.5, max: 10, level: "warning"},
                    {min: 0, max: 0.5, level: "fine"},
                    {max: 0, level: "excellent"}
                ],
                precision: 2
            },
            ping_packetLoss: {
                title: {
                    text: "PING丢包率（地域分析）"
                },
                name: "丢包率",
                values: []
            },
            pingDelayRange: {
                data_map: [
                    {min: 500, level: "critical"},
                    {min: 100, max: 500, level: "warning"},
                    {min: 50, max: 100, level: "fine"},
                    {max: 50, level: "excellent"}
                ],
                precision: 2
            },
            ping_Delay: {
                title: {
                    text: "PING延时（地域分析）"
                },
                name: "平均时间",
                values: []
            },
            ping_packetLossTime:{
                title:{
                    text:"PING丢包率（时间分析）"
                },
                xAxisName: "日期",
                yAxisName: "丢包率(%)",
                viewpoints: [
                    {
                        values: [],
                        name: ""
                    }
                ],
                "x-axis": []
            },
            ping_DelayTime:{
                title:{
                    text:"PING时延（时间分析）"
                },
                xAxisName: "日期",
                yAxisName: "时间(ms)",
                viewpoints: [
                    {
                        values: [],
                        name: ""
                    }
                ],
                "x-axis": [],
                dataZoom:true,//是否增加浮标
                stack:true//是否堆叠
            },
            ping_ErrorTime:{
                title:{
                    text:"PING异常（时间分析）"
                },
                xAxisName: "日期",
                yAxisName: "数量(个)",
                viewpoints: [
                    {
                        values: [],
                        name: ""
                    }
                ],
                "x-axis": []
            },
            ping_DefaultData:{
                title:{
                    text:"PING时延分布"
                },
                xAxisName: "日期",
                yAxisName: "数量(个)",
                viewpoints: [
                    {
                        values: [],
                        name: ""
                    }
                ],
                "x-axis": []
            }
        };
    },
    created(){
       
    },
    watch:{
        
    },
    mounted(){
       
    },
    methods: {
        updateInfo(obj){
            // switch(this.active){
            //     case 0 :
            //         this.getRegionPacketloss(obj)
            //         this.getRegionDelay(obj)
            //         break;
            //     case 1 :
            //         this.getTimePacketloss(obj)
            //         this.getTimeDelay(obj)
            //         this.getTimeError(obj)
            //         break;
            //     case 2 :
            //         this.getDefaultDelay(obj)
            //         break;
            // }
            this.getRegionPacketloss(obj)
            this.getRegionDelay(obj)
            this.getTimePacketloss(obj)
            this.getTimeDelay(obj)
            this.getTimeError(obj)
            this.getDefaultDelay(obj)
            
            
        },
        getRegionPacketloss(obj){
            let view_point = "region"
            let chart_name = "packet_loss"
            let data  = {...obj,view_point,chart_name}
            return this.$get({
                url:HP1+"/benchmark/timed/analyse/v1",
                data:data
            }).then(res=>{
                
                if(res.data.code == 200){
                    this.packetLossLoading = false
                    this.ping_packetLoss.values = res.data.info.values
                }
            })
        },
        getRegionDelay(obj){
            let view_point = "region"
            let chart_name = "delay"
            let data  = {...obj,view_point,chart_name}
            this.$get({
                url:HP1+"/benchmark/timed/analyse/v1",
                data:data
            }).then(res=>{
                
                if(res.data.code == 200){
                    this.delayLoading = false
                    this.ping_Delay.values = res.data.info.values
                }
            })
        },
        getTimePacketloss(obj){
            let view_point = "time"
            let chart_name = "packet_loss"
            let data  = {...obj,view_point,chart_name}
            this.$get({
                url:HP1+"/benchmark/timed/analyse/v1",
                data:data
            }).then(res=>{
                if(res.data.code == 200){
                    this.packetLossTimeLoading = false
                    let data = res.data.info
                    let data1=  data["x-axis"]
                    let xAxisdata = []
                    data1.forEach((item,index)=>{
                        item = timeStamp1(item);
                        xAxisdata.push(item)
                    })
                    data["x-axis"] = xAxisdata
                    this.ping_packetLossTime = Object.assign(this.ping_packetLossTime,data)
                }
                
            })
        },
        getTimeDelay(obj){
            let view_point = "time"
            let chart_name = "delay"
            let data  = {...obj,view_point,chart_name}
            this.$get({
                url:HP1+"/benchmark/timed/analyse/v1",
                data:data
            }).then(res=>{
                if(res.data.code == 200){
                    this.delayTimeLoading = false
                    let data = res.data.info
                    let data1=  data["x-axis"]
                    let xAxisdata = []
                    data1.forEach((item,index)=>{
                        item = timeStamp1(item);
                        xAxisdata.push(item)
                    })
                    data["x-axis"] = xAxisdata
                    this.ping_DelayTime = Object.assign(this.ping_DelayTime,data)
                    
                }
            })
        },
        getTimeError(obj){
            let view_point = "time"
            let chart_name = "exception"
            let data  = {...obj,view_point,chart_name}
            this.$get({
                url:HP1+"/benchmark/timed/analyse/v1",
                data:data
            }).then(res=>{
                if(res.data.code == 200){
                    this.errorTimeLoading = false
                    let data = res.data.info
                    let data1=  data["x-axis"]
                    let xAxisdata = []
                    data1.forEach((item,index)=>{
                        item = timeStamp1(item);
                        xAxisdata.push(item)
                    })
                    data["x-axis"] = xAxisdata
                    this.ping_ErrorTime = Object.assign(
                        this.ping_ErrorTime,data
                    )
                    
                }
            })
        },
        getDefaultDelay(obj){
            let view_point = "comprehensiveness"
            let chart_name = "delay"
            let data  = {...obj,view_point,chart_name}
            this.$get({
                url:HP1+"/benchmark/timed/analyse/v1",
                data:data
            }).then(res=>{
                if(res.data.code == 200){
                    this.defaultLoading = false
                    let data = res.data.info
                    this.ping_DefaultData = Object.assign(
                        this.ping_DefaultData,data
                    )
                    
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
</style>
