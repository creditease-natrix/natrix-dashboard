<template>
  <div>
    <div class="searchBar" id="searchBox">
      <el-select v-if="active == 'HTTP' " size="medium" v-model="httpMethod" placeholder="请选择">
        <el-option
          v-for="(item,index) in httpMethodSelect"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input placeholder="请输入url" size="medium" v-model="searchValue" class="searchInput"></el-input>
      <el-button
        type="primary"
        size="medium"
        @click="createTask(taskStatus)"
        :disabled="taskStatusObj.resultLoading"
      >检测一下</el-button>
      <el-button
        type="primary"
        size="medium"
        @click="changeFilterDisplay"
        :disabled="taskStatusObj.resultLoading"
      >
        <i class="icon iconfont icon-kaiqi1" v-show="!taskStatusObj.filterWrap"></i>
        <i class="icon iconfont icon-kaiqi2" v-show="taskStatusObj.filterWrap"></i>
        高级
      </el-button>
    </div>
    <div class="filterWrap" v-show="taskStatusObj.filterWrap">
      <div class="upTip" v-show="!taskStatusObj.filterFlag">过滤条件选择</div>
      <div id="filterBox" v-show="taskStatusObj.filterFlag">
        <div class="terminalbox filterContainer">
          <h4 class="filterTitle">
            <span>终端配置</span>
          </h4>
          <terminalConfig ref="terminalConfig"></terminalConfig>
        </div>
        <div class="agreement filterContainer">
          <h4 class="filterTitle">
            <span>协议配置</span>
            <el-switch
              v-model="protocolSwitch"
              :active-value="true"
              :inactive-value="false"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </h4>
          <protocolConfig
            ref="protocolConfig"
            :protocolConfig="{}"
            :active="active"
            :disabled="!protocolSwitch"
          ></protocolConfig>
        </div>
      </div>
      <i
        class="icon iconfont icon-xiangxiajiantou"
        v-show="!taskStatusObj.filterFlag"
        @click="downHandle"
      ></i>
      <i
        class="icon iconfont icon-xiangshangjiantou"
        @click="upHandle"
        id="upIcon"
        v-show="taskStatusObj.filterFlag"
      ></i>
    </div>
    <div id="resultWrap" class="clear">
      <ul id="resultBox" class="clear" v-loading="taskStatusObj.resultLoading">
        <li class="clear">
          <i class="icon iconfont icon-xiafashuju"></i>
          <div class="iconContent">
            <strong>{{this.taskInfo.total}}</strong>
            <span>下发数量</span>
          </div>
        </li>
        <li class="clear">
          <i class="icon iconfont icon-responseOrder"></i>
          <div class="iconContent">
            <strong>{{this.taskInfo.responses}}</strong>
            <span>响应数量</span>
          </div>
        </li>
        <li class="clear">
          <i class="icon iconfont icon-wuuiconxuan"></i>
          <div class="iconContent">
            <strong>{{this.taskInfo.success}}</strong>
            <span>正确响应</span>
          </div>
        </li>
        <li class="clear">
          <i class="icon iconfont icon-cuowu"></i>
          <div class="iconContent">
            <strong>{{this.taskInfo.wrong}}</strong>
            <span>错误响应</span>
          </div>
        </li>
      </ul>
      <div id="stop">
        <el-button size="medium" v-show="taskStatusObj.resultLoading" @click="stopTaskHandle">结束</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { messageTip } from "../../../until/index.js";
