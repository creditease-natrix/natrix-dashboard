<template>
  <div>
    <div id="nav">
      <span class="title">终端管理——终端概览</span>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <a :href="href" class="home">
          管理系统
          <i class="el-breadcrumb__separator el-icon-arrow-right"></i>
        </a>
        <el-breadcrumb-item :to="{ path: '' }">终端管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/terminalOverview' }">终端概览</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div id="overviewContent">
      <div id="conditionPanel">
        <el-form
          :model="filterCondition"
          size="mini"
          :rules="filterrules"
          ref="filterCondition"
          label-width="140px"
          class="demo-ruleForm"
        >
          <el-form-item label="显示指标">
            <el-select
              @change="indicatroChangeHandle"
              v-model="filterCondition.indicator"
              placeholder="请选择"
            >
              <el-option
                v-for="item in indicator"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item id="organizationBlock" v-show="filterConditionBlock=='organization'">
            <organizationSelect v-on:getParentId="organizationSelectHandle"></organizationSelect>
          </el-form-item>
          <el-form-item id="regionBlock" v-show="filterConditionBlock=='region'">
            <regionSelect v-on:selectList="regionSelectHandle"></regionSelect>
          </el-form-item>

          <el-form-item label="显示层级">
            <el-select v-model="filterCondition.level" placeholder="请选择">
              <el-option v-for="item in showLevel" :key="item" :lable="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div id="showPanel">
        <h4>
          <span>拓扑信息</span>
          <!-- <el-switch 
                    v-model="horizon" 
                    active-text="水平" 
                    inactive-text="垂直"
                    active-color="#13ce66" 
                    inactive-color="#13ce66">
          </el-switch>-->
          <div class="condition">
            <el-radio v-model="horizon" label="1">水平</el-radio>
            <el-radio v-model="horizon" label="2">垂直</el-radio>
          </div>
        </h4>
        <div id="structionContent">
          <div id="structionChart" class="areaBox">
            <treeChart
              ref="treeChart"
              v-show="horizon == '1' "
              :parentWidth="parentWidth"
              :tree_data="tree_data"
              :cells_option="cells_option"
              :node_option="node_option"
            ></treeChart>
            <treeTable
              v-show="horizon == '2' "
              :tree_data="tree_data"
              :branch_option="branch_option"
              :node_option="table_node_option"
            ></treeTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import organizationSelect from "../../../components/organizationSelect.vue";
import regionSelect from "../../../components/regionSelect.vue";
import treeChart from "../../../components/treeChart.vue";
import treeTable from "../../../components/treeTable.vue";

