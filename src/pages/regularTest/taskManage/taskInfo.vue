<template>
  <div>
    <div id="nav">
      <span class="title">云拨测——定时测详情</span>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <a :href="href" class="home">
          云拨测
          <i class="el-breadcrumb__separator el-icon-arrow-right"></i>
        </a>
        <el-breadcrumb-item>定时测</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/timedTaskList' }">定时测</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :model="ruleForm" size="mini" ref="ruleForm" label-width="140px" class="demo-ruleForm">
      <el-form-item label="任务名称：">
        <p>{{ruleForm.name}}</p>
      </el-form-item>
      <div class="clear">
        <el-form-item label="任务类型：" class="fl">
          <p class="labelItem">{{$t(ruleForm.scope)}}</p>
        </el-form-item>
        <el-form-item label="协议类型：" class="fl">
          <p class="labelItem">{{ruleForm.protocol_type}}</p>
        </el-form-item>
        <el-form-item label="监控频率：" class="fl">
          <p class="labelItem">{{ruleForm.frequency}}（分）</p>
        </el-form-item>
      </div>
      <div class="clear">
        <el-form-item label="任务状态：" class="fl">
          <p class="labelItem">{{$t(ruleForm.status)}}</p>
        </el-form-item>
        <el-form-item label="创建时间：" class="fl">
          <p class="labelItem">{{ruleForm.create_time}}</p>
        </el-form-item>
      </div>
      <div class="clear">
        <el-form-item label="生效时间：" class="fl">
          <p class="labelItem">{{ruleForm.effective_time}}</p>
        </el-form-item>
        <el-form-item label="失效时间：" class="fl">
          <p class="labelItem">{{ruleForm.expiry_time}}</p>
        </el-form-item>
      </div>
      <el-form-item label="监控地址：">
        <p>{{ruleForm.destination}}</p>
      </el-form-item>
      <el-form-item label="终端配置：">
        <el-switch
          disabled
          v-model="ruleForm.terminal_switch"
          active-color="#13ce66"
          inactive-color="#ff4949"
        ></el-switch>
        <terminalConfig
          v-if="ruleForm.terminal_switch"
          :terminalConfig="ruleForm.terminal_configuration"
          :disabled="true"
        ></terminalConfig>
      </el-form-item>
      <el-form-item label="协议配置：">
        <el-switch
          disabled
          v-model="ruleForm.protocol_switch"
          active-color="#13ce66"
          inactive-color="#ff4949"
        ></el-switch>
        <protocolConfig
          :active="ruleForm.protocol_type.toUpperCase() "
          :protocolConfig="ruleForm.protocol_configuration"
          v-show="ruleForm.protocol_switch"
          :disabled="true"
        ></protocolConfig>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import terminalConfig from "./components/terminalConfig";
import protocolConfig from "./components/protocolConfig";
import { timeStamp1 } from "../../../until/index.js";
export default {
  name: "",
  components: {
    terminalConfig,
    protocolConfig
  },
  data() {
    return {
      href: ManageIndex,
      ruleForm: {
        name: "",
        description: "",
        scope: "",
        destination: "",
        frequency: 0,
        terminal_switch: false,
        protocol_type: "",
        http_method: "",
        protocol_switch: false,
        effective_time: "",
        expiry_time: "",
        protocol_configuration: {},
        terminal_configuration: {}
      }
    };
  },
  created() {},
  watch: {},
  mounted() {
    this.getTaskInfo();
  },
  methods: {
    getTaskInfo() {
      this.$get({
        url: HP1 + "/benchmark/timed/task/v1",
        data: {
          task_id: this.$route.query.taskId,
          info_type: "detailed"
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.ruleForm = { ...res.data.data };
          this.ruleForm.effective_time = timeStamp1(
            this.ruleForm.effective_time
          );
          this.ruleForm.expiry_time = timeStamp1(this.ruleForm.expiry_time);
          this.ruleForm.create_time = timeStamp1(this.ruleForm.create_time);
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
<style scoped>
@import "../../../../static/css/resetEle.css";
.labelItem {
  width: 150px;
}
</style>
