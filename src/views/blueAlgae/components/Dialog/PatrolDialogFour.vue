<template>
  <div class='PatrolDialog'>
    <div class='dialogTitle'>
      <span style='color: #0BF0F0'>{{ details.pointName }}</span>
      站点监测结果
    </div>
    <div class='details'>
      <div>
        <div>监测时间</div>
        <div v-for='(item,index) in chartDetails.dataX' :key='index'>
          {{ item }}
        </div>
      </div>
      <div>
        <div>风向</div>
        <div v-for='(item,index) in chartDetails.WNDDIR' :key='index'>
          {{ item }}°
        </div>
      </div>
      <div>
        <div>藻类情况</div>
        <div v-for='(item,index) in chartDetails.LZZK' :key='index' :class='item==="未发现"?"red":"yellow"'>
          {{ item }}
        </div>
      </div>
    </div>
    <!--    图片监测信息-->
    <div class='title'>
      图片监测信息
      <i class='el-icon-s-unfold icon' @click='changeStep(7)'></i>
    </div>
    <div class='imgDetails'>
      <el-image v-if='imgDetails.selfUrl' class='img' :preview-src-list='srcList' :src='imgDetails.selfUrl' />
      <img v-else class='img' style='opacity: 0.8' src='@/assets/mr_img.png' />

      <div class='imgDetails_right'>
        <div>
          <span>拍摄时间：</span>
          <span>{{ imgDetails.makeTime }}</span>
        </div>
        <div>
          <span>所属区域：</span>
          <span>{{ imgDetails.hqnm }}</span>
        </div>
      </div>
    </div>
    <!--    本年度藻类数量走势-->
    <div class='title'>
      数据展示
      <i @click='changeStep(10)' class='el-icon-s-unfold icon' />
    </div>
    <div class='line' />
    <el-row>
      <el-col :span='8'>
        <div :class='chose===0? "typeItem chose":"typeItem "' @click='chose=0'>溶解氧（MG/L）</div>
      </el-col>
      <el-col :span='8'>
        <div :class='chose===1? "typeItem chose":"typeItem "' @click='chose=1'>水温（℃）</div>
      </el-col>
      <el-col :span='8'>
        <div :class='chose===2? "typeItem chose":"typeItem "' @click='chose=2'>风速（KM/H）</div>
      </el-col>
    </el-row>
    <div class='line' />
    <div id='lineEchartsOne' style='height:calc(100vh - 730px);width:calc(100%)' />
  </div>
</template>
<script>
import dialogTitle from '@/components/DialogTitle'
import { map } from '@/api'
import * as echarts from 'echarts'
import { mapGetters } from 'vuex'

export default {
  name: 'PatrolDialog',
  components: {
    dialogTitle
  },
  watch: {
    BlueDialogDetails() {
      this.init()
    },
    chose(val) {
      switch (val) {
        case 0:
          this.dataY = this.chartDetails.DOX
          break
        case 1:
          this.dataY = this.chartDetails.WT
          break
        case 2:
          this.dataY = this.chartDetails.WNDV
          break
      }
      this.initEchartsOne()
    }
  },
  computed: {
    ...mapGetters([
      'BlueDialogDetails'
    ])
  },
  data() {
    return {
      details: {},
      detail: {
        dataX: '',
        WNDDIR: '',
        LZZK: ''
      },
      imgDetails: {},
      chose: 0,
      chartDetails: {
        dataX: []
      },
      dataY: [],
      srcList: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const details = JSON.parse(this.BlueDialogDetails)
      this.details = details
      const obj = {
        beginTime: '',
        endTime: '',
        limit: 1,
        pageNum: 1,
        pointCode: details.pointCode
      }
      map.lzImgList(obj).then(res => {
        this.imgDetails = res.data.rows[0] || {}
        this.srcList = [res.data.rows[0].selfUrl]
      })
      map.getLrData({ stcd: details.pointCode }).then(res => {
        this.chartDetails = res.data
        this.detail.dataX = res.data.dataX[res.data.dataX.length - 1]
        this.detail.WNDDIR = res.data.WNDDIR[res.data.WNDDIR.length - 1]
        this.detail.LZZK = res.data.LZZK[res.data.LZZK.length - 1]
        this.dataY = res.data.DOX
        this.initEchartsOne()
      })
    },
    changeStep(type) {
      this.$emit('chageSteps', type)
    },
    initEchartsOne() {
      let dataX = this.chartDetails.dataX
      let title = ['mg/l', '℃', 'KM/H']
      let option = {
        backgroundColor: 'rgba(0,0,0,0)',
        title: {
          text: title[this.chose],
          textStyle: {
            align: 'center',
            color: 'rgba(173, 177, 182, 0.65)',
            fontSize: 14
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
          bottom: '10%'
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
            }
          },
          axisLabel: {
            color: '#fff'

          },
          splitLine: {
            show: false
          },
          boundaryGap: false,
          data: dataX
        },
        yAxis: {
          type: 'value',
          // max: '1200',
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              width: 1,
              color: 'rgba(229, 229, 229, 0.35)'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(173, 177, 182, 0.65)',
              fontSize: 14
            }
          }
        },
        series: [
          {
            name: '数值',
            type: 'line',
            smooth: true, //是否平滑
            showAllSymbol: true,
            symbol: 'circle',
            symbolSize: 7,
            lineStyle: {
              normal: {
                color: 'rgba(0, 255, 255, 1)'
              }
            },
            itemStyle: {
              color: '#fff',
              borderColor: 'rgba(0, 255, 255, 1)',
              borderWidth: 2,
              shadowBlur: 0
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
            data: this.dataY
          }
        ]
      }
      this.chart = echarts.init(document.getElementById('lineEchartsOne'))
      this.chart.setOption(option)
    }

  }
}
</script>
<style lang='less' scoped>
.PatrolDialog {
  width: 706px;
  border: 1px solid rgba(229, 229, 229, 0.56);
  background: rgba(13, 22, 25, 0.69);
}

