<template>
  <div>
    <ul class="filterList">
      <li class="clear">
        <span class="fl filterLabel">终端类型：</span>
        <div class="fl filterItem">
          <el-checkbox v-model="checked" @change="changeHandle">自有</el-checkbox>
        </div>
      </li>
      <li class="clear">
        <span class="fl filterLabel">过滤方式：</span>
        <div class="fl filterItem">
          <el-radio-group v-model="filterType" :disabled="disabled">
            <el-radio :label="'region'">地域选择</el-radio>
          </el-radio-group>
        </div>
      </li>
      <li class="clear">
        <span class="fl filterLabel">过滤条件：</span>
        <div class="fl filterItem">
          <regionSelect
            ref="regionSelect"
            v-on:selectList="getCityHandle"
            :provinceValue="province"
            :cityValue="city"
            :disabled="disabled"
            v-if="filterType == 'region' "
          ></regionSelect>
        </div>
      </li>
      
      <li class="clear">
        <span class="fl filterLabel">终端选择：</span>
        <div class="fl filterItem">
          <el-radio-group v-model="terminal" :disabled="disabled">
            <el-radio :label="1">
              <span>全部</span>
            </el-radio>
            <el-radio :label="2">
              <span @click="showTerminalDialog">特定终端</span>
            </el-radio>
          </el-radio-group>
          <!-- <span class="terminalCount">存在{{terminalCount}}个终端</span> -->
        </div>
      </li>
    </ul>
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
              :label="item1.value"
              :key="index1"
            >{{item1.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import regionSelect from "../../../../components/regionSelect.vue";
import {messageTip} from "../../../../until/index.js"
export default {
  name: "terminalConfig",
  props: {
    /**
     * disabled {Boolean} which is used to judge showInfo or create
     *
     * terminalConfig {Object} which is used to show terminalConfiguration
     * or initial terminalConfig
     *
     */
    disabled: {
      type: Boolean,
      default: false
    },
    terminalConfig: {
      type: Object
    }
  },
  components: {
    regionSelect
  },
  data() {
    return {
      filterType: "region",
      terminal: 1,
      terminalCount: 0,
      isIndeterminate: true,
      terminalDialogVisible: false,
      terminals: [], //终端集合
      checkedTerminals: [], //选中的终端
      terminalCount: 0, //终端数量
      terminalList: [],
      checkAllTerminal: false, //终端全选
      province: "all",
      city: "all",
      terminalListValue: [],
      initalFlag: true,
      checked:false //terminal type 
    };
  },
  created() {
    // init terminalConfig value if terminalConfig exist
    if (this.terminalConfig) {
      if (
        this.terminalConfig.filter_condition &&
        this.terminalConfig.filter_condition.length >= 2
      ) {
        this.province = this.terminalConfig.filter_condition[0];
        this.city = this.terminalConfig.filter_condition[1];
      }
      this.checked = this.terminalConfig.group_own
      this.terminal = this.terminalConfig.terminal_select ? 2 : 1;
      this.checkedTerminals = [];
      if (this.terminalConfig.terminals) {
        this.checkedTerminals = this.terminalConfig.terminals;
      }
    }
  },
  mounted() {},
  methods: {
    /*
     * handle regionSelect to inital cityList
     */
    getCityHandle(val) {
      this.province = val[0];
      this.city = val[1];
      this.cityList = val;
      this.getTerminalCount();
      this.getTerminalList();
    },
    // terminal type change handle
    changeHandle(){
      this.getTerminalCount();
      this.getTerminalList();
    },
    showTerminalDialog() {
      this.terminalDialogVisible = true;
    },
    terminalhandleCheckAllChange(val) {
      this.checkedTerminals = val ? this.terminalList : [];
      this.isIndeterminate = false;
    },
    handleCheckedTerminalsChange(value) {
      let checkedCount = value.length;
      this.checkAllTerminal = checkedCount === this.terminalCount;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.terminalCount;
    },
    confirmHandle() {
      this.terminalDialogVisible = false;
    },
    getTerminalList() {
      this.$post({
        url: HP1 + "/terminal/common/terminals/list/v1",
        data: {
          type: "region",
          is_classify: true,
          filter_condition: this.cityList,
          group_own:this.checked
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.terminalList = [];
          this.terminalListValue = [];
          this.terminals = res.data.info;
          this.terminals.forEach((item, index) => {
            item.terminals.forEach((item1, index1) => {
              this.terminalList.push(item1.value);
            });
          });
          if (!this.initalFlag) {
            this.checkedTerminals = this.terminalList;
          }
          this.initalFlag = false;
        }
      });
    },
    getTerminalCount() {
      this.$post({
        url: HP1 + "/terminal/common/terminals/count/v1",
        data: {
          type: "region",
          filter_condition: this.cityList,
          group_own:this.checked
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.terminalCount = res.data.info.alive;
          if (this.checkedTerminals) {
            this.checkAllTerminal =
              this.checkedTerminals.length == this.terminalCount;
          }
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
@import "../../../../../static/css/terminalConfig.css";
</style>
