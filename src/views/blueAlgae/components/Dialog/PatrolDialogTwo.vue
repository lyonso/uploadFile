<template>
  <div class="PatrolDialog">
    <dialogTitle dialogTitle="蓝藻智能识别结果">
      <span class="titlePoints">
        <span>监 测 点：</span>
        <span>{{ details.pointName }}</span>
      </span>
    </dialogTitle>
    <div class="details">
      <div class="firstChild">
        <div class="itemsDate">
          <span>{{ lastData.asot }}</span>
        </div>
        <div class="transverseLine" />
      </div>
      <span class="portraitLine"/>
      <div >
        <div class="items" >
          <span><span style="color:rgba(255, 255, 255, 0.81) ">日均强度值：</span>{{lastData.cyblScore}}</span>
          <span>表观：{{lastData.cyblShow}}</span>
          <span>分级：{{ lastData.cyblGrade }}</span>
        </div>
        <div class="transverseLine" />
      </div>
    </div>
<!--    AI识别图片-->
    <div class='patrolPosition'>
      <div class="titleNumber">
        <div class="headerTitle">
          近期智能识别表观蓝藻水华强度情况统计
          <div class="transverseLine" />
        </div>
        <el-row>
          <el-col :span="6">
            <div class="portraitBorderLine">
              无蓝藻水华
              <span class="titleColor">{{monthDataSt.zeroDays}}</span>
              <span class="dayText">天</span>
              <span class="portraitLine"></span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="portraitBorderLine">
              轻度(颗粒状)
              <span class="titleColor">{{monthDataSt.lightDays}}</span>
              <span class="dayText">天</span>
              <span class="portraitLine"></span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="portraitBorderLine">
              中度(带状)
              <span class="titleColor">{{monthDataSt.mediumDays}}</span>
              <span class="dayText">天</span>
              <span class="portraitLine"></span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="portraitBorderLine">
              重度(片状)
              <span class="titleColor">{{monthDataSt.severeDays}}</span>
              <span class="dayText">天</span>
            </div>
          </el-col>
        </el-row>
        <div class="transverseLine" />
      </div>
      <div id='imgChartTimeRange' style='height:calc(100vh - 740px);width:100%;margin-bottom: 20px'></div>
      <i class="el-icon-s-unfold icon iconPoition"  @click="openDialog"/>
    </div>
    <div class="title">
      AI识别图片
      <i class="el-icon-s-unfold icon"  @click="changeStep"/>
    </div>
    <div class="imgDetails">
        <div class="noList" v-if="imgList.length==0">
          暂无数据
        </div>
        <el-row v-else :gutter="30">
          <el-col v-for="(item ,index) in imgList" :key="index" :span="12" style="margin-bottom: 30px">
            <div class="imgItem" >
              <img :src="item.selfUrl" />
              <div>{{item.originalDate}}
               <span> AI识别:{{item.eventType}}</span>
              </div>
            </div>
          </el-col>
        </el-row>
    </div>

  </div>
</template>
<script>
import dialogTitle from '@/components/DialogTitle'
import {map}from '@/api'
import { mapGetters } from 'vuex'
import moment from 'moment'
import * as echarts from 'echarts'

