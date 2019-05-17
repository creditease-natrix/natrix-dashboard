<template>
  <div>
    <div class="searchBar" id="searchBox">
      <el-select v-if="active == 1" size="medium" v-model="httpMethod" placeholder="请选择">
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
        @click="createTask"
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
          <ul class="filterList">
            <li class="clear">
              <span class="fl filterLabel">过滤方式：</span>
              <div class="fl filterItem">
                <el-radio-group v-model="form.filterType">
                  <el-radio :label="1">地域选择</el-radio>
                  <el-radio :label="2">组织选择</el-radio>
                </el-radio-group>
              </div>
            </li>
            <li class="clear">
              <span class="fl filterLabel">过滤条件：</span>
              <div class="fl filterItem">
                <regionSelect v-on:selectList="getCityHandle" v-if="form.filterType == 1 "></regionSelect>
                <organizationSelect
                  v-on:getParentId="getParentIdHandle"
                  v-if="form.filterType == 2 "
                ></organizationSelect>
              </div>
            </li>
            <li class="clear">
              <span class="fl filterLabel">网络选择：</span>
              <div class="fl filterItem">
                <el-checkbox v-model="checkAllNet">全选</el-checkbox>
                <el-checkbox-group v-model="checkedNets" @change="handleCheckedNetChange">
                  <el-checkbox v-for="net in netOptions" :label="net" :key="net" disabled>{{net}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </li>
            <li class="clear">
              <span class="fl filterLabel">ISP选择：</span>
              <div class="fl filterItem">
                <el-checkbox v-model="checkAllIsp">全选</el-checkbox>
                <el-checkbox-group v-model="checkedIsps" @change="handleCheckedIspChange">
                  <el-checkbox v-for="isp in ispOptions" :label="isp" :key="isp" disabled>{{isp}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </li>
            <li class="clear">
              <span class="fl filterLabel">终端选择：</span>
              <div class="fl filterItem">
                <el-radio-group v-model="terminal">
                  <el-radio :label="1">
                    <span>全部</span>
                  </el-radio>
                  <el-radio :label="2">
                    <span @click="showTerminalDialog">特定终端</span>
                  </el-radio>
                </el-radio-group>
                <span class="terminalCount">存在{{terminalCount}}个终端</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="agreement filterContainer">
          <div v-if="active == 0">
            <h4 class="filterTitle">
              <span>协议配置</span>
              <el-switch v-model="pingSwitch" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </h4>
            <div class="agreementContent">
              <ul class="pingAgreeList clear">
                <li>
                  <span class="pingAgreelabel">超时时间(s)：</span>
                  <el-input
                    v-model="pingObj.timeout"
                    size="mini"
                    placeholder="请输入超时时间"
                    :disabled="!pingSwitch"
                  ></el-input>
                </li>
                <li>
                  <span class="pingAgreelabel">发送次数(次)：</span>
                  <el-input
                    v-model="pingObj.count"
                    size="mini"
                    placeholder="请输入发送次数"
                    :disabled="!pingSwitch"
                  ></el-input>
                </li>
                <li>
                  <span class="pingAgreelabel">数据包（字节）：</span>
                  <el-input
                    v-model="pingObj.packet_size"
                    size="mini"
                    placeholder="请输入大小"
                    :disabled="!pingSwitch"
                  ></el-input>
                </li>
              </ul>
            </div>
          </div>

          <div v-if="active == 1">
            <h4 class="filterTitle">
              <span>协议配置</span>
              <el-switch v-model="httpSwitch" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </h4>
            <div class="agreementContent">
              <ul class="pingAgreeList clear">
                <li>
                  <span class="pingAgreelabel">协议选择：</span>
                  <el-radio
                    v-model="httpObj.is_default"
                    label="HTTP1.1"
                    :disabled="!httpSwitch"
                  >HTTP1.1</el-radio>
                </li>
                <li>
                  <span class="pingAgreelabel">超时时间（s)：</span>
                  <el-input
                    v-model="httpObj.timeout"
                    size="mini"
                    placeholder="请输入超时时间"
                    :disabled="!httpSwitch"
                  ></el-input>
                </li>
                <li>
                  <span class="pingAgreelabel">允许重定向：</span>
                  <el-switch
                    v-model="httpObj.is_redirect"
                    :disabled="!httpSwitch"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                  ></el-switch>
                </li>
                <li>
                  <span class="pingAgreelabel">最大重定向数：</span>
                  <el-input
                    v-model="httpObj.redirect_count"
                    :disabled="!httpSwitch || !httpObj.is_redirect"
                    placeholder="请输入数量"
                    type="number"
                    size="mini"
                  ></el-input>
                </li>
                <li>
                  <span class="pingAgreelabel">页面快照：</span>
                  <el-switch
                    :disabled="!httpSwitch"
                    v-model="httpObj.is_snap"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                  ></el-switch>
                </li>
              </ul>
              <div id="jsonEditorBox" class="clear">
                <div class="fl item">
                  <h4 class="title">
                    认证(Authorization)
                    <el-tooltip placement="top" effect="light">
                      <div slot="content">目前，仅支持basic类型的安全验证.<br/>basic类型，格式如下:<br/>
                      {
                        'auth_type': 'basic',
                        'auth_user': '{username}:{password}'
                      }</div>
                      <span class="el-icon-question"></span>
                    </el-tooltip>
                  </h4>
                  <div id="authBox"></div>
                </div>
                <div class="fl item">
                  <h4 class="title">头部(headers)</h4>
                  <div id="headerBox"></div>
                </div>
                <div class="fl item">
                  <h4 class="title">主体(Body)</h4>
                  <div id="bodyBox"></div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="active == 3">
            <h4 class="filterTitle">
              <span>协议配置</span>
              <el-switch v-model="dnsSwitch" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </h4>
            <div class="agreementContent">
              <ul class="pingAgreeList clear">
                <li>
                  <span class="pingAgreelabel">DNS设置：</span>
                  <el-radio v-model="dnsObj.is_default" label="true" :disabled="!dnsSwitch">默认</el-radio>
                  <el-radio v-model="dnsObj.is_default" label="false" :disabled="!dnsSwitch">自定义</el-radio>
                  <el-input
                    v-model="dnsObj.dns_server"
                    size="mini"
                    placeholder="请输入IP地址"
                    :disabled="dnsObj.is_default == 'true' "
                  ></el-input>
                </li>
                <li>
                  <span class="pingAgreelabel">超时时间(s)：</span>
                  <el-input
                    v-model="dnsObj.timeout"
                    size="mini"
                    placeholder="请输入超时时间"
                    :disabled="!dnsSwitch"
                  ></el-input>
                </li>
              </ul>
            </div>
          </div>
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
        <el-button size="medium" v-show="taskStatusObj.resultLoading" @click="stopTask">结束</el-button>
      </div>
    </div>
    <div id="terminalDialog">
      <el-dialog title="终端选择" :visible.sync="terminalDialogVisible">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAllTerminal"
          @change="terminalhandleCheckAllChange"
        >全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <div v-for="(item,index) in terminals" :key="index" class="clear terminalItem">
          <span class="fl cityName">{{item.name}}</span>
          <el-checkbox-group
            v-model="checkedTerminals"
            @change="handleCheckedTerminalsChange"
            class="fl cityList"
          >
            <el-checkbox
              v-for="(item1,index1) in item.terminals"
              :label="item1"
              :key="index1"
            >{{item1.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import organizationSelect from "../../../components/organizationSelect.vue";
import regionSelect from "../../../components/regionSelect.vue";
let netOptions = ["有线", "无线", "移动"];
let ispOptions = ["电信", "移动", "联通", "校园网"];
const cityOptions = ["上海", "北京", "广州", "深圳"];
export default {
  name: "searchBox",
  components: {
    organizationSelect,
    regionSelect
  },
  props: ["active"],
  data() {
    return {
      searchValue: "",
      checkAllNet: true,
      checkedNets: ["有线", "无线"],
      netOptions: netOptions,
      isIndeterminateNet: true,
      checkAllIsp: true,
      checkedIsps: ["电信", "移动"],
      ispOptions: ispOptions,
      isIndeterminateIsp: true,
      form: {
        filterType: 1,
        filterCondition: this.cityList
      },
      terminal: 1,
      pingSwitch: false,
      httpSwitch: false,
      dnsSwitch: false,
      pingObj: {
        timeout: 1, //ping协议配置超时时间
        count: 10, //ping发送次数
        packet_size: 55 //ping数据包大小
      },
      dnsObj: {
        is_default: "true",
        timeout: 10,
        dns_server: "" //dns自定义ip
      },
      httpObj: {
        protocol: "HTTP1.1",
        timeout: 600,
        is_redirect: false,
        redirect_count: 5,
        is_snap: false,
        auth_info: null,
        header_info: null,
        body_info: null
      },
      taskId: "", //任务id
      taskInfo: {
        total: 0,
        success: 0,
        wrong: 0,
        responses: 0
        //    finished : false
      },
      finished: "0", //任务结束状态
      timer: null, //定时器
      taskStatus: 1, //当前状态 [1,2,3,4,5,6]//状态集对象
      taskStatusObj: {
        filterWrap: false, //filter外框的显示隐藏
        filterFlag: true, //filter过滤条件的显示隐藏
        resultLoading: false, //状态栏加载中提示
        finished: "0"
      }, //状态集对象
      protocol_type: "ping",
      cityList: ["all", "all"], //当前选中的地域列表
      organizationList: [], //当前选中的组织列表
      checkTerminalAll: false,
      cities: cityOptions,
      isIndeterminate: true,
      terminalDialogVisible: false,
      terminals: [], //终端集合
      checkedTerminals: [], //选中的终端
      terminalCount: 0,
      terminalList:[],
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
      ],
      options: {
        mode: "text",
        // modes: ['text', 'code'],
        mainMenuBar: false,
        onEditable: function(node) {
          if (!node.path) {
            // In modes code and text, node is empty: no path, field, or value
            // returning false makes the text area read-only
            return false;
          }
        },
        onError: function(err) {
          alert(err.toString());
        },
        onModeChange: function(newMode, oldMode) {
          console.log("Mode switched from", oldMode, "to", newMode);
        }
      },
      authEditor: null, //auth
      headerEditor:null, //header
      bodyEditor:null  //body

    };
  },
  created() {
    switch (this.active) {
      case 0:
        this.protocol_type = "ping";
        break;
      case 1:
        this.protocol_type = "http";
        break;
      case 2:
        this.protocol_type = "traceroute";
        break;
      case 3:
        this.protocol_type = "dns";
        break;
    }
  },
  mounted() {
    

    if (this.active == 1) {
      if (this.authEditor == null){
        let container1 = document.getElementById("authBox");
        this.authEditor = this.initEditor(container1, this.options);
      }
      if(this.headerEditor == null){
        let container2 = document.getElementById("headerBox");
        this.headerEditor = this.initEditor(container2, this.options);
      }
      if(this.bodyEditor == null){
        let container3 = document.getElementById("bodyBox");
        this.bodyEditor = this.initEditor(container3, this.options);
      }
    }
  },
  watch: {
    finished: {
      handler: function(newval, oldval) {
        if (newval == true) {
          clearInterval(this.timer);
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
            resultLoading: !this.finished,
            // disabled:false,
            finished: this.finished
          };
          break;
        case 2:
          this.taskStatusObj = {
            filterWrap: false,
            filterFlag: true,
            resultLoading: !this.finished,
            // disabled:false,
            finished: this.finished
          };
          break;
        case 3:
          this.taskStatusObj = {
            filterWrap: true,
            filterFlag: true,
            resultLoading: false,
            // disabled:false,
            finished: "0"
          };
          break;
        case 4:
          this.taskStatusObj = {
            filterWrap: true,
            filterFlag: true,
            resultLoading: !this.finished,
            // disabled:false,
            finished: this.finished
          };
          break;
        case 5:
          this.taskStatusObj = {
            filterWrap: true,
            filterFlag: false,
            resultLoading: false,
            // disabled:false,
            finished: "0"
          };
          break;
        case 6:
          this.taskStatusObj = {
            filterWrap: true,
            filterFlag: false,
            resultLoading: !this.finished,
            // disabled:false,
            finished: this.finished
          };
          break;
      }
    },
    "form.filterType":function(newval,oldval){
      if(newval != oldval){
        this.terminal = 1
        this.checkedTerminals = []
        this.checkAllTerminal = false
      }
    },

    httpSwitch: function(newval, oldval) {
      if (newval == true) {
        this.options = {
          mode: "code",
          mainMenuBar: false
        };
      } else {
        this.options = {
          mode: "text",
          // modes: ['text', 'code'],
          mainMenuBar: false,
          onEditable: function(node) {
            if (!node.path) {
              // In modes code and text, node is empty: no path, field, or value
              // returning false makes the text area read-only
              return false;
            }
          },
          
        };
      }
      let jsonEditorBox = document.getElementById("jsonEditorBox");
      let containers = jsonEditorBox.getElementsByClassName("jsoneditor");
      
      for (let i = 0; i < containers.length; i++) {
        containers[i].remove();
      }
      document
        .getElementById("headerBox")
        .getElementsByClassName("jsoneditor")[0]
        .remove();
      this.authEditor = null
      this.headerEditor = null
      this.bodyEditor = null
      if (this.authEditor == null) {
        let container = document.getElementById("authBox");
        this.authEditor = this.initEditor(container, this.options);
      }
      if (this.headerEditor == null) {
        let container = document.getElementById("headerBox");
        this.headerEditor = this.initEditor(container, this.options);
      }
      if (this.bodyEditor == null) {
        let container = document.getElementById("bodyBox");
        this.bodyEditor = this.initEditor(container, this.options);
      }
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedNets = val ? netOptions : [];
      this.isIndeterminateNet = false;
    },
    handleCheckedNetChange(value) {
      let checkedCount = value.length;
      this.checkAllNet = checkedCount === this.checkedNets.length;
      this.isIndeterminateNet =
        checkedCount > 0 && checkedCount < this.netOptions.length;
    },
    isphandleCheckAllChange(val) {
      this.checkedIsps = val ? ispOptions : [];
      this.isIndeterminateIsp = false;
    },
    handleCheckedIspChange(value) {
      let checkedCount = value.length;
      this.checkAllIsp = checkedCount === this.checkedIsps.length;
      this.isIndeterminateIsp =
        checkedCount > 0 && checkedCount < this.ispOptions.length;
    },
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
    getParentIdHandle(val) {

      this.form.filterCondition = this.organizationList;
      this.organizationList = val;
      this.getTerminalCount();
      this.getTerminalList();
    },
    getCityHandle(val) {
      this.cityList = val;
      this.getTerminalCount();
      this.getTerminalList();
    },
    createTask() {
      this.getHttpJson();

      let filter_type,
        filter_condition,
        terminal_select,
        terminals = [];
      let protocol_configuration = null;
      let protocol_switch = false;
      switch (this.active) {
        case 0:
          protocol_switch = this.pingSwitch;
          protocol_configuration = this.pingSwitch ? this.pingObj : null;
          break;
        case 1:
          protocol_switch = this.httpSwitch;
          protocol_configuration = this.httpSwitch ? this.httpObj : null;
          break;
        case 2:
          protocol_switch = false;
          break;
        case 3:
          protocol_switch = this.dnsSwitch;

          protocol_configuration = this.dnsSwitch ? this.dnsObj : null;
          break;
      }
      //过滤地域组织
      if (this.form.filterType == 1) {
        filter_type = "region";
        filter_condition = this.cityList;
      } else {
        filter_type = "organization";
        filter_condition = this.organizationList;
      }
      //过滤终端
      if (this.terminal == 1) {
        terminal_select = false;
        terminals = [];
      } else {
        terminal_select = true;
        terminals = []
        this.checkedTerminals.forEach((item, index) => {
          terminals.push(item.value);
        });
      }

      let terminal_configuration = {
        filter_type: filter_type,
        filter_condition: filter_condition,
        network_type: ["all"],
        isp_type: ["all"],
        terminal_select: terminal_select,
        terminals: terminals
      };
      if (!this.taskStatusObj.filterWrap) {
        terminal_configuration = null;
      }
      let data = {
        protocol_type: this.protocol_type,
        destination: this.searchValue,
        advanced_switch: this.taskStatusObj.filterWrap,
        terminal_configuration: terminal_configuration,
        protocol_switch: protocol_switch,
        protocol_configuration: protocol_configuration
      };
      if (this.protocol_type == "http") {
        data = {
          protocol_type: this.protocol_type,
          http_method: this.httpMethod,
          destination: this.searchValue,
          advanced_switch: this.taskStatusObj.filterWrap,
          terminal_configuration: terminal_configuration,
          protocol_switch: protocol_switch,
          protocol_configuration: protocol_configuration
        };
      }
      this.$post({
        url: HP1 + "/benchmark/instant/task/v1",
        data: data
      }).then(res => {
        if (res.data.code == 200) {
          this.taskId = res.data.info.task_id;
          this.$emit("getTaskStatus", {
            finished: this.finished,
            taskId: this.taskId
          });
          this.getTaskStatus();
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          });
        }
      });
    },
    getTaskStatus() {
      this.$get({
        url: HP1 + "/benchmark/instant/status/v1",
        data: {
          task_id: this.taskId
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.taskInfo = { ...res.data.info };
          this.finished = this.taskInfo.finished;
          this.$emit("getTaskStatus", {
            finished: this.finished,
            taskId: this.taskId
          });
          switch (this.taskStatus) {
            case 1:
              this.taskStatus = 2;
              break;
            case 2:
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
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          });
        }
      });
    },
    stopTask() {
      this.$put({
        url: HP1 + "/benchmark/instant/status/v1",
        data: {
          task_id: this.taskId
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.taskInfo = { ...res.data.info };
          this.finished = res.data.info.finished;
          this.$emit("getTaskStatus", {
            finished: this.finished,
            taskId: this.taskId
          });
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
        }
      });
    },
    showTerminalDialog() {
      this.terminalDialogVisible = true;
    },
    getTerminalList() {
      this.$post({
        url: HP1 + "/terminal/common/terminals/list/v1",
        data: {
          type: this.form.filterType == 1 ? "region" : "organization",
          is_classify: true,
          filter_condition:
            this.form.filterType == 1 ? this.cityList : this.organizationList
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.terminalList = []
          this.terminals = res.data.info;
          this.terminals.forEach((item,index)=>{
            item.terminals.forEach((item1,index1)=>{
              this.terminalList.push(item1)
            })
          })
        }
      });
    },
    getTerminalCount() {
      this.$post({
        url: HP1 + "/terminal/common/terminals/count/v1",
        data: {
          type: this.form.filterType == 1 ? "region" : "organization",
          filter_condition:
            this.form.filterType == 1
              ? this.cityList
              : this.organizationList
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.terminalCount = res.data.info.alive;
        } else {
          this.$message({
            message: res.data.message,
            type: "error"
          });
        }
      });
    },
    terminalhandleCheckAllChange(val) {
      this.checkedTerminals = val ? this.terminalList : [];
      this.isIndeterminate = false;
    },
    handleCheckedTerminalsChange(value) {
      let checkedCount = value.length;
      this.checkAllTerminal = checkedCount === this.terminalCount;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.terminalCount
    },
    confirmHandle() {
      this.terminalDialogVisible = false;
    },
    initEditor(dom, option) {
      return new JSONEditor(dom, this.options)
    },
    getHttpJson() {
      if(this.authEditor != null){
        this.httpObj.auth_info = JSON.stringify(this.authEditor.get())
        this.httpObj.header_info = JSON.stringify(this.headerEditor.get())
        this.httpObj.body_info = JSON.stringify(this.bodyEditor.get())
      }
      
    }
  },
  destroyed(){
    clearInterval(this.timer)
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
#filterBox .el-select {
  margin-top: 0;
}
#filterBox .el-checkbox-group {
  display: inline-block;
}
#filterBox .el-switch {
  margin-top: 3px;
}
#terminalDialog .el-checkbox__label {
  width: 150px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  vertical-align: middle;
}
.el-switch {
  float: right;
}
#stop .el-button {
  background: #f44336;
  color: #fff;
  border: none;
}
#terminalDialog .el-checkbox {
  min-width: 150px;
  margin-right: 5px;
}
#terminalDialog .el-checkbox + .el-checkbox {
  margin-left: 0;
}
#searchBox .searchInput {
  width: calc(100% - 350px);
}
.agreementContent .el-input {
  width: 120px;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.filterWrap {
  position: relative;
}
.filterWrap .upTip {
  height: 30px;
  font-size: 12px;
  line-height: 30px;
  padding-left: 15px;
  color: #000;
  background: rgba(139, 195, 74, 0.52);
  border-radius: 5px;
}
#filterBox {
  margin: 15px 0 0;
  position: relative;
  border: 1px solid #ebebeb;
  box-shadow: 0 0 8px rgba(232, 237, 250, 0.6);
  border-radius: 5px;
  padding: 20px;
  background: #fff;
}
#filterBox .filterContainer {
  border: 1px solid #ebebeb;
  margin: 10px 10px;
  padding: 10px 0;
  border-radius: 5px;
}
.filterContainer .filterTitle {
  font-size: 14px;
  line-height: 30px;
  border-bottom: 1px solid #ebebeb;
  text-indent: 15px;
}
.filterContainer .filterList {
  padding: 15px;
}
.filterList li {
  font-size: 14px;
  line-height: 30px;
}
.searchBar {
  margin-bottom: 10px;
}
.icon-xiangshangjiantou {
  color: #efb336;
  position: absolute;
  left: 50%;
  bottom: -40px;
  font-size: 40px;
}
.icon-xiangxiajiantou {
  color: #efb336;
  top: 10px;
  position: absolute;
  left: 50%;
  font-size: 40px;
}
#resultBox {
  float: left;
  border: 1px solid #ebebeb;
  box-shadow: 0 0 8px rgba(232, 237, 250, 0.6);
  border-radius: 5px;
  padding: 10px;
  background: #fff;
}
#resultBox li {
  width: 150px;
  font-size: 14px;
  line-height: 28px;
  padding: 5px 8px;
  border: 1px solid #ff980066;
  box-shadow: 0 0 8px rgba(232, 237, 250, 0.6);
  border-radius: 5px;
  float: left;
  margin-right: 8px;
}
#resultBox .icon {
  font-size: 20px;
  float: left;
  width: 20%;
  margin-top: 10px;
}
#resultBox .iconContent {
  width: 70%;
  float: right;
}
.iconContent strong {
  font-weight: 500;
  display: block;
  font-size: 15px;
  height: 20px;
  line-height: 20px;
  text-align: center;
}
.iconContent span {
  font-size: 14px;
  font-weight: 500;
  line-height: 30px;
  height: 30px;
  margin-top: 10px;
  display: block;
  text-align: center;
}
.icon-xiafashuju {
  color: #1296db;
}
.icon-responseOrder {
  color: #be8dbd;
}
.icon-wuuiconxuan {
  color: #2aa515;
}
.icon-cuowu {
  color: #e16531;
}
#resultWrap {
  margin-top: 30px;
}
#resultWrap #stop {
  border: none;
  float: left;
  margin: 25px 0 0 10px;
}
.filterLabel {
  width: 80px;
}
.filterItem {
  margin-left: 10px;
}
.terminalItem {
  width: 100%;
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
}
.terminalItem .cityName {
  width: 100px;
}
.terminalItem .cityList {
  width: 85%;
}
/* 协议配置 */
.agreementContent {
  padding: 10px 10px 0;
}
.pingAgreeList li {
  font-size: 14px;
  line-height: 30px;
  height: 30px;
  float: left;
  margin: 0 20px 10px 0;
}
.pingAgreeList li .pingAgreelabel {
  text-align: right;
}
.terminalCount {
  display: inline-block;
  margin-left: 10px;
  margin-top: -5px;
  vertical-align: middle;
}
.terminalAreaName {
  font-size: 14px;
  line-height: 28px;
  display: block;
  margin: 10px 0;
}
.icon-kaiqi1 {
  color: #333;
}
.icon-kaiqi2 {
  color: #2aa515;
}
#jsonEditorBox {
  width: 100%;
}
#jsonEditorBox .title {
  font-size: 14px;
  line-height: 30px;
}
#jsonEditorBox .item {
  width: 33.3%;
  padding: 20px;
  border: 1px solid #ddd;
}
#authBox{
  margin-top:30px;
}
#headerBox{
  margin-top:30px;
}
#bodyBox{
  margin-top:30px;
}
</style>
