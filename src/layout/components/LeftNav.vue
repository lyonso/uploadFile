<template>
  <div :class="isOpen? 'open turntable':'close turntable'" @mouseenter="stopTime" @mouseleave="startTimer">
    <img @click='isOpen = !isOpen' src='../../assets/close.png'>
    <div :class="getClass()">
      <router-link :to='{ path: "/blueAlgae" }'>
        <div :class="nowRouter==='/blueAlgae'? 'isChose':''">太湖蓝藻</div>
      </router-link>
      <router-link :to='{ path: "/monitor/monitorList" }'>
        <div :class="monitorList.includes(nowRouter)? 'isChose':''">协同监测</div>
      </router-link>
<!--      <router-link :to='{ path: "/3DLaboratory" }'>-->
<!--        <div :class="nowRouter==='/3DLaboratory'? 'isChose':''">数智实验室</div>-->
<!--      </router-link>-->
      <router-link :to='{ path: "/DILaboratory/BIMIndex" }'>
        <div :class="LaboratoryList.includes(nowRouter)? 'isChose':''">数智实验室</div>
      </router-link>
      <router-link :to='{ path: "/automaticStation/automaticStationIntroduce" }'>
        <div :class="commandList.includes(nowRouter)? 'isChose':''">自动监测站</div>
      </router-link>
<!--      <router-link :to='{ path: "/system/videoPoints" }'>-->
<!--        <div :class="systemList.includes(nowRouter)? 'isChose':''">系统设置</div>-->
<!--      </router-link>-->
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeftNav',
  data() {
    return {
      chose: 0,
      isOpen: false,
      timer: '',
      nowRouter: '',
      LaboratoryList:['/DILaboratory/inspect','/DILaboratory/security','/DILaboratory/environment','/DILaboratory/BIMIndex'],
      monitorList: ['/monitor/monitorList', '/monitor/monitorExercise', '/monitor/monitorExmap', '/monitor/kanban',
        '/monitor/monitorCommand', '/monitor/monitorMapCommand', '/monitor/system/videoPoints', '/monitor/system/carManage', '/monitor/system/boatsManage', '/monitor/system/peopleManage', '/monitor/system/unmannedManage', '/monitor/system/pointsStation', '/monitor/system/stationManage', '/monitor/system/markerManage'],
      commandList: ['/automaticStation/automaticStationIntroduce', '/automaticStation/stationDetails', '/automaticStation/BIMDetails'],
      systemList: ['/system/videoPoints', '/system/carManage', '/system/boatsManage', '/system/peopleManage', '/system/unmannedManage', '/system/stationManage', '/system/markerManage']
    }
  },
  watch: {
    '$route'(to, from) {
      this.nowRouter = this.$route.path
      this.chose++
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },

  mounted() {
    this.nowRouter = this.$route.path
  },
  methods: {
    stopTime() {
      clearInterval(this.timer);
    },
    startTimer() {
      this.timer = setTimeout(() => {
        this.isOpen = false
      }, 3000);
    },
    getClass() {
      let nowR = ''
      const nowRouter = this.nowRouter
      if (nowRouter === '/blueAlgae') {
        nowR = 'blueAlgae'
      } else if (this.monitorList.includes(nowRouter)) {
        nowR = 'monitor'
      } else if (this.LaboratoryList.includes(nowRouter)) {
        nowR = 'Laboratory'
      } else if (this.commandList.includes(nowRouter)) {
        nowR = 'command'
      } else if (this.systemList.includes(nowRouter)) {
        nowR = 'system'
      }
      return nowR + ' link'
    }
  }

}
</script>

<style lang='less' scoped>
.turntable {
  position: absolute;
  height: 771px;
  z-index: 11;
  top: 203px;
  width: 225px;
  text-align: center;
  background: url("../../assets/bg_unchecked.png");
  background-size: 100% 100%;

  img {
    width: 15px;
    height: 40px;
    position: absolute;
    right: 43px;
    cursor: pointer;
    top: calc(50% - 20px);

  }
}

.close {
  position: absolute;
  left: -167px;
  transition: left 1s;

  img {
    transform: rotate(180deg);
    -ms-transform: rotate(180deg); /* Internet Explorer */
    -moz-transform: rotate(180deg); /* Firefox */
    -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
    -o-transform: rotate(180deg); /* Opera */

  }
}

.open {
  position: absolute;
  left: 0px;
  transition: left 1s;

  img {
    transform: rotate(0deg);
    -ms-transform: rotate(0deg); /* Internet Explorer */
    -moz-transform: rotate(0deg); /* Firefox */
    -webkit-transform: rotate(0deg); /* Safari 和 Chrome */
    -o-transform: rotate(0deg); /* Opera */
  }
}

