<template>
    <div>
        <div v-if="active == 0 ">
            <el-collapse v-model="areaNames">
                <el-collapse-item title="DNS解析时间（地域分析）" name="1">
                    <natrixMapChart 
                    :mapChartLoading="parsetimeAreaLoading"
                    ref="map"
                    :chart_data="dns_parsetime_area"
                    :chart_style="this.packetLossRange">
                    </natrixMapChart>
                </el-collapse-item>
                <el-collapse-item title="解析地址地域分布（地域分析）" name="2">
                    <natrixPieChart 
                    :pieChartLoading="areadataLoading"
                    :chart_data="dns_areadata">
                    </natrixPieChart>
                </el-collapse-item>
            </el-collapse>
        </div>
        <div v-if="active == 1 ">
            <el-collapse v-model="timeNames">
                <el-collapse-item title="DNS解析（时间分析）" name="1">
                    <natrixLineChart 
                    :lineChartLoading="parsetimeLoading"
                    :chart_data="dns_parsetime_time"></natrixLineChart>
                </el-collapse-item>
                <el-collapse-item title="DNS异常（时间分析）" name="2">
                    <natrixLineChart
                    :lineChartLoading="errortimeLoading"
                    :chart_data="dns_errortime"></natrixLineChart>
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
    name:'timedDnsAnalysis',
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
            parsetimeAreaLoading:true,
            areadataLoading:true,
            parsetimeLoading:true,
            errortimeLoading:true,
            dns_parsetime_area:{
                title: {
                    text: "DNS解析时间（地域分析）"
                },
                name: "解析时间(ms)",
                values: []
            },
            packetLossRange: {
                data_map: [
                    {min: 1000, level: "critical"},
                    {min:500, max: 1000, level: "warning"},
                    {min: 200, max: 500, level: "fine"},
                    {max: 200, level: "excellent"}
                ],
                precision: 2
            },
            dns_areadata:{
                title: {
                    text: "解析地址地域分布",
                },
                values: []
            },
            areaNames:["1","2"],
            timeNames:["1","2"],
            dns_parsetime_time:{
                title:{
                    text:"DNS解析（时间分析）"
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
            dns_errortime:{
                title:{
                    text:"DNS异常（时间分析）"
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
            taskInfo:{}
            
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
            this.getRegionParsetime(obj)
            this.getRegionDistribute(obj)
            this.getTimeParsetime(obj)
            this.getTimeError(obj)
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
                    this.parsetimeAreaLoading = false
                    this.dns_parsetime_area.values = res.data.info.values
                }else{
                    messageTip("error",this.$t(res.data.message))
                }
            })
        },
        getRegionDistribute(obj){
            let view_point = "region"
            let chart_name = "parse_result"
            let data  = {...obj,view_point,chart_name}
            this.$get({
                url:HP1+"/benchmark/timed/analyse/v1",
                data:data
            }).then(res=>{
                if(res.data.code == 200){
                    this.areadataLoading = false
                    this.dns_areadata.values = res.data.info.values
                }else{
                    messageTip("error",this.$t(res.data.message))
                }
            })
        },
        getTimeParsetime(obj){
            let view_point = "time"
            let chart_name = "parse_time"
            let data  = {...obj,view_point,chart_name}
            this.$get({
                url:HP1+"/benchmark/timed/analyse/v1",
                data:data
            }).then(res=>{
                if(res.data.code == 200){
                    this.parsetimeLoading = false
                    let data = res.data.info
                    let data1=  data["x-axis"]
                    let xAxisdata = []
                    data1.forEach((item,index)=>{
                        item = timeStamp1(item);
                        xAxisdata.push(item)
                    })
                    data["x-axis"] = xAxisdata
                    this.dns_parsetime_time = Object.assign(
                        this.dns_parsetime_time,data
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
                    this.errortimeLoading = false
                    let data = res.data.info
                    let data1=  data["x-axis"]
                    let xAxisdata = []
                    data1.forEach((item,index)=>{
                        item = timeStamp1(item);
                        xAxisdata.push(item)
                    })
                    data["x-axis"] = xAxisdata
                    this.dns_errortime = Object.assign(
                        this.dns_errortime,data
                    )
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
