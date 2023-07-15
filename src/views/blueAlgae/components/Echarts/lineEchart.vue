<template>
  <div :id='"lineEcharts"+id'  style='height:208px;width:calc(100%)' />
</template>
<script>
import * as echarts from 'echarts'
export default {
  name:'lineEcharts',
  props:{
    id:{
      type: Number,
      default:1
    },
    title:{
      type:String,
      default: ''
    },
    dataX:{
      type:Object,
      // default
    }
  },
  data() {
    return {}
  },
  mounted() {
    this.initEcharts()
  },
  methods: {
    initEcharts() {
      const colorList =['rgba(255, 40, 40, 1)','rgba(0, 255, 255, 1)']
      const colorListOne =['rgba(255, 40, 40, 0)','rgba(0, 255, 255, 0)']

      let option ={
        backgroundColor: 'rgba(0,0,0,0)',
        title: {
          text: this.title,
          textStyle: {
            align: 'center',
            color: 'rgba(173, 177, 182, 0.65)',
            fontSize: 14,
          },
          top: '15px',
          left: '10px'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: 'rgba(0, 255, 233,0)'
                }, {
                  offset: 0.5,
                  color: 'rgba(255, 255, 255,1)',
                }, {
                  offset: 1,
                  color: 'rgba(0, 255, 233,0)'
                }],
                global: false
              }
            },
          },
        },
        grid: {
          top: '25%',
          left: '7%',
          right: '4%',
          bottom: '15%',
        },
        xAxis: {
          type: 'category',
          axisLine: {
            show: true
          },
          splitArea: {
            // show: true,
            color: '#f00',
            lineStyle: {

              color: '#f00'
            },
          },
          axisLabel: {
            color: '#fff'

          },
          splitLine: {
            show: false
          },
          boundaryGap: false,
          data: ['1月', '2月', '3月', '4月', '5月', '6月','7月','8月','9月','10月','11月','12月'],
        },
        yAxis: {
          type: 'value',
          // max: '1200',
          splitLine: {
            show: true,
            lineStyle:{
              type:'dashed',
              width :1,
              color:'rgba(229, 229, 229, 0.35)'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(173, 177, 182, 0.65)',
              fontSize:14,
            }
          }
        },
        series: [
          {
            name: '注册总量',
            type: 'line',
            smooth: true, //是否平滑
            showAllSymbol: true,
            symbol: 'circle',
            symbolSize: 7,
            lineStyle: {
              normal: {
                color: colorList[this.id],
              },
            },
            itemStyle: {
              color:'#fff',
              borderColor: colorList[this.id],
              borderWidth: 2,
              shadowBlur: 0,
            },
            tooltip: {
              show: false
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: colorList[this.id]
                },
                  {
                    offset: 1,
                    color: colorListOne[this.id]
                  }
                ], false),
                shadowBlur: 20
              }
            },
            data: [502.84, 205.97, 332.79, 281.55, 398.35, 214.02, 502.84, 205.97, 332.79, 281.55, 398.35, 214.02,]
          },
        ]
      }
      this.chart = echarts.init(document.getElementById("lineEcharts"+ this.id))
      this.chart.setOption(option)
    }
  }
}
</script>

<style>

</style>