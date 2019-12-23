//natrix line Chart: 

<template>
  <div
    class="natrix-chart-container"
    v-loading="lineChartLoading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    ref="chart_continer"
  >
    <div class="areaBox" ref="chart_body"></div>
  </div>
</template>

<script>
export default {
  name: "natrixLineChart",
  props: {
    /**
     * chart_data is an object which provide the required data to draw chart.
     * There are many attributes, include:
     *  title {Object} (required): The chart title configuration, include text
     *        subtext fields.
     *  values {Array} (required): The elements in this array are objects which
     *        contain name and value attributions.
     *
     */
    chart_data: {
      type: Object,
      required: true,
      validator: function(value) {
        if (value.title == undefined) {
          return false;
        } else {
          if (value.title.text == undefined) {
            return false;
          }
        }
        if (value.xAxisName == undefined) {
          return false;
        }
        if (value.yAxisName == undefined) {
          return false;
        }
        if (value.viewpoints == undefined) {
          return false;
        }

        return true;
      }
    },
    /**
     *
     */
    chart_style: {
      type: Object,
      required: false
    },
    lineChartLoading: false
  },
  data() {
    return {
      subtext: "数据来自Natrix",
      lineChart: null
    };
  },
  mounted() {
    this.drawChart(this.chart_data);
    window.addEventListener("resize", this.resizeHandle);
  },
  watch: {
    chart_data: {
      handler: function(newval, oldval) {
        this.drawChart(newval);
      },
      deep: true
    }
  },
  methods: {
    /**
     * draw line chart
     *
     * @param {Object} chart_data: An object with values attribute.
     */
    drawChart(chart_data) {
      let name = [],
        seriesData = [],
        xAxisData = chart_data["x-axis"];
      let startValue = xAxisData[0] ? xAxisData[0] : 0;
      let precision =
        chart_data.precision == undefined ? 2 : chart_data.precision;
      function precisionHandle(value) {
        if (typeof value == "number") {
          return value.toFixed(precision);
        }
      }

      chart_data.viewpoints.forEach((item, index) => {
        let values = item.values.map(precisionHandle);
        let temp_name = this.$t(String(item.name));
        name.push(temp_name);

        if (chart_data.stack) {
          seriesData.push({
            name: this.$t(String(item.name)),
            type: "line",
            stack: "总量",
            data: values
          });
        } else {
          seriesData.push({
            name: this.$t(String(item.name)),
            type: "line",
            data: values
          });
        }
      });
      let dom = this.$refs.chart_body;
      let dataZoom = {
        dataZoom: [
          {
            startValue: startValue
          },
          {
            type: "inside"
          }
        ]
      };

      let myChart = this.$echarts.init(dom, "macarons");
      let option = {
        title: {
          text: chart_data.title.text,
          subtext: chart_data.title.subtext
            ? chart_data.title.subtext
            : this.subtext
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: name
        },
        grid: {
          left: "3%",
          right: "8%",
          bottom: "3%",
          containLabel: true
        },

        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xAxisData,
          name: chart_data.xAxisName
        },
        yAxis: {
          type: "value",
          minInterval: 1,
          nameGap: 3,
          name: chart_data.yAxisName
        },
        series: seriesData
      };
      let yAxisData = {
        yAxis: {
          type: "log",
          min: 1,
          name: chart_data.yAxisName,
          logBase: chart_data.logBase ? chart_data.logBase : 10
        }
      };
      if (chart_data.dataZoom) {
        option = Object.assign(option, dataZoom);
      }
      if (chart_data.log) {
        option = Object.assign(option, yAxisData);
      }
      myChart.setOption((option = option), true);
      this.lineChart = myChart;
    },
    /**
     * set container style
     */
    setChartStyle(style_data = null) {
      if (style_data == null) {
        style_data = this.default_chart_style;
      }
      var container_dom = this.$refs.chart_container;
    },
    resizeHandle() {
      this.lineChart.resize();
    }
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeHandle);
  }
};
</script>

<style scoped>
.areaBox {
  width: 100%;
  height: 500px;
}
</style>

