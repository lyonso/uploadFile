<template>
  <div>
    <div class='item'>
      <div class='content'>
        <div class='title-bg'>
          <span>温湿度</span>
        </div>
        <div class='content-item'>
          <div class='title-s'>监测区</div>
          <div class='content-item-right' style='padding-right: 20px'>
            <div class='content-item-right-item'>
              <div class='t'>环境温度</div>
              <div class='s'><span>{{ range.temp }}</span> ℃</div>
            </div>
            <div class='content-item-right-item'>
              <div class='t'>环境湿度</div>
              <div class='s'><span>{{ range.humi }}</span> RH</div>
            </div>
          </div>
        </div>
        <div class='content-item' v-for='(item, index) in room' :key='`room-${index + 1}`'>
          <div class='title-s'>{{ item.name }}</div>
          <div class='content-item-right'>
            <div class='content-item-right-item'>
              <div class='t'>环境温度</div>
              <div class='s'><span>{{ item.temp }}</span> ℃</div>
            </div>
            <div class='content-item-right-item'>
              <div class='t'>环境湿度</div>
              <div class='s'><span>{{ item.humi }}</span> RH</div>
            </div>
            <div class='content-item-right-item' @click='showWarnModal(item)'>
              <div class='t'>告警信息</div>
              <div class='w'><span>{{ item.newCount }}</span>/<span>{{ item.oldCount }}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class='second item'>
      <div class='content second'>
        <div class='title-bg'>
          <span>空气质量</span>
        </div>
        <div class='content-item'>
          <div class='title-sp'>
            <img src='@/assets/environment/icon_jia.png' alt='' />
          </div>
          <div class='content-item-right'>
            <div class='content-item-right-item'>
              <div class='t'>甲醛指标</div>
              <div class='s'><span>{{ range.ch2o }}</span> mg/m³</div>
            </div>
            <div class='content-item-right-item' @click='showWarnModal1'>
              <div class='t'>告警信息</div>
              <div class='w'><span>{{ CH2O.currentWarn.num }}</span>/<span>{{ CH2O.todayWarn.num }}</span></div>
            </div>
          </div>
        </div>
        <div class='content-item'>
          <div class='title-sp'>
            <img src='@/assets/environment/icon_voc.png' alt='' />
          </div>
          <div class='content-item-right'>
            <div class='content-item-right-item'>
              <div class='t'>VOC指标</div>
              <div class='s'><span>{{ range.voc }}</span> mg/m³</div>
            </div>
            <div class='content-item-right-item' @click='showWarnModal2'>
              <div class='t'>告警信息</div>
              <div class='w'><span>{{ VOC.currentWarn.num }}</span>/<span>{{ VOC.todayWarn.num }}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'RecordList',
  computed: {
    ...mapState({
      VOC: state => state.environment.VOC,
      CH2O: state => state.environment.CH2O,
      range: state => state.environment.range,
      room: state => state.environment.room
    })
  },
  data() {
    return {

    }
  },
  methods: {
    showWarnModal(item) {
      this.$store.dispatch('environment/showDetailModal', {
        type: [3],
        eventType: ["TEMP","HUMI"],
        modelDeviceId: item.id + ''
      })
    },
    showWarnModal1() {
      this.$store.dispatch('environment/showDetailModal', {
        type: [3],
        eventType: ["CH2O"],
        modelDeviceId: ''
      })
    },
    showWarnModal2() {
      this.$store.dispatch('environment/showDetailModal', {
        type: [3],
        eventType: ["VOC"],
        modelDeviceId: ''
      })
    }
  }
}
</script>

<style lang='less' scoped>
.item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  &.second {
    margin-top: 10px;
  }

  .title {
    width: 26px;
    min-width: 26px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background: #001928;
    padding-top: 5px;

    .line {
      width: 20px;
      height: 3px;
      background: #00C0CD;
    }

    p {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
      margin: 0;
      padding: 0;
      letter-spacing: 10px;
      margin-top: 10px;
      writing-mode: vertical-lr;
    }
  }

  .content {
    position: relative;
    width: 100%;
    border-top: 1px solid rgba(153, 153, 153, .43);
    margin-top: 15px;
    padding-top: 10px;

    &.second {
      margin-top: 20px;
    }

    .title-bg {
      position: absolute;
      width: 180px;
      height: 42px;
      left: 50%;
      margin-left: -90px;
      top: -21px;
      background: url("~@/assets/environment/six_border.png") no-repeat;
      background-size: cover;
      display: flex;
      align-items: center;
      justify-content: center;

      span {
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #00FFFF;
      }
    }

    &-item {
      display: flex;
      align-items: center;
      border-bottom: 1px solid rgba(153, 153, 153, .43);
      padding: 10px 0;

      .title-sp {
        width: 44px;
        height: 44px;
        //border: 1px solid #1E8BAB;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #D1DDDE;
        text-align: center;
        margin: 0 25px;
        min-width: 44px;
        background: url("~@/assets/environment/border-s.png") no-repeat;
        background-size: cover;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .title-s {
        width: 44px;
        height: 44px;
        //border: 1px solid #1E8BAB;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #D1DDDE;
        text-align: center;
        margin: 0 25px;
        min-width: 44px;
        background: url("~@/assets/environment/border.png") no-repeat;
        background-size: cover;
      }

      &-right {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding-right: 30px;

        &-item {
          min-width: 100px;
          cursor: pointer;

          .t {
            font-size: 16px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #F0F7FF;
            line-height: 30px;
          }

          .s {
            font-size: 15px;
            color: #ffffff;

            span {
              font-size: 18px;
              font-family: SSFangYuanTi;
              font-weight: bold;
              color: #3CEFFF;
            }
          }

          .w {
            font-size: 15px;
            color: #ffffff;

            span {
              font-size: 18px;
              font-family: SSFangYuanTi;
              font-weight: bold;
              color: #FF3C3C;
              margin-right: 10px;

              &:last-child {
                margin-left: 10px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
