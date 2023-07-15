<template>
  <div class="PatrolDialog">
    <dialogTitle :dialogTitle="dialogTitle" />
    <div class="details">
      <div>
        <div class="item">
          <span>监 测 点：</span>
          <span>{{ details.STNM }}</span>
        </div>
        <div class="transverseLine" />
        <div class="item">
          <span>藻类数量：</span>
          <span>{{details.PHYD}}(万个/L)</span>
        </div>
        <div class="transverseLine" />
      </div>
      <span class="portraitLine"/>
      <div >
        <div class="item" >
          <span>监测日期：</span>
          <span>{{details.SPT}}</span>

        </div>
        <div class="transverseLine" />
        <div class="item">
          <span>生物量：</span>
          <span>{{details.PHYBM}}(mg/L)</span>
        </div>
        <div class="transverseLine" />

      </div>
      <div class="bottom item">
        <span>主要优势种：</span>
        <span>{{details.PHYDS}}</span>
      </div>
    </div>

<!--    图片监测信息-->
    <div class="title">
      图片监测信息
      <i class="el-icon-s-unfold icon" @click="changeStep(7)"></i>
    </div>
    <div class="imgDetails">
      <img v-if="imgDetails.selfUrl" :src="imgDetails.selfUrl"/>
      <img v-else style="opacity: 0.8" src="@/assets/mr_img.png" />
      <div class="imgDetails_right">
        <div>
          <span>拍摄时间：</span>
          <span>{{ imgDetails.makeTime||'-' }}</span>
        </div>
        <div>
          <span>所属水系：</span>
          <span>{{ imgDetails.hqnm||'-' }}</span>
        </div>
      </div>
    </div>

<!--    本年度藻类数量走势-->
    <div class="title">
      本年度藻类数量走势
      <i @click="changeStep(8)" class="el-icon-s-unfold icon"></i>
      <el-select class='select' v-model="value"  size='mini' placeholder="选择藻类类型">
        <el-option
            v-for="item in options"
            :key="item.label"
            :label="item.label"
            :value="item">
        </el-option>
      </el-select>
    </div>
    <div id="lineEchartsOne"  style='height:208px;width:calc(100%)' />

<!--    本年度藻生物量走势-->
    <div class="title">
      本年度生物量走势
    </div>
    <div id="lineEchartsTwo"  style='height:208px;width:calc(100%)' />
  </div>
</template>
<script>
import dialogTitle from '@/components/DialogTitle'
import lineEcharts from '../Echarts/lineEchart.vue'
import {map}from '@/api'
import * as echarts from "echarts";
import { mapGetters } from 'vuex'

export default {
  name:'PatrolDialog',
  components:{
    dialogTitle,
    lineEcharts
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
          label:'甲藻',
          value:'PYRCD',
          Company:'万个/L'
        },{
          label:'蓝藻',
          value:'CYNCD',
          Company:'万个/L'
        },{
          label:'裸藻',
          value:'EUGCD',
          Company:'万个/L'
        },{
          label:'硅藻',
          value:'BCLC',
          Company:'万个/L'
        },{
          label:'绿藻',
          value:'CHLCD',
          Company:'万个/L'
        },{
          label:'金藻',
          value:'CHRCD',
          Company:'万个/L'
        },{
          label:'隐藻',
          value:'CRYCD',
          Company:'万个/L'
        },{
          label:'黄藻',
          value:'XNTCD',
          Company:'万个/L'
        }
      ],
      value:  {
        label:'蓝藻',
        value:'CYNCD',
        Company:'万个/L'
      },
      details:{},
      chartData:[],
      imgDetails:{},
      dialogTitle:''
    }
  },
  mounted() {
    this.init()
  },
  methods:{
    init(){
      const details = JSON.parse(this.BlueDialogDetails)
      this.dialogTitle = details.type==1? "水源检测地藻类监测结果":"太湖湖体藻类监测结果"
      map.handSample({stcds:details.pointCode}).then(res=>{
        this.details = res.data
      })
      map.getAllItemDataOfYear({stcd:details.pointCode}).then(res=>{
        this.chartData = res.data
        this.initEchartsOne()
        this.initEchartsTwo()
      })
      const obj = {
        bookmark:details.type ===0? "省界":"水源地",
        fileTheme:"河湖现场人工图像",
        limit:1,
        pageNum:1,
        pointCode:details.pointCode
      }
      map.lzImgList(obj).then(res=>{
        this.imgDetails = res.data.rows[0]||{}
      })
    },
    changeStep(type){
      this.$emit('chageSteps',type)
    },
    initEchartsOne() {
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
          data:this.chartData.dataX,
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
                color: 'rgba(255, 40, 40, 1)',
              },
            },
            itemStyle: {
              color:'#fff',
              borderColor:'rgba(255, 40, 40, 1)',
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
                  color: 'rgba(255, 40, 40, 1)'
                },
                  {
                    offset: 1,
                    color:'rgba(255, 40, 40, 0)'
                  }
                ], false),
                shadowBlur: 20
              }
            },
            data: this.chartData[this.value.value]
          },
        ]
      }
      this.chart = echarts.init(document.getElementById("lineEchartsOne"))
      this.chart.setOption(option)
    },
    initEchartsTwo() {
      let option ={
        backgroundColor: 'rgba(0,0,0,0)',
        title: {
          text: 'mg/L',
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
          data:this.chartData.dataX,
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
              show: false
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
            data: this.chartData['PHYD']
          },
        ]
      }
      this.chart = echarts.init(document.getElementById('lineEchartsTwo'))
      this.chart.setOption(option)
    },

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
  .portraitLine{
    display: inline-block;
    width: 2px;
    height: 86px;
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
  height:30px;
  background: rgba(14, 78, 116, 0.31);
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 30px;
  padding-left: 23px;
  .icon{
    position: absolute;
    right: 16px;
    top: 3px;
    opacity: 0.52;
    font-size: 24px;
    cursor: pointer;
  }
}
.imgDetails{
  height: 173px;
  padding: 19px 20px 4px;
  img{
    display: inline-block;
    width: 237px;
    height: 173px;
    background: cornflowerblue;
    vertical-align: top;
  }
  .imgDetails_right{
    display: inline-block;
    width: 429px;
    height: 181px;
    >div{
      padding-top: 10px;
      >:first-child{
        display: inline-block;
        width:130px;
        text-align: right;
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
      }
      >:nth-child(2){
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #00F7FF;
      }
    }
  }
}

.select{
  position: absolute;
  top: 46px;
  right: 25px;
  width: 140px;
  z-index: 10;
}

::v-deep .el-input__inner{
  background-color:rgba(0, 51, 76, 0.49);
  border: 1px solid #05556B;
  border-radius: 4px;
  color:rgba(255, 255, 255, 0.67)
}
::v-deep .el-select:hover .el-input__inner{
  width: 140px;
}
</style>
