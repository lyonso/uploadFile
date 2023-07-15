<template>
  <div :class='className' :style='{ height: height, width: width }' />
</template>

<script>
import * as echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme
export default {
  props: {
    typeName: {
      type: String,
      default: '水温'
    },
    dataX: {
      type: Array
      // default:[],
    },
    dataY: {
      type: Array
      // default:[]
    },
    markLine: {
      type: Number,
      default: 50
    },
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '250px'
    },
    autoResize: {
      type: Boolean,
      default: true
    }
    // chartData: {
    //   type: Object,
    //   required: true
    // }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    dataX: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
      this.chart.resize()
    },
    setOptions({ expectedData, actualData } = {}) {
      let min = Math.min(...this.$props.dataY)
      const max = Math.max(...this.$props.dataY)
      min = min - ((max - min) * 0.2)
      const minInterval = (this.typeName === '水位' ? 2 : 1)
      const title = (this.typeName === '水位' ? 'm' : 'm³/s')
      this.chart.setOption(
        {
          backgroundColor: '',
          title: {
            text: '单位：' + title,
            textStyle: {
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: 16
            }
          },
          xAxis: {
            data: this.$props.dataX,
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#3A9EBF',
                width: 1
              }
            },
            axisTick: {
              show: false
            }
          },
          grid: {
            left: 10,
            right: 10,
            bottom: 20,
            top: 30,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            padding: [5, 10]
          },
          yAxis: {
            min: min,
            type: 'value',
            axisLabel: {
              formatter: function(value, index) {
                return value.toFixed(minInterval)
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#3A9EBF'
              }
            }
          },
          series: [
            {
              name: this.$props.typeName,
              showSymbol: true,
              symbol: 'emptyCircle',
              symbolSize: 8,
              itemStyle: {
                normal: {
                  lineStyle: {
                    color: 'rgba(16, 135, 219)',
                    width: 2
                  }
                }
              },
              // markLine:{
              //   symbol:"none",
              //   data:[{
              //     silent:false,
              //     lineStyle:{
              //       type:"solid",
              //       color:"rgb(134,118,28)",
              //       width:2
              //     },
              //     name:'警戒线',
              //     yAxis:this.markLine
              //   }]
              // },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(18,63,90,1)'
                  },
                  {
                    offset: 0.34,
                    color: 'rgba(56,155,255,0.25)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(38,197,254,0.00)'
                  }
                ])
              },
              smooth: true,
              type: 'line',
              data: this.$props.dataY,
              animationDuration: 2800,
              animationEasing: 'cubicInOut'
            },
            {
              name: '关注人数',
              smooth: true,
              type: 'line',
              itemStyle: {
                normal: {
                  color: '#ffffff',
                  lineStyle: {
                    color: '#ffffff',
                    width: 2
                  },
                  areaStyle: {
                    color: '#ffffff'
                  }
                }
              },
              data: actualData,
              animationDuration: 2800,
              animationEasing: 'quadraticOut'
            }
          ]
        }
      )
    }
  }
}
</script>
