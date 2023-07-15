<template>
  <div class="PatrolDialog">
    <dialogTitle dialogTitle="湖区自动站监测结果" />
    <div class="details">
      <div>
        <div class="item">
          <span>监 测 点：</span>
          <span>{{ details.pointName }}</span>
        </div>
        <div class="transverseLine" />
      </div>
      <span class="portraitLine"/>
      <div >
        <div class="item" >
          <span>监测日期：</span>
          <span>{{jcTime}}</span>
        </div>
        <div class="transverseLine" />
      </div>
    </div>

    <div class="title">指标数据</div>
    <div class="table_top">
      <el-row >
        <el-col :span="4">
          <span class="first">时间</span>
        </el-col>
        <el-col :span="4">
          <span>溶解氧 <br> (mg/L)</span>
        </el-col>
        <el-col :span="4">
          <span>高锰酸盐 <br> (mg/L)</span>
        </el-col>
        <el-col :span="4">
          <span>总氮 <br>(mg/L)</span>
        </el-col>
        <el-col :span="4">
          <span>氨氮 <br>(mg/L)</span>
        </el-col>
        <el-col :span="4">
          <span class="last">总磷 <br>(mg/L)</span>
        </el-col>
      </el-row>
    </div>
    <div class="table_body">
      <div class="item" v-for="(item, index) in List" :key="index">
        <el-row >
          <el-col :span="4">
            <span class="item_first" >{{ item.SPT||"-" }}</span>
          </el-col>
          <el-col :span="4">
            <span :class='Number(item.DOX)>Number(indexStandardValues.DOX)? "yellow":"red"'> {{ item.DOX||"-" }}</span>
          </el-col>
          <el-col :span="4">
            <span :class='Number(item.CODMN)<=Number(indexStandardValues.CODMN)? "yellow":"red"'>{{ item.CODMN||"-" }}</span>
          </el-col>
          <el-col :span="4">
            <span :class='Number(item.TN)<=Number(indexStandardValues.TN)? "yellow":"red"'>{{ item.TN ||"-"}}</span>
          </el-col>
          <el-col :span="4">
            <span :class='Number(item.NH3N)<=Number(indexStandardValues.NH3N)? "yellow":"red"'>{{ item.NH3N ||"-"}}</span>
          </el-col>
          <el-col :span="4">
            <span :class='Number(item.TP)<=Number(indexStandardValues.TP)? "yellow item_last":"red item_last"'>{{ item.TP ||"-"}}</span>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="title">水质监测走势
      <i @click="changeStep" class="el-icon-s-unfold icon"></i>
    </div>
    <div id="lineEchartsOne"  style='height:calc(100vh - 480px);width:calc(100% - 120px)' />
    <div class="option">
        <div v-for="(item,index) in options" class="option_item" @click="value = item" :key="index">
          <span :class="value.value==item.value? 'ischose':''">{{item.label}}</span>
          <div v-if="value.value==item.value" class="chose">
            <div />
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import dialogTitle from '@/components/DialogTitle'
import {map}from '@/api'
import * as echarts from "echarts";
import { mapGetters } from 'vuex'
export default {
  name:'PatrolDialog',
  components:{
    dialogTitle,
  },
  watch:{
    value:{
      deep:true,
      handler(){
        this.initEchartsOne()
      }
    },
    BlueDialogDetails:{
      handler(val) {
        this.init()
      },
    }
  },
  computed: {
    ...mapGetters([
      'BlueDialogDetails'
    ]),
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
      value:   {
        label:'水温',
        value:'dataY_WT',
        Company:'    ℃'
      },
      details:{},
      chartData:[],
      List:[],
      indexStandardValues:{},
      jcTime:'-'
    }
  },
  mounted() {
    this.init()
  },
  methods:{
    init(){
      const details = JSON.parse(this.BlueDialogDetails)
      this.details = details
      map.dataByzdPoint({stcds:details.pointCode}).then(res=>{
        this.List = res.data.list
        if(res.data.list.length>0){
          this.jcTime = res.data.list[0].SPT
        }
        this.indexStandardValues =  res.data.indexStandardValues
      })
      map.waterQualityParameter({stcd:details.pointCode}).then(res=>{
        this.chartData = res.data
        this.initEchartsOne()
      })
    },
    changeStep(){
      this.$emit('chageSteps',9)
    },
    initEchartsOne() {
      let dataX = []
      this.chartData.dataX.forEach(item=>{
        dataX.push(item.slice(0,10))
      })
      let option ={
        backgroundColor: 'rgba(0,0,0,0)',
        title: {
          text: this.value.Company,
          textStyle: {
            align: 'center',
            color: 'rgba(173, 177, 182, 0.65)',
            fontSize: 14,
          },
          top: '15px',
          left: '10px'
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: '10%',
          left: '7%',
          right: '4%',
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
            name: this.value.label,
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
            data: this.chartData[this.value.value]
          },
        ]
      }
      this.chart = echarts.init(document.getElementById('lineEchartsOne'))
      this.chart.setOption(option)
    }
  }
}
</script>
<style lang="less" scoped>
.PatrolDialog{
  width: 706px;
  border: 1px solid rgba(229, 229, 229, 0.56);
  background: rgba(13, 22, 25, 0.69);
}
.details{
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #FFFFFF;
  >div{
    display: inline-block;
    width: calc(50% - 1px);
    height:42px;
  }

  .item{
    line-height:43px;
    :first-child{
      display: inline-block;
      width: 170px;
      font-size: 18px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.81);
      text-align: right;
    }
    :nth-child(2){
      font-size: 18px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #00F6FF;
    }
  }
  .portraitLine{
    display: inline-block;
    width: 2px;
    height: 42px;
    vertical-align: top;
    background-image: linear-gradient(
        rgba(229, 229, 229, 0.33) 0%,
        rgba(229, 229, 229, 0.33) 50%,
        transparent 70%
    );
    background-size:1px 8px ;

  }
  .transverseLine{
    width: 100% !important;
    height: 1px !important;
    background-image: linear-gradient(
        to right,
        rgba(229, 229, 229, 0.33) 0%,
        rgba(229, 229, 229, 0.33) 50%,
        transparent 70%
    );
    background-size: 8px 1px;
    background-repeat: repeat-x;
  }
}

