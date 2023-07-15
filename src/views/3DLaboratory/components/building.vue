<template>
  <div>
    <div class='dialogTitle'>
      <span>环境监测</span>
    </div>
    <div class='top'>
      <div class='top_left'>
        <div>
          <img src='@/assets/icon_sd.png' />
          <span> {{ details.humiMin }}--{{ details.humiMax }}%</span> RH
        </div>
        <div>
          <img src='@/assets/icon_wd.png' />
          <span> {{ details.tempMin }} ~ {{ details.tempMax }} </span> ℃
        </div>
        <div>
          <img src='@/assets/icon_pm2.5.png' />
          <span> {{ details.ch2oMin }}~{{ details.ch2oMax }}</span> mg/m³
        </div>
      </div>
      <div class='top_right'>
        <div @click='goDetails(1)'>
          <span style='margin-right: 28px'>温湿度</span>
          <span class='num' v-if='wsdList.length>0'>{{ wsdList.length }}</span>
          <span :class=' wsdList.length>0 ?"yc":""'>{{ wsdList.length > 0 ? '异常' : '正常' }}</span>
        </div>
        <div @click='goDetails(2)'>
          <span style='margin-right: 14px'>空气质量</span>
          <span class='num' v-if='kqzlList.length>0'>{{ kqzlList.length }}</span>
          <span :class=' kqzlList.length>0 ?"yc":""'>{{ kqzlList.length > 0 ? '异常' : '正常' }}</span>
        </div>
        <div @click='goDetails(3)'>
          <span style='margin-right: 16px'>AI&nbsp;&nbsp;&nbsp;识别</span>
          <span class='num' v-if='AIList.length>0'>{{ AIList.length }}</span>
          <span :class='AIList.length>0 ?"yc":""'>{{ AIList.length > 0 ? '异常' : '正常' }}</span>
        </div>
      </div>
    </div>
    <div class='dialogTitle'>
      <span>实验室实时运行概况</span>
    </div>
    <div class='center'>
      <div>
        <div>今日任务组数 （个）</div>
        <div class='center_body'>
          <el-row>
            <el-col class='item' :span='8'>
              <div>完成数</div>
              <div>0</div>
            </el-col>
            <el-col class='item' :span='8'>
              <div>未完成数</div>
              <div>0</div>
            </el-col>
            <el-col class='item' :span='8'>
              <div>完成率</div>
              <div>-</div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div>
        <div>今日样品数 （个）</div>
        <div class='center_body'>
          <el-row>
            <el-col class='item' :span='8'>
              <div>完成数</div>
              <div>0</div>
            </el-col>
            <el-col class='item' :span='8'>
              <div>未完成数</div>
              <div>0</div>
            </el-col>
            <el-col class='item' :span='8'>
              <div>完成率</div>
              <div>-</div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class='dialogTitle'>
      <span>监测数据量</span>
    </div>
    <lineEcharts />
    <div class='dialogTitle'>
      <span>
        设备数量概览 ( 台 / 套 )
        <span style='float: right;margin-right: 20px'>总数：373</span>
      </span>
    </div>
    <ColumnarEcharts />
  </div>
</template>
<script>
import lineEcharts from '../Dialog/lineEcharts'
import ColumnarEcharts from '../Dialog/ColumnarEcharts'
import { map } from '@/api'
import { mapGetters } from 'vuex'
import { EventBus } from '@/mapJs/EventBus'

