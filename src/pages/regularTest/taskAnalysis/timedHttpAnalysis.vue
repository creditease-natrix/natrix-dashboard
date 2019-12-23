<template>
    <div>
        
        <div v-if="active == 0 ">
            <el-collapse v-model="areaActiveNames">
                <el-collapse-item title="HTTP时延（地域分析）" name="1">
                    <natrixMapChart 
                    :mapChartLoading="packetLossLoading"
                    ref="map"
                    :chart_data="http_packetLoss"
                    :chart_style="this.packetLossRange">
                    </natrixMapChart>
                </el-collapse-item>
                <el-collapse-item title="HTTP解析时间（地域分析）" name="2">
                    <natrixMapChart 
                    :mapChartLoading="parseTimeLoading"
                    ref="map"
                    :chart_data="http_parseTime"
                    :chart_style="this.parseTimeRange"
                    >
                    </natrixMapChart>
                </el-collapse-item>
            </el-collapse>
        </div>
        <div v-if="active == 1 ">
            <el-collapse v-model="areaTimeNames">
                <el-collapse-item title="HTTP时延（时间分析）" name="1">
                    <natrixLineChart 
                    :lineChartLoading="delayLoading"
                    :chart_data="http_delay"></natrixLineChart>
                </el-collapse-item>
                <el-collapse-item title="HTTP异常（时间分析）" name="2">
                    <natrixLineChart 
                    :lineChartLoading="errorLoading"
                    :chart_data="httpError_time"></natrixLineChart>
                </el-collapse-item>
            </el-collapse>
        </div>
        <div v-if="active == 2">
            <el-collapse v-model="areaDefaultNames">
                <el-collapse-item title="HTTP请求结果分布（综合分析）" name="1">
                    <natrixPieChart 
                    :pieChartLoading="requestLoading"
                    :chart_data="http_request"></natrixPieChart>
                </el-collapse-item>
                <el-collapse-item title="HTTP请求阶段分析（综合分析）" name="2">
                    <natrixPieChart 
                    :pieChartLoading="stageLoading"
                    :chart_data="http_stage"></natrixPieChart>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
    
</template>