.link {
  width: 1px;
  height: 1px;
  margin-top: 385px;
  padding-left: 720px;
  position: relative;
  left: -700px;
  transform: rotate(0deg);
  transition: transform 1s;

  div {
    position: relative;
    width: 138px;
    height: 42px;
    font-size: 20px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(12, 225, 228, 1);
    line-height: 42px;
    background: url("../../assets/button_un.png");
    background-size: 100% 100%;
    //opacity: 0.65;
    text-decoration: none;
    text-align: center;
  }

  a {
    display: inline-block;
    text-decoration: none;
    margin: 30px 0;
    position: relative;
    top: -255px;
    transform: rotate(0deg);
    transition: transform 1s;
  }


  > :first-child {
    transform: translate(-40px, 0px) rotate(0deg);
    opacity: 1;
    transition: transform 1s;
    transition: opacity 1s;

  }

  > :nth-child(2) {
    transform: translate(-20px, 0px) rotate(0deg);
    opacity: 1;
    transition: transform 1s;
    transition: opacity 1s;


  }

  > :nth-child(3) {
    transform: translate(0px, 0px) rotate(0deg);
    opacity: 1;
    transition: transform 1s;
    transition: opacity 1s;

  }

  > :nth-child(4) {
    transform: translate(-20px, 0px) rotate(0deg);
    opacity: 1;
    transition: transform 1s;
    transition: opacity 1s;

  }

  > :nth-child(5) {
    transform: translate(-40px, 0px) rotate(0deg);
    opacity: 1;
    transition: transform 1s;
    transition: opacity 1s;

  }

  .isChose {
    background: url("../../assets/button_sel.png");
    background-size: 100% 100%;
    color: #f9d000;
    position: relative;
    opacity: 1 !important;
    transition: opacity 1s;
  }


}

.blueAlgae {
  > :first-child {
    transform: translate(0px, 205px) rotate(0deg);
    opacity: 1;
    transition: transform 1s;
    transition: opacity 1s;

  }

  > :nth-child(2) {
    transform: translate(-20px, 205px) rotate(0deg);
    opacity: 0.6;
    transition: transform 1s;
    transition: opacity 1s;


  }

  > :nth-child(3) {
    transform: translate(-40px, 205px) rotate(0deg);
    opacity: 0.3;
    transition: transform 1s;
    transition: opacity 1s;

  }

  > :nth-child(4) {
    transform: translate(-60px, 205px) rotate(0deg);
    opacity: 0;
    transition: transform 1s;
    transition: opacity 1s;

  }

  > :nth-child(5) {
    transform: translate(-80px, 205px) rotate(0deg);
    opacity: 0;
    transition: transform 1s;
    transition: opacity 1s;
  }


}

.monitor {
  > :first-child {
    transform: translate(-20px, 102px) rotate(0deg);
    opacity: 0.6;
    transition: transform 1s;
    transition: opacity 1s;

  }

  > :nth-child(2) {
    transform: translate(0px, 102px) rotate(0deg);
    opacity: 1;
    transition: transform 1s;
    transition: opacity 1s;


  }

  > :nth-child(3) {
    transform: translate(-20px, 102px) rotate(0deg);
    opacity: 0.6;
    transition: transform 1s;
    transition: opacity 1s;

  }

  > :nth-child(4) {
    transform: translate(-40px, 102px) rotate(0deg);
    opacity: 0.3;
    transition: transform 1s;
    transition: opacity 1s;

  }

  > :nth-child(5) {
    transform: translate(-60px, 102px) rotate(0deg);
    opacity: 0;
    transition: transform 1s;
    transition: opacity 1s;
  }
}

.Laboratory {
  > :first-child {
    transform: translate(-40px, 0px) rotate(0deg);
    opacity: 0.3;
    transition: transform 1s;
    transition: opacity 1s;

  }

  > :nth-child(2) {
    transform: translate(-20px, 0px) rotate(0deg);
    opacity: 0.6;
    transition: transform 1s;
    transition: opacity 1s;


  }

  > :nth-child(3) {
    transform: translate(0px, 0px) rotate(0deg);
    opacity: 1;
    transition: transform 1s;
    transition: opacity 1s;

  }

  > :nth-child(4) {
    transform: translate(-20px, 0px) rotate(0deg);
    opacity: 0.6;
    transition: transform 1s;
    transition: opacity 1s;

  }

  > :nth-child(5) {
    transform: translate(-40px, 0px) rotate(0deg);
    opacity: 0.3;
    transition: transform 1s;
    transition: opacity 1s;
  }

}

.command {
  > :first-child {
    transform: translate(-60px, -102px) rotate(0deg);
    opacity: 0;
    transition: transform 1s;
    transition: opacity 1s;

  }

  > :nth-child(2) {
    transform: translate(-40px, -102px) rotate(0deg);
    opacity: 0.3;
    transition: transform 1s;
    transition: opacity 1s;


  }

  > :nth-child(3) {
    transform: translate(-20px, -102px) rotate(0deg);
    opacity: 0.6;
    transition: transform 1s;
    transition: opacity 1s;

  }

  > :nth-child(4) {
    transform: translate(0px, -102px) rotate(0deg);
    opacity: 1;
    transition: transform 1s;
    transition: opacity 1s;

  }

  > :nth-child(5) {
    transform: translate(-20px, -102px) rotate(0deg);
    opacity: 0.6;
    transition: transform 1s;
    transition: opacity 1s;
  }

}

.system {
  > :first-child {
    transform: translate(-80px, -205px) rotate(0deg);
    opacity: 0;
    transition: transform 1s;
    transition: opacity 1s;

  }

  > :nth-child(2) {
    transform: translate(-60px, -205px) rotate(0deg);
    opacity: 0;
    transition: transform 1s;
    transition: opacity 1s;


  }

  > :nth-child(3) {
    transform: translate(-40px, -205px) rotate(0deg);
    opacity: 0.3;
    transition: transform 1s;
    transition: opacity 1s;

  }

  > :nth-child(4) {
    transform: translate(-20px, -205px) rotate(0deg);
    opacity: 0.6;
    transition: transform 1s;
    transition: opacity 1s;

  }

  > :nth-child(5) {
    transform: translate(0px, -205px) rotate(0deg);
    opacity: 1;
    transition: transform 1s;
    transition: opacity 1s;
  }

}

</style>
