<template>
  <div class='infoLock'>
    <div class='infoLock-title'>
      <div class='infoLock-title-icon'>
        <img src='@/assets/title-icon.png' alt=''>
      </div>
      <div class='infoLock-title-text'>历史信息</div>
      <div class='infoLock-title-line'>
        <img src='@/assets/line.png' alt=''>
      </div>
      <div class='clearfloat'></div>
    </div>
    <div class='infoLock-zhb'>
      <div class='infoLock-zhb-container' style='overflow: hidden;margin-top: 5px;width: 100%;padding-left: 35px;height:auto'>
        <el-date-picker
          @change='changeTime'
          v-model='value'
          type='daterange'
          size='mini'
          range-separator='至'
          start-placeholder='开始日期'
          end-placeholder='结束日期'
          value-format='yyyy-MM-dd' />
      </div>
      <div class='infoLock-zhb-left'>
        <img src='@/assets/back.png' alt=''>
      </div>
      <div class='infoLock-zhb-right'>
        <img src='@/assets/next.png' alt=''>
      </div>
      <div class='infoLock-zhb-container'>
        <div class='infoLock-zhb-container-content' :style='{width:zhbwidth}'>
          <div class='infoLock-zhb-list'
               @click='getHistory(pointCode,item.type);
               activetype=item.type;typeName=item.name'
               v-for='(item,index) in list'>
            <img v-if='activetype == item.type' src='@/assets/history.png' alt=''>
            <div>{{ item.name }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class='clearfloat'></div>
    <div style='width: 100%;height: 230px;'
         v-loading='loading'
         element-loading-text='加载中'
         element-loading-spinner='el-icon-loading'
         element-loading-background='rgba(0, 0, 0, 0.8)'
    >
      <line-chart v-if='showchart' :typeName='typeName' :dataX='dataX' :dataY='dataY' :activetype='activetype' />
    </div>
  </div>
</template>

<script>
import { swszyDataAuto } from '@/api/baseInfo'
import LineChart from './LineChart.vue'
import { mapState } from 'vuex'
import { getNextDate } from '@/utils/time'

export default {
  components: { LineChart },
  props: {
    pointCode: String,
    shuiwentype: String,
    choiceName: String,
    shuizhidata: {}
  },
  computed: {
    ...mapState({
      taskTime: state => state.security.taskTime
    })
  },
  data() {
    return {
      loading: false,
      showchart: true,
      dataX: [],
      dataY: [],
      value: [],
      startTime: '',
      endTime: '',
      list: [],
      activetype: 'WT',
      zhbwidth: '270px',
      typeName: '',
      preday: ''
    }
  },
  mounted() {
    this.list = this.$props.shuizhidata
    this.zhbwidth = (this.$props.shuizhidata.length * 90) + 'px'
    if (this.list.length > 0) {
      this.activetype = this.list[0].type
    }
    let date = new Date()
    let year = date.getFullYear() // 年
    let month = date.getMonth() + 1 // 月
    let day = date.getDate() // 日

    var yugi = function(n) {
      var now = new Date
      now.setDate(now.getDate() - n)
      return now
    }
    Date.prototype.format = function(format) {
      var o = {
        'M+': this.getMonth() + 1, //month
        'd+': this.getDate(), //day
        'h+': this.getHours(), //hour
        'm+': this.getMinutes(), //minute
        's+': this.getSeconds(), //second
        'q+': Math.floor((this.getMonth() + 3) / 3), //quarter
        'S': this.getMilliseconds() //millisecond
      }
      if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
      for (var k in o)
        if (new RegExp('(' + k + ')').test(format))
          format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
      return format
    }

    this.value = [
      this.taskTime.substring(0, 10),
      this.taskTime.substring(0, 10)
    ]
    this.startTime = this.taskTime.substring(0, 10)
    this.endTime = this.taskTime.substring(0, 10)
    this.preday = yugi(1).format('yyyy-MM-dd')

    if (this.$props.choiceName === 'section') {
      // 人工
      if (this.$props.shuiwentype === 'shuizhi') {
        // 水质
      } else {
        // 水文
        this.list = [
          { name: '流量', type: 'liuliang' },
          { name: '水位', type: 'shuiwei' }
        ]
        this.activetype = 'liuliang'
        this.zhbwidth = (this.list.length * 90) + 'px'
        this.getHistory(this.$props.pointCode, 'liuliang')
      }
    } else {
      // 自动
      if (this.$props.shuiwentype === 'shuizhi') {
        this.getHistory(this.$props.pointCode, this.activetype)
      } else {
        // '风速','流量','雨量','水位'
        this.list = [
          { name: '流量', type: 'liuliang' },
          { name: '水位', type: 'shuiwei' },
          { name: '风速', type: 'fengsu' },
          { name: '雨量', type: 'yuliang' }
        ]
        this.activetype = 'liuliang'
        this.zhbwidth = (this.list.length * 90) + 'px'
        this.getHistory(this.$props.pointCode, 'liuliang')
      }
    }
  },
  methods: {
    changeTime(e) {
      this.startTime = e[0]
      this.endTime = e[1]
      this.getHistory(this.pointCode, this.activetype)
    },
    getHistory(pointCode, type) {
      this.loading = true
      this.showchart = false
      if (this.$props.choiceName == 'section') {
        if (this.$props.shuiwentype == 'shuiwen') {
          let data = {
            'apiName': 'thwb.rtflow.info.getWxList',
            'bizContent': JSON.stringify({
              'stcd': pointCode,
              'taskName': '',
              'startTime': this.startTime,
              'endTime': this.endTime
            })
          }
          swszyDataAuto(data).then(res => {
            if (res.thwb_rtflow_info_getWxList_response.code == '10000' && res.thwb_rtflow_info_getWxList_response.data.records.length > 0) {
              const X = []
              const Y = []
              res.thwb_rtflow_info_getWxList_response.data.records.forEach(item => {
                X.unshift(item.scsj_s)
                if (this.activetype === 'shuiwei') Y.unshift(item.shuiwei)
                if (this.activetype === 'liuliang') Y.unshift(item.dmll)
              })
              this.dataX = X
              this.dataY = Y
              this.loading = false
              this.showchart = true
            }
          })
        } else {
          let data = {
            'apiName': 'thwb.rtwq.swnorm.getAllItemData',
            'bizContent': JSON.stringify({
              'stcd': pointCode,
              'taskName': '',
              'startTime': this.startTime,
              'endTime': this.endTime
            })
          }
          swszyDataAuto(data).then(res => {
            if (res.thwb_rtwq_swnorm_getAllItemData_response.code == '10000' && res.thwb_rtwq_swnorm_getAllItemData_response.data.records.length > 0) {
              let data = res.thwb_rtwq_swnorm_getAllItemData_response.data.records
              let dataX = []
              let dataY = []
              for (let i = 0; i < data.length; i++) {
                if (data[i].SPT) {
                  dataX.push(data[i].SPT)

                } else {
                  dataX.push(data[i].tjdate)

                }
                if (type == 'shuiwei') {
                  dataY.push(data[i].shuiwei)
                } else if (type == 'liuxiang') {
                  dataY.push(data[i].liuxiang)
                } else if (type == 'liuliang') {
                  dataY.push(data[i].dmll)
                } else {
                  Object.keys(data[i]).forEach(key => {
                    if (type == key) {
                      dataY.push(data[i][key])
                    }
                  })


                }
              }
              if (data.length == 1) {
                dataY.push('0')
                dataX.push('--')
              }
              this.dataX = dataX
              this.dataY = dataY
              this.loading = false
              this.showchart = true
            }
          })

        }

      }
      else {
        if (this.$props.shuiwentype == 'shuiwen') {
          if (type == 'fengsu') {
            //风速时长
            let data = {
              'apiName': 'thwb.rthy.wind.getMinData',
              'bizContent': JSON.stringify({
                'stcd': pointCode,
                'startTime': this.preday,
                'endTime': this.endTime
              })
            }
            swszyDataAuto(data).then(res => {
              if (res.thwb_rthy_wind_getMinData_response.code == '10000') {
                let data = res.thwb_rthy_wind_getMinData_response.data.records
                let dataX = []
                let dataY = []
                for (let i = 0; i < data.length; i++) {
                  dataX.push(data[i].TM)
                  Object.keys(data[i]).forEach(key => {
                    if (key != 'STCD' && key != 'STNM' && key != 'TM') {
                      dataY.push(data[i][key])
                    }
                  })
                }
                this.dataX = dataX
                this.dataY = dataY
                this.showchart = true
                this.loading = false
              }
            })
          } else if (type == 'liuliang') {
            let data = {
              'apiName': 'thwb.rthy.flow.getHourData',
              'bizContent': JSON.stringify({
                'stcd': pointCode,
                'startTime': this.preday,
                'endTime': this.endTime
              })
            }
            swszyDataAuto(data).then(res => {
              if (res.thwb_rthy_flow_getHourData_response.code == '10000') {
                let data = res.thwb_rthy_flow_getHourData_response.data.records
                let dataX = []
                let dataY = []
                for (let i = 0; i < data.length; i++) {
                  dataX.push(data[i].TM)
                  Object.keys(data[i]).forEach(key => {
                    if (key != 'STCD' && key != 'STNM' && key != 'TM') {
                      dataY.push(data[i][key])
                    }
                  })
                }
                this.dataX = dataX
                this.dataY = dataY
                this.showchart = true
                this.loading = false
              }
            })
          } else if (type == 'yuliang') {
            let data = {
              'apiName': 'thwb.rthy.rain.getMinData',
              'bizContent': JSON.stringify({
                'stcd': pointCode,
                'startTime': this.preday,
                'endTime': this.endTime
              })
            }
            swszyDataAuto(data).then(res => {
              if (res.thwb_rthy_rain_getMinData_response.code == '10000') {
                let data = res.thwb_rthy_rain_getMinData_response.data.records
                let dataX = []
                let dataY = []
                for (let i = 0; i < data.length; i++) {
                  dataX.push(data[i].TM)
                  Object.keys(data[i]).forEach(key => {
                    if (key != 'STCD' && key != 'STNM' && key != 'TM') {
                      dataY.push(data[i][key])
                    }
                  })
                }
                this.dataX = dataX
                this.dataY = dataY
                this.showchart = true
                this.loading = false
              }
            })
          } else {
            let data = {
              'apiName': 'thwb.rthy.river.getMinData',
              'bizContent': JSON.stringify({
                'stcd': pointCode,
                'startTime': this.preday,
                'endTime': this.endTime
              })
            }
            swszyDataAuto(data).then(res => {
              if (res.thwb_rthy_river_getMinData_response.code == '10000') {
                let data = res.thwb_rthy_river_getMinData_response.data.records
                let dataX = []
                let dataY = []
                for (let i = 0; i < data.length; i++) {
                  dataX.push(data[i].TM)
                  Object.keys(data[i]).forEach(key => {
                    if (key != 'STCD' && key != 'STNM' && key != 'TM') {
                      dataY.push(data[i][key])
                    }
                  })
                }
                this.dataX = dataX
                this.dataY = dataY
                this.showchart = true
                this.loading = false
              }
            })
          }
        } else {
          let data = {
            'apiName': 'thwb.rtwq.awqmd.getItemData',
            'bizContent': JSON.stringify({
              'stcd': pointCode,
              'itemName': type,
              'startTime': this.startTime,
              'endTime': this.endTime
            })
          }
          swszyDataAuto(data).then(res => {
            if (res.thwb_rtwq_awqmd_getItemData_response.code == '10000' && res.thwb_rtwq_awqmd_getItemData_response.data.records.length > 0) {
              let data = res.thwb_rtwq_awqmd_getItemData_response.data.records
              let dataX = []
              let dataY = []
              if (data.length == 1) {
                dataY.push('0')
                dataX.push('--')
              }
              for (let i = 0; i < data.length; i++) {
                dataX.push(data[i].SPT)
                Object.keys(data[i]).forEach(key => {
                  if (key == this.activetype) {
                    dataY.push(data[i][key])
                  }
                })
              }
              this.dataX = dataX
              this.dataY = dataY
              this.showchart = true
              this.loading = false
            }
          })
        }

      }
    }
  }
}
</script>

<style lang='less' scoped>
.infoLock-zhb {
  &-list {
    width: 90px;
    height: 60px;
    float: left;
    position: relative;
    cursor: pointer;
    // transform: translateX(-50px);
    img {
      position: absolute;
      top: 15px;
    }

    div {
      width: 100%;
      text-align: center;
      line-height: 55px;
      position: absolute;
      top: 0px;
      color: white;
    }
  }

  width: 100%;
  height: 60px;

  &-right {
    float: right;
    padding-top: 8px;
  }

  &-left {
    float: left;
    padding-top: 8px;
  }

  &-container {
    float: left;
    height: 60px;
    width: 330px;
    overflow: hidden;
    // overflow: hidden;
    overflow-x: auto;

  }

}

.infoLock-container {
  height: auto;
  overflow: hidden;
  padding: 5px;
  position: relative;
  font-size: 14px;
  cursor: pointer;

  &-list {
    width: 33%;
    float: left;
    height: 51px;
    margin-top: 22px;
    font-family: DIN Alternate;
    overflow: hidden;
  }
}

.infoLock {
  width: 420px;
  height: auto;
  padding: 20px;
  background: rgba(4, 16, 27, 0.8);

  &-title {
    width: 100%;

    &-icon {
      float: left;
    }

    &-text {
      float: left;
      font-size: 18px;
      font-family: sbold;
      font-weight: 400;
      color: #FEFEFE;
      margin-left: 17px;
    }

    &-line {
      float: right;
      position: relative;
      right: 40px;
    }
  }

}

::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 6px;
}

::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  background-color: #02adf7;
  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);
}

::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #1b5aa9;
}
</style>
