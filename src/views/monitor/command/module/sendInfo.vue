<template>
  <div class='infoLock'>
    <div class='infoLock-title'>
      <div class='infoLock-title-icon'>
        <img src='@/assets/title-icon.png' alt=''>
      </div>
      <div>
        <span @click="sendtype('shuiwen');activeid=0" :class='{activeImg:activeid==0}'
              style='color: #15CFF7FF;cursor: pointer;margin-left: 20px'> 水文</span>
        <span @click="sendtype('shuizhi');activeid=1" :class='{activeImg:activeid==1}'
              style='color: #15CFF7FF;cursor: pointer;margin-left: 20px;'> 水质</span>
      </div>
      <div>
        <img src='@/assets/line.png' alt=''>
      </div>
      <div class='clearfloat'></div>
    </div>
    <div style='font-size: 20px;padding:10px 0 20px 5px'>
      <div style='color: #15CFF7FF;cursor: pointer;'>监测断面：{{ mtitle }}</div>
      <div style='color: #15CFF7FF;cursor: pointer; margin-top: 15px'>监测时间：{{ taskTime.substring(0, 10) }}</div>
    </div>
    <div class='infoLock-container' v-if='showwen'>
      <el-scrollbar wrap-style='overflow-x:hidden;' style='height:100%'>
        <div class='infoLock-container-list' v-for='(item,index) in shuizhidata'>
          <div style='color: #15CFF7FF;font-size: 18px;'>{{ item.name }}</div>
          <div style='width: 100%;'>
            <div style='float: left;color: white;font-weight: bold;font-size: 26px;'>
              <span>{{ item.shuizhi }}</span>
            </div>
            <div
              style='float: left;color: white;font-weight: 500;font-size: 18px;padding-top: 12px;padding-left: 11px;'>
              {{ item.tagUnit }}
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class='infoLock-container' v-else>
      <el-scrollbar wrap-style='overflow-x:hidden;' style='height:100%'>
        <div class='infoLock-container-list' v-for='(item,index) in shuizhidata'>
          <div style='color: #15CFF7FF;font-size: 18px;'>{{ item.name }}</div>
          <div style='width: 100%;'>
            <div style='float: left;color: white;font-weight: bold;font-size: 26px;'>
              {{ item.shuizhi }}
            </div>
            <div style='float: left;color: white;font-weight: 500;font-size: 18px;padding-top: 6px;padding-left: 11px;'>
              {{ item.tagUnit }}
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex'

export default {
  props: {
    shuizhidata: {},
    showwen: {
      type: Boolean,
      default: false
    },
    mtitle: String
  },
  wacth:{
    shuizhidata(val){
      console.log(val)
    },
    showwen(val){
      console.log(val)
    },
    mtitle(val){
      console.log(val)
    },
  },
  computed: {
    ...mapState({
      taskTime: state => state.security.taskTime
    })
  },
  data() {
    return {
      list: [],
      activeid: 0
    }
  },
  mounted() {
  },
  methods: {
    sendtype(data) {
      this.$emit('sendtype', data)
    }
  }
}
</script>

<style lang='less' scoped>
.activeImg {
  color: #3cb79c !important;
}

.infoLock-container {
  height: 220px;
  padding: 5px;
  position: relative;
  font-size: 14px;
  cursor: pointer;

  &-list {
    width: 33%;
    display: inline-block;
    vertical-align: top;
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
</style>