// import organizationSelect from "../../../components/organizationSelect.vue";
import regionSelect from "../../../components/regionSelect.vue";
const cityOptions = ["上海", "北京", "广州", "深圳"];
import terminalConfig from "../../regularTest/taskManage/components/terminalConfig.vue";
import protocolConfig from "../../regularTest/taskManage/components/protocolConfig.vue";
export default {
  name: "searchBox",
  components: {
    // organizationSelect,
    regionSelect,
    terminalConfig,
    protocolConfig
  },
  props: {
    active: {
      type: String,
      default: "PING"
    }
  },
  data() {
    return {
      searchValue: "",
      checkAllNet: true,
      isIndeterminateNet: true,
      form: {
        filterType: 1,
        filterCondition: this.cityList
      },
      terminal: 1,
      protocolSwitch: false,

      taskId: "", //任务id
      taskInfo: {
        total: 0,
        success: 0,
        wrong: 0,
        responses: 0
      },
      finished: true, //任务结束状态
      timer: null, //定时器
      taskStatus: 1, //当前状态 [1,2,3,4,5,6]//状态集对象
      taskStatusObj: {
        filterWrap: false, //filter外框的显示隐藏
        filterFlag: true, //filter过滤条件的显示隐藏
        resultLoading: false //状态栏加载中提示
      }, //状态集对象
      protocol_type: "ping",
      checkTerminalAll: false,
      cities: cityOptions,
      isIndeterminate: true,
      terminalDialogVisible: false,
      terminals: [], //终端集合
      checkedTerminals: [], //选中的终端

      checkAllTerminal: false, //终端全选
      httpMethod: "get",
      httpMethodSelect: [
        {
          value: "get",
          label: "get"
        },
        {
          value: "post",
          label: "post"
        },
        {
          value: "put",
          label: "put"
        },
        {
          value: "delete",
          label: "delete"
        }
      ]
    };
  },
  created() {
    switch (this.active) {
      case "PING":
        this.protocol_type = "ping";
        break;
      case "HTTP":
        this.protocol_type = "http";
        break;
      case "Traceroute":
        this.protocol_type = "traceroute";
        break;
      case "DNS":
        this.protocol_type = "dns";
        break;
    }
  },
  mounted() {},
  watch: {
    finished: {
      handler: function(newval, oldval) {
        if (newval == true) {
          clearInterval(this.timer);
          this.stopTask();
        } else {
          this.timer = setInterval(_ => {
            this.getTaskStatus();
          }, 5 * 1000);
        }
      }
    },
    taskStatus: function(newval, oldval) {
      switch (newval) {
        case 1:
          this.taskStatusObj = {
            filterWrap: false,
            filterFlag: true,
            resultLoading: false
          };
          this.finished = !this.taskStatusObj.resultLoading;
          break;
        case 2:
          this.taskStatusObj = {
            filterWrap: false,
            filterFlag: true,
            resultLoading: true
          };
          this.finished = !this.taskStatusObj.resultLoading;
          break;
        case 3:
          this.taskStatusObj = {
            filterWrap: true,
            filterFlag: true,
            resultLoading: false
          };
          this.finished = !this.taskStatusObj.resultLoading;
          break;
        case 4:
          this.taskStatusObj = {
            filterWrap: true,
            filterFlag: true,
            resultLoading: true
          };
          this.finished = !this.taskStatusObj.resultLoading;
          break;
        case 5:
          this.taskStatusObj = {
            filterWrap: true,
            filterFlag: false,
            resultLoading: false
          };
          this.finished = !this.taskStatusObj.resultLoading;
          break;
        case 6:
          this.taskStatusObj = {
            filterWrap: true,
            filterFlag: false,
            resultLoading: true
          };
          this.finished = !this.taskStatusObj.resultLoading;
          break;
      }
    }
  },
  methods: {
    //向上箭头
    upHandle() {
      switch (this.taskStatus) {
        case 1:
          break;
        case 2:
          break;
        case 3:
          this.taskStatus = 5;
          break;
        case 4:
          this.taskStatus = 6;
          break;
        case 5:
          this.taskStatus = 3;
          break;
        case 6:
          this.taskStatus = 4;
          break;
      }
    },
    //向下箭头
    downHandle() {
      switch (this.taskStatus) {
        case 1:
          break;
        case 2:
          break;
        case 3:
          this.taskStatus = 5;
          break;
        case 4:
          this.taskStatus = 6;
          break;
        case 5:
          this.taskStatus = 3;
          break;
        case 6:
          this.taskStatus = 4;
          break;
      }
    },
    //外层显隐
    changeFilterDisplay() {
      switch (this.taskStatus) {
        case 1:
          this.taskStatus = 3;
          break;
        case 2:
          break;
        case 3:
          this.taskStatus = 1;
          break;
        case 4:
          break;
        case 5:
          this.taskStatus = 1;
          break;
        case 6:
          break;
      }
    },

    startTask() {
      switch (this.taskStatus) {
        case 1:
          this.taskStatus = 2;
          break;
        case 2:
          this.taskStatus = 1;
          break;
        case 3:
          this.taskStatus = 6;
          break;
        case 4:
          break;
        case 5:
          this.taskStatus = 6;
          break;
        case 6:
          break;
      }
    },
    getConfigData(){
      let terminals = [];
      this.$refs.terminalConfig.checkedTerminals.forEach((item, index) => {
        terminals.push(item);
      });
      let terminal_configuration = {
        filter_type: "region",
        network_type: ["all"],
        isp_type: ["all"],
        filter_condition: [
          this.$refs.terminalConfig.province,
          this.$refs.terminalConfig.city
        ],
        group_own:this.$refs.terminalConfig.checked,
        terminal_select:
          this.$refs.terminalConfig.terminal === 1 ? false : true,
        terminals: this.$refs.terminalConfig.terminal === 1 ? null : terminals
      };
      if (!this.taskStatusObj.filterWrap) {
        terminal_configuration = null;
      }
      let protocol_configuration, auth_info, header_info, body_info;
      let protocol_type, destination, advanced_switch, protocol_switch;
      protocol_type = this.protocol_type;
      destination = this.searchValue;
      advanced_switch = this.taskStatusObj.filterWrap;
      protocol_switch = this.protocolSwitch;
      switch (this.protocol_type) {
        case "ping":
          protocol_configuration = this.$refs.protocolConfig.pingObj;
          break;
        case "http":
          auth_info = this.isObjEmpty(
            this.$refs.protocolConfig.authEditor.get()
          );
          header_info = this.isObjEmpty(
            this.$refs.protocolConfig.headerEditor.get()
          );
          body_info = this.isObjEmpty(
            this.$refs.protocolConfig.bodyEditor.get()
          );
          protocol_configuration = {
            ...this.$refs.protocolConfig.httpObj,
            auth_info: auth_info,
            header_info: header_info,
            body_info: body_info
          };
          break;
        case "dns":
          protocol_configuration = this.$refs.protocolConfig.dnsObj;
          break;
      }

      protocol_configuration = this.protocolSwitch
        ? protocol_configuration
        : null;
      let data = {
        protocol_type,
        destination,
        advanced_switch,
        protocol_switch,
        terminal_configuration,
        protocol_configuration: protocol_configuration
      };
      if (this.protocol_type == "http") {
        data = {
          ...data,
          http_method: this.httpMethod
        };
      }
      return data 
    },

    createTask() {
      this.startTask();
      this.taskId = null //清空taskId
      this.finished = true //reset finished
      this.taskInfo = {
        total: 0,
        success: 0,
        wrong: 0,
        responses: 0
      }
      this.$emit("getTaskStatusHandle", {
              finished: this.finished,
              taskId: this.taskId
      });
      let data = this.getConfigData() //get post configiration data
      

      this.$post({
        url: HP1 + "/benchmark/instant/task/v1",
        data: data
      }).then(res => {
        if (res.data.code == 200) {
          this.taskId = res.data.info.task_id;
          if (this.taskId && this.taskId != null) {
            this.$emit("getTaskStatusHandle", {
              finished: this.finished,
              taskId: this.taskId
            });
          }
        } else {
          this.stopTask(); //reset taskStatus
          messageTip("error", this.$t(res.data.message));
        }
      });
    },

    getTaskStatus() {
      if (this.taskId == "" || this.taskId == null) {
        return;
      }
      this.$get({
        url: HP1 + "/benchmark/instant/status/v1",
        data: {
          task_id: this.taskId
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.taskInfo = { ...res.data.info };
          this.finished = this.taskInfo.finished;

          this.$emit("getTaskStatusHandle", {
            finished: this.finished,
            taskId: this.taskId
          });
        } else {
          messageTip("error", this.$t(res.data.message));
        }
      });
    },
    stopTask() {
      switch (this.taskStatus) {
        case 1:
          break;
        case 2:
          this.taskStatus = 1;
          break;
        case 3:
          break;
        case 4:
          this.taskStatus = 3;
          break;
        case 5:
          break;
        case 6:
          this.taskStatus = 5;
          break;
      }
    },
    stopTaskHandle() {
      if(this.taskId == "" || this.taskId == null ){
        return 
      }

      this.$put({
        url: HP1 + "/benchmark/instant/status/v1",
        data: {
          task_id: this.taskId
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.taskInfo = { ...res.data.info };
          this.finished = res.data.info.finished;
          this.$emit("getTaskStatusHandle", {
            finished: this.finished,
            taskId: this.taskId
          });
          this.stopTask(); //change taskStatus
        } else {
          messageTip("error", this.$t(res.data.message));
        }
      });
    },
    isObjEmpty(obj) {
      return JSON.stringify(obj);
    }
  },
  destroyed() {
    clearInterval(this.timer);
  }
};
</script>
<style>
.icon-yincang {
  color: #efb336;
}
.icon-xianshi {
  color: #efb336;
}
#searchBox .el-select {
  width: 120px;
}
#terminalDialog .el-checkbox__label {
  width: 150px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  vertical-align: middle;
}
#stop .el-button {
  background: #f44336;
  color: #fff;
  border: none;
}
#searchBox .searchInput {
  width: calc(100% - 350px);
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "../../../../static/css/searchBox.css";
</style>
