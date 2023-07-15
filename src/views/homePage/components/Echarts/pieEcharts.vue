<template>
  <div id='pieEcharts'  style='height:249px;width:calc(100%)' />
</template>
<script>
import * as echarts from 'echarts'
export default {
  name:'pieEcharts',
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
        color: this.nowData.color,
        backgroundColor: 'rgba(135, 232, 255, 0.05)',
        tooltip: {
          show: false,
        },
        legend: {
          show: false,
        },
        series: {
          type: 'pie',
          clockwise: false,
          radius: '75%',
          center: ['50%', '50%'],
          roseType: 'radius',
          data:this.nowData.grade,
          label: {
            show: true,
            color: '#fff',
            textStyle: {
              fontSize: '11',
              color: '#fff',
            },            formatter: '{a|{b}：{c}个  {d}%}',
            rich: {},
          },
          labelLine: {
            normal: {
              length: 20,
              length2: 30,
              lineStyle: {
                width: 2,
              },
            },
          },
        },
      };
      this.chart = echarts.init(document.getElementById('pieEcharts'))
      this.chart.setOption(option)
    }
  }
}
</script>

<style>

</style>