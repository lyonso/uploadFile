<template>
  <div class='machine'>
    <div class='title'>
      <div class='l'>
        <img src='@/assets/environment/feng.png' alt='' />
        <span class='t'>风机操作</span>
      </div>
      <div class='r'>
        <sw-switch v-model='value' @change='machineChange' />
      </div>
    </div>
    <div class='content'>
      <div class='content-row'>
        <el-row>
          <el-col :span='8'>
            <label class='label'>1号风机</label>
            <!--            <sw-switch v-model='value' />-->
            <img v-if='value' class='zhuan' src='@/assets/environment/zhuan-active.png' alt='' />
            <img v-else src='@/assets/environment/zhuan.png' alt='' />
          </el-col>
          <el-col :span='8'>
            <label class='label'>2号风机</label>
            <!--            <sw-switch v-model='value' />-->
            <img v-if='value' class='zhuan' src='@/assets/environment/zhuan-active.png' alt='' />
            <img v-else src='@/assets/environment/zhuan.png' alt='' />
          </el-col>
          <el-col :span='8'>
            <label class='label'>3号风机</label>
            <!--            <sw-switch v-model='value' />-->
            <img v-if='value' class='zhuan' src='@/assets/environment/zhuan-active.png' alt='' />
            <img v-else src='@/assets/environment/zhuan.png' alt='' />
          </el-col>
        </el-row>
      </div>
      <div class='content-row'>
        <el-row>
          <el-col :span='8'>
            <label class='label'>4号风机</label>
            <!--            <sw-switch v-model='value' />-->
            <img v-if='value' class='zhuan' src='@/assets/environment/zhuan-active.png' alt='' />
            <img v-else src='@/assets/environment/zhuan.png' alt='' />
          </el-col>
          <el-col :span='8'>
            <label class='label'>5号风机</label>
            <!--            <sw-switch v-model='value' />-->
            <img v-if='value' class='zhuan' src='@/assets/environment/zhuan-active.png' alt='' />
            <img v-else src='@/assets/environment/zhuan.png' alt='' />
          </el-col>
          <el-col :span='8'>

          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import SwSwitch from '@/components/SwSwitch'
import { EventBus } from '@/mapJs/EventBus'

export default {
  name: 'Machine',
  components: {
    SwSwitch
  },
  data() {
    return {
      value: false
    }
  },
  methods: {
    machineChange(data) {
      EventBus.$emit('dataType', { type: 6, data })
    }
  }
}
</script>

<style lang='less' scoped>
.machine {
  padding: 0 0 10px 0;
}

.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 42px;
  width: 382px;
  margin: 15px auto;
  background: url("~@/assets/environment/border-double.png") no-repeat;
  background-size: cover;
  padding: 0 10px;
  box-sizing: border-box;

  .l {
    display: flex;
    align-items: center;
  }

  .t {
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
    margin-left: 10px;
  }
}

.content {

  &-row {
    height: 35px;
    display: flex;
    align-items: center;

    .label {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #F0F7FF;
      margin-right: 5px;
    }

    img {
      position: relative;
      top: 2px;
      left: 5px;
    }
  }
}

.zhuan {
  -webkit-animation: animal .25s infinite linear ;
  -webkit-transform-origin: center center;
  -ms-transform-origin: center center;
  transform-origin: center center;
}

@-webkit-keyframes animal {
  0% {
    transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
    -ms-transform: rotate(-360deg);
    -webkit-transform: rotate(-360deg);
  }
}
</style>

<style lang='less'>
.content {

  .el-row {
    width: 100%;
  }

  .el-col {
    text-align: center;
  }
}
</style>