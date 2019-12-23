<template>
  <div>
    <div id="nav">
      <span class="title">终端管理——终端设备列表</span>
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
      <div style="float:right;">
        <el-select
          size="mini"
          style="display:inline-block;"
          @change="getTerminalList(1)"
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
        <el-input
          id="searchBtn"
          style="diaplay:inline-block;width:300px;"
          placeholder="根据mac、ip、客户端版本和组织名称搜索"
          size="mini"
          v-model="searchWord"
          @keyup.enter.native="getTerminalList(1)"
        >
          <!-- <i slot="prefix" class="el-input__icon el-icon-search"></i> -->
          <el-button slot="append" icon="el-icon-search" size="mini" @click="getTerminalList(1)"></el-button>
        </el-input>
      </div>
    </div>
    <div class="statusTip">
      <span class="listLabel">终端信息：</span>
      <span class="listOption">
        [有效数量]/[激活数量]/[总和数量]
        <!-- <span><i class="icon iconfont icon-wuxianjuyuwang"></i>局域网访问</span>
                <span><i class="icon iconfont icon-neiwang"></i>企业网访问</span>
        <span><i class="icon iconfont icon-gongsiwangdian"></i>互联网访问</span>-->
      </span>
    </div>
    <el-table :data="tableData" border style="width: 100%,margin-top:50px;">
      <el-table-column label="序列号" width="120">
        <template slot-scope="scope">
          <a class="nameLink" @click="getTerminalDetail(scope.row.sn)">{{scope.row.sn}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="type" width="200" label="设备类型"></el-table-column>
      <el-table-column prop="client_version" width="100" label="客户端版本"></el-table-column>
      <el-table-column width="120" label="登记组织">
        <template slot-scope="scope">
          <el-popover
            trigger="hover"
            placement="top"
            v-for="(item1,index1) in scope.row.reg_orgs"
            :key="index1"
          >
            <p>名称: {{ item1.desc }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ item1.name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column width="120" label="状态">
        <template slot-scope="scope">
          <span
            class="num"
            :class="{ success:scope.row.status == 'active' }"
          >{{scope.row.statusTxt}}</span>
          <span
            class="num"
            :class="{ success:scope.row.scope == 'shared' }"
          >{{scope.row.scopeTxt}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="terminalNum" width="100" label="终端信息">
        <template slot-scope="scope">
          <span
            @click="gotoTerminalSite(scope.row.sn)"
            class="num cursor"
            :class="{error:scope.row.terminal_alive == 0,success : scope.row.terminal_alive == scope.row.terminal_active}"
          >{{scope.row.terminalNum}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-show="scope.row.status != 'maintain' "
            size="mini"
            type="default"
            @click="getMaintainOperation(scope.$index, scope.row)"
          >维护</el-button>
          <el-button
            v-show="scope.row.status != 'active' "
            size="mini"
            type="success"
            @click="getActiveOperation(scope.$index, scope.row)"
          >激活</el-button>
          <el-button size="mini" type="warning" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="getDelOperation(scope.$index, scope.row)">删除</el-button>
          <el-button
            size="mini"
            type="primary"
            v-show="scope.row.scope == 'private' "
            @click="getPublicOperation(scope.$index, scope.row)"
          >共享</el-button>
          <el-button
            v-show="scope.row.scope == 'shared' "
            size="mini"
            type="primary"
            @click="getPrivateOperation(scope.$index, scope.row)"
          >私有</el-button>
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
import {messageTip} from "../../../until/index.js"
import page from "../../../components/page";
export default {
  name: "",
  components: {
    page
  },
  data() {
    return {
      href: ManageIndex,
      page_Count: 1,
      pageNum: 1,
      pageShow: false,
      tableData: [],
      searchWord: "",
      statusTxt: "all",
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
      item_count:0,//总条数
      currentPageNum: 1
    };
  },
  created() {},
  watch: {},
  mounted() {
    this.getTerminalList(1);
  },
  methods: {
    pageChangeHandle(currentPageNum) {
      this.currentPageNum = currentPageNum;
      this.getTerminalList(currentPageNum);
    },
    getTerminalList(num) {
        let identification = this.$route.query.identification 
        && this.$route.query.identification !=  undefined ? 
        JSON.parse(this.$route.query.identification):null
      this.$post({
        url: HP1 + "/terminal/device/list/v1",
        data: {
          search: this.searchWord,
          status: this.statusTxt,
          identification:identification,
          is_paginate: true,
          pagenum:
            this.$route.query.pagenum != undefined
              ? this.$route.query.pagenum
              : num
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.tableData = res.data.info
          this.page_Count = res.data.page_count
          this.pageNum = res.data.page_num
          this.item_count = res.data.item_count
          this.pageShow = this.page_Count > 0 ? true : false
          this.tableData.forEach((item, index) => {
            item.statusTxt = this.$t(item.status);
            item.scopeTxt = this.$t(item.scope)
            item.terminalNum =
              item.terminal_alive +
              "/" +
              item.terminal_active +
              "/" +
              item.terminal_total;
          });
        }else{
            messageTip("error",this.$t(res.data.message))
        }
      });
    },
    getTerminalDetail(sn) {
      this.$router.push({
        path: "terminalDetail",
        query: {
          sn: sn
        }
      });
    },
    gotoTerminalSite(sn) {
      this.$router.push({
        path: "terminalSite",
        query: {
          sn: sn
        }
      });
    },
    handleEdit(index, row) {
      this.$router.push({
        path: "editTerminal",
        query: {
          sn: row.sn
        }
      });
    },
    getMaintainOperation(index, row) {
      this.$put({
        url: HP1 + "/terminal/device/operation/v1",
        data: {
          sn: row.sn,
          operation: "maintain"
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.getTerminalList(this.currentPageNum);
        } else {
          messageTip("error",this.$t(res.data.message))
        }
      });
    },
    getActiveOperation(index, row) {
      this.$put({
        url: HP1 + "/terminal/device/operation/v1",
        data: {
          sn: row.sn,
          operation: "active"
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.getTerminalList(this.currentPageNum);
        } else {
          messageTip("error",this.$t(res.data.message))
        }
      });
    },
    getPublicOperation(index, row) {
      this.$put({
        url: HP1 + "/terminal/device/operation/v1",
        data: {
          sn: row.sn,
          operation: "public"
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.getTerminalList(this.currentPageNum);
        } else {
          messageTip("error",this.$t(res.data.message))
        }
      });
    },
    getPrivateOperation(index,row){
        this.$put({
            url: HP1 + "/terminal/device/operation/v1",
            data: {
                sn: row.sn,
                operation: "private"
            }
        }).then(res => {
            if (res.data.code == 200) {
                this.getTerminalList(this.currentPageNum);
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
        url: HP1 + "/terminal/device/operation/v1",
        data: {
          sn: row.sn,
          operation: "delete"
        }
      }).then(res => {
        if (res.data.code == 200) {
          messageTip("success",this.$t(res.data.message))
          this.getTerminalList(this.currentPageNum);
        } else {
          messageTip("error",this.$t(res.data.message))
        }
      });
    }
  }
};
</script>
<style>
.el-popover__reference {
  margin-top: 5px;
}
.el-button + .el-button {
  margin-left: 0 !important;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "../../../../static/css/resetEle.css";
.optionBox {
  line-height: 30px;
  margin: 20px 0;
}
.nameLink {
  color: #409eff;
  cursor: pointer;
}
.num {
  display: inline-block;
  padding: 5px;
  background: #e6a23c;
  color: #fff;
  border-radius: 5px;
}
.success {
  background: #67c23a;
}
.error {
  background: #f56c6c;
}
.statusTip {
  text-align: right;
  margin: 0 0 10px 0;
  font-size: 12px;
  color: #409eff;
}
</style>