export default {
  name: 'floorDetails',
  components: {
    lineEcharts,
    ColumnarEcharts
  },
  computed: {
    ...mapGetters([
      'wsdList',
      'kqzlList',
      'AIList',
      'duplicateList'
    ])
  },
  mounted() {
    map.getEnvironmentInfoByFloor({ floor: 0 }).then(res => {
      console.log(res)
      this.details = res.data
    })
  },
  data() {
    return {
      details: {}
    }
  },
  methods: {
    goDetails(type) {
      switch (type) {
        case 1:
          if (this.wsdList.length > 0) {
            const obj = {
              jd: this.wsdList[0]['longitude'],
              wd: this.wsdList[0]['latitude']
            }
            this.$store.dispatch('map/setEquipmentId', this.wsdList[0]['DeviceID'])
            this.$store.dispatch('map/setOpenDialog', 6)
            let data = {
              floor: this.wsdList[0]['floor'],
              data: []
            }

            this.$store.dispatch('map/setBuildingControl', this.wsdList[0]['floor'])

            this.duplicateList.forEach(item => {
              if (item['floor'] == this.wsdList[0]['floor']) {
                data.data.push(item)
              }
            })
            EventBus.$emit('houseWaring', data)
            EventBus.$emit('cameraPosition', 2)
            //   EventBus.$emit('cameraFly', obj)
          }
          break
        case 2:
          if (this.kqzlList.length > 0) {
            const obj = {
              jd: this.kqzlList[0]['longitude'],
              wd: this.kqzlList[0]['latitude']
            }
            this.$store.dispatch('map/setEquipmentId', this.kqzlList[0]['DeviceID'])
            this.$store.dispatch('map/setOpenDialog', 6)
            let data = {
              floor: this.kqzlList[0]['floor'],
              data: []
            }
            this.$store.dispatch('map/setBuildingControl', this.kqzlList[0]['floor'])
            this.duplicateList.forEach(item => {
              if (item['floor'] == this.kqzlList[0]['floor']) {
                data.data.push(item)
              }
            })
            EventBus.$emit('houseWaring', data)
            EventBus.$emit('cameraPosition', 2)
            //   EventBus.$emit('cameraFly', obj)

          }
          break
        case 3:
          break
      }
    }
  }
}
</script>

<style lang='less' scoped>
.dialogTitle {
  background: rgba(37, 82, 88, 0.49);
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  font-weight: 400;
  color: #FFFFFF;
  font-family: FZLanTingHei-DB-GBK;

  > span:before {
    display: inline-block;
    content: '';
    width: 4px;
    height: 20px;
    background: #00CCFF;
    vertical-align: top;
    margin: 10px;
  }
}

.top {
  .top_left {
    display: inline-block;
    width: 50%;
    height: 117px;
    position: relative;

    div {
      height: 39px;
      padding-left: 20px;
      line-height: 39px;
      color: #FFFFFF;
      font-size: 14px;
    }

    span {
      margin-left: 8px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #00FBFF;
    }

    img {
      width: 19px;
      vertical-align: text-top;
    }
  }

  .top_left:before {
    content: '';
    position: absolute;
    display: block;
    width: 1px;
    height: 83px;
    left: 102%;
    bottom: 11px;
    background: #FFFFFF;
  }

  .top_right {
    display: inline-block;
    width: 50%;
    height: 117px;

    div {
      position: relative;
      padding-left: 25px;
      height: 39px;
      color: #FFFFFF;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
      cursor: pointer;
      line-height: 39px;

      :last-child {
        display: inline-block;
        width: 62px;
        height: 16px;
        border-radius: 2px;
        border: 1px solid #00FF00;
        color: rgba(0, 255, 0, 1);
        vertical-align: middle;
        line-height: 16px;
        margin-left: 16px;
        text-align: center;
      }
    }

    .yc {
      border: 1px solid rgba(255, 0, 0, 1) !important;
      color: rgba(255, 0, 0, 1) !important;
    }

  }
}

.center {
  height: 205px;

  > div {
    padding: 28px 0 0 112px;
    height: 67px;
    background-position: 22px 22px;
    background-repeat: no-repeat;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #FFFFFF;

    .center_body {
      margin-top: 16px;
      font-size: 14px;
    }

    .item {
      div {
        width: 60px;
        text-align: center;
      }
    }
  }

  > :first-child {
    background-image: url("../../../assets/bg_rw.png");
  }

  > :last-child {
    background-image: url("../../../assets/bg_yb.png");
  }

}

.num {
  position: absolute;
  right: 8px;
  font-size: 11px;
  background: red;
  width: 15px;
  height: 15px;
  line-height: 12px;
  text-align: center;
  border-radius: 100%;
  top: 4px;
}
</style>
