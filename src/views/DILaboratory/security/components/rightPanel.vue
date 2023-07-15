<template>
  <div :class='isOpen? "rightPanel ":"rightPanel close"'>
    <DialogTitle dialogTitle='今日告警'>
      <slot>
        <div :class='openAllMJ? "openMJ isOpen":"openMJ"'>
          一键开启门禁
          <SwSwitch style='margin-left: 10px' v-model='openAllMJ' @change='mjChange' />
        </div>
      </slot>
    </DialogTitle>
    <div class='panel'>
      <div class='panel_top'>
        <img src='../../../../assets/icon_yj.png'>
        <div>
          <div class='num red'>{{ zongji }}</div>
          <div>实时告警</div>
        </div>
        <div>
          <div @click='openDialog("1")' class='num org'>
            {{ formData.ycsd + formData.zjrq + formData.yhjc + formData.dmjs }}
          </div>
          <div>今日总告警</div>
        </div>
      </div>
      <div class='panel_bottom'>
        <div>
          <div @click='openDialog("197384")' class='num'>{{ formData.ycsd || '0' }}</div>
          <div>门禁异常</div>
        </div>
        <div>
          <div @click='openDialog("72057594339918080")' class='num'>{{ formData.zjrq || '0' }}</div>
          <div>周界入侵</div>
        </div>
        <div>
          <div @click='openDialog("72057594943900160")' class='num'>{{ formData.dmjs || '0' }}</div>
          <div>人员摔倒</div>
        </div>
        <div>
          <div @click='openDialog("192514")' class='num'>{{ formData.yhjc || '0' }}</div>
          <div>烟火检测</div>
        </div>

      </div>
    </div>
    <DialogTitle dialogTitle='人员数量AI统计' />
    <div class='title'>实验区总人数趋势</div>
    <ColumnarEcharts />
    <div class='title'>分区域人数趋势</div>
    <lineEChart />
    <!--    收缩图片-->
    <img v-if='isOpen' @click='closeDialog(false)' src='../../../../assets/closePanel.png'>
    <img v-else @click='closeDialog(true)' src='../../../../assets/openPanel.png'>
  </div>
</template>

<script>
import DialogTitle from '@/components/DialogTitle'
import ColumnarEcharts from '../Echarts/ColumnarEcharts'
import lineEChart from '../Echarts/lineEChart'
import videoPlayer from '@/components/video'
import { mapState } from 'vuex'
import { DILaboratory } from '@/api'
import floorInList from './floorInList'
import SwSwitch from '@/components/SwSwitch'
import { EventBus } from '@/mapJs/EventBus'
import bus from '@/bus'
import _ from 'lodash'

export default {
  name: 'security',
  components: {
    DialogTitle,
    ColumnarEcharts,
    lineEChart,
    videoPlayer,
    SwSwitch,
    floorInList
  },
  watch: {
    // floorChose() {
    //   this.spchecked = false
    //   this.spgjchecked = false
    //   this.mjchecked = false
    //   this.mjgjchecked = false
    //   this.formData = {
    //     qyrq: 0,
    //     hdjc: 0,
    //     yhjc: 0,
    //     ffrq: 0,
    //     cswg: 0,
    //     ffsd: 0
    //   }
    //   this.eventNum()
    //   this.aqjkCount()
    // }
  },
  computed: {
    ...mapState({
      isOpen: state => state.security.isOpen,
      floorChose: state => state.security.floorChose,
      videoID: state => state.security.videoID
    })
  },
  data() {
    return {
      formData: {},
      openAllMJ: false,
      checkList: [],
      zongji: ''
    }
  },

  mounted() {
    this.eventNum()
    this.aqjkCount()
    bus.on('aqjk', this.handleMsg)
    window.addEventListener('beforeunload', () => {
      bus.removeListener('aqjk', this.handleMsg)
    })
  },
  beforeDestroy() {
    bus.removeListener('aqjk', this.handleMsg)
  },
  methods: {
    handleMsg: _.throttle(function(message) {
      this.eventNum()
      this.aqjkCount()
    }, 300),
    /**
     * 左侧收缩
     * @param status
     */
    closeDialog(status) {
      this.$store.commit('security/SET_ISOPEN', status)
    },
    /**
     * 一键开启门禁
     */
    mjChange(e) {
      if (e) {
        DILaboratory.doControlAll().then(res => {
          this.$message.success(res.message)
        })
      }
    },
    /**
     * 获取数据
     */
    securityGJ(flag, type) {
      const data = {
        flag,
        floor: this.floorChose === 0 ? '' : this.floorChose,
        type
      }
      let res = DILaboratory.securityGJ(data)
      return res
    },
    /**
     * 安全监控-告警数量统计
     */
    eventNum() {
      const obj = {
        floor: this.floorChose === 0 ? '' : this.floorChose
      }
      let formData = {
        ycsd: 0,
        zjrq: 0,
        yhjc: 0,
        dmjs: 0,
      }
      DILaboratory.eventNum(obj).then(res => {
        res.data.forEach(item => {
          switch (item.eventType) {
            case '197384':
              formData.ycsd = item.num
              break
            case '72057594339918080':
              formData.zjrq = item.num
              break
            case '192514':
              formData.yhjc = item.num
              break
            case '72057594943900160':
              formData.dmjs = item.num
              break
          }
        })
        this.formData = formData
      })
    },
    /**
     * 视频监控
     */
    changeOpen(e, type, other, flag) {
      EventBus.$emit('clearLayer', type)
      if (this[e] || e === true) {
        if (this[e] && e === 'spchecked' && this.floorChose) {
          DILaboratory.pCount({ f: this.floorChose }).then(res => {
            EventBus.$emit('pointData2', res.data)
          })
        }
        this.securityGJ(flag, type).then(res => {
          if (e && this[other]) this[other] = false
          const obj = {
            data: res.data,
            type  // 0 摄像头 // 2门禁
          }
          EventBus.$emit('pointData', obj)
        })
      }
    },
    /**
     * 获取实时告警数量
     */
    aqjkCount() {
      DILaboratory.aqjkCount({ floor: this.floorChose === 0 ? '' : this.floorChose }).then(res => {
        this.zongji = res.data
      })
    },
    openDialog(code) {
      this.$store.commit('security/SET_OPENDIALOG', 3)
      this.$store.dispatch('security/setDialogCode', code)
    }
  }

}
</script>

