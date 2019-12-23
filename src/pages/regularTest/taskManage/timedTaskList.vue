<template>
  <div>
    <div id="nav">
      <span class="title">云拨测——定时测</span>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <a :href="href" class="home">
          云拨测
          <i class="el-breadcrumb__separator el-icon-arrow-right"></i>
        </a>
        <el-breadcrumb-item :to="{path:''}">定时测</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/timedTaskList' }">定时测</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="optionBox clear">
      <div class="fl">
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="gotoAddTask">创建</el-button>
        <el-button type="primary" size="mini" icon="el-icon-star-on" @click="gotoFocusTask">关注</el-button>
      </div>

      <el-input class="fr" placeholder="根据任务名称和地址" size="mini" v-model="searchWord">
        <el-button slot="append" icon="el-icon-search" size="mini" @click="getTaskList(1)"></el-button>
      </el-input>
    </div>
    <el-table :data="tableData" border>
      <el-table-column prop="name" label="任务名称" width="180">
        <template slot-scope="scope">
          <a class="detailColor cursor" @click="gotoTaskInfo(scope.row.id)">{{scope.row.name}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="scope" label="范围" width="100"></el-table-column>
      <el-table-column prop="protocol_type" width="100" label="协议类型"></el-table-column>
      <el-table-column prop="destination" label="地址"></el-table-column>
      <el-table-column prop="frequency" width="60" label="频率"></el-table-column>
      <el-table-column width="60" label="状态">
        <template slot-scope="scope">
          <span
            class="statusBtn successBk"
            v-if="scope.row.status == 'running'"
          >{{$t(scope.row.status)}}</span>
          <span
            class="statusBtn defaultBk"
            v-if="scope.row.status == 'expired'"
          >{{$t(scope.row.status)}}</span>
          <span
            class="statusBtn errorBk"
            v-if="scope.row.status == 'stoped'"
          >{{$t(scope.row.status)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="effective_time" width="120" label="生效时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-show="scope.row.analyseShow"
            size="mini"
            type="default"
            @click="gotoTaskAnalysis(scope.$index,scope.row)"
          >分析</el-button>
          <el-button
            v-show="scope.row.editShow"
            size="mini"
            type="warning"
            @click="handleEdit(scope.$index, scope.row)"
          >修改</el-button>
          <el-button
            v-show="scope.row.onShow"
            size="mini"
            type="success"
            @click="turnOnHandle(scope.$index, scope.row)"
          >开启</el-button>
          <el-button
            v-show="scope.row.offShow"
            size="mini"
            type="off"
            @click="turnOffHandle(scope.$index, scope.row)"
          >暂停</el-button>
          <el-button
            size="mini"
            v-show="scope.row.deleteShow"
            type="danger"
            @click="handleDel(scope.$index, scope.row)"
          >删除</el-button>
          <el-button
            v-show="scope.row.unfollowedShow"
            size="mini"
            type="unfollowed"
            @click="handleUnfollow(scope.$index, scope.row)"
          >取关</el-button>
          <!-- <el-button v-show="scope.row.alertShow" size="mini" type="primary" icon="el-icon-plus">告警</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <page
      :pageCount="page_Count"
      :item_count="item_count"
      ref="page"
      :currentPage="currentPageNum"
      v-on:page-change="pageChangeHandle"
      v-show="pageShow"
    ></page>
  </div>
</template>

<script>
import page from "../../../components/page";
import { timeStamp1,messageTip } from "../../../until/index.js";
export default {
  name: "",
  components: {
    page
  },
  data() {
    return {
      href: ManageIndex,
      searchWord: "",
      tableData: [],
      page_Count: 1,
      pageNum: 1,
      pageShow: false,
      currentPageNum: 1,
      item_count: 0
    };
  },
  created() {},
  watch: {},
  mounted() {
    this.getTaskList(1);
  },
  methods: {
    pageChangeHandle(currentPageNum) {
      this.getTaskList(currentPageNum);
    },
    getTaskList(num) {
      this.$get({
        url: HP1 + "/benchmark/timed/task/list/v1",
        data: {
          search: this.searchWord,
          is_paginate: true,
          pagenum: num
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.item_count = res.data.item_count;
          this.page_Count = res.data.page_count;
          this.pageNum = res.data.page_num;
          this.pageShow = res.data.page_count > 0 ? true : false;
          this.tableData = res.data.info;
          this.tableData.forEach((item, index) => {
            item.effective_time = timeStamp1(item.effective_time);
            item.analyseShow = item.operations.includes("analyse");
            item.editShow = item.operations.includes("edit");
            item.offShow = item.operations.includes("off");
            item.onShow = item.operations.includes("on");
            item.deleteShow = item.operations.includes("delete");
            item.alertShow = item.operations.includes("alert");
            item.unfollowedShow = item.operations.includes("unfollowed");
            // item.status = this.$t(item.status)
            item.scope = this.$t(item.scope);
          });
        }
      });
    },
    gotoAddTask() {
      this.$router.push({
        path: "addTask"
      });
    },
    gotoFocusTask() {
      this.$router.push({
        path: "focusTask"
      });
    },
    gotoTaskInfo(id) {
      this.$router.push({
        path: "taskInfo",
        query: {
          taskId: id
        }
      });
    },
    handleEdit(index, row) {
      this.$router.push({
        path: "editTask",
        query: {
          taskId: row.id
        }
      });
    },
    handleDel(index, row) {
      this.$confirm("此操作将永久删除该任务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteHandle(row.id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    deleteHandle(id) {
      this.$delete({
        url: HP1 + "/benchmark/timed/task/v1",
        data: {
          task_id: id
        }
      }).then(res => {
        if (res.data.code == 200) {
          messageTip("success",this.$t(res.data.message))
          this.$refs.page.currentPage = 1;
          this.getTaskList(1);
        } else {
          messageTip("error",this.$t(res.data.message))
        }
      });
    },
    turnOnHandle(index, row) {
      this.$put({
        url: HP1 + "/benchmark/timed/operation/v1",
        data: {
          task_id: row.id,
          operation: "on"
        }
      }).then(res => {
        if (res.data.code == 200) {
          messageTip("success",this.$t(res.data.message))
          this.$refs.page.currentPage = 1;
          this.getTaskList(1);
        } else {
          messageTip("error",this.$t(res.data.message))
        }
      });
    },
    turnOffHandle(index, row) {
      this.$put({
        url: HP1 + "/benchmark/timed/operation/v1",
        data: {
          task_id: row.id,
          operation: "off"
        }
      }).then(res => {
        if (res.data.code == 200) {
          messageTip("success",this.$t(res.data.message))
          this.$refs.page.currentPage = 1;
          this.getTaskList(1);
        } else {
          messageTip("error",this.$t(res.data.message))
        }
      });
    },
    handleUnfollow(index, row) {
      this.$put({
        url: HP1 + "/benchmark/timed/operation/v1",
        data: {
          task_id: row.id,
          operation: "unfollowed"
        }
      }).then(res => {
        if (res.data.code == 200) {
          messageTip("success",this.$t(res.data.message))
          this.$refs.page.currentPage = 1;
          this.getTaskList(1);
        } else {
          messageTip("error",this.$t(res.data.message))
        }
      });
    },
    handlefollow(index, row) {
      this.$put({
        url: HP1 + "/benchmark/timed/operation/v1",
        data: {
          task_id: row.id,
          operation: "followed"
        }
      }).then(res => {
        if (res.data.code == 200) {
          messageTip("success",this.$t(res.data.message))
          this.$refs.page.currentPage = 1;
          this.getTaskList(1);
        } else {
          messageTip("error",this.$t(res.data.message))
        }
      });
    },
    gotoTaskAnalysis(index, row) {
      this.$router.push({
        path: "timedAnalysis",
        query: {
          taskId: row.id
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
</style>
