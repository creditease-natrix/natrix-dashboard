// natrix Map Chart;

<template>
  <div
    v-loading="mapChartLoading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    class="natrix-chart-container"
    ref="chart_container"
  >
    <div class="areaBox" ref="chart_body"></div>
  </div>
</template>

<script>
export default {
  name: "natrixMapChart",
  props: {
    /**
     * chart_data is an object which provide the required data to draw a map chart.
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
     * chart_style is an object which provice the data used to control the chart style.
     * There are many attributes, include:
     *  data_map {Array} (optional): used to create visualMap option in echarts.
     *          Such as: [{min: 1, max: 2, level: 'fine' }, {min: 2, max: 3, level: 'critical'}]
     *  precision {Integer} {optionnal}: all number precision configuration
     */
    chart_style: {
      type: Object,
      required: false
    },
    mapChartLoading: false
  },
  data() {
    return {
      subtext: "数据来自Natrix",
      // The precision of map data
      precision: 3,
      // The colors definition
      data_level: {
        critical: "#CD0000",
        warning: "#FF0000",
        fine: "#FFA500",
        excellent: "#008B00"
      },
      mapChart: null
    };
  },
  mounted() {
    this.resetStyleConfiguration();
    this.drawChart();
    window.addEventListener("resize", this.resizeHandle);
  },
  watch: {
    chart_data: {
      handler: function(newval, oldval) {
        this.drawChart();
      },
      deep: true
    },
    chart_style: {
      handler: function(newval, oldval) {
        if (this.chart_style.precision != undefined) {
          this.precision = this.chart_style.precision;
        }
        this.drawChart();
      },
      deep: true
    }
  },
  methods: {
    /**
     * To set the global configurations.
     */
    resetStyleConfiguration() {
      if (!this.chart_style) return;
      if (this.chart_style.precision)
        this.precision = this.chart_style.precision;
    },
    /**
     * Convert the region name.
     * In this function, we omit the province and city(omitRegionUnit).
     */
    convertRegionName(data) {
      let res = [];
      function omitRegionUnit(name) {
        let regExpress = new RegExp(/省|市|自治区/g);
        return name.replace(regExpress, "");
      }
      data.forEach(item => {
        res.push({
          name: String(omitRegionUnit(item.name)),
          value: item.value
        });
      });
      return res;
    },
    chartStyleGenerator() {
      let style_config = {};
      if (!this.chart_style) {
        return style_config;
      }
      if (this.chart_style.data_map) {
        let pieces = [];

        this.chart_style.data_map.forEach(value => {
          let item = { color: this.data_level[value.level] };
          if (value.max != undefined) {
            item["lte"] = value.max;
            if (value.min != undefined) {
              item["gt"] = value.min;
            }
          } else {
            item["gt"] = value.min;
          }
          pieces.push(item);
        });
        style_config["visualMap"] = {
          type: "piecewise",
          precision: this.precision,
          pieces: pieces
        };
      }
      return style_config;
    },
    drawChart(chart_data = null) {
      if (chart_data == null) {
        chart_data = this.chart_data;
      }
      let chart_dom = this.$refs.chart_body;
      let natrix_chart = this.$echarts.init(chart_dom, "macarons");
      let style_option = this.chartStyleGenerator();
      let option = {
        title: {
          text: chart_data.title.text,
          subtext: chart_data.title.subtext
            ? chart_data.title.subtext
            : this.subtext
        },
        tooltip: {
          // formatter the data display
          formatter: params => {
            let value = "";
            if (params.data) {
              if (params.data.name) value += params.data.name + ":<br/>";
              if (params.data.value == undefined) {
                value += null;
              } else {
                if (typeof params.data.value == "number") {
                  value += params.data.value.toFixed(this.precision);
                } else {
                  value += params.data.value;
                }
              }
            } else value += null;
            return value;
          }
        },
        legend: {
          data: name
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        geo: {
          map: "china",
          roam: false,
          label: {
            normal: {
              show: true,
              textStyle: {
                color: "rgba(0,0,0,0.4)"
              }
            }
          },
          itemStyle: {
            normal: {
              borderColor: "rgba(0, 0, 0, 0.2)"
            },
            emphasis: {
              areaColor: null,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,
              borderWidth: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          },
          zoom: 1
        },
        series: [
          {
            name: this.$t(chart_data.name),
            type: "map",
            geoIndex: 0,
            mapValueCalculation: "average",
            mapValuePrecision: 2,
            data: this.convertRegionName(chart_data.values)
          }
        ]
      };

      option = Object.assign(option, style_option);
      natrix_chart.setOption((option = option), true);
      this.mapChart = natrix_chart;
    },
    resizeHandle() {
      this.mapChart.resize();
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

