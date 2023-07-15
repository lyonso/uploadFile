<template>
  <div>
    <section class='app-main'>
      <div class='app-main__container'>
        <transition name='fade-transform' mode='out-in'>
          <router-view :key='key' />
        </transition>
      </div>
      <yqmodel v-if='showModel' />
      <div v-if='Mask' class='Mask' />
      <leafet v-if='mapState===0' class='map' />
      <leafet2 v-else-if='mapState===1' class='map' />
      <modelMap v-else-if='mapState===2' class='map' />
      <modelMap2 v-else-if='mapState===3' class='map' />
      <autoStation v-else-if='mapState===4' class='map' />
      <modelMap3 v-else-if='mapState===5' class='map' />
      <safeMap v-else-if='mapState===6' class='map' />
      <environmentMap v-else-if='mapState===7' class='map' />
      <allSceneCamera v-else-if='mapState===8' class='map' />
      <div class='full' v-else-if='mapState===9'>
        <detectionMap v-if='currentFlow < 1' class='map' />
        <task-bg v-else-if='currentFlow == 1' class='map' />
        <flow-bg v-else-if='currentFlow == 2' class='map' />
        <detectionMap2 v-else-if='currentFlow==3' class='map' />
        <accept-bg v-else-if='currentFlow == 4' class='map' />
      </div>
    </section>
  </div>
</template>
<script>
import yqmodel from '@/views/model'
import leafet from '@/views/leafet'
import leafet2 from '@/views/leafet2'
import modelMap from '@/views/modelMap'
import modelMap2 from '@/views/modelMap2'
import modelMap3 from '@/views/modelMap3'
import safeMap from '@/views/safeMap'
import autoStation from '@/views/autoStation'
import environmentMap from '@/views/environmentMap'
import allSceneCamera from '@/views/allSceneCamera'
import detectionMap from '@/views/detectionMap'
import FlowBg from '@/components/FlowBg'
import AcceptBg from '@/components/AcceptBg'
import TaskBg from '@/components/TaskBg'
import detectionMap2 from '@/views/detectionMap2'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'AppMain',
  components: {
    leafet,
    leafet2,
    modelMap,
    modelMap2,
    modelMap3,
    yqmodel,
    autoStation,
    safeMap,
    environmentMap,
    allSceneCamera,
    detectionMap,
    FlowBg,
    AcceptBg,
    TaskBg,
    detectionMap2
  },
  computed: {
    ...mapState('inspect', ['currentFlow']),
    ...mapGetters([
      'Mask',
      'mapState',
      'showModel'
    ]),
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang='less' scoped>
.app-main {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  //background: url("../../assets/bg.png");
}

.app-main__container {
  position: absolute;
  //background: #052E43;
}

.Mask {
  width: 1920px;
  height: 1080px;
  position: absolute;
  background: #042631;
  transition: width 1s;
  z-index: 2;
}

.full {
  height: 1080px;
}

.map {
  width: 100%;
  height: 100%;
  z-index: 1;
  position: relative;
}

.fade-enter {
  opacity: 0;
}

.fade-enter-active {
  transition: opacity 3s;
}

.fade-leave-to {
  opacity: 0;
}

.fade-leave-active {
  transition: opacity 3s;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .1s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
