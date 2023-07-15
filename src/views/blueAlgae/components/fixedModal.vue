<template>
  <div class='modal-container' v-if='value'>
    <div class='dialogTitle'>
      <div>
        <div class='split' />
        <span class='title'>{{ title }}</span>
      </div>
      <img src='@/assets/inspect/close.png' alt='' class='close' @click='closeDialog' />
    </div>

    <div class='modal-content'>
      <el-form ref='form' :model='form' :inline='true' label-width='82px'>
        <el-form-item label='选择时间：'>
          <el-date-picker
            :clearable='false'
            v-model='form.time'
            type='daterange'
            value-format='yyyy-MM-dd'
            range-separator='至'
            start-placeholder='开始日期'
            :picker-options="pickerOptions"
            end-placeholder='结束日期'>
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click='onsubmit'>查询</el-button>
        </el-form-item>
      </el-form>
      <el-radio-group v-model="checkList" @change='changeRaido'>
        <el-radio label="1">
          <span class='label'>趋势</span>
        </el-radio>
        <el-radio label="2">
          <span class='label'>记录</span>
        </el-radio>
      </el-radio-group>
      <div v-if='checkList == 1'>
        <div id='chartDataSeparete' style='width: 100%;height: 400px'></div>
      </div>
      <div v-else class='tableReset__style'>
        <el-table
          ref="multipleTable"
          :data="list"
          tooltip-effect="dark"
          element-loading-background="rgba(0, 0, 0, 0)"
          style="width: 100%"
          height="380px"
          :cell-style="{backgwround: 'transparent',color:'#fff'}"
          :header-cell-style="{background: 'linear-gradient(0deg, rgba(0, 48, 83, 0.14), rgba(0, 143, 255, 0.14))'}"
        >
          <el-table-column prop="asot" label="日期" />
          <el-table-column prop="cyblShow" label="表观" />
          <el-table-column prop="cyblGrade" label="分级" />
          <el-table-column prop="cyblScore" label="日均强度值" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { map } from '@/api'
import * as echarts from 'echarts'
export default {
  name: 'FixedModal',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: Boolean,
    title: {
      type: String,
      default: '蓝藻分布强度'
    }
  },
  components: {

  },
  data() {
    return {
      checkList: '1',
      form: {
        time: [moment().subtract(30, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
      },
      detailData: {},
      list: [],
      chartData: {},
      details: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  methods: {
    /**
     * 关闭弹窗
     */
    closeDialog() {
      this.$emit('change', false)
    },
    init(details) {
      this.checkList = '1'
      this.form.time = [moment().subtract(30,'days').format('YYYY-MM-DD'),moment().format('YYYY-MM-DD')]
      this.details = details
      let params = {
        stcds: details.pointCode,
        startTime: this.form.time[0],
        endTime: this.form.time[1]
      }
      map.getImageCyblSiDay(params).then(res => {
        this.chartData = res.data.eChartsData
        this.list = res.data.records
        this.$nextTick(() => {
          this.initEchartsOne(res.data.eChartsData)
        })
      })
    },
    initEchartsOne(data) {
      let dataX = data.xData
      let option ={
        backgroundColor: 'rgba(0,0,0,0)',
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: '10%',
          left: '7%',
          right: '7%',
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
        yAxis: [{
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
      this.chart = echarts.init(document.getElementById('chartDataSeparete'))
      this.chart.setOption(option)
    },
    changeRaido(val) {
      if (val == 1) {
        this.initEchartsOne(this.chartData)
      } else if (val == 2) {

      }
    },
    onsubmit() {
      let end = this.form.time[1]
      let start = this.form.time[0]
      // if ((moment(end).diff(moment(start), 'days')) > 30) {
      //   return this.$message.warning('时间相差超过30天')
      // }
      let params = {
        stcds: this.details.pointCode,
        startTime: this.form.time[0],
        endTime: this.form.time[1]
      }
      map.getImageCyblSiDay(params).then(res => {
        this.chartData = res.data.eChartsData
        this.list = res.data.records
        if (this.checkList == 1) {
          this.$nextTick(() => {
            this.initEchartsOne(this.chartData)
          })
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
.modal-container {
  position: absolute;
  left: 480px;
  top: 95px;
  width: 661px;
  height: 606px;
  background: url("~@/assets/inspect/modal_bg.png") no-repeat;
  background-size: cover;
  z-index: 30;

  .dialogTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 30px 10px 30px;

    .split {
      width: 4px;
      height: 22px;
      background: #00CCFF;
      display: inline-block;
      margin-right: 10px;
      position: relative;
      top: 4px;
    }

    .title {
      font-size: 20px;
      font-weight: 500;
      color: #FFFFFF;
    }

    .close {
      width: 24px;
      height: 24px;
      cursor: pointer;
    }
  }

  .modal-content {
    padding: 0 30px;
    .label{
      margin-left: 12px;
      vertical-align: middle;
    }

    ::v-deep .el-radio-group{
      display:block;
    }
    ::v-deep .el-radio__inner{
      width: 16px;
      height: 16px;
      background: rgba(9, 84, 78, 0.36);
      border: 1px solid #0CD2D5;
      border-radius: 50%;
    }
    ::v-deep .el-radio__inner::after{
      width:3px;
      height:10px;
      top: 0;
      left: 5px;
      border:1px solid #fff;
      border-left:0;
      border-top:0;
      border-radius: 0%;
      background: none;
      //transform:rotate(45deg) scaleY(1);
      //transition:transform .15s ease-in .05s;
      //transform-origin:center;
    }
    ::v-deep .el-radio__label{
      font-size: 20px;
      color: #FFFFFF;

    }
    ::v-deep .el-radio{
      margin-bottom: 18px;
    }
    ::v-deep .el-radio__input.is-checked .el-radio__inner::after{
      transform: rotate(45deg) scaleY(1);
    }
    ::v-deep .el-button--primary {
      width: 85px;
      height: 40px;
      border: 1px solid #0089D7;
      opacity: 0.48;
      background: rgba(0, 137, 215, 0);
      border-radius: 3px;
      font-size: 20px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #FFFFFF
    }

    ::v-deep .el-input__inner {
      background-color: rgba(0, 51, 76, 0.49);
      border: 1px solid #05556B;
      border-radius: 4px;
      color: rgba(255, 255, 255, 0.67)
    }

    ::v-deep .el-button {
      padding-top: 9px;
    }

    ::v-deep .el-range-input {
      background: rgba(0, 137, 215, 0);
      color: rgba(255, 255, 255, 0.67)
    }

    ::v-deep .el-range-separator {
      color: #FFFFFF
    }
    ::v-deep .el-table .cell{
      text-align: center;
    }
    ::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td {
      background-color: #212e3e !important;
    }
    ::v-deep .el-form-item__label {
      color: #fff;
    }
  }
}
</style>
