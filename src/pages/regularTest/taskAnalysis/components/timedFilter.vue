<template>
  <div class="optionBox clear" id="timedFilter">
    <div class="fl filterOption">
      <span>协议类型：</span>
      <el-select size="mini" @change="getTaskList(true)" v-model="type" placeholder="请选择">
        <el-option
          v-for="item in typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="fl filterOption">
      <span>监测任务：</span>
      <el-select size="mini" @change="getTaskInfo" v-model="task" placeholder="请选择">
        <el-option
          v-for="item in taskList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="fl filterOption">
      <span>开始时间：</span>
      <!-- <el-date-picker
            size="mini"
            v-model="startTime"
            type="datetime"
            value-format="timestamp"
            placeholder="开始日期时间">
            </el-date-picker>
            <span>结束时间：</span>
            <el-date-picker
            size="mini"
            v-model="endTime"
            type="datetime"
            value-format="timestamp"
            placeholder="结束日期时间">
      </el-date-picker>-->
      <el-date-picker
        v-model="time"
        value-format="timestamp"
        type="datetimerange"
        size="mini"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      ></el-date-picker>
    </div>
    <!-- <div class="fl">
            <el-button type="primary" size="mini" @click="confirmHandle">确定</el-button>
    </div>-->
  </div>
</template>

<script>
export default {
  name: "timedFilter",
  props: {
    taskId: {
      type: String
    }
  },
  components: {},
  data() {
    return {
      type: "all",
      typeOptions: [
        {
          value: "all",
          label: "全部"
        },
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
      ],
      taskList: [],
      task: "",
      time: [new Date().setHours(0, 0, 0), new Date().getTime()],
      startTime: "",
      endTime: "",
      taskInfo: {},
      pickerOptions: {
        shortcuts: [
          {
            text: "最近1小时",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近6小时",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 6);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近1天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近1周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  created() {},
  watch: {
    time: {
      handler: function(newval, oldval) {
        this.confirmHandle();
      },
      deep: true
    }
  },
  mounted() {
    this.getTaskList();
  },
  methods: {
    getTaskList(origin) {
      this.$get({
        url: HP1 + "/benchmark/timed/task/select/v1",
        data: {
          protocol_type: this.type
        }
      }).then(res => {
        this.taskList = [];
        if (res.data.code == 200) {
          res.data.info.forEach((item, index) => {
            this.taskList.push({
              value: item.id,
              label: item.name
            });
          });
          if (this.taskId) {
            if (origin == true) {
              this.task = this.taskList[0].value;
            } else {
              this.task = this.taskId;
            }
          } else {
            this.task = this.taskList.length > 0 ? this.taskList[0].value : "";
          }
          if (this.task && this.task != undefined) {
            this.getTaskInfo(this.task);
          }
        }
      });
    },
    getTaskInfo(id) {
      this.$get({
        url: HP1 + "/benchmark/timed/task/v1",
        data: {
          task_id: id,
          info_type: "brief"
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.taskInfo = { ...res.data.data };
          this.$emit("getdata", this.taskInfo);
        } else {
          this.$emit("getdata", {});
          messageTip("error",this.$t(res.data.message))
        }
        this.confirmHandle();
      });
    },
    confirmHandle() {
      this.startTime = this.time[0];
      this.endTime = this.time[1];
      this.$emit("gettaskdata", {
        task_id: this.task,
        start_time: this.startTime,
        end_time: this.endTime
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#timedFilter .el-select {
  width: 150px;
}
#timedFilter .el-input--prefix .el-input__inner {
  padding-left: 20px;
  padding-right: 0;
}

#timedFilter .el-input__prefix {
  left: 0;
}
</style>
<style scoped>
@import "../../../../../static/css/resetEle.css";
.filterOption {
  margin-right: 5px;
}
</style>
