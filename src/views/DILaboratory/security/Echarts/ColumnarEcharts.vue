  <template>
  <div id='3DColumnarEcharts' style='height:200px;width:100%' />
</template>
<script>
import * as echarts from 'echarts'
import { DILaboratory } from '@/api'

export default {
  name: '3DColumnarEcharts',
  data() {
    return {
      // timer: ''
    }
  },
  mounted() {
    this.timeCount()
    // this.timer = setInterval(() => {
    //   this.initEcharts()
    // }, 10000)
  },
  // beforeDestroy() {
  //   clearInterval(this.timer)
  // },
  methods: {

    timeCount() {
      const obj = {
        classification: 3
      }
      DILaboratory.timeCount(obj).then(res => {
        this.initEcharts(res.data['0'], res.data['1'])
      })
    },
    initEcharts(datax, datay) {
      let option = {
        grid: {
          top: '15%',
          right: '8%',
          left: '12%',
          bottom: '15%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          }
        },
        legend: {
          show: false
        },
        xAxis: {
          data: datax,
          axisLabel: {
            margin: 8,
            color: 'rgba(173, 177, 182, 1)',
            textStyle: {
              fontSize: 11
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
            name: '（人次）',
            nameTextStyle: {
              fontSize: 12,
              color: '#fff'
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
              }
            },
            axisLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '人次',
            type: 'line',
            smooth: true,
            barWidth: 12,
            yAxisIndex: 0,
            color: 'rgba(0, 255, 255, 1)',
            symbolSize: '0',
            itemStyle: {
              barBorderRadius: 4
            },

            lineStyle: {
              normal: {
                color: 'rgba(0, 255, 255, 1)'
              }
            },
            data: datay
          }
        ]
      }
      if (this.chart != null && this.chart != '' && this.chart != undefined) {
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
