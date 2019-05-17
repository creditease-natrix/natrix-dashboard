<template>
  <div class="clear organizeBox">
    <div class="organize">
      <span>部门</span>
      <el-select
        id="section"
        v-model="section"
        @change="getCountHandle()"
        multiple
        size="mini"
        placeholder="请选择"
      >
        <el-option
          v-for="(item,index) in sections"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="organize">
      <span>大区</span>
      <el-select v-model="area" size="mini" multiple @change="getCountHandle()" placeholder="请选择">
        <el-option
          v-for="(item,index) in areas"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="organize">
      <span>分中心</span>
      <el-select
        v-model="branchCenter"
        size="mini"
        multiple
        @change="getCountHandle()"
        placeholder="请选择"
      >
        <el-option
          v-for="(item,index) in branchCenters"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="organize">
      <span>营业部</span>
      <el-select
        v-model="salesDepartMent"
        size="mini"
        @change="getCountHandle()"
        multiple
        placeholder="请选择"
      >
        <el-option
          v-for="(item,index) in salesDepartMents"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
  </div>
</template>
<style scoped>
.organizeBox {
  width: 100%;
}
.organizeBox .organize {
  float: left;
  width: 25%;
}
</style>
<script>
export default {
  name: "organizationSelect",
  props: {
    selectOptions: {
      type: Object
    }
  },
  data() {
    return {
      branchCenter: [], //分中心
      branchCenters: [], //分中心列表
      area: [], //大区
      areas: [], //大区列表
      section: [], //部门
      sections: [], //部门列表
      salesDepartMent: [], //营业部
      salesDepartMents: [], //营业部列表
      terminalNumber: ""
    };
  },
  computed: {},
  watch: {
    selectOptions: function(newval, oldval) {

      this.section = newval.section;
      this.area = newval.area;
      
      this.branchCenter = newval.branchCenter;
      this.salesDepartMent = newval.salesDepartMent;

    },

    branchCenter: function(newval, oldval) {
      if (newval.length != 0) {
        this.getSalesDepartMent();
      } else {
        this.salesDepartMent = [];
        this.salesDepartMents = [];
      }
    },
    area: function(newval, oldval) {
      if (newval.length != 0) {
        this.getBranchCenter();
      } else {
        this.branchCenter = [];
        this.branchCenters = [];
      }
    },
    section: function(newval, oldval) {
      if (newval.length != 0) {
        this.getArea();
      } else {
        this.area = [];
        this.areas = [];
      }
    }
  },

  created() {},
  mounted() {
    //初始化渲染section列表数据
    this.getSection();
  },
  methods: {
    //部门
    getSection() {
      this.$post({
        url: HP1 + "/raspi/get/level1s",
        data: {}
      }).then(res => {
        if (res.data.code == 200) {
          res.data.level1s.forEach((item, index) => {
            this.sections.push({
              value: item,
              label: item
            });
          });
        }
      });
    },
    //大区
    getArea() {
      //判断是初始化操作 还是 change 操作

      if (this.selectOptions.section !== this.section) {
        this.area = [];
      }
      // this.area = [];
      this.areas = [];

      if (this.section.length == 0) {
        this.$message({
          message: "您尚未选择部门",
          type: "error"
        });
        return;
      }
      this.$post({
        url: HP1 + "/raspi/get/level2s",
        data: {
          level1s: this.section
        }
      }).then(res => {
        if (res.data.code == 200) {
          res.data.level2s.forEach((item, index) => {
            this.areas.push({
              value: item,
              label: item
            });
          });
        }
      });
    },
    //分中心
    getBranchCenter() {
      //判断是初始化操作 还是 change 操作
      if (this.selectOptions.area !== this.area) {
        this.branchCenter = [];
      }
      this.branchCenters = [];
      if (this.area.length == 0) {
        this.$message({
          message: "您尚未选择大区",
          type: "error"
        });
        return;
      }
      this.$post({
        url: HP1 + "/raspi/get/level4s",
        data: {
          level1s: this.section,
          level2s: this.area
        }
      }).then(res => {
        if (res.data.code == 200) {
          res.data.level4s.forEach((item, index) => {
            this.branchCenters.push({
              value: item,
              label: item
            });
          });
        }
      });
    },
    //营业部
    getSalesDepartMent() {
      //判断是初始化操作 还是 change 操作
      if (this.selectOptions.branchCenter !== this.branchCenter) {
        this.salesDepartMent = [];
      }
      this.salesDepartMents = [];
      // this.salesDepartMent = [];
      if (this.branchCenter.length == 0) {
        this.$message({
          message: "您尚未选择分中心",
          type: "error"
        });
        return;
      }
      this.$post({
        url: HP1 + "/raspi/get/workplaceLevel5s/v1",
        data: {
          level1s: this.section,
          level2s: this.area,
          level4s: this.branchCenter
        }
      }).then(res => {
        if (res.data.code == 200) {
          res.data.infos.forEach((item, index) => {
            this.salesDepartMents.push({
              value: item.level5,
              label: item.level5
            });
          });
        }
      });
    },
    getCountHandle() {
      this.$post({
        url: HP1 + "/workplaceGuard/faultMonitor/terminals/count/v1",
        data: {
          level1: this.section,
          level2: this.area,
          level4: this.branchCenter,
          level5: this.salesDepartMent
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.terminalNumber = res.data.info.count;
          this.getMultibleSelect();
        }
      });
    },
    getMultibleSelect() {
      this.$emit("getSelect", {
        section: this.section,
        area: this.area,
        branchCenter: this.branchCenter,
        salesDepartMent: this.salesDepartMent
      });
    }
  }
};
</script>
