<template>
    <div>
        <div id="nav">
            <span class="title">云拨测——即时测</span>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <a :href="href" class="home">云拨测<i class="el-breadcrumb__separator el-icon-arrow-right"></i></a>
                <el-breadcrumb-item :to="{ path: '/pingAnalysis' }">即时测</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
       <instantNav :active="1"></instantNav>
       <searchBox :active="'HTTP'" v-on:getTaskStatusHandle="getTaskInfo"></searchBox>
       <div class="pingContent">
            <div class="pingNavBox">
                <ul class="pingNav clear">
                    <li 
                    v-for="(item,index) in navData" 
                    class="cursor"
                    @click="tabClick(index)"
                    v-bind:class="{active: active == index}"
                    :key="index">
                        {{item.name}}
                    </li>
                </ul>
            </div>
            
            <div id="areaContent" v-if="active == 0">
                <el-collapse v-model="areaActiveNames" @change="handleChange">
                    <el-collapse-item title="HTTP时延（地域分析）" name="1">
                        <natrixMapChart 
                        :chart_data="delayRegionData"
                        :chart_style="parseTimeRange"
                        >
                        </natrixMapChart>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <div id="organizationContent" v-if="active == -1">
                <el-collapse v-model="organizationActiveNames" @change="handleChange">
                    <el-collapse-item title="HTTP时延（组织分析）" name="1">
                        <natrixLineChart :chart_data="organization_delayData"></natrixLineChart>
                    </el-collapse-item>
                    <el-collapse-item title="HTTP时间段分布（组织分析）" name="2">
                        <natrixLineChart :chart_data="organization_distributionData"></natrixLineChart>
                    </el-collapse-item>
                    
                </el-collapse>
            </div>
            <div id="multibleContent" v-if="active == 1">
                <el-collapse v-model="resultActiveNames" @change="handleChange">
                    <el-collapse-item title="请求结果分布（组织分析）" name="1">
                        <natrixPieChart :chart_data="organization_resultData"></natrixPieChart>
                    </el-collapse-item>
                    <el-collapse-item title="连接性能分布（组织分析）" name="2">
                        <natrixPieChart :chart_data="organization_performanceData"></natrixPieChart>
                    </el-collapse-item>
                    
                </el-collapse>
            </div>
            <div id="detailContent" v-if="active == 2">
                <el-collapse v-model="activeNames" @change="handleChange">
                    <el-collapse-item  name="1">
                        <template slot="title">
                            HTTP错误信息<span>（条数{{errorData.length}}）</span>
                        </template>
                        <errorinfoTable :tableData="errorData"></errorinfoTable>
                    </el-collapse-item>
                    <el-collapse-item  name="2">
                        <template slot="title">
                            HTTP错误状态码检测详细信息<span>（条数{{tableData1.length}}）</span>
                        </template>
                        <el-table
                            :data="tableData1"
                            border
                            :fit="true"
                            style="width: 100%,margin-top:50px;">
                            <el-table-column
                            prop="terminal"
                            width="125"
                            label="终端"
                            >
                            </el-table-column>
                            <el-table-column
                            prop="name"
                            width="125"
                            label="组织"
                            >
                            </el-table-column>
                            <el-table-column
                            prop="province"
                            label="省份"
                            width="100">
                            </el-table-column>
                            <el-table-column
                            prop="city"
                            width="100"
                            label="市">
                            </el-table-column>
                            <el-table-column
                            prop="operator"
                            width="80"
                            label="运营商">
                            </el-table-column>
                            <el-table-column
                            prop="status_code"
                            width="80"
                            label="状态码">
                            </el-table-column>
                            <el-table-column
                            prop="total_time"
                            
                            label="总时间">
                            </el-table-column>
                            <el-table-column
                            prop="period_nslookup"
                            width="60"
                            label="解析时间">
                            </el-table-column>
                            <el-table-column
                            prop="period_tcp_connect"
                            width="60"
                            label="tcp连接耗时">
                            </el-table-column>
                            <el-table-column
                            prop="period_request"
                            width="60"
                            label="请求耗时">
                            </el-table-column>
                            <el-table-column
                            prop="period_response"
                            width="60"
                            label="响应处理耗时">
                            </el-table-column>
                            <el-table-column
                            prop="size_download"
                            width="60"
                            label="下载数量">
                            </el-table-column>
                            <!-- <el-table-column
                            label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                    size="mini"
                                    type="info"
                                    @click="handleInfo(scope.$index, scope.row)">详细</el-button>
                                </template>
                            </el-table-column> -->
                        </el-table>
                    </el-collapse-item>
                    <el-collapse-item  name="3">
                        <template slot="title">
                            HTTP检测详细信息<span>（条数{{tableData.length}}）</span>
                        </template>
                        <el-table
                            :data="tableData"
                            border
                            style="width: 100%,margin-top:50px;">
                            <el-table-column
                            prop="terminal"
                            width="125"
                            label="终端"
                            >
                            </el-table-column>
                            <el-table-column
                            width="125"
                            label="组织"
                            >
                                <template slot-scope="scope">
                                    <div 
                                    v-for="(item,index) in scope.row.organizations" 
                                    :key="index">
                                        <el-popover trigger="hover" placement="top">
                                            <p>名称: {{ item }}</p>
                                            <div slot="reference" class="name-wrapper">
                                                <el-tag size="medium" class="tag">{{ item }}</el-tag>
                                            </div>
                                        </el-popover> 
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                            prop="province"
                            label="省份"
                            width="100">
                            </el-table-column>
                            <el-table-column
                            prop="city"
                            width="100"
                            label="市">
                            </el-table-column>
                            <el-table-column
                            prop="operator"
                            width="80"
                            label="运营商">
                            </el-table-column>
                            <el-table-column
                            prop="status_code"
                            width="80"
                            label="状态码">
                            </el-table-column>
                            <el-table-column
                            prop="total_time"
                            label="总时间">
                            </el-table-column>
                            <el-table-column
                            prop="period_nslookup"
                            width="60"
                            label="解析时间">
                            </el-table-column>
                            <el-table-column
                            prop="period_tcp_connect"
                            width="60"
                            label="tcp连接耗时">
                            </el-table-column>
                            <el-table-column
                            prop="period_request"
                            width="60"
                            label="请求耗时">
                            </el-table-column>
                            <el-table-column
                            prop="period_response"
                            width="60"
                            label="响应处理耗时">
                            </el-table-column>
                            <el-table-column
                            prop="size_download"
                            width="60"
                            label="下载数量">
                            </el-table-column>
                            <!-- <el-table-column
                            label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                    size="mini"
                                    type="info"
                                    @click="handleInfo(scope.$index, scope.row)">详细</el-button>
                                </template>
                            </el-table-column> -->
                        </el-table>
                    </el-collapse-item>
                   
                    
                </el-collapse>

            </div>
       </div>
       
       
       
        
    </div>
    
