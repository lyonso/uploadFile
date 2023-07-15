<template>
  <div id='lineEchartss' style='height:200px' />
</template>
<script>
import * as echarts from 'echarts'
import { DILaboratory } from '@/api'

export default {
  name: 'lineEcharts',
  data() {
    return {}
  },

  mounted() {
    this.doorTimeAnalysis()
  },
  methods: {
    doorTimeAnalysis() {
      DILaboratory.countByArea().then(res => {
        this.initEcharts(res.data)
      })
    },
    initEcharts(data) {
      let option = {
        backgroundColor: 'rgba(0,0,0,0)',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          icon: 'rect',
          itemWidth: 16,
          itemHeight: 7,
          itemGap: 20,
          orient: 'horizontal',
          data: ['公共区域', '常规监测区', '重点监测区'],
          textStyle: {
            fontSize: 12,
            color: '#ffffff'
          }
        },
        grid: {
          top: '30%',
          left: '12%',
          right: '4%',
          bottom: '19%'
          // containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: 'rgba(238, 238, 238, 0.33)'
            }
          },
          axisTick: {
            show: false
          },
          data: data.x
        }],
        yAxis: [
          {
            type: 'value',
            name: '（人次）',
            axisTick: {
              show: false
            },
            minInterval: 1,
            axisLine: {
              lineStyle: {
                color: '#ffffff'
              }
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(238, 238, 238, 0.11)'
              }
            }
          }],
        series: [
          {
            name: '公共区域',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(5, 252, 232, 0.3)'
                }, {
                  offset: 0.8,
                  color: 'rgba(5, 252, 232, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: 'rgba(5, 254, 233, 1)',
                borderColor: 'rgba(5, 252, 232, 0.32)',
                borderWidth: 12

              }
            },
            data: data['ggY']
          },
          {
            name: '常规监测区',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(10, 152, 253, 0.3)'
                }, {
                  offset: 0.8,
                  color: 'rgba(10, 152, 253, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: 'rgba(10, 152, 253, 1)',
                borderColor: 'rgba(10, 152, 253, 0.32)',
                borderWidth: 12

              }
            },
            data: data['cgY']
          },
          {
            name: '重点监测区',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(255, 0, 0, 0.3)'
                }, {
                  offset: 0.8,
                  color: 'rgba(255, 0, 0, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: 'rgba(255, 0, 0, 1)',
                borderColor: 'rgba(255, 0, 0, 0.32)',
                borderWidth: 12
              }
            },
            data: data['zdY']
          }]
      }
      this.chart = echarts.init(document.getElementById('lineEchartss'))
      this.chart.setOption(option)
    }
  }
}
</script>

<style>

</style>
