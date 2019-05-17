<template>
  <div>
    <div id="nav">
      <span class="title">云拨测——即时测</span>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <a :href="href" class="home">云拨测<i class="el-breadcrumb__separator el-icon-arrow-right"></i></a>
        <el-breadcrumb-item :to="{ path: '/pingAnalysis' }">即时测</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <instantNav :active="0"></instantNav>
    <searchBox :active="0" ref="searchBox" v-on:getTaskStatus="updateTaskInfo"></searchBox>
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
          <el-collapse-item title="PING丢包（地域分析）" name="1">
            <natrixMapChart 
              :chart_data="ping_packetLoss"
              :chart_style="this.packetLossRange">
            </natrixMapChart>
          </el-collapse-item>
          <el-collapse-item title="ping时延（地域分析）" name="2">
            <natrixMapChart 
              :chart_data="ping_time"
              :chart_style="this.pingDelayRange">
            </natrixMapChart>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div id="organizationContent" v-if="active == 1">
        <el-collapse v-model="organizationActiveNames" @change="handleChange">
          <el-collapse-item title="PING丢包（组织分析）" name="1">
            <natrixLineChart :chart_data="organization_packetLoss"></natrixLineChart>
          </el-collapse-item>
          <el-collapse-item title="ping时延（组织分析）" name="2">
            <natrixLineChart :chart_data="organization_delay"></natrixLineChart>
          </el-collapse-item>
          <el-collapse-item title="ping时间段分布（组织分析）" name="3">
            <natrixLineChart :chart_data="organization_interval"></natrixLineChart>
          </el-collapse-item>
          <el-collapse-item title="ping高延时TOP10（组织分析）" name="4">
            <natrixBarChart :chart_data="organization_top10"></natrixBarChart>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div id="detailContent" v-if="active == 2">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item  name="1">
            <template slot="title">
              ping错误信息<span>（条数{{tableData1.length}}）</span>
            </template>
            <errorinfoTable :tableData="tableData1"></errorinfoTable>
          </el-collapse-item>
          <el-collapse-item  name="2">
            <template slot="title">
              ping检测详细信息<span>（条数{{tableData.length}}）</span>
            </template>
            <el-table :data="tableData" border :fit="true" style="width: 100%,margin-top:50px;">
              <el-table-column prop="terminal" label="终端" width="125"></el-table-column>
              <el-table-column prop="organization" label="组织" width="125">
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
              <el-table-column prop="province" label="省份" width="100"></el-table-column>
              <el-table-column prop="city" label="市" width="100"></el-table-column>
              <el-table-column prop="packet_send" width="50" label="发送"></el-table-column>
              <el-table-column prop="packet_receive" width="50" label="接收"></el-table-column>
              <el-table-column prop="packet_loss" width="50" label="丢弃"></el-table-column>
              <el-table-column prop="max_time"  label="最大时间(ms)"></el-table-column>
              <el-table-column prop="min_time"  label="最小时间(ms)"></el-table-column>
              <el-table-column prop="avg_time"  label="平均时间(ms)"></el-table-column>
              <el-table-column prop="packet_size"  label="包大小"></el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
        
        
      </div>
    </div>
  </div>
</template>