.table_top{
  span{
    width: calc(100% - 1px);
    height: 42px;
    padding-top: 6px;
    display: inline-block;
    font-size: 13px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #09ECF0;
    text-align: center;
    border: 1px solid rgba(11, 240, 240, 0.3);
    border-right-width: 0px;
    vertical-align: bottom;
  }
  .first{
    line-height: 32px;
  }
  .last{
    width: calc(100% - 2px);
    border: 1px solid rgba(11, 240, 240, 0.3);
  }

}
.table_body{
  min-height: 186px;
  .item{
    font-size: 13px;
    font-weight: bold;
    span{
      width: calc(100% - 1px);
      display: inline-block;
      border: 1px solid rgba(11, 240, 240, 0.3) ;
      border-right-width: 0px;
      border-top-width: 0px;
      line-height: 30px;
      text-align: center;
    }
    .item_first{
      color: #fff;
      text-align: center;
    }
    .red{
      color: #FF755A;
    }
    .yellow{
      color: #FFDE00;
    }
    .item_last{
      width: calc(100% - 2px);
      border-right-width: 1px;
    }
  }
}
.title{
  position: relative;
  height: 44px;
  background: rgba(14, 78, 116, 0.31);
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 44px;
  padding-left: 23px;
  .icon{
    position: absolute;
    right: 16px;
    top: 11px;
    opacity: 0.52;
    font-size: 24px;
    cursor: pointer;
  }
}
#lineEchartsOne{
  display: inline-block;
  vertical-align: top;
}
.option{
  display: inline-block;
  width: 120px;
  margin-top: 40px;
  font-size: 13px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 31px;
  .option_item{

    span{
      display: inline-block;
    }
    >:first-child{
      width: 80px;
      text-align: right;
      cursor: pointer;
      vertical-align:top ;
    }

    .ischose{
      color: #0BFFFF !important;
    }
    .chose{
      display: inline-block;
      width: 12px;
      height: 12px;
      border: 1px solid #0BF0F0;
      border-radius: 50%;
      vertical-align: middle;
      margin-left: 10px;
      div{
        width: 6px;
        height: 6px;
        margin: 3px;
        border-radius: 50%;
        background: #0BF0F0;
      }
    }
  }

}

::v-deep .el-scrollbar__wrap {
  overflow-x:hidden
}

</style>
