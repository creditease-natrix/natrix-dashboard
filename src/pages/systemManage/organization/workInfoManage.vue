<template>
  <div>
    <div id="nav">
      <span class="title">组织管理——组织信息管理</span>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <a :href="href" class="home">
          管理系统
          <i class="el-breadcrumb__separator el-icon-arrow-right"></i>
        </a>
        <el-breadcrumb-item :to="{ path: '' }">组织管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/workInfoManage' }">组织信息管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <h5 class="departMentTitle">组织选择</h5>
      <organizationSelect v-on:getParentId="getParentIdHandle" ref="organizationSelect"></organizationSelect>
    </div>
    <div class="optionBox clear">
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-plus"
        style="float:left;"
        id="addBtn"
        @click="addOrganization"
      >增加</el-button>
      <el-input
        id="searchBtn"
        style="width: 300px;
                       float: right;"
        placeholder="根据组织名称或网段模糊查询"
        size="mini"
        v-model="searchWord"
        @keyup.enter.native="getWorkList(1)"
      >
        <!-- <i slot="prefix" class="el-input__icon el-icon-search"></i> -->
        <el-button slot="append" icon="el-icon-search" size="mini" @click="getWorkList(1)"></el-button>
      </el-input>
    </div>
    <el-table :data="tableData" border style="width: 100%,margin-top:50px;">
      <el-table-column prop="name" label="组织名称" width="150">
        <template slot-scope="scope">
          <a class="nameLink" @click="handleInfo(scope.$index, scope.row)">{{scope.row.name}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="level" label="级别" width="80"></el-table-column>
      <el-table-column prop="parent" label="上级组织"></el-table-column>
      <el-table-column prop="children_num" width="120" label="下级组织数量"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page 
    :item_count="item_count"
    :pageCount="page_Count" 
    v-on:page-change="pageChangeHandle" 
    v-show="pageShow"></page>
    
  </div>
</template>

<script>
import page from "../../../components/page";
import newOrganization from "../../../components/newOrganization.vue";
import organizationSelect from "../../../components/organizationSelect";
import {messageTip} from "../../../until/index.js"
export default {
  name: "",
  components: {
    page,
    newOrganization,
    organizationSelect
  },
  data() {
    return {
      href: ManageIndex,
      searchWord: "",
      tableData: [],
      page_Count: 1,
      num:1,//当前页码
      pageNum: 1,
      item_count:0,
      pageShow: false,
      departMents: [],
      departMent: "",
      selectParentId: 1, //默认父级id
      source: true, //搜索框是否有值
      selectParentArray: []
      
    };
  },
  created() {},
  watch: {},
  mounted() {
    this.getWorkList(1);
  },
  methods: {
    getParentIdHandle(val) {
      this.selectParentArray = val;
      this.selectParentId = val[val.length - 2];
      this.pageNum = 1;
      this.getWorkList(this.pageNum, this.source);
    },

    pageChangeHandle(currentPageNum) {
      this.pageNum = currentPageNum;
      this.getWorkList(currentPageNum);
    },
    addOrganization() {
      this.$router.push({
        path: "addWorkInfo",
        query: {
          parentId: this.selectParentId
        }
      });
    },
    getWorkList(num,source) {
        //   num 页码
        //   source  搜索框是否有值
      if (source) {
        this.searchWord = "";
      }

      this.$post({
        url: HP1 + "/terminal/organization/list/v1",
        data: {
          parent: this.selectParentId,
          is_paginate: true,
          search: this.searchWord,
          pagenum: num
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.tableData = res.data.info;
          this.page_Count = res.data.page_count;
          this.pageNum = res.data.page_num;
          this.pageShow = res.data.page_count > 0 ? true : false;
          this.item_count = res.data.item_count
        }
      });
    },
    handleInfo(index, row) {
      this.$router.push({
        path: "workDetail",
        query: {
          id: row.id
        }
      });
    },
    handleEdit(index, row) {
      this.$router.push({
        path: "editWorkInfo",
        query: {
          id: row.id
        }
      });
    },
    handleDel(index, row) {
      if (row.children_num > 0) {
        this.$message({
          message: "当前组织存在下级组织，不能删除",
          type: "warning"
        });
      } else {
        this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.delOperation(row);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },
    delOperation(row) {
      this.$delete({
        url: HP1 + "/terminal/organization/v1",
        data: {
          id: row.id
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.getWorkList(this.pageNum);
          messageTip("success",this.$t(res.data.message))
        } else {
          messageTip("error",this.$t(res.data.message))
          
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
.optionBox {
  height: 30px;
  line-height: 30px;
  margin-bottom: 20px;
  margin-top: 20px;
}
.departMentTitle {
  margin: 10px 0;
  font-size: 14px;
  line-height: 30px;
}
.selectBox .el-select {
  margin: 10px 30px 0 0;
}
.nameLink {
  color: #409eff;
  cursor: pointer;
}
</style>