<script>
import instantNav from "../../../components/instantNav.vue";
import searchBox from "../components/searchBox.vue";
import errorinfoTable from "../components/errorinfoTable.vue";
import natrixLineChart from "../../../components/natrixLineChart.vue";
import natrixBarChart from "../../../components/natrixBarChart.vue";
import natrixMapChart from "../../../components/natrixMapChart.vue";
import {intercept} from "../../../until/index.js"
export default {
  name: "",
  components: {
    instantNav,
    searchBox,
    natrixLineChart,
    natrixBarChart,
    natrixMapChart,
    errorinfoTable
  },
  data() {
    return {
      href:ManageIndex,
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
      activeNames:["1"],
      areaActiveNames: ["1", "2"],
      organizationActiveNames: ["1", "2", "3", "4"],
      areaCharts: [], //地域分析
      orgaCharts: [], //组织分析

      timer: null,

      width: 0,
      height: 0,
      tableData: [],
      tableData1: [],
      // taskId: "bb6c60f9-d04f-49dc-b1f1-703761c1fb07",
      taskId: null,
      finished: true, //状态

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
      ping_time: {
        title: {
          text: "PING延时（地域分析）"
        },
        name: "解析时间",
        values: []
      },
      organization_packetLoss: {
        title: {
          text: "PING丢包率（组织分析）"
        },
        xAxisName: "职场名称",
        yAxisName: "丢包率(%)",
        viewpoints: [
          {
            values: [],
            name: ""
          }
        ],
        "x-axis": []
      },
      organization_delay: {
        title: {
          text: "PING延时（组织分析）"
        },
        xAxisName: "职场名称",
        yAxisName: "时间(ms)",
        viewpoints: [
          {
            values: [],
            name: ""
          }
        ],
        "x-axis": []
      },
      organization_interval: {
        title: {
          text: "PING延时时间段分布"
        },
        xAxisName: "时间段(ms)",
        yAxisName: "数量",
        viewpoints: [
          {
            values: [],
            name: ""
          }
        ],
        "x-axis": []
      },
      organization_top10: {
        title: {
          text: "PING延时TOP（组织分析）"
        },
        barWidth: 50,
        xAxisName: "往返时间(ms)",
        yAxisName: "组织名称",
        viewpoints: [
          {
            values: [],
            name: ""
          }
        ],
        "x-axis": []
      },
      precision:2
    };
  },
  created() {},
  watch: {
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
        this.organization_top10.viewpoints = [
          {
            values: [],
            name: ""
          }
        ]
        this.organization_top10["x-axis"]= []
        this.organization_interval.viewpoints = [
          {
            values: [],
            name: ""
          }
        ]
        this.organization_interval["x-axis"]= []
        this.organization_delay.viewpoints = [
          {
            values: [],
            name: ""
          }
        ]
        this.organization_delay["x-axis"]= []
        this.organization_packetLoss.viewpoints = [
          {
            values: [],
            name: ""
          }
        ]
        this.organization_packetLoss["x-axis"]= []
        this.ping_time.values = []
        this.ping_packetLoss.values = []
        this.tableData = []
        this.tableData1 = []
      }
    }

  },
  mounted() {
    this.refreshAnalyseContent()
    // 监听resize事件
    window.addEventListener("resize", this.resizeHandle);
  },
  methods: {
    // TODO: remove
    resizeHandle() {
      if (this.active == 0) {
        let width = document.getElementById("areaContent").clientWidth;
        this.width = width;
        for (let i = 0; i < this.areaCharts.length; i++) {
          this.areaCharts[i].resize();
        }
      }
      if (this.active == 1) {
        let width = document.getElementsByClassName("pingContent")[0]
          .clientWidth;
        var dom = document.getElementById("organizationContent");
        var areaBoxs = dom.getElementsByClassName("areaBox");
        for (var i = 0; i < areaBoxs.length; i++) {
          areaBoxs[i].style.width = width + "px";
        }
        for (let i = 0; i < this.orgaCharts.length; i++) {
          this.orgaCharts[i].resize();
        }
      }
    },
    handleChange() {},
    tabClick(index) {
      this.active = index;
      this.refreshAnalyseContent()
    },
    refreshAnalyseContent() {
      if (this.taskId)
        switch (this.active){
          case 0:
            this.updatePacketLossData()
            this.updateDelayData()
            break
          case 1:
            this.updatePacketLossData()
            this.updateDelayData()
            this.updateDistributionData()
            this.updateOrgTop10()
            break
          case 2:
            this.updateDetailData();
        }
    },
    /**
     * This function is used by searchBox documents to receive the task info.
     */
    updateTaskInfo(val) {
      this.taskId = val.taskId;
      this.finished = val.finished;
    },
    updatePacketLossData() {
      let view_point = this.active == 0 ? "region" : "organization";
      this.$get({
        url: HP1 + "/benchmark/instant/analyse/v1",
        data: {
          task_id: this.taskId,
          view_point: view_point,
          chart_name: "packet_loss"
        }
      }).then(res => {
        if (res.data.code == 200) {
          let data = res.data.info;

          if (view_point == "region") {
            this.ping_packetLoss.values = data.values;
          } else {
            this.organization_packetLoss = Object.assign(
              this.organization_packetLoss, data
            );
          }
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          });
        }
      });
    },
    updateDelayData() {
      let view_point = this.active == 0 ? "region" : "organization";
      this.$get({
        url: HP1 + "/benchmark/instant/analyse/v1",
        data: {
          task_id: this.taskId,
          view_point: view_point,
          chart_name: "delay"
        }
      }).then(res => {
        if (res.data.code == 200) {
          let data = res.data.info;
          if (view_point == "region") {
            this.ping_time.values = data.values;
          } else {
            this.organization_delay = Object.assign(
              this.organization_delay,
              data
            );
          }
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          });
        }
      });
    },
    updateDistributionData() {
      let view_point = this.active == 0 ? "region" : "organization";
      this.$get({
        url: HP1 + "/benchmark/instant/analyse/v1",
        data: {
          task_id: this.taskId,
          view_point: view_point,
          chart_name: "distribution"
        }
      }).then(res => {
        if (res.data.code == 200) {
          let data = res.data.info;
          this.organization_interval = Object.assign(
            this.organization_interval,
            data
          );
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          });
        }
      });
    },
    updateOrgTop10() {
      let view_point = this.active == 0 ? "region" : "organization";
      this.$get({
        url: HP1 + "/benchmark/instant/analyse/v1",
        data: {
          task_id: this.taskId,
          view_point: view_point,
          chart_name: "top"
        }
      }).then(res => {
        if (res.data.code == 200) {
          let data = res.data.info;
          this.organization_top10 = Object.assign(
            this.organization_top10,
            data
          );
          // this.orgaTimeChartTop(data)
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          });
        }
      });
    },
    updateDetailData() {
      this.$get({
        url: HP1 + "/benchmark/instant/analyse/v1",
        data: {
          task_id: this.taskId,
          view_point: "detail",
          chart_name: "default"
        }
      }).then(res => {
        if (res.data.code == 200) {
          res.data.info.success.forEach((item, index) => {
            item.organization = item.organizations.join(" \n ");
            item.max_time = intercept(item.max_time,this.precision)
            item.min_time = intercept(item.min_time,this.precision)
            item.avg_time = intercept(item.avg_time,this.precision)
          });
          this.tableData = res.data.info.success;
          this.tableData1 = res.data.info.error;
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          });
        }
      });
    },
   
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeHandle);
    // this.timer = null 
    clearInterval(this.timer)
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.el-collapse-item__header {
  font-size: 14px;
  font-weight: 500;
  text-indent: 20px;
}
#detailContent .el-table {
  margin: 10px 0;
}
</style>
<style scoped>
@import "../../../../static/css/intantTest.css";
</style>