.details {
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #FFFFFF;
  margin-bottom: 10px;

  div {
    display: inline-block;
    text-align: center;
    border: 1px solid #075858;
    border-bottom-width: 0px;
    border-left-width: 0px;
  }

  > :first-child {
    width: calc(30% - 1px);
  }

  > :nth-child(2) {
    width: calc(30% - 1px);
    color: #ECDF3F;
  }

  > :nth-child(3) {
    width: calc(40% - 2px);
  }

  > :nth-child(1),
  > :nth-child(2),
  > :nth-child(3) {
    div {
      line-height: 30px;
      height: 30px;
      width: 100%;
    }

    :last-child {
      border-bottom-width: 1px;
    }

    :first-child {
      line-height: 40px;
      height: 42px;
      color: #47CFCE !important;
    }

    .yellow {
      color: #EDDA27;
    }

    .red {
      color: #ED775E;
    }
  }


  //.bottom{
  //  width: 100%;
  //}
  //.item{
  //  line-height:43px;
  //  :first-child{
  //    display: inline-block;
  //    width: 170px;
  //    font-size: 18px;
  //    font-family: PingFang SC;
  //    font-weight: 500;
  //    color: rgba(255, 255, 255, 0.81);
  //    text-align: right;
  //  }
  //  :nth-child(2){
  //    font-size: 18px;
  //    font-family: PingFang SC;
  //    font-weight: 500;
  //    color: #00F6FF;
  //  }
  //}
  //.portraitLine{
  //  display: inline-block;
  //  width: 2px;
  //  height: 86px;
  //  vertical-align: top;
  //  background-image: linear-gradient(
  //      rgba(229, 229, 229, 0.33) 0%,
  //      rgba(229, 229, 229, 0.33) 50%,
  //      transparent 70%
  //  );
  //  background-size:1px 8px ;
  //
  //}
  //.transverseLine{
  //  width: 100% !important;
  //  height: 1px !important;
  //  background-image: linear-gradient(
  //      to right,
  //      rgba(229, 229, 229, 0.33) 0%,
  //      rgba(229, 229, 229, 0.33) 50%,
  //      transparent 70%
  //  );
  //  background-size: 8px 1px;
  //  background-repeat: repeat-x;
  //}
}


.title {
  position: relative;
  height: 44px;
  background: rgba(14, 78, 116, 0.31);
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 44px;
  padding-left: 23px;

  .icon {
    position: absolute;
    right: 16px;
    top: 11px;
    opacity: 0.52;
    font-size: 24px;
    cursor: pointer;
  }
}

.imgDetails {
  height: 171px;
  padding: 19px 20px;

  .img {
    display: inline-block;
    width: 237px;
    height: 173px;
    background: cornflowerblue;
    vertical-align: top;
  }

  .imgDetails_right {
    display: inline-block;
    width: 429px;
    height: 181px;

    > div {
      padding-top: 10px;

      > :first-child {
        display: inline-block;
        width: 130px;
        text-align: right;
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
      }

      > :nth-child(2) {
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #00F7FF;
      }

      .isTrue {
        display: inline-block;
        text-align: center;
        width: 70px;
        height: 25px;
        background: rgba(255, 86, 86, 0.37);
        color: rgba(255, 0, 0, 1);
        border: 1px solid #FF0000;
        border-radius: 4px;
      }
    }
  }
}

.select {
  position: absolute;
  top: 46px;
  right: 25px;
  width: 140px;
  z-index: 10;
}

.line {
  width: 100% !important;
  height: 1px !important;
  background-image: linear-gradient(to right,
  rgba(0, 255, 255, 1) 0%,
  rgba(0, 255, 255, 1) 50%,
  transparent 70%);
  background-size: 8px 1px;
  background-repeat: repeat-x;
}

.typeItem {
  height: 46px;
  color: #FFFFFF;
  text-align: center;
  line-height: 46px;
  font-size: 16px;
  cursor: pointer;
}

.chose {
  background: rgba(0, 255, 255, 0.17);
}

.dialogTitle {
  background: #2A3E41;
  height: 40px;
  line-height: 40px;
  font-size: 15px;
  font-weight: 400;
  color: #FFFFFF;
  font-family: FZLanTingHei-DB-GBK;

  span:before {
    display: inline-block;
    content: '';
    width: 4px;
    height: 20px;
    background: #00CCFF;
    vertical-align: top;
    margin: 10px;
  }
}

::v-deep .el-input__inner {
  background-color: rgba(0, 51, 76, 0.49);
  border: 1px solid #05556B;
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.67)
}

::v-deep .el-select:hover .el-input__inner {
  width: 140px;
}
</style>
