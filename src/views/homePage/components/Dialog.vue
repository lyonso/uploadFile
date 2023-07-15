<template>
  <div class='dialog'>
    <div class='title'>
      <span>{{ titleName }}</span>
      <i @click='changeMark' class='el-icon-s-unfold icon'></i>
    </div>
    <div class='top'>
      <div>指标数据</div>
      <div class='table_top'>
        <el-row>
          <el-col :span='4'>
            <span class='first'>时间</span>
          </el-col>
          <el-col :span='4'>
            <span>溶解氧 (mg/L)</span>
          </el-col>
          <el-col :span='4'>
            <span>高锰酸盐 (mg/L)</span>
          </el-col>
          <el-col :span='4'>
            <span>总氮 <br>(mg/L)</span>
          </el-col>
          <el-col :span='4'>
            <span>氨氮 <br>(mg/L)</span>
          </el-col>
          <el-col :span='4'>
            <span class='last'>总磷 <br>(mg/L)</span>
          </el-col>
        </el-row>
      </div>
      <div class='table_body'>
        <div class='item' v-for='(item, index) in List' :key='index'>
          <el-row>
            <el-col :span='4'>
              <span class='item_first'>{{ item.SPT || '-' }}</span>
            </el-col>
            <el-col :span='4'>
              <span :class='Number(item.DOX)>Number(indexStandardValues.DOX)? "yellow":"red"'> {{ item.DOX || '-' }}</span>
            </el-col>
            <el-col :span='4'>
              <span :class='Number(item.CODMN)<=Number(indexStandardValues.CODMN)? "yellow":"red"'>{{ item.CODMN || '-' }}</span>
            </el-col>
            <el-col :span='4'>
              <span :class='Number(item.TN)<=Number(indexStandardValues.TN)? "yellow":"red"'>{{ item.TN || '-' }}</span>
            </el-col>
            <el-col :span='4'>
              <span :class='Number(item.NH3N)<=Number(indexStandardValues.NH3N)? "yellow":"red"'>{{ item.NH3N || '-' }}</span>
            </el-col>
            <el-col :span='4'>
              <span :class='Number(item.TP)<=Number(indexStandardValues.TP)? "yellow item_last":"red item_last"'>{{ item.TP || '-' }}</span>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class='center'>
      <div>近6月数据趋势图</div>
      <el-select class='select' v-model='value' size='mini' placeholder='选择指标类型'>
        <el-option
          v-for='item in options'
          :key='item.label'
          :label='item.label'
          :value='item'>
        </el-option>
      </el-select>
      <div id='lineEcharts' style='height:278px;width:100%' />
    </div>
    <div class='center'>
      <div>近6月水质类别趋势</div>
      <div id='histogramEcharts' style='height:calc(100vh - 740px);width:calc(100%)' />
    </div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import { map } from '@/api'
import { mapGetters } from 'vuex'

