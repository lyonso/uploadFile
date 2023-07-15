<template>
  <div id='3DColumnarEcharts'  style='height:200px;width:100%' />
</template>
<script>
import * as echarts from 'echarts'
import {map} from '@/api'

export default {
  name:'3DColumnarEcharts',
  data() {
    return {
      lineCharts:{},
      timer: '',

    }
  },
  mounted() {
    this.initEcharts()
    this.timer = setInterval(()=>{
      this.initEcharts()
    }, 10000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    initEcharts() {
      const getname = ['有机分析设备','元素分析设备','水生态监测设备','流程自动化监测设备','常规理化设备','辅助设施设备'];
      const getvalue1 = [32,17,20,19,94,191]
      let option ={
        grid: {
          top: '13%',
          right: '8%',
          left: '12%',
          bottom: '30%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          }
        },
        legend: {
          show: false,
        },
        xAxis: {
          data: getname,
          axisLabel: {
            margin: 8,
            rotate:28,
            color: 'rgba(173, 177, 182, 1)',
            textStyle: {
              fontSize: 11
            },
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 1)',
            }
          },
          axisTick: {
            show: false
          },
        },
        yAxis: [
          {
            type: 'value',
            nameTextStyle: {
              fontSize: 12,
              color: '#fff',
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: 'rgba(255, 255, 255, 0.15)',
                width: 1,
              },
            },
            axisLabel: {
              formatter: '{value}',
              textStyle: {
                color: '#fff',
                fontSize: 12,
              },
            },
            axisLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: '样品数',
            type: 'bar',
            smooth: true,
            barWidth: 12,
            yAxisIndex: 0,
            color: 'rgba(0, 204, 255, 1)',
            symbolSize: '0',
            itemStyle: {
              barBorderRadius: 4,

            },

            lineStyle: {
              normal: {
                color: 'rgba(0, 204, 255, 1)',
              },
            },
            data: getvalue1,
          },
        ],
      }
      if (this.chart != null && this.chart != "" && this.chart != undefined) {
        this.chart.dispose()
      }
      this.chart = echarts.init(document.getElementById('3DColumnarEcharts'))
      this.chart.setOption(option)
    }
  }
}
</script>

<style>

</style>