</template>

<script>
import instantNav from '../../../components/instantNav.vue'
import searchBox from '../components/searchBox.vue'
import errorinfoTable from "../components/errorinfoTable.vue"
import natrixMapChart from "../../../components/natrixMapChart.vue"
import natrixLineChart from "../../../components/natrixLineChart.vue"
import natrixPieChart from "../../../components/natrixPieChart.vue"
import {intercept ,messageTip} from "../../../until/index.js"


export default {
    name:'',
    components:{
       instantNav,
       searchBox,
       errorinfoTable,
       natrixMapChart,
       natrixLineChart,
       natrixPieChart
    },
    data() {

        return {
            href:ManageIndex,
            active:0,
            navData:[
                {
                    name:'地域分析',
                    index:0
                },
                // {
                //     name:'组织分析',
                //     index:1
                // },
                {
                    name:'综合分析',
                    index:1
                },
                {
                    name:'详细信息',
                    index:2
                },
                
            ],
            areaActiveNames:['1'],
            organizationActiveNames:['1','2'],
            resultActiveNames:['1','2'],
            areaCharts:[],//地域分析
            orgaCharts:[],//组织分析
            multibleCharts:[],//综合分析
            width:0,
            height:0,
            activeNames:['1','2'],
            tableData:[],
            tableData1:[],
            errorData:[],
            // taskId:"aec6a8b5-4d68-4efc-b549-194a4ae34211",
            taskId:null,
            finished:true,
            timer:null,
            delayRegionData:{
                title: {
                    text: "HTTP请求（地域分析）"
                },
                name:'总时间',
                values: []
            },
            parseTimeRange: {
                data_map: [
                    {min: 10000, level: "critical"},
                    {min: 5000, max: 10000, level: "warning"},
                    {min: 2000, max: 5000, level: "fine"},
                    {max: 2000, level: "excellent"}
                ],
                precision: 2
            },
            organization_delayData:{
                title:{
                    text:"HTTP延时（组织分析）"
                },
                xAxisName:"职场名称",
                yAxisName:"时间(ms)",
                viewpoints:[{
                    values:[],
                    name:''
                }],
                "x-axis":[]
            },
            organization_distributionData:{
                title:{
                    text:"HTTP请求时间段分布"
                },
                xAxisName:"时间段(ms)",
                yAxisName:"数量",
                viewpoints:[{
                    values:[],
                    name:''
                }],
                "x-axis":[]
            },
            organization_resultData:{
                title: {
                    text: "HTTP请求结果分布",
                },
                values: []
            },
            organization_performanceData:{
                title: {
                    text: "HTTP连接性能分布",
                },
                values: []
            },
            precision:2
            
        };
    },
    created(){
       
    },
    watch:{
        finished:{
            handler:function(val,old){
                if(!val){
                    this.timer = setInterval(_=>{
                        this.refreshAnalyseContent()
                    },5*1000)
                
                }else{
                    this.refreshAnalyseContent()
                    clearInterval(this.timer)
                }
            }
        },
        taskId:function(newval,oldval){
            this.organization_performanceData.values = []
            this.organization_resultData.values = []
            this.organization_distributionData.viewpoints = [
                {
                    values:[],
                    name:''
                }
            ]
            this.organization_distributionData["x-axis"]=[]
            this.organization_delayData.viewpoints = [
                {
                    values:[],
                    name:''
                }
            ]
            this.organization_delayData["x-axis"] = []
            this.delayRegionData.values = []
            this.tableData = []
            this.tableData1 = []
            this.errorData = []
            
        }

    },
    mounted(){
        
        this.refreshAnalyseContent()
    },
    methods: {
        
        
        handleClick(tab, event) {
            
        },
        refreshAnalyseContent(){
            if(this.taskId){
                switch(this.active){
                    case 0:
                        this.getDelayRegionData(this.taskId)
                        break;
                    case -1:
                        this.getDelayRegionData(this.taskId)
                        this.getDelayDistributionData(this.taskId)
                        break;
                    case 1:
                        this.getResultData(this.taskId)
                        this.getPerformanceData(this.taskId)
                        break;
                    case 2:
                        this.getDetailData(this.taskId)
                        break;

                }
            }
        },
        tabClick(index){
            this.active = index
            this.refreshAnalyseContent()
        },
        handleChange(val) {
        },
        //请求结果分布
        orgaResultChart(){
            var dom = document.getElementById("orgaResultChart")
            dom.style.width = this.width +'px'
            dom.style.height = this.height +'px'
            var myChart = this.$echarts.init(dom,'macarons');
            this.multibleCharts.push(myChart)
            let option ;
            myChart.setOption(option = {
                title : {
                    text: '请求结果分布',
                    subtext: '数据来自Natrix',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                toolbox: {
                    feature: {
                        dataView: {show: true, readOnly: false},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                },
                series : [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                            {value:335, name:'直接访问'},
                            {value:310, name:'邮件营销'},
                            {value:234, name:'联盟广告'},
                            {value:135, name:'视频广告'},
                            {value:1548, name:'搜索引擎'}
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            })
        },

        //连接性能分布
        orgaPerformanceChart(){
            var dom = document.getElementById("orgaPerformanceChart")
            dom.style.width = this.width +'px'
            dom.style.height = this.height +'px'
            var myChart = this.$echarts.init(dom,'macarons');
            this.multibleCharts.push(myChart)
            let option ;
            myChart.setOption(option = {
                title : {
                    text: '连接性能分布',
                    subtext: '数据来自Natrix',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                toolbox: {
                    feature: {
                        dataView: {show: true, readOnly: false},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                },
                series : [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                            {value:335, name:'直接访问'},
                            {value:310, name:'邮件营销'},
                            {value:234, name:'联盟广告'},
                            {value:135, name:'视频广告'},
                            {value:1548, name:'搜索引擎'}
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            })
        },
        getTaskInfo(val){
            this.taskId = val.taskId
            this.finished = val.finished
            
        },
        getDelayRegionData(id){
            let view_point = this.active == 0 ? 'region' : 'organization'
            this.$get({
                url:HP1+'/benchmark/instant/analyse/v1',
                data:{
                    task_id:id,
                    view_point:view_point,
                    chart_name:'request'
                }
            }).then(res=>{
                if(res.data.code == 200){
                    let data = res.data.info
                    if(view_point == 'region'){
                        this.delayRegionData = Object.assign(this.delayRegionData,data)
                    }else{
                        this.organization_delayData = Object.assign(this.organization_delayData,data)
                    }
                
                }else{
                    messageTip("error",this.$t(res.data.message))
                }
            })
        },
        getDelayDistributionData(id){
            let view_point = 'organization'
            this.$get({
                url:HP1+'/benchmark/instant/analyse/v1',
                data:{
                    task_id:id,
                    view_point:view_point,
                    chart_name:'distribution'
                }
            }).then(res=>{
                if(res.data.code == 200){
                    let data = res.data.info
                    this.organization_distributionData = Object.assign(this.organization_distributionData,data)
                   
                
                }else{
                    messageTip("error",this.$t(res.data.message))
                }
            })
        },
        getResultData(id){
            this.$get({
                url:HP1+'/benchmark/instant/analyse/v1',
                data:{
                    task_id:id,
                    view_point:"comprehensiveness",
                    chart_name:'result_distribution'
                }
            }).then(res=>{
                if(res.data.code == 200){
                    let data = res.data.info
                    this.organization_resultData = Object.assign(this.organization_resultData,data)
                    
                
                }else{
                    messageTip("error",this.$t(res.data.message))
                }
            })

        },
        getPerformanceData(id){
            this.$get({
                url:HP1+'/benchmark/instant/analyse/v1',
                data:{
                    task_id:id,
                    view_point:"comprehensiveness",
                    chart_name:'stage_distribution'
                }
            }).then(res=>{
                if(res.data.code == 200){
                    let data = res.data.info
                    this.organization_performanceData = Object.assign(this.organization_performanceData,data)
                    
                
                }else{
                    messageTip("error",this.$t(res.data.message))
                }
            })

        },
        getDetailData(id){
            this.$get({
                url:HP1+'/benchmark/instant/analyse/v1',
                data:{
                    task_id:id,
                    view_point:"detail",
                    chart_name:'default'
                }
            }).then(res=>{
                if(res.data.code == 200){
                    this.tableData = res.data.info.success
                    this.tableData.forEach((item,index)=>{
                        // item.name = item.organizations.join(" ")
                        item.total_time = intercept(item.total_time,this.precision)
                        item.period_nslookup = intercept(item.period_nslookup,this.precision)
                        item.period_tcp_connect = intercept(item.period_tcp_connect,this.precision)
                        item.period_ssl_connect = intercept(item.period_ssl_connect,this.precision)
                        item.period_request = intercept(item.period_request,this.precision)
                        item.period_response = intercept(item.period_response,this.precision)
                        item.period_transfer = intercept(item.period_transfer,this.precision)
                    })
                    this.tableData1 = res.data.info.wrong
                    
                    this.errorData = res.data.info.error
                }else{
                    messageTip("error",this.$t(res.data.message))
                }
            })
        }
    },
    destroyed(){
        window.removeEventListener("resize",this.resizeHandle);
        clearInterval(this.timer)
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.el-collapse-item__header{
    font-size:14px;
    font-weight:500;
    text-indent:20px;
}
.el-tag{
    padding:0 3px;
}
</style>
<style scoped>
@import "../../../../static/css/intantTest.css";
</style>