<style lang='less' scoped>
.rightPanel {
  position: absolute;
  top: 110px;
  right: 20px;
  background: rgba(11, 37, 50, 0.8);
  width: 422px;
  //height: 978px;
  border: 1px solid rgba(229, 229, 229, 0.31);
  transition: right 1s;

  > img {
    position: absolute;
    transform: rotateY(180deg);
    top: 0;
    width: 20px;
    left: -20px;
    cursor: pointer;
  }

  .openMJ {
    position: absolute;
    right: 15px;
    top: 0;
  }

  .isOpen {
    color: rgba(0, 246, 255, 1);
  }

}


.body_top {
  height: 48px;
  background-image: url("../../../../assets/BIMIndex_icon6.png");
  background-size: 100% 100%;
  margin: 10px 10px 0;

  img {
    margin: 11px;
    vertical-align: top;
  }

  span {
    display: inline-block;
    font-size: 18px;
    font-weight: 500;
    color: #EDF6FF;
    vertical-align: top;
    line-height: 48px;
  }

  :nth-child(3),
  :nth-child(5) {
    width: 90px;
    color: rgba(255, 17, 73, 1);
    font-family: DS-DIGIB;
    font-size: 40px;
    text-align: center;
  }

  :nth-child(4) {
    margin-left: 26px;
  }
}

.panel {
  width: 397px;
  height: 195px;
  margin: 15px 12px;
  background-image: url("../../../../assets/kuang.png");
  background-size: 100% 100%;

  &_top {
    position: relative;

    > div {
      width: 35%;
      font-size: 16px;
      font-weight: 400;
      color: #FEFEFE;
      text-align: center;
      display: inline-block;
    }

    .num {
      font-family: DS-DIGIB;
      font-size: 45px;
      margin: 18px 0 5px;
      cursor: pointer;
    }

    .red {
      color: rgba(223, 26, 26, 1);
    }

    .org {
      color: rgba(255, 122, 4, 1);
    }

    img {
      width: 70px;
      height: 70px;
      margin: 14px 10px 17px 30px;
      vertical-align: top;
    }

    > :nth-child(2)::before {
      position: absolute;
      top: 20px;
      left: 120px;
      content: '';
      width: 1px;
      height: 58px;
      border-right: rgba(80, 136, 188, 1) 1px dashed;
    }
  }

  &_top::after {
    display: block;
    content: '';
    width: 394px;
    height: 1px;
    border-bottom: #3F6384 1px dashed;
  }

  &_bottom {
    > div {
      position: relative;
      display: inline-block;
      width: 25%;
      vertical-align: top;
      text-align: center;
      color: #FFF;
    }

    .num {
      font-family: DS-DIGIB;
      font-size: 40px;
      margin: 12px 0 0;
      cursor: pointer;
    }

    > div::after {
      position: absolute;
      content: '';
      top: 15px;
      right: 0;
      width: 1px;
      height: 56px;
      border-right: rgba(80, 136, 188, 1) 1px dashed;
    }

    > :last-child ::after {
      display: none;
    }
  }

}

.title {
  margin: 14px;
  height: 16px;
  font-size: 16px;
  font-weight: 400;
  color: #FFFFFF
}

.close {
  right: -422px;
  transition: right 1s;
}


</style>
