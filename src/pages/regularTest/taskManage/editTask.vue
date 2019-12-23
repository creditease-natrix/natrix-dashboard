<template>
  <div>
    <div id="nav">
      <span class="title">云拨测——编辑定时测任务</span>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <a :href="href" class="home">
          云拨测
          <i class="el-breadcrumb__separator el-icon-arrow-right"></i>
        </a>
        <el-breadcrumb-item>定时测</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/timedTaskList' }">定时测</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      size="mini"
      ref="ruleForm"
      label-width="140px"
      class="demo-ruleForm"
    >
      <el-form-item label="任务名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="任务描述" prop="description">
        <el-input type="textarea" v-model="ruleForm.description"></el-input>
      </el-form-item>
      <el-form-item label="任务范围" prop="scope">
        <el-radio-group v-model="ruleForm.scope">
          <el-radio label="public"></el-radio>
          <el-radio label="private"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="监测地址" prop="destination">
        <el-input v-model="ruleForm.destination"></el-input>
      </el-form-item>
      <el-form-item label="监测频率" prop="frequency">
        <el-input v-model.number="ruleForm.frequency" type="number"></el-input>（分）
      </el-form-item>
      <el-form-item label="终端配置" prop="terminal_switch">
        <el-switch
          v-model="ruleForm.terminal_switch"
          active-color="#13ce66"
          inactive-color="#ff4949"
        ></el-switch>
        <terminalConfig
          ref="terminalConfig"
          :terminalConfig="ruleForm.terminal_configuration"
          v-if="ruleForm.terminal_switch"
        ></terminalConfig>
      </el-form-item>
      <el-form-item label="协议类型" prop="protocol_type">
        <el-radio-group v-model="ruleForm.protocol_type" disabled>
          <el-radio label="PING"></el-radio>
          <el-radio label="HTTP"></el-radio>
          <el-radio label="DNS"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="HTTP方法" prop="http_method" v-if="ruleForm.protocol_type == 'HTTP' ">
        <el-select v-model="ruleForm.http_method" placeholder="请选择请求方式">
          <el-option label="get" value="get"></el-option>
          <el-option label="post" value="post"></el-option>
          <el-option label="put" value="put"></el-option>
          <el-option label="delete" value="delete"></el-option>
          <el-option label="header" value="header"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="协议配置" prop="protocol_switch">
        <el-switch
          v-model="ruleForm.protocol_switch"
          active-color="#13ce66"
          inactive-color="#ff4949"
        ></el-switch>
        <protocolConfig
          :active="ruleForm.protocol_type"
          ref="protocolConfig"
          :protocolConfig="ruleForm.protocol_configuration"
          v-if="ruleForm.protocol_switch"
        ></protocolConfig>
      </el-form-item>

      <el-form-item label="生效时间" prop="effective_time" class="taskEdit">
        <el-date-picker
          size="mini"
          v-model="ruleForm.effective_time"
          type="datetime"
          value-format="timestamp"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="失效时间" prop="expiry_time" class="taskEdit">
        <el-date-picker
          size="mini"
          v-model="ruleForm.expiry_time"
          type="datetime"
          value-format="timestamp"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item class="formButtonbox">
        <el-button @click="resetForm('ruleForm')" size="mini" type="warning">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" size="mini">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import terminalConfig from "./components/terminalConfig";
import protocolConfig from "./components/protocolConfig";
import { timeStamp1 ,messageTip} from "../../../until/index.js";
export default {
  name: "",
  components: {
    terminalConfig,
    protocolConfig
  },
  data() {
    return {
      href: ManageIndex,
      page_Count: 1,
      pageNum: 1,
      pageShow: false,
      ruleForm: {
        name: "",
        description: "",
        scope: "private",
        destination: "",
        frequency: 5,
        terminal_switch: false,
        protocol_type: "ping",
        http_method: "get",
        protocolConfig: false,
        effective_time: "",
        expiry_time: "",
        protocol_configuration: {},
        terminal_configuration: {}
      },
      rules: {
        name: [
          { required: true, message: "请输入任务名称", trigger: "blur" },
          { min: 1, max: 16, message: "长度在 1 到 16 个字符", trigger: "blur" }
        ],
        destination: [
          { required: true, message: "请输入地址", trigger: "blur" }
        ],
        scope: [
          { required: true, message: "请选择任务范围", trigger: "change" }
        ],
        frequency: [
          {
            type: "number",
            required: true,
            message: "请输入监测频率",
            trigger: "blur"
          }
          // { min: 1,  message: '最小值为1', trigger: 'blur' }
        ],
        http_method: [
          { required: true, message: "请选择HTTP方法", trigger: "change" }
        ],
        protocol_type: [
          { required: true, message: "请选择协议类型", trigger: "change" }
        ],
        effective_time: [
          { required: true, message: "请选择开始时间", trigger: "change" }
        ],
        expiry_time: [
          { required: true, message: "请选择结束时间", trigger: "change" }
        ]
      }
    };
  },
  created() {},
  watch: {},
  mounted() {
    this.getTaskInfo();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.editTask();
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      // this.$refs[formName].resetFields();
      window.history.go(-1);
    },
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
          this.ruleForm.protocol_type = this.ruleForm.protocol_type.toUpperCase();
        }
      });
    },
    editTask() {
      let terminals = [];
      let protocol_configuration = {};
      let auth_info, header_info, body_info, terminal_configuration;
      if (this.ruleForm.terminal_switch) {
        if (
          this.$refs.terminalConfig.terminals &&
          this.$refs.terminalConfig.terminals.length > 0
        ) {
          this.$refs.terminalConfig.checkedTerminals.forEach((item, index) => {
            terminals.push(item);
          });
        }
        terminal_configuration = {
          filter_type: "region",
          filter_condition: [
            this.$refs.terminalConfig.province,
            this.$refs.terminalConfig.city
          ],
          group_own:this.$refs.terminalConfig.checked,
          terminal_select:
            this.$refs.terminalConfig.terminal == 1 ? false : true,
          terminals: this.$refs.terminalConfig.terminal === 1 ? null : terminals
        };
      } else {
        terminal_configuration = null;
      }

      if (this.ruleForm.protocol_switch) {
        switch (this.ruleForm.protocol_type) {
          case "PING":
            protocol_configuration = this.$refs.protocolConfig.pingObj;
            break;
          case "HTTP":
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
          case "DNS":
            protocol_configuration = this.$refs.protocolConfig.dnsObj;
            break;
        }
      }

      let ruleForm = {
        ...this.ruleForm,
        terminal_configuration: terminal_configuration,
        protocol_type: this.ruleForm.protocol_type.toLowerCase(),
        protocol_configuration: this.ruleForm.protocol_switch
          ? protocol_configuration
          : null
      };
      if (ruleForm.expiry_time < ruleForm.effective_time) {
        this.$message({
          type: "error",
          message: "失效时间必须大于生效时间"
        });
        return false;
      } else {
        this.$put({
          url: HP1 + "/benchmark/timed/task/v1",
          data: ruleForm
        }).then(res => {
          if (res.data.code == 200) {
            messageTip("success",this.$t(res.data.message))
            this.$router.push({
              path: "timedTaskList"
            });
          } else {
            messageTip("error",this.$t(res.data.message))
          }
        });
      }
    },
    isObjEmpty(obj) {
      return JSON.stringify(obj);
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.taskEdit .el-date-editor.el-input {
  width: 200px !important;
}
</style>
<style scoped>
@import "../../../../static/css/resetEle.css";
</style>