export default {
  name: 'Dialog',
  components: {},
  watch: {
    value: {
      deep: true,
      handler() {
        this.initLineEcharts()
      }
    },
    HomeDialogDetails() {
      this.init()
    }
  },
  computed: {
    ...mapGetters([
      'HomeDialogDetails'
    ])
  },
  data() {
    return {
      List: [],
      options: [
        {
          label: '砷',
          value: 'ARS',
          Company: '（mg/L）'
        }, {
          label: '叶绿素',
          value: 'CHLA',
          Company: '(μg/L)'
        }, {
          label: '氟化物',
          value: 'F',
          Company: '（mg/L）'
        }, {
          label: '挥发性酚',
          value: 'VLPH',
          Company: '（mg/L）'
        }, {
          label: '氨氮',
          value: 'NH3N',
          Company: '（mg/L）'
        }, {
          label: '化学需氧量',
          value: 'CODCR',
          Company: '（mg/L）'
        }, {
          label: '硒',
          value: 'SE',
          Company: '（mg/L）'
        }, {
          label: '水温',
          value: 'WT',
          Company: '   ℃'
        }, {
          label: '五日生化需氧量',
          value: 'BOD5',
          Company: '（mg/L）'
        }, {
          label: '镉',
          value: 'CD',
          Company: '（mg/L）'
        }, {
          label: '六价铬',
          value: 'CR6',
          Company: '（mg/L）'
        }, {
          label: '氰化物',
          value: 'CN',
          Company: '（mg/L）'
        }, {
          label: '溶解氧',
          value: 'DOX',
          Company: '（mg/L）'
        }, {
          label: '高锰酸盐指数',
          value: 'CODMN',
          Company: '（mg/L）'
        }, {
          label: '铜',
          value: 'CU',
          Company: '（mg/L）'
        }, {
          label: '铅',
          value: 'PB',
          Company: '（mg/L）'
        }, {
          label: '石油类',
          value: 'OIL',
          Company: '（mg/L）'
        }, {
          label: '锌',
          value: 'ZN',
          Company: '（mg/L）'
        }, {
          label: 'PH',
          value: 'PH',
          Company: '   PH'
        }, {
          label: '总氮',
          value: 'TN',
          Company: '（mg/L）'
        }, {
          label: '总磷',
          value: 'TP',
          Company: '（mg/L）'
        }, {
          label: '汞',
          value: 'HG',
          Company: '（mg/L）'
        }, {
          label: '阴离子',
          value: 'LAS',
          Company: '（mg/L）'
        }, {
          label: '硫化物',
          value: 'S2',
          Company: '（mg/L）'
        }
      ],
      value: {
        label: '总氮',
        value: 'TN',
        Company: '（mg/L）'
      },
      dataX: [],
      dataY: {},
      indexStandardValues: {},
      titleName: ''
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const details = JSON.parse(this.HomeDialogDetails)
      this.titleName = details.pointName
      map.waterQualityCategory({ stcds: details.pointCode }).then(res => {
        let dataY = {
          ARS: [],
          CHLA: [],
          F: [],
          VLPH: [],
          NH3N: [],
          CODCR: [],
          SE: [],
          WT: [],
          BOD5: [],
          CD: [],
          CR6: [],
          CN: [],
          DOX: [],
          CODMN: [],
          CU: [],
          PB: [],
          OIL: [],
          ZN: [],
          PH: [],
          TN: [],
          TP: [],
          HG: [],
          LAS: [],
          S2: [],
          AllGrade: []
        }
        let dayaTType = []
        res.data.dataY.forEach(item => {
          dataY.ARS.push(item.ARS || 0),// 砷(mg/L)
            dataY.CHLA.push(item.CHLA || 0), //叶绿素a(μg/L)
            dataY.F.push(item.F || 0) ,  // 氟化物(mg/L)
            dataY.VLPH.push(item.VLPH || 0), //挥发性酚(mg/L)
            dataY.NH3N.push(item.NH3N || 0), //氨氮(mg/L)
            dataY.CODCR.push(item.CODCR || 0), //化学需氧量(mg/L)
            dataY.SE.push(item.SE || 0), //硒(mg/L)
            dataY.WT.push(item.WT || 0),  //水温
            dataY.BOD5.push(item.BOD5 || 0),  //五日生化需氧量(mg/L)
            dataY.CD.push(item.CD || 0), //镉(mg/L)
            dataY.CR6.push(item.CR6 || 0),  //六价铬(mg/L)
            dataY.CN.push(item.CN || 0),  //氰化物(mg/L)
            dataY.DOX.push(item.DOX || 0),   //溶解氧(mg/L)
            dataY.CODMN.push(item.CODMN || 0),  //高锰酸盐指数(mg/L)
            dataY.CU.push(item.CU || 0),  //铜(mg/L)
            dataY.PB.push(item.PB || 0),  //铅(mg/L)
            dataY.OIL.push(item.OIL || 0),  //石油类(mg/L)
            dataY.ZN.push(item.ZN || 0),  //锌(mg/L)
            dataY.PH.push(item.PH || 0),  //PH
            dataY.TN.push(item.TN || 0),  //总氮(mg/L)
            dataY.TP.push(item.TP || 0),  //总磷(mg/L)
            dataY.HG.push(item.HG || 0), //汞(mg/L)
            dataY.LAS.push(item.LAS || 0), //阴离子mg/L
            dataY.S2.push(item.S2 || 0)  //硫化物(mg/L)
          dataY.S2.push(item.S2 || 0)  //硫化物(mg/L)
          switch (item.AllGrade) {
            case 'Ⅰ类':
              dataY.AllGrade.push(1)
              break
            case 'Ⅱ类':
              dataY.AllGrade.push(2)
              break
            case 'Ⅲ类':
              dataY.AllGrade.push(3)
              break
            case 'Ⅳ类':
              dataY.AllGrade.push(4)
              break
            case 'Ⅴ类':
              dataY.AllGrade.push(5)
              break
            case '劣Ⅴ类':
              dataY.AllGrade.push(6)
              break
          }
        })
        this.dataY = dataY
        this.dataX = res.data.dataX
        this.initLineEcharts()
        this.initEcharts()
      })
      map.dataByPoint({ stcds: details.pointCode }).then(res => {
        this.List = res.data.list
        this.indexStandardValues = res.data.indexStandardValues
      })
    },
    /**
     * 返回首页
     */
    changeMark() {
      this.$store.dispatch('map/setHomeDialogDetails', '')
    },
    /**
     * 进6月数据趋势图 Echarts
     */
    initLineEcharts() {
      let option = {
        backgroundColor: 'rgba(0,0,0,0)',
        title: {
          text: this.value.Company,
          textStyle: {
            align: 'center',
            color: 'rgba(173, 177, 182, 0.65)',
            fontSize: 14
          },
          top: '15px'
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
                  color: 'rgba(255, 255, 255,1)'
                }, {
                  offset: 1,
                  color: 'rgba(0, 255, 233,0)'
                }],
                global: false
              }
            }
          }
        },
        grid: {
          top: '21%',
          left: '10%',
          right: '6%',
          bottom: '15%'
        },
        xAxis: {
          type: 'category',
          axisLine: {
            show: false
          },
          axisLabel: {
            color: '#fff'
          },
          splitLine: {
            show: false
          },
          boundaryGap: false,
          data: this.dataX
        },
        yAxis: {
          type: 'value',
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
            data: this.dataY[this.value.value]
          }
        ]
      }
      this.chart = echarts.init(document.getElementById('lineEcharts'))
      this.chart.setOption(option)
    },
    /**
     * 近6月水质类别趋势 Echarts
     */
    initEcharts() {
      let option = {
        backgroundColor: 'rgba(0,0,0,0)',
        title: {
          text: '（类别）',
          textStyle: {
            align: 'center',
            color: 'rgba(173, 177, 182, 0.65)',
            fontSize: 14
          },
          top: '15px'
        },
        grid: {
          top: '20%',
          left: '10%',
          right: '6%',
          bottom: '15%'
        },
        xAxis: {
          type: 'category',
          axisLine: {
            show: false
          },
          axisLabel: {
            color: '#fff'
          },
          offset: 10,
          splitLine: {
            show: false
          },
          data: this.dataX
        },
        yAxis: {
          type: 'value',
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
          },
          min: 1,
          max: 6,
          axisLabel: {
            formatter: function(value) {
              var texts = []
              if (value === 1) {
                texts.push('Ⅰ类')
              } else if (value === 2) {
                texts.push('Ⅱ类')
              } else if (value === 3) {
                texts.push('Ⅲ类')
              } else if (value === 4) {
                texts.push('Ⅳ类')
              } else if (value === 5) {
                texts.push('Ⅴ类')
              } else {
                texts.push('劣Ⅴ')
              }
              return texts
            }
          }
        },
        series: [
          {
            data: this.dataY.AllGrade,
            type: 'bar',
            barWidth: 22,
            itemStyle: {
              color: {
                type: 'linear',
                global: false,
                colorStops: [
                  {
                    offset: 0,
                    color: '#D71345'
                  },
                  {
                    offset: 1,
                    color: '#8f4b2e'
                  }
                ]
              }
            }
          }
        ]
      }
      this.chart = echarts.init(document.getElementById('histogramEcharts'))
      this.chart.setOption(option)
    }

  }
}
</script>
<style lang='less' scoped>
.dialog {
  width: 516px;
  background: rgba(13, 22, 25, 0.69);
  border: 1px solid rgba(229, 229, 229, 0.31);
}

