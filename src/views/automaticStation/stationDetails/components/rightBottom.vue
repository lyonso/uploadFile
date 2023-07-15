<template>
  <div class="rightBottom">
    <div class="title">
      数据趋势图
      <i class="el-icon-s-unfold icon"></i>
    </div>
    <div class="bottom">
      <el-select class='select' v-model="value"  size='mini' placeholder="选择指标类型">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <div id="chartTrendcy" />
    </div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import {map} from "@/api";
export  default {
  name:'RightBottom',
  components: {
  },
  watch:{
    $route(){
      this.init()
    },
    value(){
      this.options.forEach(item=>{
        if (this.value === item.value){
          this.value2 = item
        }
      })
      this.initEcharts()
    }
  },
  data(){
    return{
      options: [
        {
          label:'水温',
          value:'dataY_WT',
          Company:'    ℃'
        },
        {
          label:'PH',
          value:'dataY_PH',
          Company:'PH'
        },
        {
          label:'电导率',
          value:'dataY_COND',
          Company:'(us/cm)'
        },
        {
          label:'溶解氧',
          value:'dataY_DOX',
          Company:'(mg/L)'
        },
        {
          label:'浊度',
          value:'dataY_TURB',
          Company:'(us/cm)'
        },
        {
          label:'氧化还原单位',
          value:'dataY_REDOX',
          Company:'(us/cm)'
        },
        {
          label:'高锰酸盐指数',
          value:'dataY_CODMN',
          Company:'(us/cm)'
        },
        {
          label:'总氮',
          value:'dataY_TN',
          Company:'(mg/L)'
        }, {
          label:'氨氮',
          value:'dataY_NH3N',
          Company:'(mg/L)'
        },
        {
          label:'总磷',
          value:'dataY_TP',
          Company:'(mg/L)'
        },
        {
          label:'总有机碳',
          value:'dataY_TOC',
          Company:'(mg/L)'
        },
        {
          label:'叶绿素a',
          value:'dataY_CHLA',
          Company:'(ug/L)'
        }
      ],
      value: 'dataY_WT',
      chartData: [],
      value2: {
        label:'水温',
        value:'dataY_WT',
        Company:'    ℃'
      },
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this.init()
    })
  },
  methods:{
    init(){
      map.waterQualityParameter({stcd:this.$route.query.id}).then(res=>{
        this.chartData = res.data
        this.initEcharts()
      })
    },
    initEcharts() {
      let dataX = []
      this.chartData.dataX.forEach(item=>{
        dataX.push(item.slice(0,10))
      })
      let option ={
        backgroundColor: 'rgba(0,0,0,0)',
        title: {
          text: this.value2.Company,
          textStyle: {
            align: 'center',
            color: 'rgba(173, 177, 182, 0.65)',
            fontSize: 14,
          },
          top: '0px',
          left: '0px'
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: '13%',
          left: '5%',
          right: '5%',
          bottom: '10%',
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
          data:dataX,
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
            name: this.value2.label,
            type: 'line',
            smooth: true, //是否平滑
            showAllSymbol: true,
            symbol: 'circle',
            symbolSize: 7,
            lineStyle: {
              normal: {
                color: 'rgba(0, 255, 255, 1)',
              },
            },
            itemStyle: {
              color:'#fff',
              borderColor:'rgba(0, 255, 255, 1)',
              borderWidth: 2,
              shadowBlur: 0,
            },
            tooltip: {
              show: true
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(0, 255, 255, 1)'
                },
                  {
                    offset: 1,
                    color: 'rgba(0, 255, 255, 0)'
                  }
                ], false),
                shadowBlur: 20
              }
            },
            data: this.chartData[this.value2.value]
          },
        ]
      }
      this.chart = echarts.init(document.getElementById('chartTrendcy'))
      this.chart.setOption(option)
    }
  }
}

</script>

<style lang='less' scoped>
.rightBottom {
  .title {
    width: 100%;
    height: 32px;
    background: rgba(14, 78, 116, 0.31);
    padding-left: 20px;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: bold;
    box-sizing: border-box;
    line-height: 32px;
    color: #FFFFFF;
    .icon{
      padding-top: 5px;
      position: absolute;
      right: 16px;
      opacity: 0.52;
      font-size: 24px;
      cursor: pointer;
    }
  }
  .bottom {
    padding: 15px 0px 20px 20px;
    #chartTrendcy {
      margin-top: 10px;
      height:180px
    }
    .select{
      position: absolute;
      right: 25px;
      width: 140px;
      z-index: 9;
    }
    ::v-deep .el-input__inner{
      background-color:rgba(0, 51, 76, 0.49);
      border: 1px solid #05556B;
      border-radius: 4px;
      color:rgba(255, 255, 255, 0.67)
    }
  }
}
</style>

