<template>
  <div>
    <div id="nav">
      <span class="title">云拨测——即时测</span>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <a :href="href" class="home">云拨测<i class="el-breadcrumb__separator el-icon-arrow-right"></i></a>
        <el-breadcrumb-item :to="{ path: '/pingAnalysis' }">即时测</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <instantNav :active="2"></instantNav>
    <searchBox :active="'Traceroute'" v-on:getTaskStatusHandle="getTaskInfo"></searchBox>
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
    </div>
    <div>
        <el-collapse v-model="activeNames">
          <el-collapse-item  name="1">
            <template slot="title">
                Traceroute错误信息<span>（条数{{errorTableData.length}}）</span>
            </template>
            <errorinfoTable :tableData="errorTableData"></errorinfoTable>
          </el-collapse-item>
          <el-collapse-item title="" name="2">
            <template slot="title">
                Traceroute详细信息<span>（条数{{length}}）</span>
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
                prop="organization"
                label="组织"
                width="125"
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
                prop="hop"
                width="50"
                label="跳数">
                </el-table-column>
                <el-table-column
                prop="seq"
                width="50"
                label="序号">
                </el-table-column>
                <el-table-column
                prop="hostname"
                
                label="主机名">
                </el-table-column>
                <el-table-column
                prop="ip"
                
                label="ip地址">
                </el-table-column>
                <el-table-column
                prop="locationName"
                
                label="定位信息">
                </el-table-column>
                <el-table-column
                prop="response_times"
                
                label="时间列表(ms)">
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
</template>

<script>
import instantNav from "../../../components/instantNav.vue";
import searchBox from "../components/searchBox.vue";
import errorinfoTable from "../components/errorinfoTable.vue"
import { intercept,messageTip } from '../../../until/index.js';

export default {
  name: "",
  components: {
    instantNav,
    searchBox,
    errorinfoTable
  },
  data() {
    return {
      href:ManageIndex,
      active: 0,
      navData: [
        
        {
          name: "详细信息",
          index: 0
        }
      ],
      tableData:[],//success信息
      errorTableData:[],//error
      activeNames:['1'],
      length:0,
      taskId:null,
      finished:true,
      timer:null
    };
  },
  created() {},
  watch: {
    finished: {
      handler: function(newval, oldval) {
        if(!newval){
          this.timer = setInterval(_=>{
            this.getTraceRouteData()
          },5*1000)
        }else{
          this.getTraceRouteData()
          clearInterval(this.timer)
        }

      }
    },
    taskId:function(newval,oldval){
      if(newval != oldval){
        this.tableData = []
        this.errorTableData = []
      }
    }
  },
  mounted() {
    if(this.taskId){
      this.getTraceRouteData()
    }
  },
  methods: {
      getTaskInfo(val){
          this.taskId = val.taskId
          this.finished = val.finished
      },
      getTraceRouteData(){
          this.$get({
            url:HP1+'/benchmark/instant/analyse/v1',
            data:{
              task_id:this.taskId,
              view_point:'detail',
              chart_name:'default'
            }
          }).then(res=>{
            if(res.data.code == 200){
              let  data = res.data.info.success
              this.length = data.length
              this.generateTableData(data)
              this.errorTableData = res.data.info.error
            }else{
              messageTip("error",this.$t(res.data.message))
            }
          })
      },
      copyDeep(templateData){
        return JSON.parse(JSON.stringify(templateData))
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
          if (columnIndex in [0,1,2,3,4]){
            let index_value = row.index[0]
            if (index_value == 0){
              return {
                rowspan: row.rowspans[0],
                colspan: 1
              }
            }else{
              return {
                rowspan: 0,
                colspan: 0
              }
            }
          }
          if (columnIndex == 5){
            let index_value = row.index[1]
            if (index_value == 0){
              return {
                rowspan: row.rowspans[1],
                colspan: 1
              }
            }else{
              return {
                rowspan: 0,
                colspan: 0
              }
            }
          }
      
      },
      generateTableData(data){
          let tableData = []
          let indexList = [0, 0, 0]
          data.forEach((tree, index_one)=>{
            indexList[0] = 0
            // initialize the first record index of tree in tableData
            let first_index_one = -1
            let paths = tree.paths
            paths.forEach((path, index_two)=>{
              indexList[1] = 0
              // initialize the first record index of path in tableData
              let first_index_two = -1
              let routers = path.routes
              routers.forEach((route, index_three)=>{
                indexList[2] = 0
                
                let record_count = tableData.length
                
                if (first_index_one == -1){
                  first_index_one = record_count
                }
                if (first_index_two == -1){
                  first_index_two = record_count
                }
                let response_times = intercept(route.response_times)
                tableData.push({
                  terminal:tree.terminal,
                  organizations: tree.organizations,
                  province: tree.province,
                  city: tree.city,
                  hop: tree.hop,
                  seq: path.seq,
                  hostname: route.hostname,
                  ip: route.ip,
                  response_times:response_times,
                  locationName:route.location == null ? '' : route.location.country+'-'+route.location.province+'-'+route.location.isp,
                  index: this.copyDeep(indexList),
                  rowspans: [0, 0, 1]
                })
                tableData[first_index_one]['rowspans'][0] += 1
                tableData[first_index_two]['rowspans'][1] += 1
                indexList[0] += 1
                indexList[1] += 1
              })
            })
          })
          this.tableData = tableData


      },
    
  },
  destroyed(){
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
.el-tag{
  padding:0 3px;
}
</style>
<style scoped>
@import "../../../../static/css/intantTest.css";
</style>
