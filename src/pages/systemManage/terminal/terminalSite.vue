<template>
  <div>
    <div id="nav">
      <span class="title">终端管理——终端列表</span>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <a :href="href" class="home">
          管理系统
          <i class="el-breadcrumb__separator el-icon-arrow-right"></i>
        </a>
        <el-breadcrumb-item :to="{ path: '' }">终端管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/terminalList' }">终端设备列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="optionBox clear">
      <div class="fl">
        <span v-if="this.$route.query.sn != undefined ">终端设备：{{this.$route.query.sn}}</span>
      </div>
      <div class="fr">
        <span>状态：</span>
        <el-select
          size="mini"
          style="display:inline-block;"
          @change="getMonitorSiteList(1)"
          v-model="statusTxt"
          placeholder="请选择"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <span>活跃：</span>
        <el-select
          size="mini"
          style="display:inline-block;"
          @change="getMonitorSiteList(1)"
          v-model="activeTxt"
          placeholder="请选择"
        >
          <el-option
            v-for="item in activeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input
          id="searchBtn"
          style="diaplay:inline-block;width:300px;"
          placeholder="根据mac、ip、客户端版本和组织名称搜索"
          size="mini"
          v-model="searchWord"
          @keyup.enter.native="getMonitorSiteList(1)"
        >
          <!-- <i slot="prefix" class="el-input__icon el-icon-search"></i> -->
          <el-button slot="append" icon="el-icon-search" size="mini" @click="getMonitorSiteList(1)"></el-button>
        </el-input>
      </div>
    </div>
    <div class="statusTip">
      <span class="listLabel">状态：</span>
      <span class="listOption">
        <span>
          <i class="icon iconfont icon-wuxianjuyuwang"></i>局域网访问
        </span>
        <span>
          <i class="icon iconfont icon-neiwang"></i>企业网访问
        </span>
        <span>
          <i class="icon iconfont icon-gongsiwangdian"></i>互联网访问
        </span>
      </span>
    </div>
    <el-table :data="tableData" border style="width: 100%,margin-top:50px;">
      <el-table-column prop="macaddress" label="mac" width="150">
        <template slot-scope="scope">
          <span>
            {{scope.row.macaddress}}
            <i
              class="icon iconfont icon-chongdian active"
              v-if="scope.row.is_active"
            ></i>
            <i v-else class="icon iconfont icon-chongdian inActive"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="终端名称"></el-table-column>
      <el-table-column prop="type" width="80" label="类型"></el-table-column>
      <el-table-column prop="localip" width="150" label="IP地址"></el-table-column>
      <el-table-column prop="statusTxt" width="120" label="状态"></el-table-column>
      <el-table-column prop="children_num" width="120" label="能力">
        <template slot-scope="scope">
          <span
            class="icon iconfont icon-wuxianjuyuwang"
            :class="{success:scope.row.access_intranet}"
          ></span>
          <span class="icon iconfont icon-neiwang" :class="{success:scope.row.access_corporate}"></span>
          <span
            class="icon iconfont icon-gongsiwangdian"
            :class="{success:scope.row.access_internet }"
          ></span>
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-show="scope.row.status != 'maintain' "
            type="warning"
            @click="getMaintainOperation(scope.$index, scope.row)"
          >维护</el-button>
          <el-button
            size="mini"
            v-show="scope.row.status != 'active' "
            type="success"
            @click="getActiveOperation(scope.$index, scope.row)"
          >激活</el-button>
          <el-button size="mini" type="danger" @click="getDelOperation(scope.$index, scope.row)">删除</el-button>
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
import{messageTip} from "../../../until/index.js"
export default {
  name: "",
  components: {
    page
  },
  data() {
    return {
      href: ManageIndex,
      tableData: [],
      searchWord: "",
      statusTxt: "all",
      page_Count: 1,
      pageShow: false,
      options: [
        {
          value: "all",
          label: "全部"
        },
        {
          value: "active",
          label: "激活"
        },
        {
          value: "maintain",
          label: "维护"
        }
      ],
      activeTxt: "all",
      activeOptions: [
        {
          value: "all",
          label: "全部"
        },
        {
          value: "yes",
          label: "是"
        },
        {
          value: "no",
          label: "否"
        }
      ],
      currentPageNum: 1,
      item_count:0
    };
  },
  created() {},
  watch: {
    $route: function(newval, oldval) {
      this.getMonitorSiteList(1);
    }
  },
  mounted() {
    this.getMonitorSiteList(1);
  },
  methods: {
    pageChangeHandle(currentPageNum) {
      this.currentPageNum = currentPageNum;
      this.getMonitorSiteList(currentPageNum);
    },
    getMonitorSiteList(num) {
      let data = {
        sn: this.$route.query.sn,
        search: this.searchWord,
        status: this.statusTxt,
        is_active: this.activeTxt,
        is_paginate: true,
        pagenum: num
      };

      this.$post({
        url: HP1 + "/terminal/terminal/list/v1",
        data: data
      }).then(res => {
        if (res.data.code == 200) {
          this.tableData = res.data.info;
          this.tableData.forEach((item, index) => {
            item.statusTxt = this.$t(item.status);
            item.type = this.$t(item.type);
          });
          this.page_Count = res.data.page_count;
          this.pageShow = res.data.page_count > 0 ? true : false;
          this.item_count = res.data.item_count
        }else{
          messageTip("error",this.$t(res.data.message))
        }
      });
    },
    getActiveOperation(index, row) {
      this.$put({
        url: HP1 + "/terminal/terminal/operation/v1",
        data: {
          // sn:this.$route.query.sn,
          mac: row.macaddress,
          operation: "active"
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.getMonitorSiteList(this.currentPageNum);
        } else {
          messageTip("error",this.$t(res.data.message))
        }
      });
    },
    getMaintainOperation(index, row) {
      this.$put({
        url: HP1 + "/terminal/terminal/operation/v1",
        data: {
          // sn:this.$route.query.sn,
          mac: row.macaddress,
          operation: "maintain"
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.getMonitorSiteList(this.currentPageNum);
        } else {
          messageTip("error",this.$t(res.data.message))
        }
      });
    },
    getDelOperation(index, row) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delHandle(row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    delHandle(row) {
      this.$put({
        url: HP1 + "/terminal/terminal/operation/v1",
        data: {
          mac: row.macaddress,
          operation: "delete"
        }
      }).then(res => {
        if (res.data.code == 200) {
          messageTip("success",this.$t(res.data.message))
          this.getMonitorSiteList(this.currentPageNum);
        } else {
          messageTip("error",this.$t(res.data.message))
        }
      });
    }
  }
};
</script>
<style>
.el-button + .el-button {
  margin-left: 0 !important;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.optionBox {
  height: 30px;
  line-height: 30px;
  margin-bottom: 20px;
  margin-top: 20px;
}
.iconfont {
  color: #f56c6c;
}

.success {
  color: #67c23a;
}
.active {
  color: #67c23a;
}
.inActive {
  color: #c0c4cc;
}
.statusTip {
  text-align: right;
  margin: 0 0 10px 0;
}
.statusTip .icon {
  color: #67c23a;
}
</style>
