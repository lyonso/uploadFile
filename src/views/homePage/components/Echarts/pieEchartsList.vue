<template>
  <div id='pieEchartsList'  style='height:269px;width:calc(100%)' />
</template>
<script>
import * as echarts from 'echarts'
export default {
  name:'pieEchartsList',
  props:{
    nowData:{
      type: Object,
      default:()=>{}
    },
  },
  watch:{
    nowData:{
      deep:true,
      handler(){
        this.initEcharts()
      }
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
      let option = {
        backgroundColor: 'rgba(135, 232, 255, 0.05)',
        tooltip: {
          show: false,
        },
        legend: {
          show: false,
        },
        title: [
          {
            text: '太湖（'+this.nowData.TH+')',
            left: '18%',
            top: '80%',
            textAlign: 'center',
            textStyle: {
              fontWeight: 'normal',
              fontSize: '12',
              color: 'white',
              textAlign: 'center',
            }
          },{
            text: '淀山湖（'+this.nowData.DSH+')',
            left: '48%',
            top: '80%',
            textAlign: 'center',
            textStyle: {
              fontWeight: 'normal',
              fontSize: '12',
              color: 'white',
              textAlign: 'center',
            }
          },{
            text: '元荡（'+this.nowData.YD+')',
            left: '80%',
            top: '80%',
            textAlign: 'center',
            textStyle: {
              fontWeight: 'normal',
              fontSize: '12',
              color: 'white',
              textAlign: 'center',
            }
          }
          ],
        // color:['#0000D4','#006411','#E1E199','#DD0806','#CECECE','#FB6463'],
        series: [
          {
            type: 'pie',
            clockwise: false,
            radius: ['25%', '35%'],
            center: ['20%', '50%'],
            roseType: 'radius',
            data:this.nowData.gradeTH,
            color:this.nowData.colorTH,
            label: {
              show: true,
              color: '#fff',
              fontsize:14,
              formatter: '{a|{b}：{d}%}',
              rich: {},
            },
            labelLine: {
              normal: {
                length: 10,
                length2: 5,
                lineStyle: {
                  width: 2,
                },
              },
            },
          },
          {
            type: 'pie',
            clockwise: false,
            radius: ['25%', '35%'],
            center: ['50%', '50%'],
            roseType: 'radius',
            data:this.nowData.gradeDSH,
            color:this.nowData.colorDSH,
            label: {
              show: true,
              color: '#fff',
              formatter: '{a|{b}：{c} 个  {d}%}',
              textStyle: {
                fontSize: '11',
                color: '#fff',
              },
              rich: {},
            },
            labelLine: {
              normal: {
                length: -10,
                length2: 0,
                lineStyle: {
                  width: 2,
                },
              },
            },
          },
          {
            type: 'pie',
            clockwise: false,
            radius: ['30%', '35%'],
            center: ['80%', '50%'],
            roseType: 'radius',
            data:this.nowData.gradeYD,
            color:this.nowData.colorYD,
            label: {
              show: true,
              formatter: '{b}：{c} \n 占比：{d}%',
              position: 'center',
              textStyle: {
                fontSize: '11',
                color: '#fff',
              },
            },
            labelLine: {
              normal: {
                length: 0,
                length2: 15,
                lineStyle: {
                  width: 2,
                },
              },
            },
          },
        ],
      }
      this.chart = echarts.init(document.getElementById('pieEchartsList'))
      this.chart.setOption(option)
    }
  }
}
</script>

<style>

</style>