export default {
  name: "",
  components: {
    organizationSelect,
    regionSelect,
    treeChart,
    treeTable
  },
  data() {
    return {
      href: ManageIndex,
      // show indicator, include region and organization
      indicator: [
        {
          value: "region",
          label: "地域"
        },
        {
          value: "organization",
          label: "组织"
        }
      ],
      // show level, the tree high
      showLevel: [1, 2, 3, 4, 5, 6, 7, 8],
      // filter condition type, this attribute equal to the default value of filterCondition.indicator
      filterConditionBlock: "region",

      filterCondition: {
        indicator: "region",
        regionList: ["all", "all"],
        organizationList: [],
        level: 3
      },
      tree_data: {
        
      },
      node_option: {
        events: [
          {
            type: "click",
            handler: d => {
              this.$router.push({
                path: "terminalList",
                query: {
                  identification: JSON.stringify(d.identification),
                  is_paginate: true
                }
              });
            }
          }
        ]
      },
      cells_option: [
        {
          dom_class: function(d) {
            if (d.total) {
              if (d.alive == d.total) {
                return "fine";
              } else {
                return "danger";
              }
            } else {
              return "unknown";
            }
          },
          get_text: function(d) {
            if (d.name) {
              return d.name;
            } else {
              return "";
            }
          }
        },
        {
          dom_class: function(d) {
            return "normal";
          },
          get_text: function(d) {
            if (d.alive == undefined || d.total == undefined) {
              return "";
            }
            return d.alive + " / " + d.total;
          }
        }
      ],
      // table options
      branch_option: {
        get_text: function(d) {
          let text = "";
          if (d.name) {
            text += d.name;
          }
          if (d.total && d.alive) {
            text += "(" + d.alive + "/" + d.total + ")";
          }
          return text;
        },
        get_class: function(d) {
          if (d.total && d.alive) {
            if (d.total == d.alive) {
              return "fine";
            } else {
              return "danger";
            }
          } else {
            return "unknown";
          }
        }
      },
      table_node_option: {
        get_text: function(d) {
          let text = "";
          if (d.name) {
            text += d.name;
          }
          if (d.total && d.alive) {
            text += "(" + d.alive + "/" + d.total + ")";
          }
          return text;
        },
        get_class: function(d) {
          if (d.total && d.alive) {
            if (d.total == d.alive) {
              return "fine";
            } else {
              return "danger";
            }
          } else {
            return "unknown";
          }
        },
        events: {
          click: d => {
            this.$router.push({
              path: "terminalList",
              query: {
                identification: JSON.stringify(d.identification),
                is_paginate: true
              }
            });
          }
        }
      },
      horizon: "1",

      // TODO: define
      filterrules: {},
      parentWidth: 0
    };
  },
  created() {},
  watch: {
    filterCondition: {
      handler: function(newval, oldval) {
        this.getStruction();
      },
      deep: true
    },
    horizon: {
      handler: function(newval, oldval) {
        this.drawStruction();
      }
    },
    tree_data: {
      handler: function(newval, oldval) {
        this.drawStruction();
      },
      deep: true
    }
  },
  mounted() {
    this.getStruction();
    let width = document.getElementsByClassName("areaBox")[0].clientWidth;
    this.parentWidth = width;
    let that = this;
    window.onresize = function resizeHandle() {
      that.parentWidth = document.getElementsByClassName(
        "areaBox"
      )[0].clientWidth;
      that.$refs.treeChart.eraseChart();
      that.$refs.treeChart.drawChart();
    };
  },
  methods: {
    /**
     * @param {Array} val: The value of selected organization info, organization path.
     */
    organizationSelectHandle(val) {
      val.pop();
      this.filterCondition.organizationList = val;
    },
    /**
     * @param {Array} val: The value of selected region info, include province and city
     */
    regionSelectHandle(val) {
      this.filterCondition.regionList = val;
    },

    /**
     * @param {String} val: The value of selected indicator.
     */
    indicatroChangeHandle(val) {
      if (val == "region") {
        this.filterConditionBlock = "region";
      } else {
        this.filterConditionBlock = "organization";
      }
    },

    /**
     * Obtain terminal struction from server
     *
     */
    getStruction() {
      let filter_list;

      if (this.filterCondition.indicator == "region") {
        filter_list = this.filterCondition.regionList;
      } else {
        filter_list = this.filterCondition.organizationList;
      }

      this.$get({
        url: HP1 + "/terminal/device/overview/v1",
        data: {
          type: this.filterCondition.indicator,
          filter: filter_list,
          show_level: this.filterCondition.level
        }
      }).then(res => {
        if (res.data.code == 200) {
          if (res.data.info) {
            this.tree_data = res.data.info;
          } else {
            this.tree_data = null;
          }
        }
      });
    },
    /**
     *
     */
    drawStruction() {}
  },
  beforeDestroy() {
    window.onresize = function() {};
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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

.el-switch {
  float: right;
}

#overviewContent {
  margin: 20px 0;
  width: 100%;
  height: 500px;
}

.areaBox {
  width: 100%;
  min-height: 500px;
  background: #fff;
}

.condition {
  text-align: right;
  padding: 10px 0;
}
</style>