.title {
  background: #2A3E41;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  font-weight: 400;
  color: #FFFFFF;
  font-family: FZLanTingHei-DB-GBK;

  :first-child:before {
    display: inline-block;
    content: '';
    width: 4px;
    height: 20px;
    background: #00CCFF;
    vertical-align: top;
    margin: 10px;
  }

  :first-child {
    margin-right: 80px;
  }

  .item {
    cursor: pointer;
    margin-left: 20px;
  }

  .chose {
    display: inline-block;
    position: relative;
    color: rgba(0, 255, 255, 1);
    line-height: 30px;
    border-bottom: 4px solid rgba(0, 255, 255, 1);
  }

  .icon {
    position: absolute;
    right: 16px;
    top: 11px;
    opacity: 0.52;
    font-size: 24px;
    cursor: pointer;
  }
}

.top,
.center {
  > :first-child {
    height: 32px;
    background: rgba(14, 78, 116, 0.31);
    line-height: 32px;
    padding-left: 17px;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #FFFFFF;
  }
}

.table_top {
  span {
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

  .first {
    line-height: 32px;
  }

  .last {
    width: calc(100% - 2px);
    border: 1px solid rgba(11, 240, 240, 0.3);
  }

}

.table_body {
  min-height: 186px;
}

.item {
  font-size: 13px;
  font-weight: bold;

  span {
    width: calc(100% - 1px);
    display: inline-block;
    border: 1px solid rgba(11, 240, 240, 0.3);
    border-right-width: 0px;
    border-top-width: 0px;
    line-height: 30px;
    text-align: center;
  }

  .item_first {
    color: #fff;
    text-align: center;
  }

  .red {
    color: #FF755A;
  }

  .yellow {
    color: #FFDE00;
  }

  .item_last {
    width: calc(100% - 2px);
    border-right-width: 1px;
  }
}

.center {
  position: relative;

  .select {
    position: absolute;
    top: 46px;
    right: 25px;
    width: 140px;
    z-index: 10;
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
}


</style>
