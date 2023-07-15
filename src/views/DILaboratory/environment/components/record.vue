<template>
  <div class='record'>
    <div class='record-item'>
      <div class='l'>
        <img :src='a' alt='' />
      </div>
      <div class='r'>
        <div class='title'>实时告警</div>
        <div class='num'>{{ currentWarn.num }}</div>
      </div>
    </div>
    <div class='split'></div>
    <div class='record-item'>
      <div class='l'>
        <img :src='b' alt='' @click='showWarnModal' />
      </div>
      <div class='r'>
        <div class='title'>当日告警</div>
        <div class='num' @click='showWarnModal'>{{ todayWarn.num }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Record',
  computed: {
    ...mapState({
      currentWarn: state => state.environment.currentWarn,
      todayWarn: state => state.environment.todayWarn
    })
  },
  data() {
    return {
      a: require('@/assets/environment/实时告警.png'),
      b: require('@/assets/environment/当日告警.png')
    }
  },
  methods: {
    showWarnModal() {
      this.$store.dispatch('environment/showDetailModal', {
        type: [3],
        eventType: [],
        modelDeviceId: ''
      })
    }
  }
}
</script>

<style lang='less' scoped>
.record {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;

  .split {
    width: 1px;
    height: 67px;
    background: url("~@/assets/environment/border-split.png") no-repeat;
    background-size: cover;
  }

  &-item {
    box-sizing: border-box;
    padding: 10px 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    .l {
      width: 44px;
      height: 44px;
      margin-right: 20px;

      img {
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
    }

    .title {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
      white-space: nowrap;
    }

    .num {
      font-size: 32px;
      font-family: DS-DIGIB;
      font-weight: bold;
      color: #FF6666;
      margin-top: 5px;
      cursor: pointer;
    }
  }
}
</style>
