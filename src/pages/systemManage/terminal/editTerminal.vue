<template>
  <div>
    <div id="nav">
      <span class="title">终端管理——修改终端设备</span>
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
      <ul class="primaryList">
        <li class="clearfix">
          <span class="listLabel fl">端设备序列号：</span>
          <span class="fl listOption">{{primaryInfo.sn}}</span>
        </li>
        <li class="clearfix">
          <span class="listLabel fl">主机名称：</span>
          <span class="fl listOption">{{primaryInfo.hostname}}</span>
        </li>
        <li class="clearfix">
          <span class="listLabel fl">设备类型：</span>
          <span class="fl listOption">{{primaryInfo.type}}</span>
        </li>
        <li class="clearfix">
          <span class="listLabel fl">告警配置：</span>
          <span class="fl listOption">
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="终端设备"></el-checkbox>
              <el-checkbox label="终端"></el-checkbox>
            </el-checkbox-group>
          </span>
        </li>
      </ul>
      <ul class="orgList">
        <li class="clearfix">
            <span class="listLabel fl">检测网段：</span>
            <span class="fl listOption">
            <strong class="netIp" v-for="(item,index) in primaryInfo.segments" :key="index">{{item}}</strong>
            </span>
        </li>
        <li class="clearfix">
          <span class="listLabel fl">登记组织：</span>
          <div class="fl listOption">
            <el-table :data="tableData" border style="width: 100%,margin-top:50px;">
              <el-table-column prop="name" width="300" label="组织名称"></el-table-column>
              <el-table-column prop="desc" width="300" label="组织描述"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDel(scope.$index, scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div style="text-align:right;margin:30px 0 0 0 ;">
              <el-button type="primary" size="mini" @click="showDialog">添加</el-button>
            </div>
          </div>
        </li>
      </ul>
      <div class="submitBox formButtonbox">
        <el-button type="warning" size="mini" @click="resetHandle">取消</el-button>
        <el-button type="primary" size="mini" @click="submitHandle">确定</el-button>
      </div>
    </div>
    <el-dialog :visible.sync="dialog" width="40%">
      <div>
        <div>
          <span>组织选择：</span>
          <organizationSelect v-on:getParentId="organizationSelectHandle"></organizationSelect>
        </div>
        <div class="organizationBox">
          <ul class="organization">
            <li>
              <span>网段信息：</span>
              <span>
                <strong class="netIp" v-for="(item,index) in netWork" :key="index">{{item}}</strong>
              </span>
            </li>
            <li>
              <span>地址信息：</span>
              <span>
                <strong class="netIp" v-for="(item,index) in address" :key="index">{{item}}</strong>
              </span>
            </li>
          </ul>
          <div class="action">
            <el-button type="warning" size="mini" @click="cancelHandle">取消</el-button>
            <el-button type="primary" size="mini" @click="confirmHandle">确定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import organizationSelect from "../../../components/organizationSelect.vue";
import {messageTip} from "../../../until/index.js"
export default {
  name: "",
  components: {
    organizationSelect
  },
  data() {
    return {
      href: ManageIndex,
      activeName: "first",
      checkList: ["终端设备"],
      tableData: [],
      dialog: false,
      value: "",
      options: [
        {
          value: "1",
          label: "1"
        }
      ],
      primaryInfo: "", //基本信息
      netWork: "", //网段信息
      address: "", //地址信息
      summaryInfo: "", //概要信息
      reg_orgs: [], //array reg_orgs
      device_alert: "",
      terminal_alert: ""
    };
  },
  created() {},
  watch: {},
  mounted() {
    this.getPrimaryInfo();
  },
  methods: {
    handleClick(tab, event) {
      this.activeName = tab.name;
    },
    getPrimaryInfo() {
      this.$get({
        url: HP1 + "/terminal/device/basic/v1",
        data: {
          sn: this.$route.query.sn
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.primaryInfo = res.data.info;
          this.tableData = res.data.info.reg_orgs;

          this.checkList = [];
          if (this.primaryInfo.device_alert) {
            this.checkList.push("终端设备");
          }
          if (this.primaryInfo.terminal_alert) {
            this.checkList.push("终端");
          }
        }else{
          messageTip("error",this.$t(res.data.message))
        }
      });
    },
    showDialog() {
      this.dialog = true;
    },
    handleDel(index, row) {
      this.tableData.splice(index, 1);
    },
    organizationSelectHandle(val) {
      this.address = ""
      this.netWork = ""
      let length = val.length;
      let id = val[length - 2];
      if(id == 0 || id == 1){
        return 
      }
      this.getOrganizationSummary(id);
    },
    getOrganizationSummary(id) {
      this.$get({
        url: HP1 + "/terminal/organization/summary/v1",
        data: {
          id: id
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.summaryInfo = res.data.info;
          this.address = res.data.info.addresses;
          this.netWork = res.data.info.networks;
        } else {
          messageTip("error",this.$t(res.data.message))
        }
      });
    },
    confirmHandle() {
      this.tableData.forEach((item, index) => {
        if (item.id == this.summaryInfo.id) {
          this.tableData.splice(index, 1);
        }
      });
      this.tableData.push({
        name: this.summaryInfo.name,
        desc: this.summaryInfo.full_name,
        id: this.summaryInfo.id
      });
      this.dialog = false;
    },
    cancelHandle() {
      this.dialog = false;
    },
    submitHandle() {
      this.reg_orgs = []
      if (this.checkList.indexOf("终端设备") == "-1") {
        this.device_alert = false;
      } else {
        this.device_alert = true;
      }
      if (this.checkList.indexOf("终端") == "-1") {
        this.terminal_alert = false;
      } else {
        this.terminal_alert = true;
      }
      this.tableData.forEach((item, index) => {
        this.reg_orgs.push(item.id);
      });
      this.$put({
        url: HP1 + "/terminal/device/basic/v1",
        data: {
          sn: this.$route.query.sn,
          reg_orgs: this.reg_orgs,
          device_alert: this.device_alert,
          terminal_alert: this.terminal_alert
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.$router.push({
            path: "terminalList"
          });
        } else {
          messageTip("error",this.$t(res.data.message))
        }
      });
    },
    resetHandle(){
      window.history.go(-1)
    }
  }
};
</script>
<style>
.el-tabs__content {
  display: none;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.optionBox {
  line-height: 30px;
  margin-bottom: 20px;
  margin-top: 20px;
}
.primaryList {
  display: flex;
  display: -webkit-flex;
  display: -moz-flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.primaryList li {
  width: 50%;
  font-size: 14px;
  line-height: 30px;
  margin: 0 0 5px 0;
}
.listLabel {
  display: inline-block;
  min-width: 150px;
  text-align: left;
}
.listOption {
  display: inline-block;
  /* width: 70%; */
}
.organizationBox {
  margin: 20px 0 20px 0;
}
.organization li {
  font-size: 14px;
  line-height: 30px;
  margin: 0 0 10px 0;
}
.action {
  text-align: right;
}
.org {
  padding: 5px;
  display: inline-block;
  border: 1px solid #ececec;
  margin: 0 5px 0 0;
  color: #409eff;
  border-radius: 5px;
}
.netIp {
  display: inline-block;
  border: 1px solid #ececec;
  color: #409eff;
  border-radius: 5px;
  padding: 5px;
  margin-right: 5px;
}
.submitBox {
    text-align: right;
    /* margin-right: 138px; */
    margin-top: 20px;
}
.orgList li {
  margin: 0 0 5px 0;
}
</style>