<script>
import natrixMapChart from "../../../components/natrixMapChart.vue"
import natrixLineChart from "../../../components/natrixLineChart.vue"
import natrixPieChart from "../../../components/natrixPieChart.vue"
import {timeStamp1,messageTip} from "../../../until/index.js"
export default {
    name:'timedHttpAnalysis',
    props:{
        active:{
            type:Number,
            default:0
        },
        taskObj:{
            type:Object,
            required:true
        }
    },
    components:{
        natrixMapChart,
        natrixLineChart,
        natrixPieChart
    },
    data() {

        return {
            packetLossLoading:true,
            parseTimeLoading:true,
            delayLoading:true,
            errorLoading:true,
            requestLoading:true,
            stageLoading:true,
            packetLossRange: {
                data_map: [
                    {min: 10000, level: "critical"},
                    {min: 5000, max: 10000, level: "warning"},
                    {min: 2000, max: 5000, level: "fine"},
                    {max: 2000, level: "excellent"}
                ],
                precision: 2
            },
            parseTimeRange:{
                data_map: [
                    {min: 1000, level: "critical"},
                    {min: 500, max: 1000, level: "warning"},
                    {min: 200, max: 500, level: "fine"},
                    {max: 200, level: "excellent"}
                ],
                precision: 2
            },
            http_packetLoss: {
                title: {
                    text: "HTTP时延（地域分析）"
                },
                name: "总时间(ms)",
                values: []
            },
            areaActiveNames:["1","2"],
            areaTimeNames:["1","2"],
            areaDefaultNames:["1","2"],
            http_parseTime:{
                title: {
                    text: "HTTP解析时间（地域分析）"
                },
                name: "解析时间(ms)",
                values: []
            },
            http_delay:{
                title:{
                    text:"HTTP时延（时间分析）"
                },
                xAxisName: "日期",
                yAxisName: "时间(ms)",
                viewpoints: [
                    {
                        values: [],
                        name: ""
                    }
                ],
                "x-axis": []
            },
            httpError_time:{
                title:{
                    text:"HTTP异常（时间分析）"
                },
                xAxisName: "日期",
                yAxisName: "数量(个)",
                viewpoints: [
                    {
                        values: [],
                        name: ""
                    }
                ],
                "x-axis": [],
                precision:0
            },
            http_request:{
                title: {
                    text: "HTTP请求结果分布",
                },
                values: [],
                precision:0
            },
            http_stage:{
                title: {
                    text: "HTTP请求阶段分析",
                },
                values: []
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
            //         this.getRegionDelay(obj)
            //         this.getRegionParsetime(obj)
            //         break;
            //     case 1 :
            //         this.getTimeRequest(obj)
            //         this.getTimeError(obj)
            //         break;
            //     case 2 :
            //         this.getDefaultResult(obj)
            //         this.getDefaultPercent(obj)
            //         break;
            // }
            this.getRegionDelay(obj)
            this.getRegionParsetime(obj)
            this.getTimeRequest(obj)
            this.getTimeError(obj)
            this.getDefaultResult(obj)
            this.getDefaultPercent(obj)
        },
        getRegionDelay(obj){
            let view_point = "region"
            let chart_name = "request"
            let data  = {...obj,view_point,chart_name}
            this.$get({
                url:HP1+"/benchmark/timed/analyse/v1",
                data:data
            }).then(res=>{
                if(res.data.code == 200){
                    this.packetLossLoading = false
                    this.http_packetLoss.values = res.data.info.values
                }else{
                    messageTip("error",this.$t(res.data.message))
                }
            })
        },
        getRegionParsetime(obj){
            let view_point = "region"
            let chart_name = "parse_time"
            let data  = {...obj,view_point,chart_name}
            this.$get({
                url:HP1+"/benchmark/timed/analyse/v1",
                data:data
            }).then(res=>{
                if(res.data.code == 200){
                    this.parseTimeLoading = false
                    this.http_parseTime.values = res.data.info.values
                }else{
                    messageTip("error",this.$t(res.data.message))
                }
            })
        },
        getTimeRequest(obj){
            let view_point = "time"
            let chart_name = "request"
            let data  = {...obj,view_point,chart_name}
            this.$get({
                url:HP1+"/benchmark/timed/analyse/v1",
                data:data
            }).then(res=>{
                if(res.data.code == 200){
                    this.delayLoading = false
                    let data = res.data.info
                    let data1=  data["x-axis"]
                    let xAxisdata = []
                    data1.forEach((item,index)=>{
                        item = timeStamp1(item);
                        xAxisdata.push(item)
                    })
                    data["x-axis"] = xAxisdata
                    this.http_delay = Object.assign(
                        this.http_delay,data
                    )
                }else{
                    messageTip("error",this.$t(res.data.message))
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
                    this.errorLoading = false
                    let data = res.data.info
                    let data1=  data["x-axis"]
                    let xAxisdata = []
                    data1.forEach((item,index)=>{
                        item = timeStamp1(item);
                        xAxisdata.push(item)
                    })
                    data["x-axis"] = xAxisdata
                    this.httpError_time = Object.assign(
                        this.httpError_time,data
                    )
                }else{
                    messageTip("error",this.$t(res.data.message))
                }
            })
        },
        getDefaultResult(obj){
            let view_point = "comprehensiveness"
            let chart_name = "result_distribution"
            let data  = {...obj,view_point,chart_name}
            this.$get({
                url:HP1+"/benchmark/timed/analyse/v1",
                data:data
            }).then(res=>{
                if(res.data.code == 200){
                    this.requestLoading = false
                    let data = res.data.info
                    this.http_request.values = data.values
                }else{
                    messageTip("error",this.$t(res.data.message))
                }
            })
        },
        getDefaultPercent(obj){
            let view_point = "comprehensiveness"
            let chart_name = "stage_distribution"
            let data  = {...obj,view_point,chart_name}
            this.$get({
                url:HP1+"/benchmark/timed/analyse/v1",
                data:data
            }).then(res=>{
                if(res.data.code == 200){
                   this.stageLoading = false
                   this.http_stage.values = res.data.info.values
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

</style>
<style scoped>
</style>
