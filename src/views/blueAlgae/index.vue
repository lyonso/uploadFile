<template>
  <div class="monitor">
    <div v-if="dialogType===1">
      <rightTop class='leftTop' />
      <rightCenter @chageSteps="chageSteps"  class='rightCenter' />
      <rightBottom class='rightBottom'/>
    </div>

    <!--    四种类型弹窗-->
    <PatrolDialog  v-else-if="dialogType===2" @chageSteps="chageSteps" class="PatrolDialog"/>
    <PatrolDialogTwo  v-else-if="dialogType===3" @chageSteps="chageSteps" class="PatrolDialog" @openDialog='openDialog'/>
    <PatrolDialogThree  v-else-if="dialogType===4" @chageSteps="chageSteps" class="PatrolDialog"/>
    <PatrolDialogFour  v-else-if="dialogType===5" @chageSteps="chageSteps" class="PatrolDialog"/>

    <satelliteList  v-else-if="dialogType===6"  @chageSteps="chageSteps" class="satelliteList"/>
    <CameraList  v-else-if="dialogType===7" @chageSteps="chageSteps" class="CameraList"/>

    <algaeList v-else-if="dialogType===8"  @chageSteps="chageSteps" class="CameraList"/>
    <stationList v-else-if="dialogType===9"  @chageSteps="chageSteps" class="CameraList"/>
    <blueAlgaeList v-else-if="dialogType===10"  @chageSteps="chageSteps" class="CameraList"/>

    <searchInput v-show=" dialogType<6"  class="searchInput"/>
    <panel v-show=" dialogType<6" class='Bluepanel' />
    <indicatorPanel v-if="dialogType<3||dialogType===4" class="indicatorPanel"/>
    <indicatorPanelTwo v-if="dialogType===5" class="indicatorPanel"/>
    <indicatorPanelThree v-if="dialogType===3" class="indicatorPanel"/>
    <FixedModal v-model='visible' :title='visibleTitle' ref='dialogBlueChart'/>
  </div>
</template>
<script>
import rightTop from './components/rightTop'
import rightCenter from './components/rightCenter'
import rightBottom from './components/rightBottom'
import indicatorPanel from  './components/indicatorPanel'
import indicatorPanelTwo from  './components/indicatorPanelTwo'
import indicatorPanelThree from  './components/indicatorPanelThree'
import panel from './components/panel'

import PatrolDialog from './components/Dialog/PatrolDialog'
import PatrolDialogTwo from './components/Dialog/PatrolDialogTwo'
import PatrolDialogThree from './components/Dialog/PatrolDialogThree'
import PatrolDialogFour from './components/Dialog/PatrolDialogFour'

import satelliteList from './components/Dialog/satelliteList'
import CameraList from './components/Dialog/CameraList'

import algaeList from './components/Dialog/algaeList'
import stationList from './components/Dialog/stationList'
import blueAlgaeList from './components/Dialog/blueAlgaeList'

import searchInput from './components/Dialog/searchInput'

import FixedModal from './components/fixedModal'

import { mapGetters } from 'vuex'
import { EventBus } from '@/mapJs/EventBus'
export  default {
  name:'monitor',
  computed: {
    ...mapGetters([
      'BlueDialogDetails'
    ]),
  },
  watch:{
    BlueDialogDetails(){
        const details = JSON.parse(this.BlueDialogDetails)
        switch (details.type){
          case 0:
            this.dialogType = 2
            break
          case 1:
            this.dialogType = 2
            break
          case 2:
            this.dialogType = 3
            break
          case 3:
            this.dialogType = 4
            break
          case 4:
            this.dialogType = 5
            break
        }
    }
  },

  mounted() {
    this.$store.dispatch('map/setMapState',1)
  },
  components: {
    panel,
    rightTop,
    rightCenter,
    rightBottom,
    indicatorPanel,
    indicatorPanelTwo,
    PatrolDialog,
    PatrolDialogTwo,
    PatrolDialogThree,
    PatrolDialogFour,
    satelliteList,
    CameraList,
    algaeList,
    blueAlgaeList,
    stationList,
    searchInput,
    FixedModal,
    indicatorPanelThree

  },

  data(){
    return{
      dialogType:1,
      visible: false,
      visibleTitle: '蓝藻分布强度'
    }
  },
  methods:{
    chageSteps(val){
      this.dialogType = val
    },
    openDialog(detail) {
      this.visible = true
      this.$refs.dialogBlueChart.init(detail)
    }

  }
}

</script>

<style lang='less' scoped>
.monitor{
  position: relative;
  z-index: 10;
}
.panel{

}
.leftTop{
  position: absolute;
  left:1187px;
  top: 60px;
}
.rightCenter{
  position: absolute;
  left:1187px;
  top: 492px;
}
.rightBottom{
  position: absolute;
  left:1187px;
  top: 728px;
}
.indicatorPanel{
  position: absolute;
  left:1044px;
  top: 60px;
}

.PatrolDialog{
  position: absolute;
  left: 1187px;
  top: 60px;
}
.satelliteList,
.CameraList{
  position: absolute;
}

.fade-enter{
  opacity: 0;
}
.fade-enter-active{
  transition: opacity 3s;
}
.fade-leave-to{
  opacity: 0;
}
.fade-leave-active{
  transition: opacity 3s;
}
.searchInput{
  position: absolute;
  top: 106px;
  left: 42px;
}
</style>



