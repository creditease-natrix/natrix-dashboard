//natrix Pie Chart: 

<template>
  <div
    class="natrix-chart-container"
    v-loading="pieChartLoading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    ref="chart_continer"
  >
    <div class="areaBox" ref="chart_body"></div>
  </div>
</template>

<script>
export default {
  name: "natrixPieChart",
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
        if (value.values == undefined) {
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
    pieChartLoading: false
  },
  data() {
    return {
      subtext: "数据来自Natrix",
      pieChart: null
    };
  },
  mounted() {
    this.drawChart();
    window.addEventListener("resize", this.resizeHandle);
  },
  watch: {
    chart_data: {
      handler: function(newval, oldval) {
        this.drawChart();
      },
      deep: true
    }
  },
  methods: {
    /**
     * draw pie chart
     *
     * @param {Object} chart_data: An object with values attribute.
     */
    drawChart(chart_data = null) {
      if (chart_data == null) {
        chart_data = this.chart_data;
      }
      let chart_dom = this.$refs.chart_body;

      let seriesData = [],
        xAxis = [],
        precision;
      precision = chart_data.precision == undefined ? 2 : chart_data.precision;
      chart_data.values.forEach((item, index) => {
        xAxis.push(this.$t(String(item.name)));
        item.name = this.$t(String(item.name));
      });
      seriesData = chart_data.values;
      seriesData.forEach((item, index) => {
        if (typeof item.value == "number") {
          item.value = item.value.toFixed(precision);
        }
      });
      let natrix_chart = this.$echarts.init(chart_dom, "macarons");
      let option = {
        title: {
          text: chart_data.title.text,
          subtext: chart_data.title.subtext
            ? chart_data.title.subtext
            : this.subtext,
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)"
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: xAxis
        },
        series: [
          {
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: seriesData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      natrix_chart.setOption((option = option), true);
      this.pieChart = natrix_chart;
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
      this.pieChart.resize();
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

