<template>
  <div id='3DlineEcharts'  style='height:200px;width:calc(100%)' />
</template>
<script>
import * as echarts from 'echarts'
import {map} from '@/api'

export default {
  name:'lineEcharts',
  data() {
    return {
      lineCharts:{},
      timer: '',
      details:{}
    }
  },
  mounted() {
    map.CONUTFOLDERS().then(res=>{
      this.details  = res.data
      this.initEcharts(res.data)
    })
    this.timer = setInterval(()=>{
      this.initEcharts(this.details)
    }, 10000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    initEcharts(data) {
      const getname = data.dataX;
      const getvalue1 = data.YPL;
      const getvalue2 = data.SJL;
      let option ={
        color: ['rgba(0, 255, 255, 1)', 'rgba(255, 255, 0, 1)'],
        grid: {
          top: '21%',
          right: '15%',
          left: '12%',
          bottom: '16%'
          // height: '75%',
        },

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          }
        },
        legend: {
          x: 'center',
          show: true,
          orient: 'horizontal',
          textStyle: {
            color: '#fff',
            fontSize: 13,
          },
        },
        xAxis: {
          data: getname,
          axisLabel: {
            margin: 10,
            color: 'rgba(173, 177, 182, 1)',
            textStyle: {
              fontSize: 12
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

            name: '样品数（个）',
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
          {
            type: 'value',
            name: '数据量（个）',
            nameTextStyle: {
              fontSize: 14,
              color: '#fff',
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
              lineStyle: {
                type: 'dashed',
                color: '#ddd',
                width: 1,
              },
            },
            axisLabel: {
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
            type: 'line',
            smooth: true,
            yAxisIndex: 0,
            color: '#23bcca',
            symbolSize: '0',
            lineStyle: {
              normal: {
                color: '#23bcca',
              },
            },
            data: getvalue1,
          },
          {
            name: '数据量',
            type: 'line',
            smooth: true,
            yAxisIndex: 1,
            symbolSize: '0',
            zlevel: 3,
            color: 'rgba(255, 255, 0, 1)',
            lineStyle: {
              normal: {
                color: 'rgba(255, 255, 0, 1)',
              },
            },
            data: getvalue2,
          },
        ],
      }
      if (this.chart != null && this.chart != "" && this.chart != undefined) {
        this.chart.dispose()
      }
      this.chart = echarts.init(document.getElementById('3DlineEcharts'))
      this.chart.setOption(option)
    }
  }
}
</script>

<style>

</style>
