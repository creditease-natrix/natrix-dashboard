<template>
  <div>
    <div id="nav">
      <span class="title">云拨测——即时测</span>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <a :href="href" class="home">云拨测<i class="el-breadcrumb__separator el-icon-arrow-right"></i></a>
        <el-breadcrumb-item :to="{ path: '/pingAnalysis' }">即时测</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <instantNav :active="3"></instantNav>
    <searchBox :active="3" v-on:getTaskStatus="updateTaskInfo"></searchBox>
    <div class="pingContent">
      <div class="pingNavBox">
        <ul class="pingNav clear">
          <li
            v-for="(item,index) in navData"
            class="cursor"
            @click="tabClick(index)"
            v-bind:class="{active: active == index}"
            :key="index"
          >{{item.name}}</li>
        </ul>
      </div>
      <div id="areaContent" v-if="active == 0">
        <el-collapse v-model="areaActiveNames" @change="handleChange">
          <el-collapse-item title="DNS解析时间分析" name="1">
            <natrixMapChart
              v-show="true"
              :chart_data="this.parseTimeRegionAnalyse"
              :chart_style="this.parseTimeRange">
            </natrixMapChart>
          </el-collapse-item>
          <el-collapse-item title="DNS解析地址地域分布" name="2">
            <natrixPieChart
                v-show="true"
                :chart_data="this.parseResultRegionDistribution">
            </natrixPieChart>
          </el-collapse-item>
          <el-collapse-item title="DNS解析地域分布TOP10" name="3">
            <natrixBarChart
              v-show="true"
              :chart_data="this.parseTimeRegionTop10">
            </natrixBarChart>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div id="orgaContent" v-if="active == 1">
        <el-collapse v-model="organizationActiveNames" @change="handleChange">
          <el-collapse-item title="DNS解析时间" name="1">
            <natrixLineChart 
              :chart_data="this.parseTimeOrganizationAnalyse">
            </natrixLineChart>
          </el-collapse-item>
          <el-collapse-item title="DNS解析时间段分布" name="2">
            <natrixLineChart :chart_data="parseTimeOrganizationDistribution"></natrixLineChart>
          </el-collapse-item>
          <el-collapse-item title="DNS解析组织分布TOP10" name="3">
            <natrixBarChart
              v-show="true"
              :chart_data="this.parseTimeOrganizationTop10">
            </natrixBarChart>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div id="detailContent" v-if="active == 2">
        <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item  name="1">
              <template slot="title">
                  DNS错误信息<span>（条数{{errorData.length}}）</span>
              </template>
              <errorinfoTable :tableData="errorData"></errorinfoTable>
            </el-collapse-item>
            <el-collapse-item  name="2">
              <template slot="title">
                  DNS详细信息<span>（条数{{successData.length}}）</span>
              </template>
              <el-table
                  :data="tableData"
                  :span-method="objectSpanMethod"
                  border
                  style="width: 100%,margin-top:50px;">
                  <el-table-column
                  prop="terminal"
                  label="终端"
                  width="125">
                  </el-table-column>
                  <el-table-column
                  label="组织"
                  width="125">
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
                  prop="ptime"
                  
                  label="解析时间">
                  </el-table-column>
                  <el-table-column
                  prop="destination"
                  
                  label="目的地址">
                  </el-table-column>
                  <el-table-column
                  prop="ip"
                  
                  label="解析ip">
                  </el-table-column>
                  <el-table-column
                  prop="locationUrl"
                  label="定位信息">
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
import instantNav from "../../../components/instantNav.vue"
import searchBox from "../components/searchBox.vue"
import errorinfoTable from "../components/errorinfoTable.vue"
import natrixPieChart from "../../../components/natrixPieChart.vue"
import natrixLineChart from "../../../components/natrixLineChart.vue"
import natrixMapChart from "../../../components/natrixMapChart.vue"
import natrixBarChart from "../../../components/natrixBarChart.vue"
import {intercept} from "../../../until/index.js"
export default {
  name: "",
  components: {
    instantNav,
    searchBox,
    natrixPieChart,
    natrixLineChart,
    natrixMapChart,
    natrixBarChart,
    errorinfoTable
  },
  data() {
    return {
      href:ManageIndex,
      taskId: null,
      finished: true,
      // refresh the analyse content periodically
      timer: null,

      active: 0,
      navData: [
        {
          name: "地域分析",
          index: 0
        },
        {
          name: "组织分析",
          index: 1
        },
        {
          name: "详细信息",
          index: 2
        }
      ],
      areaActiveNames: ["1", "2", "3"],
      organizationActiveNames: ["1", "2", "3"],
      areaCharts: [], //地域分析
      orgaCharts: [], //组织分析

      width: 0,
      height: 0,
      tableData:[],
      successData:[],
      errorData:[],
      activeNames:['1'],

      // Doamin name parse result distribution of location on region
      parseResultRegionDistribution: {
        title: {
          text: "DNS解析结果地域分布",
        },
        values: []
      },
      // Domain name parse time analysis on map
      parseTimeRegionAnalyse: {
        title: {
          text: "DNS解析时间（地域分析）"
        },
        values: []
      },
      parseTimeRange: {
        data_map: [
          {min: 1000, level: "critical"},
          {min: 500, max: 1000, level: "warning"},
          {min: 200, max: 500, level: "fine"},
          {max: 200, level: "excellent"}
        ],
        precision: 2

      },
      // Domain name parse operation ranking in time
      parseTimeRegionTop10: {
        title: {
          text: "DNS解析TOP10（地域分析）"
        },
        xAxisName: "解析时间(ms)",
        yAxisName: "城市名称",
        viewpoints: [],
        "x-axis": []
      },
      // Domain name parse time average analysis on organization
      parseTimeOrganizationAnalyse: {
        title:{
          text:"DNS解析时间（组织分析）"
        },
        xAxisName:"时间（ms）",
        yAxisName:"组织名称",
        viewpoints:[],
        "x-axis":[]
      },
      // Domain name parse time distribution analysis on organization
      parseTimeOrganizationDistribution: {
        title:{
          text:"DNS解析时间分布（组织分析）"
        },
        xAxisName:"时间段（ms）",
        yAxisName:"数量",
        viewpoints:[],
        "x-axis":[]
      },
      // Domain name average parse time ranking on organization
      parseTimeOrganizationTop10: {
        title: {
          text: "DNS解析时间TOP10(组织分析)"
        },
        xAxisName: "解析时间(ms)",
        yAxisName: "组织名称",
        viewpoints: [],
        "x-axis": []
      }
      
    };
  },
  created() {},
  watch: {
    // the changes of finished means transform between running and waiting states. 
    finished: {
      handler: function(newval, oldval) {
        if (this.finished){
          if (this.timer){
            clearInterval(this.timer)
          }
        }else{
          this.timer = setInterval(_ => {
            this.refreshAnalyseContent()
          }, 5*1000)
        }
      }
    },
    taskId:function(newval,oldval){
      if(newval != oldval){
        this.tableData = []
        this.errorData = []
        this.successData = []
        this.parseTimeOrganizationTop10.viewpoints = []
        this.parseTimeOrganizationTop10["x-axis"] = []
        this.parseTimeOrganizationDistribution.viewpoints = []
        this.parseTimeOrganizationDistribution["x-axis"] = []
        
        this.parseTimeOrganizationAnalyse.viewpoints = []
        this.parseTimeOrganizationAnalyse["x-axis"] = []
        this.parseTimeRegionTop10.viewpoints = []
        this.parseTimeRegionTop10["x-axis"] = []
        this.parseResultRegionDistribution.values = []
        this.parseTimeRegionAnalyse.values = []
      }
    }
  },
  mounted() {
    this.refreshAnalyseContent()
    // 监听resize事件
    window.addEventListener("resize",this.resizeHandle);
  },
  methods: {
      //todo: remove
      resizeHandle(){
            if(this.active == 0){
                //地域分析
               let width = document.getElementById("areaContent").clientWidth
               this.width = width
               for(let i =0;i<this.areaCharts.length;i++){
                    this.areaCharts[i].resize()
                }
            }
            if(this.active == 1){
                //组织分析
                let width =  document.getElementsByClassName("pingContent")[0].clientWidth
                var dom = document.getElementById("orgaContent");
                var areaBoxs = dom.getElementsByClassName("areaBox");
                for(var i =0 ;i<areaBoxs.length;i++){
                    areaBoxs[i].style.width = width +'px'
                }
                for(let i =0;i<this.orgaCharts.length;i++){
                    this.orgaCharts[i].resize()
                }
            }
            
      },
      handleChange(){
      },
      tabClick(index) {
        this.active = index;
        this.refreshAnalyseContent()

      },
      refreshAnalyseContent(){
        if (this.taskId) 
          switch (this.active){
            case 0:
              this.updateParseTimeRegionDist()
              this.updateParseResultRegionDist()
              this.updateParseTimeRegionTop10()
              break
            case 1:
              this.updateParseTimeOrgAnalyse()
              this.updateParseTimeOrgDist()
              this.updateParseTimeOrgTop()
              break
            case 2:
              this.updateDetailData()
          }
      },
      /**
       * This function is used by searchBox documents to receive the task info.
       */
      updateTaskInfo(val){
        this.taskId = val.taskId
        this.finished = val.finished
      },
      updateParseTimeRegionDist(){
        this.$get({
          url:HP1+'/benchmark/instant/analyse/v1',
          data:{
            task_id: this.taskId,
            view_point: "region",
            chart_name:'parse_time'
          }
        }).then(res=>{
          if(res.data.code == 200){
            let data = res.data.info
            this.parseTimeRegionAnalyse.values = data.values
          }else{
            this.$message({
              type:'error',
              message:res.data.message
            })
          }
        })
      },
      updateParseResultRegionDist(){
        this.$get({
          url:HP1+'/benchmark/instant/analyse/v1',
          data:{
            task_id: this.taskId,
            view_point:'region',
            chart_name:'distribution'
          }
        }).then(res=>{
          if(res.data.code == 200){
            let data = res.data.info
            // natrixPieChart
            this.parseResultRegionDistribution.values = data.values
          }else{
            this.$message({
              type:'error',
              message:res.data.message
            })
          }
        })
      },
      updateParseTimeRegionTop10(){
        this.$get({
          url:HP1+"/benchmark/instant/analyse/v1",
          data:{
            task_id: this.taskId,
            view_point: "region",
            chart_name: "top"
          }
        }).then(res=>{
          if(res.data.code == 200){
            let data = res.data.info
            this.parseTimeRegionTop10.viewpoints = data.viewpoints
            this.parseTimeRegionTop10['x-axis'] = data['x-axis']

          }else{
            this.$message({
              type:'error',
              message:res.data.message
            })
          }
        })
      },
      updateParseTimeOrgAnalyse(){
        this.$get({
          url:HP1 + "/benchmark/instant/analyse/v1",
          data:{
            task_id: this.taskId,
            view_point: "organization",
            chart_name: "parse_time"
          }
        }).then(res=>{
          if(res.data.code == 200){
            let data = res.data.info
            this.parseTimeOrganizationAnalyse.viewpoints = data.viewpoints
            this.parseTimeOrganizationAnalyse["x-axis"] = data["x-axis"]
          }else{
            this.$message({
              type:'error',
              message:res.data.message
            })
          }
        })
      },
      updateParseTimeOrgDist(id){
        this.$get({
          url:HP1+'/benchmark/instant/analyse/v1',
          data:{
            task_id: this.taskId,
            view_point: "organization",
            chart_name: 'distribution'
          }
        }).then(res=>{
          if(res.data.code == 200){
            let data = res.data.info
            this.parseTimeOrganizationDistribution.viewpoints = data.viewpoints
            this.parseTimeOrganizationDistribution["x-axis"] = data["x-axis"]
          }else{
            this.$message({
              type:'error',
              message:res.data.message
            })
          }
        })
      },
      updateParseTimeOrgTop(){
        this.$get({
          url:HP1+'/benchmark/instant/analyse/v1',
          data:{
            task_id: this.taskId,
            view_point: "organization",
            chart_name: "top"
          }
        }).then(res=>{
          if(res.data.code == 200){
            let data = res.data.info

            this.parseTimeOrganizationTop10.viewpoints = data.viewpoints
            this.parseTimeOrganizationTop10['x-axis'] = data['x-axis']
          }else{
            this.$message({
              type:'error',
              message:res.data.message
            })
          }
        })
      },
      updateDetailData(){
        this.$get({
          url: HP1 + "/benchmark/instant/analyse/v1",
          data:{
            task_id: this.taskId,
            view_point: "detail",
            chart_name: "default"
          }
        }).then(res=>{
          if(res.data.code == 200){
            this.successData = res.data.info.success
            let successData = res.data.info.success
            this.errorData = res.data.info.error
            this.errorData.forEach((item,index)=>{
              item.organization = item.organizations.join(" \n ")
            })
            this.generateTableData(successData)
          }else{
            this.$message({
              type:'error',
              message:res.data.message
            })
          }
        })
      },
      generateTableData(data){
        let tableData = []
        data.forEach((item,index)=>{
            item.ips.forEach((item1,index1)=>{
                let tableItem = {
                  rowspan:item.ips.length,
                  index:index1,
                  terminal:item.terminal,
                  organizations:item.organizations,
                  province:item.province,
                  city:item.city,
                  operator:item.operator,
                  ptime:item.ptime,
                  destination:item.destination,
                  ip:item1.ip,
                  locationUrl:item1.location.country + "-" + item1.location.province + "-" + item1.location.isp
                }
                tableData.push(tableItem)
            })
        })
        tableData.forEach((item,index)=>{
          item.ptime = intercept(item.ptime)
        })
        this.tableData = tableData
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }){
        if(columnIndex in [0,1,2,3,4,5]){
          if(row.index == 0){
              return {
                rowspan: row.rowspan,
                colspan: 1
              }
          }else{
              return {
                rowspan: 0,
                colspan: 0
              }
          }
        }
        
      }
  },
  destroyed(){
    window.removeEventListener("resize",this.resizeHandle)
    clearInterval(this.timer)
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import "../../../../static/css/intantTest.css";
</style>
