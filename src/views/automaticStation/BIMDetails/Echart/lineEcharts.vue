<template>
  <div id='lineEcharts' style='height:calc(100vh - 725px);width:calc(100%)' />
</template>
<script>
import * as echarts from 'echarts'
import { map } from '@/api'

export default {
  name: 'lineEcharts',
  data() {
    return {
      lineCharts: {},
      timer: '',
      details: {}
    }
  },
  mounted() {
    this.initEcharts()
  },
  methods: {
    initEcharts() {
      const getname = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      const getvalue1 = [20, 13, 55, 43, 23, 47, 27, 41, 19, 23, 27, 38]
      let option = {
        color: ['rgba(0, 255, 255, 1)', 'rgba(255, 255, 0, 1)'],
        grid: {
          top: '20%',
          left: '12%',
          bottom: '13%',
          right:'20px'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          }
        },
        legend: {
          x: 'center',
          show: false,
          orient: 'horizontal',
          textStyle: {
            color: '#fff',
            fontSize: 13
          }
        },
        xAxis: {
          data: getname,
          axisLabel: {
            margin: 10,
            color: 'rgba(173, 177, 182, 1)',
            textStyle: {
              fontSize: 12
            }
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 1)'
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '（次）',
            nameTextStyle: {
              fontSize: 12,
              color: '#fff',
              align:'right',
            },

            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: 'rgba(255, 255, 255, 0.15)',
                width: 1
              }
            },
            axisLabel: {
              formatter: '{value}',
              textStyle: {
                color: '#fff',
                fontSize: 12
              },
            },
            axisLine: {
              show: false
            }
          },
        ],
        series: [
          {
            name: '次',
            type: 'line',
            smooth: true,
            yAxisIndex: 0,
            color: 'rgba(255, 255, 0, 1)',
            symbolSize: '0',
            lineStyle: {
              normal: {
                color: 'rgba(255, 255, 0, 1)'
              }
            },
            data: getvalue1
          }

        ]
      }
      if (this.chart != null && this.chart != '' && this.chart != undefined) {
        this.chart.dispose()
      }
      this.chart = echarts.init(document.getElementById('lineEcharts'))
      this.chart.setOption(option)
    }
  }
}
</script>

<style>

</style>
