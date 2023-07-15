<template>
  <div id='lineEcharts'  style='height:186px;width:calc(100%)' />
</template>
<script>
import * as echarts from 'echarts'
import {map} from '@/api'

export default {
  name:'lineEcharts',
  data() {
    return {}
  },
  mounted() {
    map.waterL().then(res=>{
      this.initEcharts(res.data)
    })
  },

  methods: {
    initEcharts(data) {
      const getname = data.dataX;
      const getvalue1 = data.dataY;
      let option ={
        backgroundColor: 'rgba(13,22,25,0)',
        title: {
          text: '单位：m',
          textStyle: {
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: 16,
          },
          top:8,
          right: 18
        },

        grid: {
          top: '21%',
          right: '5%',
          left: '8%',
          bottom: '16%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          }
        },

        xAxis: [{
          data: getname,
          axisLabel: {
            margin: 10,
            color: 'rgba(173, 177, 182, 0.65)',
            textStyle: {
              fontSize: 12
            },
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(173, 177, 182, 0.65)',
            }
          },
          axisTick: {
            show: false
          },
        }],
        yAxis: [
          {
            type: 'value',
            min: 2.7,
            name:'太湖水位过程线',
            splitNumber: 5,
            nameTextStyle: {
              color: 'rgba(173, 177, 182, 0.65)',
              fontSize: 16,
              padding: [0, 0, 0, 70]
            },
            axisLabel: {
              formatter: function(value) {
                let num = value
                if (num && num != 'undefined' && num != 'null') {
                  let numS = num;
                  numS = numS.toString();
                  numS = numS.replace(/,/gi, '');
                  return numS;
                } else {
                  return num;
                }
              },
              color: 'rgba(173, 177, 182, 0.65)',
              textStyle: {
                fontSize: 12
              },
            },
            axisLine: {
              show:false,
              lineStyle: {
                color: '#ddd',
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show:false,
            }
          }
        ],
        series: [
          {
            name: '水位',
            type: 'line',
            data: getvalue1,
            smooth: true,
            symbol: 'none',
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#00CCFF'
                },
              }
            }
          }
        ]
      }
      this.chart = echarts.init(document.getElementById('lineEcharts'))
      this.chart.setOption(option)
    }
  }
}
</script>

<style>

</style>
