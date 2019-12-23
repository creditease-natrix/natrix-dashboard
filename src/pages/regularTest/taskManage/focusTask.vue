<template>
  <div>
    <div id="nav">
      <span class="title">云拨测——关注定时测任务</span>
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
      <el-form-item label="协议类型" prop="type">
        <el-select v-model="ruleForm.type" placeholder="请选择协议类型" @change="getFocusList" size="mini">
          <el-option
          v-for="item in typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          ></el-option>
          <!-- <el-option label="ping" value="ping"></el-option>
          <el-option label="http" value="http"></el-option>
          <el-option label="dns" value="dns"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item label="任务选择" prop="task">
        <el-select
          v-model="ruleForm.task"
          @change="getBriefinfo(ruleForm.task)"
          placeholder="请选择任务"
          size="mini"
        >
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="(item,index ) in taskList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label prop>
        <div class="taskListBox">
          <ul>
            <li class="listItem clear">
              <span class="fl labelItem">任务名称：</span>
              <p class="fl labelContent taskName">
                <a
                  href="javascript:void(0)"
                  class="detailColor"
                  @click="gotoTaskInfo"
                >{{briefInfo.name}}</a>
              </p>
            </li>
            <li class="listItem clear">
              <span class="fl labelItem">监控地址：</span>
              <p class="fl labelContent">{{briefInfo.destination}}</p>
            </li>
            <li class="listItem clear">
              <div class="fl status">
                <span class="fl labelItem">任务状态：</span>
                {{$t(briefInfo.status)}}
              </div>
              <div class="fl status">
                <span class="fl labelItem">监控频率：</span>
                {{briefInfo.frequency}}（分钟）
              </div>
            </li>
            <li class="listItem clear">
              <span class="fl labelItem">创建时间：</span>
              <p class="fl labelContent">{{briefInfo.create_time}}</p>
            </li>
            <li class="listItem clear">
              <span class="fl labelItem">任务描述：</span>
              <p class="fl labelContent">{{briefInfo.description}}</p>
            </li>
          </ul>
        </div>
        <el-form-item class="submit formButtonbox">
          <el-button @click="unFocus" size="mini" type="warning">取消</el-button>
          <el-button type="primary" @click="focusTask" size="mini">关注</el-button>
        </el-form-item>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { timeStamp1 ,messageTip} from "../../../until/index.js";
import page from "../../../components/page";
export default {
  name: "",
  components: {
    page
  },
  data() {
    return {
      href: ManageIndex,
      ruleForm: {
        type: "ping",
        task: ""
      },
      taskList: [],
      briefInfo: {},
      rules: {
        type: [
          { required: true, message: "请选择协议类型", trigger: "change" }
        ],
        task: [{ required: true, message: "请选择任务", trigger: "change" }]
      },
      typeOptions: [
          {
              value: "ping",
              label: "PING"
          },
          {
              value: "http",
              label: "HTTP"
          },
          {
              value: "dns",
              label: "DNS"
          }
      ]
    };
  },
  created() {},
  watch: {},
  mounted() {
    this.getFocusList();
  },
  methods: {
    getFocusList() {
      this.$get({
        url: HP1 + "/benchmark/timed/unfollowedTask/list/v1",
        data: {
          protocol_type: this.ruleForm.type
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.taskList = res.data.info;

          if (this.taskList.length > 0) {
            this.ruleForm.task = this.taskList[0].id;
            this.getBriefinfo(this.ruleForm.task);
          } else {
            this.ruleForm.task = "";
            this.briefInfo = {};
          }
        } else {
          messageTip("error",this.$t(res.data.message))
        }
      });
    },
    getBriefinfo(id) {
      this.$get({
        url: HP1 + "/benchmark/timed/task/v1",
        data: {
          task_id: id,
          info_type: "brief"
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.briefInfo = { ...res.data.data };
          this.briefInfo.create_time = timeStamp1(this.briefInfo.create_time);
        } else {
          messageTip("error",this.$t(res.data.message))
        }
      });
    },
    gotoTaskInfo() {
      this.$router.push({
        path: "taskInfo",
        query: {
          taskId: this.briefInfo.id
        }
      });
    },
    focusTask() {
      if (this.ruleForm.task == "") {
        this.$message({
          type: "error",
          message: "您未选择要关注的任务！"
        });
        return false;
      } else {
        this.$put({
          url: HP1 + "/benchmark/timed/operation/v1",
          data: {
            task_id: this.ruleForm.task,
            operation: "followed"
          }
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
    unFocus() {
      this.$router.push({
        path: "timedTaskList"
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
<style scoped>
.taskListBox {
  width: 500px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ebebeb;
  box-shadow: 0 0 8px rgba(232, 237, 250, 0.6);
}
.taskListBox li {
  font-size: 14px;
  line-height: 30px;
  margin: 5px 0 10px 0;
}
.listItem .labelItem {
  min-width: 80px;
}
.listItem .labelContent {
  width: 80%;
}
.listItem .taskName {
  width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.listItem .status {
  width: 50%;
}
.submit {
  text-align:right;
  /* width: 500px; */
  margin: 20px 0 0 0;
}
</style>