export default {
  name:'PatrolDialog',
  components:{
    dialogTitle,
  },
  watch:{
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
      details:{},
      imgList:[],
      lastData: {},
      monthDataSt: {}
    }
  },
  mounted() {
    this.init()
  },
  methods:{
    init(){
      const details = JSON.parse(this.BlueDialogDetails)
      this.details = details
      const obj = {
        limit:4,
        pageNum:1,
        pointCode:details.pointCode
      }
      map.imglist(obj).then(res=>{
        this.imgList = res.data.rows
      })
      map.getStatisticsData({
        stcd: details.pointCode
      }).then(res=>{
        this.lastData = res.data.lastData
        this.monthDataSt = res.data.monthDataSt
        this.$nextTick(() => {
          this.initEchartsOne(res.data.eChartsData)
        })
      })
    },
    changeStep(){
      this.$emit('chageSteps',7)
    },
    initEchartsOne(data) {
      let dataX = data.xData
      let option ={
        backgroundColor: 'rgba(0,0,0,0)',
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: '8%',
          left: '7%',
          right: '10%',
          bottom: '10%',
        },
        xAxis: {
          type: 'category',
          axisLine: {
            show: true
          },
          splitArea: {
            color: '#f00',
            lineStyle: {

              color: '#f00'
            },
          },
          axisLabel: {
            color: '#fff',
            showMaxLabel:true

          },
          splitLine: {
            show: false
          },
          boundaryGap: false,
          data:dataX,
        },
        yAxis: [
          {
            type: 'value',
            max: '100',
            interval:25,
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
          {
            name: '',
            nameTextStyle: {
              color: '#65d5ff'
            },
            min: 0,
            max: 100,
            interval: 25,
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: 'rgba(173, 177, 182, 0.65)'
              },
              formatter: function(value) {
                if (value == 0) {
                  return '无'
                } else if (value == 25) {
                  return '轻度'
                }  else if (value == 50) {
                  return '中度'
                }  else if (value == 75) {
                  return '重度'
                } else if ( value  == 100) {
                  return ''
                }
              }
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '评分',
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
            data: data.yData
          },
        ]
      }
      this.chart = echarts.init(document.getElementById('imgChartTimeRange'))
      this.chart.setOption(option)
    },
    openDialog() {
      this.$emit('openDialog',this.details)
    }
  }
}
</script>
<style lang="less" scoped>
.PatrolDialog{
  width: 706px;
  height:calc( 100vh - 70px);
  border: 1px solid rgba(229, 229, 229, 0.56);
  background: rgba(13, 22, 25, 0.69);
}
.titlePoints {
  margin-left: 50px;
  :nth-child(2){
    color: #00F6FF;
  }
}
.details{
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #FFFFFF;
  >div{
    display: inline-block;
    width: calc(80% - 1px);
    height:42px;
  }
  .firstChild {
    display: inline-block;
    width: calc(20% - 1px);
    height:42px;
  }
  .bottom{
    width: 100%;
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
  .items {
    line-height:43px;
    display: flex;
    justify-content: space-around;
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: 500;
    :first-child{
      color: #00F6FF;
    }
    :nth-child(2){
      color: rgba(255, 255, 255, 0.81);
    }
    :nth-child(3){
      color: rgba(255, 255, 255, 0.81);
    }
  }
  .itemsDate {
    line-height:43px;
    display: flex;
    justify-content: space-around;
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.81);
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
.imgDetails{
  color: #FFFFFF;
  padding: 20px 17px;
  .imgItem{
    div{
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #FFFFFF;
    }
    img{
      display: inline-block;
      width: 100%;
      height: 150px;
      vertical-align: top;
      margin-bottom: 20px;
    }
    :first-child{
      position: relative;
      margin-bottom: 10px;
      span{
        position: absolute;
        right:  0 ;

      }
    }
    //:last-child{
    //  text-align: center;
    //  margin: 5px 0 10px;
    //}
  }
}

.noList{
  text-align: center;
  line-height: 400px;
}
.patrolPosition {
  position: relative;
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
  .iconPoition {
    position: absolute;
    right: 16px;
    top:100px;
    opacity: 0.52;
    font-size: 24px;
    cursor: pointer;
    color: #fff;
  }
  .titleNumber {
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.81);
    text-align: center;
    .headerTitle {
      line-height: 43px;
    }
    .titleColor {
      color: #00F6FF;
      margin-left: 10px;
    }
    .dayText {
      color: #00F6FF;
      font-size: 18px;
    }
    .portraitBorderLine{
      position: relative;
      line-height: 43px;
      .portraitLine{
        position: absolute;
        right: 0px;
        top: 0px;
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

    }
  }
}
</style>
